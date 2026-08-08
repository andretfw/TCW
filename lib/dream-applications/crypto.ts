import 'server-only';

import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from 'node:crypto';

const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const LEGACY_KEY_ID = 'legacy';
const KEY_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/;
const JSON_AAD_V1 = Buffer.from('tcw-dream-application-json-v1', 'utf8');
const FILE_AAD_V1 = Buffer.from('tcw-dream-application-file-v1', 'utf8');
const FILE_MAGIC_V1 = Buffer.from('TCWENC01', 'ascii');
const FILE_MAGIC_V2 = Buffer.from('TCWENC02', 'ascii');

interface EncryptedJsonEnvelopeV1 {
  v: 1;
  alg: 'A256GCM';
  iv: string;
  tag: string;
  data: string;
}

interface EncryptedJsonEnvelopeV2 {
  v: 2;
  alg: 'A256GCM';
  kid: string;
  iv: string;
  tag: string;
  data: string;
}

function decodeEncryptionKey(configured: string, name: string): Buffer {
  const key = /^[a-f0-9]{64}$/i.test(configured)
    ? Buffer.from(configured, 'hex')
    : Buffer.from(configured, 'base64');

  if (key.length !== 32) {
    throw new Error(`${name} must decode to exactly 32 bytes.`);
  }
  return key;
}

function activeKeyId(): string {
  const keyId = process.env.DREAM_APPLICATION_ENCRYPTION_KEY_ID?.trim() || LEGACY_KEY_ID;
  if (!KEY_ID_PATTERN.test(keyId)) {
    throw new Error(
      'DREAM_APPLICATION_ENCRYPTION_KEY_ID must contain 1-64 letters, numbers, dots, underscores, or hyphens.',
    );
  }
  return keyId;
}

function activeEncryptionKey(): Buffer {
  const configured = process.env.DREAM_APPLICATION_ENCRYPTION_KEY?.trim();
  if (!configured) {
    throw new Error('DREAM_APPLICATION_ENCRYPTION_KEY is not configured.');
  }
  return decodeEncryptionKey(configured, 'DREAM_APPLICATION_ENCRYPTION_KEY');
}

function previousEncryptionKeys(): Map<string, Buffer> {
  const configured = process.env.DREAM_APPLICATION_ENCRYPTION_PREVIOUS_KEYS?.trim();
  const keys = new Map<string, Buffer>();
  if (!configured) return keys;

  let parsed: unknown;
  try {
    parsed = JSON.parse(configured);
  } catch {
    throw new Error('DREAM_APPLICATION_ENCRYPTION_PREVIOUS_KEYS must be a JSON object.');
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('DREAM_APPLICATION_ENCRYPTION_PREVIOUS_KEYS must be a JSON object.');
  }

  for (const [keyId, value] of Object.entries(parsed)) {
    if (!KEY_ID_PATTERN.test(keyId) || typeof value !== 'string' || !value.trim()) {
      throw new Error('DREAM_APPLICATION_ENCRYPTION_PREVIOUS_KEYS contains an invalid key entry.');
    }
    if (keyId === activeKeyId()) {
      throw new Error(`Previous encryption keys must not repeat the active key id "${keyId}".`);
    }
    keys.set(
      keyId,
      decodeEncryptionKey(value.trim(), `Previous encryption key "${keyId}"`),
    );
  }
  return keys;
}

function encryptionKeyForId(keyId: string): Buffer {
  if (!KEY_ID_PATTERN.test(keyId)) {
    throw new Error('Encrypted data contains an invalid key id.');
  }
  if (keyId === activeKeyId()) return activeEncryptionKey();

  const previous = previousEncryptionKeys().get(keyId);
  if (previous) return previous;
  throw new Error(`Encryption key "${keyId}" is not configured.`);
}

function jsonAadV2(keyId: string): Buffer {
  return Buffer.from(`tcw-encrypted-json-v2:${keyId}`, 'utf8');
}

function fileAadV2(keyId: string): Buffer {
  return Buffer.from(`tcw-encrypted-file-v2:${keyId}`, 'utf8');
}

function decryptJsonEnvelope<T>(input: {
  key: Buffer;
  iv: string;
  tag: string;
  data: string;
  aad: Buffer;
}): T {
  const decipher = createDecipheriv(
    ENCRYPTION_ALGORITHM,
    input.key,
    Buffer.from(input.iv, 'base64'),
  );
  decipher.setAAD(input.aad);
  decipher.setAuthTag(Buffer.from(input.tag, 'base64'));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(input.data, 'base64')),
    decipher.final(),
  ]);
  return JSON.parse(decrypted.toString('utf8')) as T;
}

export function encryptJson(value: unknown): string {
  const keyId = activeKeyId();
  const iv = randomBytes(12);
  const cipher = createCipheriv(ENCRYPTION_ALGORITHM, activeEncryptionKey(), iv);
  cipher.setAAD(jsonAadV2(keyId));
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(value), 'utf8'),
    cipher.final(),
  ]);

  const envelope: EncryptedJsonEnvelopeV2 = {
    v: 2,
    alg: 'A256GCM',
    kid: keyId,
    iv: iv.toString('base64'),
    tag: cipher.getAuthTag().toString('base64'),
    data: encrypted.toString('base64'),
  };
  return JSON.stringify(envelope);
}

export function decryptJson<T>(payload: string): T {
  const envelope = JSON.parse(payload) as EncryptedJsonEnvelopeV1 | EncryptedJsonEnvelopeV2;
  if (envelope.alg !== 'A256GCM') {
    throw new Error('Unsupported encrypted application format.');
  }

  if (envelope.v === 1) {
    return decryptJsonEnvelope<T>({
      key: encryptionKeyForId(LEGACY_KEY_ID),
      iv: envelope.iv,
      tag: envelope.tag,
      data: envelope.data,
      aad: JSON_AAD_V1,
    });
  }
  if (envelope.v === 2 && KEY_ID_PATTERN.test(envelope.kid)) {
    return decryptJsonEnvelope<T>({
      key: encryptionKeyForId(envelope.kid),
      iv: envelope.iv,
      tag: envelope.tag,
      data: envelope.data,
      aad: jsonAadV2(envelope.kid),
    });
  }
  throw new Error('Unsupported encrypted application format.');
}

export function encryptFile(value: Buffer): Buffer {
  const keyId = activeKeyId();
  const keyIdBytes = Buffer.from(keyId, 'ascii');
  const iv = randomBytes(12);
  const cipher = createCipheriv(ENCRYPTION_ALGORITHM, activeEncryptionKey(), iv);
  cipher.setAAD(fileAadV2(keyId));
  const encrypted = Buffer.concat([cipher.update(value), cipher.final()]);
  return Buffer.concat([
    FILE_MAGIC_V2,
    Buffer.from([keyIdBytes.length]),
    keyIdBytes,
    iv,
    cipher.getAuthTag(),
    encrypted,
  ]);
}

function decryptFileBody(input: {
  value: Buffer;
  key: Buffer;
  ivStart: number;
  aad: Buffer;
}): Buffer {
  const tagStart = input.ivStart + 12;
  const dataStart = tagStart + 16;
  if (input.value.length < dataStart) throw new Error('Encrypted file is incomplete.');

  const decipher = createDecipheriv(
    ENCRYPTION_ALGORITHM,
    input.key,
    input.value.subarray(input.ivStart, tagStart),
  );
  decipher.setAAD(input.aad);
  decipher.setAuthTag(input.value.subarray(tagStart, dataStart));
  return Buffer.concat([
    decipher.update(input.value.subarray(dataStart)),
    decipher.final(),
  ]);
}

export function decryptFile(value: Buffer): Buffer {
  if (value.subarray(0, FILE_MAGIC_V2.length).equals(FILE_MAGIC_V2)) {
    const keyIdLength = value[FILE_MAGIC_V2.length];
    if (!keyIdLength || keyIdLength > 64) throw new Error('Encrypted file is incomplete.');
    const keyIdStart = FILE_MAGIC_V2.length + 1;
    const ivStart = keyIdStart + keyIdLength;
    if (value.length < ivStart + 12 + 16) throw new Error('Encrypted file is incomplete.');
    const keyId = value.subarray(keyIdStart, ivStart).toString('ascii');
    if (!KEY_ID_PATTERN.test(keyId)) throw new Error('Encrypted file contains an invalid key id.');
    return decryptFileBody({
      value,
      key: encryptionKeyForId(keyId),
      ivStart,
      aad: fileAadV2(keyId),
    });
  }

  if (value.subarray(0, FILE_MAGIC_V1.length).equals(FILE_MAGIC_V1)) {
    const ivStart = FILE_MAGIC_V1.length;
    if (value.length < ivStart + 12 + 16) throw new Error('Encrypted file is incomplete.');
    return decryptFileBody({
      value,
      key: encryptionKeyForId(LEGACY_KEY_ID),
      ivStart,
      aad: FILE_AAD_V1,
    });
  }

  throw new Error('Unsupported encrypted file format.');
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

function rateLimitSecret(): string {
  const salt = process.env.DREAM_RATE_LIMIT_SALT?.trim();
  if (salt) return salt;

  // Preserve the historical fallback across the first key rotation. Production
  // should configure DREAM_RATE_LIMIT_SALT so identifier hashes never depend on
  // an encryption key.
  try {
    return encryptionKeyForId(LEGACY_KEY_ID).toString('base64');
  } catch {
    throw new Error(
      'DREAM_RATE_LIMIT_SALT must be configured before the legacy encryption key is retired.',
    );
  }
}

export function hashRateLimitIdentifier(identifier: string): string {
  return createHmac('sha256', rateLimitSecret()).update(identifier, 'utf8').digest('hex');
}
