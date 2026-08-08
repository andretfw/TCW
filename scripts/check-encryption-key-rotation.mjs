import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const cryptoSource = await readFile(new URL('../lib/dream-applications/crypto.ts', import.meta.url), 'utf8');
const envExample = await readFile(new URL('../.env.example', import.meta.url), 'utf8');

assert.match(cryptoSource, /interface EncryptedJsonEnvelopeV2[\s\S]*v: 2;[\s\S]*kid: string;/);
assert.match(cryptoSource, /DREAM_APPLICATION_ENCRYPTION_KEY_ID/);
assert.match(cryptoSource, /DREAM_APPLICATION_ENCRYPTION_PREVIOUS_KEYS/);
assert.match(cryptoSource, /encryptionKeyForId\(LEGACY_KEY_ID\)/);
assert.match(cryptoSource, /FILE_MAGIC_V1 = Buffer\.from\('TCWENC01'/);
assert.match(cryptoSource, /FILE_MAGIC_V2 = Buffer\.from\('TCWENC02'/);
assert.match(cryptoSource, /cipher\.setAAD\(jsonAadV2\(keyId\)\)/);
assert.match(cryptoSource, /cipher\.setAAD\(fileAadV2\(keyId\)\)/);
assert.match(cryptoSource, /DREAM_RATE_LIMIT_SALT must be configured before the legacy encryption key is retired/);

assert.match(envExample, /^DREAM_APPLICATION_ENCRYPTION_KEY_ID=legacy$/m);
assert.match(envExample, /^DREAM_APPLICATION_ENCRYPTION_PREVIOUS_KEYS=\{\}$/m);
assert.match(envExample, /^DREAM_RATE_LIMIT_SALT=/m);

console.log('Encryption key rotation regression checks passed.');
