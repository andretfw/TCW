import 'server-only';

import {randomBytes} from 'node:crypto';

import {
  getGoogleWorkspaceAccessToken,
  GOOGLE_DRIVE_FILE_SCOPE,
} from './google-drive';

const DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files';
const DRIVE_API_URL = 'https://www.googleapis.com/drive/v3/files';
const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

function folderId(): string {
  const value = process.env.GOOGLE_DRIVE_UPLOAD_FOLDER_ID?.trim();
  if (!value || !/^[A-Za-z0-9_-]{10,}$/.test(value)) {
    throw new Error('GOOGLE_DRIVE_UPLOAD_FOLDER_ID is not configured correctly.');
  }
  return value;
}

function bufferToArrayBuffer(value: Buffer): ArrayBuffer {
  return value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength) as ArrayBuffer;
}

async function uploadNew(input: {
  buffer: Buffer;
  filename: string;
  reference: string;
  contractNumber: number;
  language: string;
}): Promise<string> {
  const accessToken = await getGoogleWorkspaceAccessToken(GOOGLE_DRIVE_FILE_SCOPE);
  const boundary = `tcw_${randomBytes(18).toString('hex')}`;
  const metadata = JSON.stringify({
    name: input.filename,
    parents: [folderId()],
    description: `TCW Dream Support contract ${input.contractNumber}. Reference: ${input.reference}.`,
    properties: {
      tcwReference: input.reference,
      tcwCategory: 'contract',
      tcwContractNumber: String(input.contractNumber),
      tcwLanguage: input.language,
    },
  });
  const prefix = Buffer.from(
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n`
      + `--${boundary}\r\nContent-Type: ${DOCX_MIME}\r\n\r\n`,
    'utf8',
  );
  const suffix = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf8');
  const body = Buffer.concat([prefix, input.buffer, suffix]);
  const url = new URL(DRIVE_UPLOAD_URL);
  url.search = new URLSearchParams({
    uploadType: 'multipart',
    supportsAllDrives: 'true',
    fields: 'id',
  }).toString();
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
      'Content-Length': String(body.byteLength),
    },
    body: bufferToArrayBuffer(body),
    cache: 'no-store',
    signal: AbortSignal.timeout(45_000),
  });
  const payload = await response.json().catch(() => ({})) as {id?: string; error?: {message?: string}};
  if (!response.ok || !payload.id) {
    throw new Error(payload.error?.message || `Google Drive upload failed with ${response.status}.`);
  }
  return payload.id;
}

async function updateExisting(driveFileId: string, buffer: Buffer): Promise<boolean> {
  const accessToken = await getGoogleWorkspaceAccessToken(GOOGLE_DRIVE_FILE_SCOPE);
  const url = new URL(`${DRIVE_UPLOAD_URL}/${encodeURIComponent(driveFileId)}`);
  url.searchParams.set('uploadType', 'media');
  url.searchParams.set('supportsAllDrives', 'true');
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': DOCX_MIME,
      'Content-Length': String(buffer.byteLength),
    },
    body: bufferToArrayBuffer(buffer),
    cache: 'no-store',
    signal: AbortSignal.timeout(45_000),
  });
  if (response.status === 404) return false;
  if (!response.ok) {
    const payload = await response.json().catch(() => ({})) as {error?: {message?: string}};
    throw new Error(payload.error?.message || `Google Drive update failed with ${response.status}.`);
  }
  return true;
}

export async function upsertDreamContractInGoogleDrive(input: {
  buffer: Buffer;
  filename: string;
  reference: string;
  contractNumber: number;
  language: string;
  existingDriveFileId?: string;
}): Promise<string> {
  if (input.existingDriveFileId) {
    const updated = await updateExisting(input.existingDriveFileId, input.buffer);
    if (updated) return input.existingDriveFileId;
  }
  return uploadNew(input);
}

export async function downloadDreamContractFromGoogleDrive(driveFileId: string): Promise<Buffer> {
  const accessToken = await getGoogleWorkspaceAccessToken(GOOGLE_DRIVE_FILE_SCOPE);
  const url = new URL(`${DRIVE_API_URL}/${encodeURIComponent(driveFileId)}`);
  url.searchParams.set('alt', 'media');
  url.searchParams.set('supportsAllDrives', 'true');
  const response = await fetch(url, {
    headers: {Authorization: `Bearer ${accessToken}`},
    cache: 'no-store',
    signal: AbortSignal.timeout(45_000),
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({})) as {error?: {message?: string}};
    throw new Error(payload.error?.message || `Google Drive download failed with ${response.status}.`);
  }
  return Buffer.from(await response.arrayBuffer());
}
