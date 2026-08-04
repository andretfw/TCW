import 'server-only';

import {createHmac, randomBytes, timingSafeEqual} from 'node:crypto';

import {isCampaignId, type CampaignId} from '@/lib/campaigns';

export type CryptoDonationAsset = 'btc' | 'eth' | 'usdc';
export type CryptoDonationDestination = 'kraken' | 'metamask';

export type CryptoDonationIntent = {
  version: 1;
  campaignId: CampaignId;
  asset: CryptoDonationAsset;
  destination: CryptoDonationDestination;
  issuedAt: number;
  expiresAt: number;
  nonce: string;
};

const INTENT_TTL_MS = 24 * 60 * 60 * 1000;
const CLOCK_SKEW_MS = 2 * 60 * 1000;

function isAsset(value: unknown): value is CryptoDonationAsset {
  return value === 'btc' || value === 'eth' || value === 'usdc';
}

function isDestination(value: unknown): value is CryptoDonationDestination {
  return value === 'kraken' || value === 'metamask';
}

function intentSecret(): string {
  const secret =
    process.env.CRYPTO_DONATION_INTENT_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!secret || secret.length < 32) {
    throw new Error('Crypto donation intent signing is not configured.');
  }

  return secret;
}

function signPayload(encodedPayload: string): string {
  return createHmac('sha256', intentSecret())
    .update(`tcw-crypto-intent:v1:${encodedPayload}`)
    .digest('base64url');
}

function parsePayload(encodedPayload: string): CryptoDonationIntent {
  let parsed: Partial<CryptoDonationIntent>;

  try {
    parsed = JSON.parse(
      Buffer.from(encodedPayload, 'base64url').toString('utf8'),
    ) as Partial<CryptoDonationIntent>;
  } catch {
    throw new Error('Invalid crypto donation session.');
  }

  if (
    parsed.version !== 1 ||
    !isCampaignId(parsed.campaignId) ||
    !isAsset(parsed.asset) ||
    !isDestination(parsed.destination) ||
    typeof parsed.issuedAt !== 'number' ||
    typeof parsed.expiresAt !== 'number' ||
    typeof parsed.nonce !== 'string' ||
    parsed.nonce.length < 16
  ) {
    throw new Error('Invalid crypto donation session.');
  }

  return parsed as CryptoDonationIntent;
}

export function createCryptoDonationIntent(input: {
  campaignId: CampaignId;
  asset: CryptoDonationAsset;
  destination: CryptoDonationDestination;
}): {token: string; intent: CryptoDonationIntent} {
  const issuedAt = Date.now();
  const intent: CryptoDonationIntent = {
    version: 1,
    campaignId: input.campaignId,
    asset: input.asset,
    destination: input.destination,
    issuedAt,
    expiresAt: issuedAt + INTENT_TTL_MS,
    nonce: randomBytes(16).toString('base64url'),
  };
  const encodedPayload = Buffer.from(JSON.stringify(intent)).toString(
    'base64url',
  );

  return {
    token: `${encodedPayload}.${signPayload(encodedPayload)}`,
    intent,
  };
}

export function verifyCryptoDonationIntent(
  token: string,
): CryptoDonationIntent {
  if (token.length < 80 || token.length > 2_048) {
    throw new Error('Invalid crypto donation session.');
  }

  const [encodedPayload, providedSignature, ...extra] = token.split('.');

  if (!encodedPayload || !providedSignature || extra.length > 0) {
    throw new Error('Invalid crypto donation session.');
  }

  const expectedSignature = Buffer.from(
    signPayload(encodedPayload),
    'base64url',
  );
  let receivedSignature: Buffer;

  try {
    receivedSignature = Buffer.from(providedSignature, 'base64url');
  } catch {
    throw new Error('Invalid crypto donation session.');
  }

  if (
    expectedSignature.length !== receivedSignature.length ||
    !timingSafeEqual(expectedSignature, receivedSignature)
  ) {
    throw new Error('Invalid crypto donation session.');
  }

  const intent = parsePayload(encodedPayload);
  const now = Date.now();

  if (intent.issuedAt > now + CLOCK_SKEW_MS || intent.expiresAt <= now) {
    throw new Error('This crypto donation session has expired. Copy the address again.');
  }

  if (intent.expiresAt - intent.issuedAt !== INTENT_TTL_MS) {
    throw new Error('Invalid crypto donation session.');
  }

  return intent;
}
