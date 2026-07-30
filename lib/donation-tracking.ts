import {getSupabaseAdmin} from './supabase-admin';

export type DonationProvider = 'paypal' | 'btc' | 'eth' | 'usdc';

export type VerifiedDonation = {
  campaignId: string;
  provider: DonationProvider;
  transactionId: string;
  amountOriginal: number;
  currency: string;
  amountEur: number;
  metadata?: Record<string, unknown>;
};

export type ExistingDonation = {
  campaignId: string;
  transactionId: string;
  status: string;
};

export type RecordVerifiedDonationResult =
  | {status: 'recorded'}
  | {
      status: 'duplicate';
      campaignId: string;
      transactionId: string;
    };

type DonationRow = {
  provider: DonationProvider;
  amount_original: number | string;
  amount_eur: number | string;
};

type ExistingDonationRow = {
  campaign_id: string;
  transaction_id: string;
  status: string;
};

const KRAKEN_EUR_PAIRS: Record<Exclude<DonationProvider, 'paypal'>, string> = {
  btc: 'XBTEUR',
  eth: 'ETHEUR',
  usdc: 'USDCEUR',
};

async function getCurrentEurRate(
  provider: Exclude<DonationProvider, 'paypal'>,
): Promise<number> {
  const pair = KRAKEN_EUR_PAIRS[provider];
  const response = await fetch(
    `https://api.kraken.com/0/public/Ticker?pair=${encodeURIComponent(pair)}`,
    {
      // Refresh market prices at most once per minute while still valuing
      // donations at the time visitors view the campaign page.
      next: {revalidate: 60},
    },
  );

  if (!response.ok) {
    throw new Error(`Unable to load the current ${provider.toUpperCase()}/EUR rate.`);
  }

  const payload = await response.json();
  if (Array.isArray(payload.error) && payload.error.length > 0) {
    throw new Error(payload.error.join(', '));
  }

  const ticker = Object.values(payload.result || {})[0] as
    | {c?: string[]}
    | undefined;
  const rate = Number(ticker?.c?.[0]);

  if (!Number.isFinite(rate) || rate <= 0) {
    throw new Error(`Invalid ${provider.toUpperCase()}/EUR rate.`);
  }

  return rate;
}

export async function findDonationByTransactionIds(
  transactionIds: string[],
): Promise<ExistingDonation | null> {
  const uniqueTransactionIds = Array.from(
    new Set(transactionIds.map((transactionId) => transactionId.trim()).filter(Boolean)),
  );

  if (uniqueTransactionIds.length === 0) return null;

  const supabase = getSupabaseAdmin();

  if (!supabase) {
    throw new Error('Donation storage is not configured.');
  }

  const {data, error} = await supabase
    .from('campaign_donations')
    .select('campaign_id, transaction_id, status')
    .in('transaction_id', uniqueTransactionIds)
    .limit(1);

  if (error) throw error;

  const row = (data?.[0] ?? null) as ExistingDonationRow | null;
  if (!row) return null;

  return {
    campaignId: row.campaign_id,
    transactionId: row.transaction_id,
    status: row.status,
  };
}

export async function recordVerifiedDonation(
  donation: VerifiedDonation,
): Promise<RecordVerifiedDonationResult> {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    throw new Error('Donation storage is not configured.');
  }

  const {error} = await supabase.from('campaign_donations').insert({
    campaign_id: donation.campaignId,
    provider: donation.provider,
    transaction_id: donation.transactionId,
    amount_original: donation.amountOriginal,
    currency: donation.currency,
    // Keep the EUR value at verification time as an audit/fallback value.
    // The public progress total revalues crypto at the current market rate.
    amount_eur: donation.amountEur,
    status: 'verified',
    metadata: donation.metadata ?? {},
  });

  if (!error) return {status: 'recorded'};

  // The database has a global unique constraint on transaction_id. If two
  // requests race, return the campaign that won instead of silently ignoring
  // the duplicate or moving it to another campaign.
  if (error.code === '23505') {
    const existingDonation = await findDonationByTransactionIds([
      donation.transactionId,
    ]);

    if (existingDonation) {
      return {
        status: 'duplicate',
        campaignId: existingDonation.campaignId,
        transactionId: existingDonation.transactionId,
      };
    }
  }

  throw error;
}

export async function getCampaignTotalEur(campaignId: string) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    throw new Error('Donation storage is not configured.');
  }

  const {data, error} = await supabase
    .from('campaign_donations')
    .select('provider, amount_original, amount_eur')
    .eq('campaign_id', campaignId)
    .eq('status', 'verified');

  if (error) throw error;

  const donations = (data ?? []) as DonationRow[];
  const cryptoProviders = Array.from(
    new Set(
      donations
        .map((entry) => entry.provider)
        .filter(
          (provider): provider is Exclude<DonationProvider, 'paypal'> =>
            provider === 'btc' || provider === 'eth' || provider === 'usdc',
        ),
    ),
  );

  const currentRates = new Map<Exclude<DonationProvider, 'paypal'>, number>();

  await Promise.all(
    cryptoProviders.map(async (provider) => {
      try {
        currentRates.set(provider, await getCurrentEurRate(provider));
      } catch (rateError) {
        // If a price service is briefly unavailable, the stored EUR snapshot
        // keeps the progress bar available instead of returning an error.
        console.error(`Unable to refresh ${provider} price:`, rateError);
      }
    }),
  );

  return donations.reduce((total, entry) => {
    const storedEur = Number(entry.amount_eur ?? 0);

    if (entry.provider === 'paypal') {
      return total + (Number.isFinite(storedEur) ? storedEur : 0);
    }

    const amountOriginal = Number(entry.amount_original ?? 0);
    const currentRate = currentRates.get(entry.provider);

    if (
      Number.isFinite(amountOriginal) &&
      amountOriginal > 0 &&
      typeof currentRate === 'number' &&
      Number.isFinite(currentRate) &&
      currentRate > 0
    ) {
      return total + amountOriginal * currentRate;
    }

    return total + (Number.isFinite(storedEur) ? storedEur : 0);
  }, 0);
}
