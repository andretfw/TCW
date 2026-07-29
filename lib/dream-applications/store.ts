import 'server-only';

import { getStore } from '@netlify/blobs';

import { decryptJson, encryptJson, hashRateLimitIdentifier } from './crypto';
import { deleteGoogleDriveFile } from './google-drive';
import {
  CLOSED_MEDICAL_RETENTION_DAYS,
  type DreamApplicationListItem,
  type DreamApplicationRecord,
} from './types';

const STORE_NAME = 'tcw-dream-applications';
const APPLICATION_PREFIX = 'applications/';
const RATE_PREFIX = 'rate/';
const CONDITIONAL_WRITE_ATTEMPTS = 5;

function store() {
  return getStore({name: STORE_NAME, consistency: 'strong'});
}

function applicationKey(id: string): string {
  return `${APPLICATION_PREFIX}${id}.json`;
}

function applicationMetadata(record: DreamApplicationRecord) {
  return {
    kind: 'application',
    status: record.status,
    updatedAt: record.updatedAt,
  };
}

export async function saveDreamApplication(record: DreamApplicationRecord): Promise<void> {
  await store().set(applicationKey(record.id), encryptJson(record), {
    metadata: applicationMetadata(record),
  });
}

export async function getDreamApplication(id: string): Promise<DreamApplicationRecord | null> {
  const payload = await store().get(applicationKey(id), {
    type: 'text',
    consistency: 'strong',
  });
  if (!payload) return null;
  return decryptJson<DreamApplicationRecord>(payload);
}

export async function mutateDreamApplication<T>(
  id: string,
  mutate: (record: DreamApplicationRecord) => T | Promise<T>,
): Promise<{record: DreamApplicationRecord; result: T} | null> {
  const key = applicationKey(id);

  for (let attempt = 0; attempt < CONDITIONAL_WRITE_ATTEMPTS; attempt += 1) {
    const current = await store().getWithMetadata(key, {
      type: 'text',
      consistency: 'strong',
    });
    if (!current) return null;
    if (!current.etag || !current.data) continue;

    const record = decryptJson<DreamApplicationRecord>(current.data);
    const result = await mutate(record);
    const write = await store().set(key, encryptJson(record), {
      metadata: applicationMetadata(record),
      onlyIfMatch: current.etag,
    });

    if (write.modified) return {record, result};
  }

  throw new Error('APPLICATION_WRITE_CONFLICT');
}

export async function listDreamApplications(): Promise<DreamApplicationRecord[]> {
  const result = await store().list({prefix: APPLICATION_PREFIX});
  const records = await Promise.all(
    result.blobs
      .filter((blob) => blob.key.endsWith('.json'))
      .map(async (blob) => {
        const payload = await store().get(blob.key, {
          type: 'text',
          consistency: 'strong',
        });
        return payload ? decryptJson<DreamApplicationRecord>(payload) : null;
      }),
  );

  return records
    .filter((record): record is DreamApplicationRecord => Boolean(record))
    .sort((a, b) => (b.submittedAt || b.createdAt).localeCompare(a.submittedAt || a.createdAt));
}

export function toDreamListItem(record: DreamApplicationRecord): DreamApplicationListItem {
  return {
    id: record.id,
    reference: record.reference,
    status: record.status,
    fullName: record.fullName,
    country: record.country,
    diagnosis: record.diagnosis,
    dream: record.dream,
    estimatedCost: record.estimatedCost,
    requestedAmountEur: record.requestedAmountEur,
    locale: record.locale,
    submittedAt: record.submittedAt,
    updatedAt: record.updatedAt,
    fileCount: record.files.length,
  };
}

export async function deleteDreamApplication(record: DreamApplicationRecord): Promise<void> {
  for (const file of record.files) {
    await deleteGoogleDriveFile(file.driveFileId);
  }
  await store().delete(applicationKey(record.id));
}

interface RateWindow {
  count: number;
  resetsAt: string;
}

export async function enforceDreamStartRateLimit(identifier: string): Promise<void> {
  const key = `${RATE_PREFIX}${hashRateLimitIdentifier(identifier)}.json`;
  const now = new Date();

  for (let attempt = 0; attempt < CONDITIONAL_WRITE_ATTEMPTS; attempt += 1) {
    const existing = await store().getWithMetadata(key, {
      type: 'text',
      consistency: 'strong',
    });
    let window: RateWindow | null = existing?.data
      ? JSON.parse(existing.data) as RateWindow
      : null;

    if (!window || new Date(window.resetsAt) <= now) {
      window = {
        count: 0,
        resetsAt: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      };
    }

    if (window.count >= 5) {
      throw new Error('RATE_LIMITED');
    }

    window.count += 1;
    const metadata = {kind: 'rate-limit', expiresAt: window.resetsAt};
    const write = existing
      ? existing.etag
        ? await store().set(key, JSON.stringify(window), {
            metadata,
            onlyIfMatch: existing.etag,
          })
        : {modified: false}
      : await store().set(key, JSON.stringify(window), {
          metadata,
          onlyIfNew: true,
        });

    if (write.modified) return;
  }

  throw new Error('RATE_LIMIT_BUSY');
}

export function retentionDateFrom(now: Date): string {
  return new Date(
    now.getTime() + CLOSED_MEDICAL_RETENTION_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString();
}

export async function purgeExpiredDreamApplications(now = new Date()): Promise<{
  deletedDrafts: number;
  deletedClosed: number;
}> {
  const records = await listDreamApplications();
  let deletedDrafts = 0;
  let deletedClosed = 0;

  for (const record of records) {
    const expiredDraft =
      record.status === 'draft' &&
      Boolean(record.draftExpiresAt) &&
      new Date(record.draftExpiresAt as string) <= now;
    const expiredClosed =
      ['declined', 'closed'].includes(record.status) &&
      Boolean(record.retentionDeleteAt) &&
      new Date(record.retentionDeleteAt as string) <= now;

    if (!expiredDraft && !expiredClosed) continue;
    await deleteDreamApplication(record);
    if (expiredDraft) deletedDrafts += 1;
    if (expiredClosed) deletedClosed += 1;
  }

  return {deletedDrafts, deletedClosed};
}
