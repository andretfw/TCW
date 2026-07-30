import 'server-only';

import {createHash, randomBytes, timingSafeEqual} from 'node:crypto';

import {getStore} from '@netlify/blobs';

import {decryptJson, encryptJson, hashRateLimitIdentifier} from './crypto';

const STORE_NAME = 'tcw-dream-applications';
const STATE_KEY_PREFIX = 'config/google-drive-oauth-state/';
const STATE_PURPOSE = 'google-drive-oauth-state-v1';
const STATE_TTL_MS = 10 * 60 * 1000;
const BASE64URL_PATTERN = /^[A-Za-z0-9_-]+$/;
const SHA256_HEX_PATTERN = /^[a-f0-9]{64}$/;

interface GoogleDriveOAuthStatePayload {
  v: 1;
  adminEmail: string;
  expiresAt: number;
  nonce: string;
}

interface GoogleDriveOAuthStateRecord {
  v: 1;
  adminEmail: string;
  stateHash: string;
  expiresAt: number;
  consumedAt?: string;
}

export class GoogleDriveOAuthStateError extends Error {
  constructor() {
    super('Invalid or expired Google Drive authorization session.');
    this.name = 'GoogleDriveOAuthStateError';
  }
}

function stateStore() {
  return getStore({name: STORE_NAME, consistency: 'strong'});
}

function normalizeAdminEmail(email: string): string {
  const normalized = email.trim().toLowerCase();
  if (!normalized) throw new GoogleDriveOAuthStateError();
  return normalized;
}

function stateRecordKey(adminEmail: string): string {
  const adminHash = createHash('sha256')
    .update(adminEmail, 'utf8')
    .digest('hex');
  return `${STATE_KEY_PREFIX}${adminHash}.json`;
}

function hashState(state: string): string {
  return createHash('sha256').update(state, 'utf8').digest('hex');
}

function safeHexMatch(actual: string, expected: string): boolean {
  if (
    !SHA256_HEX_PATTERN.test(actual) ||
    !SHA256_HEX_PATTERN.test(expected)
  ) {
    return false;
  }

  const actualBuffer = Buffer.from(actual, 'hex');
  const expectedBuffer = Buffer.from(expected, 'hex');
  return timingSafeEqual(actualBuffer, expectedBuffer);
}

function signedStatePayload(encodedPayload: string): string {
  return hashRateLimitIdentifier(`${STATE_PURPOSE}:${encodedPayload}`);
}

function parseSignedState(
  state: string,
  expectedAdminEmail: string,
): GoogleDriveOAuthStatePayload {
  if (state.length > 1024) throw new GoogleDriveOAuthStateError();

  const parts = state.split('.');
  if (parts.length !== 2) throw new GoogleDriveOAuthStateError();

  const [encodedPayload, signature] = parts;
  if (
    !encodedPayload ||
    !BASE64URL_PATTERN.test(encodedPayload) ||
    !signature ||
    !safeHexMatch(signature, signedStatePayload(encodedPayload))
  ) {
    throw new GoogleDriveOAuthStateError();
  }

  let payload: GoogleDriveOAuthStatePayload;
  try {
    payload = JSON.parse(
      Buffer.from(encodedPayload, 'base64url').toString('utf8'),
    ) as GoogleDriveOAuthStatePayload;
  } catch {
    throw new GoogleDriveOAuthStateError();
  }

  const now = Date.now();
  if (
    payload.v !== 1 ||
    payload.adminEmail !== expectedAdminEmail ||
    !Number.isSafeInteger(payload.expiresAt) ||
    payload.expiresAt <= now ||
    payload.expiresAt > now + STATE_TTL_MS ||
    !/^[A-Za-z0-9_-]{43}$/.test(payload.nonce)
  ) {
    throw new GoogleDriveOAuthStateError();
  }

  return payload;
}

function browserStatesMatch(
  actual: string | null,
  expected: string | undefined,
): actual is string {
  if (!actual || !expected || actual.length !== expected.length) return false;

  const actualBuffer = Buffer.from(actual, 'utf8');
  const expectedBuffer = Buffer.from(expected, 'utf8');
  return timingSafeEqual(actualBuffer, expectedBuffer);
}

export async function createGoogleDriveOAuthState(
  adminEmail: string,
): Promise<string> {
  const normalizedEmail = normalizeAdminEmail(adminEmail);
  const expiresAt = Date.now() + STATE_TTL_MS;
  const payload: GoogleDriveOAuthStatePayload = {
    v: 1,
    adminEmail: normalizedEmail,
    expiresAt,
    nonce: randomBytes(32).toString('base64url'),
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload), 'utf8').toString(
    'base64url',
  );
  const state = `${encodedPayload}.${signedStatePayload(encodedPayload)}`;
  const record: GoogleDriveOAuthStateRecord = {
    v: 1,
    adminEmail: normalizedEmail,
    stateHash: hashState(state),
    expiresAt,
  };

  await stateStore().set(
    stateRecordKey(normalizedEmail),
    encryptJson(record),
    {
      metadata: {
        kind: 'google-drive-oauth-state',
        expiresAt: new Date(expiresAt).toISOString(),
        consumed: false,
      },
    },
  );

  return state;
}

export async function assertAndConsumeGoogleDriveOAuthState(input: {
  state: string | null;
  cookieState: string | undefined;
  adminEmail: string;
}): Promise<void> {
  const normalizedEmail = normalizeAdminEmail(input.adminEmail);
  if (!browserStatesMatch(input.state, input.cookieState)) {
    throw new GoogleDriveOAuthStateError();
  }

  const payload = parseSignedState(input.state, normalizedEmail);
  const key = stateRecordKey(normalizedEmail);
  const store = stateStore();
  const entry = await store.getWithMetadata(key, {
    type: 'text',
    consistency: 'strong',
  });

  if (!entry?.data || !entry.etag) {
    throw new GoogleDriveOAuthStateError();
  }

  let record: GoogleDriveOAuthStateRecord;
  try {
    record = decryptJson<GoogleDriveOAuthStateRecord>(entry.data);
  } catch {
    throw new GoogleDriveOAuthStateError();
  }

  const now = Date.now();
  if (
    record.v !== 1 ||
    record.adminEmail !== normalizedEmail ||
    record.expiresAt !== payload.expiresAt ||
    record.expiresAt <= now ||
    Boolean(record.consumedAt) ||
    !safeHexMatch(record.stateHash, hashState(input.state))
  ) {
    throw new GoogleDriveOAuthStateError();
  }

  const consumedAt = new Date(now).toISOString();
  const consumed = await store.set(
    key,
    encryptJson({...record, consumedAt}),
    {
      onlyIfMatch: entry.etag,
      metadata: {
        kind: 'google-drive-oauth-state',
        expiresAt: new Date(record.expiresAt).toISOString(),
        consumed: true,
        consumedAt,
      },
    },
  );

  if (!consumed.modified) {
    throw new GoogleDriveOAuthStateError();
  }
}
