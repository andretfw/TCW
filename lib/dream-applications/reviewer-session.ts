import 'server-only';

import {randomBytes, randomInt, timingSafeEqual} from 'node:crypto';
import {getStore} from '@netlify/blobs';
import {cookies} from 'next/headers';

import {
  decryptJson,
  encryptJson,
  hashRateLimitIdentifier,
} from './crypto';

const STORE_NAME = 'tcw-reviewer-auth';
const COOKIE_NAME = 'tcw_reviewer_security';
const COOKIE_PATH = '/api';
const CODE_TTL_MS = 10 * 60 * 1000;
const SESSION_TTL_SECONDS = 12 * 60 * 60;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_CODE_ATTEMPTS = 5;
const WRITE_ATTEMPTS = 5;

interface ReviewerChallenge {
  email: string;
  codeHash: string;
  nonce: string;
  sentAt: string;
  expiresAt: string;
  attempts: number;
  usedAt?: string;
}

interface ReviewerGeneration {
  email: string;
  generation: number;
  updatedAt: string;
}

interface ReviewerSession {
  email: string;
  generation: number;
  createdAt: string;
  expiresAt: string;
  revokedAt?: string;
}

function authStore() {
  return getStore({name: STORE_NAME, consistency: 'strong'});
}

function challengeKey(email: string): string {
  return `challenge/${hashRateLimitIdentifier(`reviewer-challenge:${email}`)}.json`;
}

function generationKey(email: string): string {
  return `generation/${hashRateLimitIdentifier(`reviewer-generation:${email}`)}.json`;
}

function sessionKey(token: string): string {
  return `session/${hashRateLimitIdentifier(`reviewer-session:${token}`)}.json`;
}

function codeHash(email: string, code: string, nonce: string): string {
  return hashRateLimitIdentifier(`reviewer-code:${email}:${nonce}:${code}`);
}

function securityCookie(token: string, maxAge = SESSION_TTL_SECONDS): string {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${COOKIE_NAME}=${token}; Path=${COOKIE_PATH}; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

export function clearReviewerSecurityCookie(): string {
  return securityCookie('', 0);
}

async function currentGeneration(email: string): Promise<number> {
  const payload = await authStore().get(generationKey(email), {
    type: 'text',
    consistency: 'strong',
  });
  if (!payload) return 0;
  return decryptJson<ReviewerGeneration>(payload).generation;
}

async function bumpGeneration(email: string): Promise<number> {
  const store = authStore();
  const key = generationKey(email);
  for (let attempt = 0; attempt < WRITE_ATTEMPTS; attempt += 1) {
    const existing = await store.getWithMetadata(key, {
      type: 'text',
      consistency: 'strong',
    });
    const current = existing?.data
      ? decryptJson<ReviewerGeneration>(existing.data)
      : null;
    const next: ReviewerGeneration = {
      email,
      generation: (current?.generation || 0) + 1,
      updatedAt: new Date().toISOString(),
    };
    const write = existing
      ? existing.etag
        ? await store.set(key, encryptJson(next), {onlyIfMatch: existing.etag})
        : {modified: false}
      : await store.set(key, encryptJson(next), {onlyIfNew: true});
    if (write.modified) return next.generation;
  }
  throw new Error('REVIEWER_AUTH_WRITE_CONFLICT');
}

export async function issueReviewerSecurityCode(email: string): Promise<string> {
  const store = authStore();
  const key = challengeKey(email);
  const existing = await store.get(key, {
    type: 'text',
    consistency: 'strong',
  });
  if (existing) {
    const previous = decryptJson<ReviewerChallenge>(existing);
    if (Date.now() - new Date(previous.sentAt).getTime() < RESEND_COOLDOWN_MS) {
      throw new Error('REVIEWER_CODE_RATE_LIMITED');
    }
  }

  const code = String(randomInt(100000, 1000000));
  const nonce = randomBytes(16).toString('base64url');
  const now = new Date();
  const challenge: ReviewerChallenge = {
    email,
    codeHash: codeHash(email, code, nonce),
    nonce,
    sentAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + CODE_TTL_MS).toISOString(),
    attempts: 0,
  };
  await store.set(key, encryptJson(challenge), {
    metadata: {
      kind: 'reviewer-security-challenge',
      expiresAt: challenge.expiresAt,
    },
  });
  return code;
}

async function createReviewerSession(email: string): Promise<string> {
  const store = authStore();
  const generation = await currentGeneration(email);
  const now = new Date();
  const session: ReviewerSession = {
    email,
    generation,
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + SESSION_TTL_SECONDS * 1000).toISOString(),
  };

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const token = randomBytes(32).toString('base64url');
    const write = await store.set(sessionKey(token), encryptJson(session), {
      onlyIfNew: true,
      metadata: {
        kind: 'reviewer-security-session',
        expiresAt: session.expiresAt,
      },
    });
    if (write.modified) return securityCookie(token);
  }
  throw new Error('REVIEWER_SESSION_COLLISION');
}

export async function verifyReviewerSecurityCode(
  email: string,
  code: string,
): Promise<string> {
  if (!/^\d{6}$/.test(code)) throw new Error('INVALID_REVIEWER_CODE');

  const store = authStore();
  const key = challengeKey(email);
  for (let attempt = 0; attempt < WRITE_ATTEMPTS; attempt += 1) {
    const existing = await store.getWithMetadata(key, {
      type: 'text',
      consistency: 'strong',
    });
    if (!existing?.data || !existing.etag) {
      throw new Error('INVALID_REVIEWER_CODE');
    }

    const challenge = decryptJson<ReviewerChallenge>(existing.data);
    if (
      challenge.email !== email ||
      challenge.usedAt ||
      new Date(challenge.expiresAt).getTime() <= Date.now() ||
      challenge.attempts >= MAX_CODE_ATTEMPTS
    ) {
      throw new Error('INVALID_REVIEWER_CODE');
    }

    const actual = Buffer.from(codeHash(email, code, challenge.nonce), 'hex');
    const expected = Buffer.from(challenge.codeHash, 'hex');
    const valid = actual.length === expected.length && timingSafeEqual(actual, expected);
    if (!valid) {
      challenge.attempts += 1;
      const write = await store.set(key, encryptJson(challenge), {
        onlyIfMatch: existing.etag,
        metadata: {
          kind: 'reviewer-security-challenge',
          expiresAt: challenge.expiresAt,
        },
      });
      if (write.modified) throw new Error('INVALID_REVIEWER_CODE');
      continue;
    }

    challenge.usedAt = new Date().toISOString();
    const used = await store.set(key, encryptJson(challenge), {
      onlyIfMatch: existing.etag,
      metadata: {
        kind: 'reviewer-security-challenge',
        expiresAt: challenge.expiresAt,
      },
    });
    if (!used.modified) continue;
    return createReviewerSession(email);
  }

  throw new Error('REVIEWER_AUTH_WRITE_CONFLICT');
}

async function cookieToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return token && /^[A-Za-z0-9_-]{43}$/.test(token) ? token : null;
}

export async function reviewerSecuritySessionEmail(): Promise<string | null> {
  const token = await cookieToken();
  if (!token) return null;

  const payload = await authStore().get(sessionKey(token), {
    type: 'text',
    consistency: 'strong',
  });
  if (!payload) return null;

  const session = decryptJson<ReviewerSession>(payload);
  if (session.revokedAt || new Date(session.expiresAt).getTime() <= Date.now()) {
    return null;
  }
  if (session.generation !== await currentGeneration(session.email)) {
    return null;
  }
  return session.email;
}

export async function hasReviewerSecuritySession(email: string): Promise<boolean> {
  return (await reviewerSecuritySessionEmail()) === email;
}

export async function revokeCurrentReviewerSecuritySession(): Promise<void> {
  const token = await cookieToken();
  if (!token) return;
  await authStore().delete(sessionKey(token));
}

export async function revokeAllReviewerSecuritySessions(email: string): Promise<void> {
  await bumpGeneration(email);
  await revokeCurrentReviewerSecuritySession();
}
