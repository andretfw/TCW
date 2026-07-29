import { randomBytes, randomUUID } from 'node:crypto';

import { hashUploadToken } from '@/lib/dream-applications/crypto';
import { assertSameOrigin, DreamAuthorizationError, privateJson } from '@/lib/dream-applications/security';
import {
  enforceDreamStartRateLimit,
  saveDreamApplication,
} from '@/lib/dream-applications/store';
import {
  DRAFT_RETENTION_HOURS,
  type DreamApplicationRecord,
} from '@/lib/dream-applications/types';
import {
  DreamValidationError,
  validateDreamApplicationInput,
} from '@/lib/dream-applications/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function createReference(): string {
  const year = new Date().getUTCFullYear();
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const random = randomBytes(5);
  const suffix = Array.from(random, (byte) => alphabet[byte % alphabet.length]).join('');
  return `TCW-${year}-${suffix}`;
}

function getRateIdentifier(request: Request): string {
  return (
    request.headers.get('x-nf-client-connection-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown-client'
  );
}

export async function POST(request: Request): Promise<Response> {
  try {
    assertSameOrigin(request);
    const payload = validateDreamApplicationInput(await request.json());
    if (payload.website) {
      return privateJson({error: 'Unable to submit this application.'}, {status: 400});
    }

    await enforceDreamStartRateLimit(getRateIdentifier(request));

    const now = new Date();
    const applicationId = randomUUID();
    const uploadToken = randomBytes(32).toString('base64url');
    const {website: _website, ...applicationInput} = payload;
    void _website;

    const record: DreamApplicationRecord = {
      ...applicationInput,
      id: applicationId,
      reference: createReference(),
      status: 'draft',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      draftExpiresAt: new Date(
        now.getTime() + DRAFT_RETENTION_HOURS * 60 * 60 * 1000,
      ).toISOString(),
      uploadTokenHash: hashUploadToken(uploadToken),
      files: [],
      reviewerNotes: [],
      history: [],
      consentVersion: 'dream-application-v1',
      grantPolicyVersion: '3.1',
      privacyNoticeVersion: '2026-07-29',
    };

    await saveDreamApplication(record);

    return privateJson(
      {
        applicationId,
        uploadToken,
        reference: record.reference,
        expiresAt: record.draftExpiresAt,
      },
      {status: 201},
    );
  } catch (error) {
    if (error instanceof DreamAuthorizationError) {
      return privateJson({error: error.message}, {status: error.status});
    }
    if (error instanceof DreamValidationError) {
      return privateJson(
        {error: error.message, field: error.field},
        {status: 400},
      );
    }
    if (error instanceof Error && error.message === 'RATE_LIMITED') {
      return privateJson(
        {error: 'Too many applications were started from this connection. Please try again tomorrow.'},
        {status: 429},
      );
    }

    console.error('Unable to start Dream Support application', error);
    return privateJson(
      {error: 'The secure application service is temporarily unavailable.'},
      {status: 503},
    );
  }
}

