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

export async function recordVerifiedDonation(donation: VerifiedDonation) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    throw new Error('Donation storage is not configured.');
  }

  const {error} = await supabase.from('campaign_donations').upsert(
    {
      campaign_id: donation.campaignId,
      provider: donation.provider,
      transaction_id: donation.transactionId,
      amount_original: donation.amountOriginal,
      currency: donation.currency,
      amount_eur: donation.amountEur,
      status: 'verified',
      metadata: donation.metadata ?? {},
    },
    {
      onConflict: 'transaction_id',
      ignoreDuplicates: true,
    },
  );

  if (error) throw error;
}

export async function getCampaignTotalEur(campaignId: string) {
  const supabase = getSupabaseAdmin();

  if (!supabase) return 0;

  const {data, error} = await supabase
    .from('campaign_donations')
    .select('amount_eur')
    .eq('campaign_id', campaignId)
    .eq('status', 'verified');

  if (error) throw error;

  return (data ?? []).reduce(
    (total, entry) => total + Number(entry.amount_eur ?? 0),
    0,
  );
}
