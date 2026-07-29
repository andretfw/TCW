import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from 'node:crypto';

const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const JSON_AAD = Buffer.from('tcw-dream-application-json-v1', 'utf8');
const FILE_AAD = Buffer.from('tcw-dream-application-file-v1', 'utf8');
const FILE_MAGIC = Buffer.from('TCWENC01', 'ascii');

interface EncryptedJsonEnvelope {
  v: 1;
  alg: 'A256GCM';
  iv: string;
  tag: string;
  data: string;
}

function getEncryptionKey(): Buffer {
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

export function encryptJson(value: unknown): string {
  const key = getEncryptionKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv(ENCRYPTION_ALGORITHM, key, iv);
  cipher.setAAD(JSON_AAD);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(value), 'utf8'),
    cipher.final(),
  ]);

  const envelope: EncryptedJsonEnvelope = {
    v: 1,
    alg: 'A256GCM',
    iv: iv.toString('base64'),
    tag: cipher.getAuthTag().toString('base64'),
    data: encrypted.toString('base64'),
  };

  return JSON.stringify(envelope);
}

export function decryptJson<T>(payload: string): T {
  const envelope = JSON.parse(payload) as EncryptedJsonEnvelope;
  if (envelope.v !== 1 || envelope.alg !== 'A256GCM') {
    throw new Error('Unsupported encrypted application format.');
  }

  const decipher = createDecipheriv(
    ENCRYPTION_ALGORITHM,
    getEncryptionKey(),
    Buffer.from(envelope.iv, 'base64'),
  );
  decipher.setAAD(JSON_AAD);
  decipher.setAuthTag(Buffer.from(envelope.tag, 'base64'));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(envelope.data, 'base64')),
    decipher.final(),
  ]);

  return JSON.parse(decrypted.toString('utf8')) as T;
}

export function encryptFile(value: Buffer): Buffer {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ENCRYPTION_ALGORITHM, getEncryptionKey(), iv);
  cipher.setAAD(FILE_AAD);
  const encrypted = Buffer.concat([cipher.update(value), cipher.final()]);
  return Buffer.concat([FILE_MAGIC, iv, cipher.getAuthTag(), encrypted]);
}

export function decryptFile(value: Buffer): Buffer {
  if (value.length < FILE_MAGIC.length + 12 + 16) {
    throw new Error('Encrypted file is incomplete.');
  }
  if (!value.subarray(0, FILE_MAGIC.length).equals(FILE_MAGIC)) {
    throw new Error('Unsupported encrypted file format.');
  }

  const ivStart = FILE_MAGIC.length;
  const tagStart = ivStart + 12;
  const dataStart = tagStart + 16;
  const decipher = createDecipheriv(
    ENCRYPTION_ALGORITHM,
    getEncryptionKey(),
    value.subarray(ivStart, tagStart),
  );
  decipher.setAAD(FILE_AAD);
  decipher.setAuthTag(value.subarray(tagStart, dataStart));
  return Buffer.concat([decipher.update(value.subarray(dataStart)), decipher.final()]);
}

export function hashUploadToken(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex');
}

export function uploadTokensMatch(token: string, expectedHash?: string): boolean {
  if (!expectedHash) return false;
  const actual = Buffer.from(hashUploadToken(token), 'hex');
  const expected = Buffer.from(expectedHash, 'hex');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function hashRateLimitIdentifier(identifier: string): string {
  const salt = process.env.DREAM_RATE_LIMIT_SALT || getEncryptionKey().toString('base64');
  return createHmac('sha256', salt).update(identifier, 'utf8').digest('hex');
}
