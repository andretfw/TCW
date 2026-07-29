import {createHmac, timingSafeEqual} from 'node:crypto';

const SIGNING_PURPOSE = 'tcw-dream-maintenance-v1';
const MAX_TIMESTAMP_SKEW_MS = 5 * 60 * 1000;

function encryptionKey(): Buffer {
  const configured = process.env.DREAM_APPLICATION_ENCRYPTION_KEY?.trim();
  if (!configured) {
    throw new Error('DREAM_APPLICATION_ENCRYPTION_KEY is not configured.');
  }

  const key = /^[a-f0-9]{64}$/i.test(configured)
    ? Buffer.from(configured, 'hex')
    : Buffer.from(configured, 'base64');
  if (key.length !== 32) {
    throw new Error('DREAM_APPLICATION_ENCRYPTION_KEY must decode to exactly 32 bytes.');
  }
  return key;
}

function maintenanceSigningKey(): Buffer {
  return createHmac('sha256', encryptionKey())
    .update(SIGNING_PURPOSE, 'utf8')
    .digest();
}

export function createDreamMaintenanceSignature(timestamp: string): string {
  return createHmac('sha256', maintenanceSigningKey())
    .update(timestamp, 'utf8')
    .digest('hex');
}

export function verifyDreamMaintenanceSignature(input: {
  timestamp?: string | null;
  signature?: string | null;
  now?: Date;
}): boolean {
  if (!input.timestamp || !input.signature || !/^[a-f0-9]{64}$/i.test(input.signature)) {
    return false;
  }

  const timestampMs = Number(input.timestamp);
  const now = input.now || new Date();
  if (!Number.isFinite(timestampMs) || Math.abs(now.getTime() - timestampMs) > MAX_TIMESTAMP_SKEW_MS) {
    return false;
  }

  const expected = Buffer.from(createDreamMaintenanceSignature(input.timestamp), 'hex');
  const actual = Buffer.from(input.signature, 'hex');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
