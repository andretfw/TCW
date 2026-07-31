import 'server-only';

import {createHash, randomBytes, timingSafeEqual} from 'node:crypto';

import type {ConnectProfile, PublicConnectProfile} from './types';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;

export function createPortalToken(): string {
  return randomBytes(32).toString('base64url');
}

export function hashPortalToken(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex');
}

export function portalTokensMatch(token: string, expectedHash: string): boolean {
  if (!TOKEN_PATTERN.test(token) || !/^[a-f0-9]{64}$/.test(expectedHash)) {
    return false;
  }
  const actual = Buffer.from(hashPortalToken(token), 'hex');
  const expected = Buffer.from(expectedHash, 'hex');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function normalizeEmail(value: string): string {
  const email = value.trim().toLowerCase();
  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    throw new Error('INVALID_EMAIL');
  }
  return email;
}

export function cleanText(
  value: unknown,
  options: {min?: number; max: number; required?: boolean},
): string {
  if (typeof value !== 'string') {
    if (options.required) throw new Error('INVALID_TEXT');
    return '';
  }
  const cleaned = value.replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim();
  const min = options.min ?? 0;
  if ((options.required && cleaned.length < Math.max(1, min)) || cleaned.length < min) {
    throw new Error('INVALID_TEXT');
  }
  if (cleaned.length > options.max) throw new Error('INVALID_TEXT');
  return cleaned;
}

export function publicProfile(profile: ConnectProfile): PublicConnectProfile {
  return {
    id: profile.id,
    role: profile.role,
    firstName: profile.firstName,
    ageRange: profile.ageRange,
    gender: profile.gender,
    country: profile.country,
    timezone: profile.timezone,
    languages: profile.languages,
    cancerType: profile.cancerType,
    cancerSubtype: profile.cancerSubtype,
    phase: profile.phase,
    treatments: profile.treatments,
    topics: profile.topics,
    communicationMethods: profile.communicationMethods,
    shortIntro: profile.shortIntro,
  };
}

export function privateJson(data: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  headers.set('Cache-Control', 'no-store, private');
  headers.set('Content-Type', 'application/json; charset=utf-8');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'no-referrer');
  return new Response(JSON.stringify(data), {...init, headers});
}
