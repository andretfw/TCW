import 'server-only';

import {randomBytes} from 'node:crypto';
import {getStore} from '@netlify/blobs';

import {
  decryptJson,
  encryptJson,
  hashRateLimitIdentifier,
} from '@/lib/dream-applications/crypto';

import {getConnectProfile} from './store';
import type {ConnectProfile} from './types';

const STORE_NAME = 'tcw-connect-auth';
const COOKIE_NAME = 'tcw_connect_session';
const COOKIE_PATH = '/api/connect';
const LEGACY_COOKIE_PATH = '/api/connect/portal';
const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60;
const ACCESS_TTL_MS = 15 * 60 * 1000;
const WRITE_ATTEMPTS = 5;
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;

interface ConnectAccessGeneration {
  profileId: string;
  generation: number;
  updatedAt: string;
}

interface ConnectAccessToken {
  profileId: string;
  generation: number;
  createdAt: string;
  expiresAt: string;
  usedAt?: string;
}

interface ConnectSessionGeneration {
  profileId: string;
  generation: number;
  updatedAt: string;
}

interface ConnectSessionRecord {
  profileId: string;
  email: string;
  generation: number;
  createdAt: string;
  expiresAt: string;
}

function authStore() {
  return getStore({name: STORE_NAME, consistency: 'strong'});
}

function accessGenerationKey(profileId: string): string {
  return `access-generation/${hashRateLimitIdentifier(`connect-access:${profileId}`)}.json`;
}

function accessTokenKey(token: string): string {
  return `access-token/${hashRateLimitIdentifier(`connect-access-token:${token}`)}.json`;
}

function sessionGenerationKey(profileId: string): string {
  return `session-generation/${hashRateLimitIdentifier(`connect-session:${profileId}`)}.json`;
}

function sessionKey(token: string): string {
  return `session/${hashRateLimitIdentifier(`connect-session-token:${token}`)}.json`;
}

function readCookie(request: Request, name: string): string | undefined {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return undefined;

  for (const part of cookieHeader.split(';')) {
    const separator = part.indexOf('=');
    if (separator < 0) continue;
    const key = part.slice(0, separator).trim();
    if (key !== name) continue;
    return part.slice(separator + 1).trim();
  }
  return undefined;
}

function cookieSecurity(): string {
  return process.env.NODE_ENV === 'production' ? '; Secure' : '';
}

function expiredCookie(path: string): string {
  return `${COOKIE_NAME}=; Path=${path}; HttpOnly; SameSite=Strict; Max-Age=0${cookieSecurity()}`;
}

async function currentGeneration(key: string): Promise<number> {
  const payload = await authStore().get(key, {
    type: 'text',
    consistency: 'strong',
  });
  if (!payload) return 0;
  return decryptJson<{generation: number}>(payload).generation;
}

async function bumpGeneration(
  key: string,
  record: (generation: number) => ConnectAccessGeneration | ConnectSessionGeneration,
  kind: string,
): Promise<number> {
  const store = authStore();
  for (let attempt = 0; attempt < WRITE_ATTEMPTS; attempt += 1) {
    const existing = await store.getWithMetadata(key, {
      type: 'text',
      consistency: 'strong',
    });
    const current = existing?.data
      ? decryptJson<{generation: number}>(existing.data).generation
      : 0;
    const next = record(current + 1);
    const write = existing
      ? existing.etag
        ? await store.set(key, encryptJson(next), {
            onlyIfMatch: existing.etag,
            metadata: {kind},
          })
        : {modified: false}
      : await store.set(key, encryptJson(next), {
          onlyIfNew: true,
          metadata: {kind},
        });
    if (write.modified) return current + 1;
  }
  throw new Error('CONNECT_AUTH_WRITE_CONFLICT');
}

export async function createConnectAccessToken(
  profileId: string,
  options: {invalidatePrevious?: boolean} = {},
): Promise<string> {
  const generationKey = accessGenerationKey(profileId);
  const generation = options.invalidatePrevious
    ? await bumpGeneration(
        generationKey,
        (value) => ({profileId, generation: value, updatedAt: new Date().toISOString()}),
        'connect-access-generation',
      )
    : await currentGeneration(generationKey);

  const now = new Date();
  const record: ConnectAccessToken = {
    profileId,
    generation,
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + ACCESS_TTL_MS).toISOString(),
  };
  const store = authStore();

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const token = randomBytes(32).toString('base64url');
    const write = await store.set(accessTokenKey(token), encryptJson(record), {
      onlyIfNew: true,
      metadata: {
        kind: 'connect-access-token',
        expiresAt: record.expiresAt,
      },
    });
    if (write.modified) return token;
  }
  throw new Error('CONNECT_ACCESS_TOKEN_COLLISION');
}

export async function consumeConnectAccessToken(token: string): Promise<string | null> {
  if (!TOKEN_PATTERN.test(token)) return null;

  const store = authStore();
  const key = accessTokenKey(token);
  const existing = await store.getWithMetadata(key, {
    type: 'text',
    consistency: 'strong',
  });
  if (!existing?.data || !existing.etag) return null;

  const record = decryptJson<ConnectAccessToken>(existing.data);
  if (
    record.usedAt ||
    new Date(record.expiresAt).getTime() <= Date.now() ||
    record.generation !== await currentGeneration(accessGenerationKey(record.profileId))
  ) {
    return null;
  }

  record.usedAt = new Date().toISOString();
  const used = await store.set(key, encryptJson(record), {
    onlyIfMatch: existing.etag,
    metadata: {
      kind: 'connect-access-token',
      expiresAt: record.expiresAt,
    },
  });
  return used.modified ? record.profileId : null;
}

export async function createConnectSessionCookie(
  profile: ConnectProfile,
): Promise<string> {
  const generation = await currentGeneration(sessionGenerationKey(profile.id));
  const now = new Date();
  const session: ConnectSessionRecord = {
    profileId: profile.id,
    email: profile.email,
    generation,
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + SESSION_TTL_SECONDS * 1000).toISOString(),
  };
  const store = authStore();

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const token = randomBytes(32).toString('base64url');
    const write = await store.set(sessionKey(token), encryptJson(session), {
      onlyIfNew: true,
      metadata: {
        kind: 'connect-session',
        expiresAt: session.expiresAt,
      },
    });
    if (write.modified) {
      return `${COOKIE_NAME}=${token}; Path=${COOKIE_PATH}; HttpOnly; SameSite=Strict; Max-Age=${SESSION_TTL_SECONDS}${cookieSecurity()}`;
    }
  }
  throw new Error('CONNECT_SESSION_COLLISION');
}

export function clearConnectSessionCookies(): string[] {
  return [expiredCookie(COOKIE_PATH), expiredCookie(LEGACY_COOKIE_PATH)];
}

export async function connectSessionProfileId(request: Request): Promise<string | null> {
  const token = readCookie(request, COOKIE_NAME);
  if (!token || !TOKEN_PATTERN.test(token)) return null;

  const payload = await authStore().get(sessionKey(token), {
    type: 'text',
    consistency: 'strong',
  });
  if (!payload) return null;

  const session = decryptJson<ConnectSessionRecord>(payload);
  if (
    new Date(session.expiresAt).getTime() <= Date.now() ||
    session.generation !== await currentGeneration(sessionGenerationKey(session.profileId))
  ) {
    return null;
  }

  const profile = await getConnectProfile(session.profileId);
  if (
    !profile ||
    profile.email !== session.email ||
    profile.status === 'closed' ||
    profile.status === 'suspended'
  ) {
    return null;
  }
  return profile.id;
}

export async function revokeConnectSession(request: Request): Promise<void> {
  const token = readCookie(request, COOKIE_NAME);
  if (!token || !TOKEN_PATTERN.test(token)) return;
  await authStore().delete(sessionKey(token));
}

export async function revokeAllConnectSessions(profileId: string): Promise<void> {
  await bumpGeneration(
    sessionGenerationKey(profileId),
    (generation) => ({
      profileId,
      generation,
      updatedAt: new Date().toISOString(),
    }),
    'connect-session-generation',
  );
}
