import 'server-only';

import { randomBytes } from 'node:crypto';

import { getStore } from '@netlify/blobs';

import { decryptJson, encryptJson } from './crypto';

const STORE_NAME = 'tcw-dream-applications';
const CONNECTION_KEY = 'config/google-drive.json';
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://openidconnect.googleapis.com/v1/userinfo';
const DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files';
const DRIVE_API_URL = 'https://www.googleapis.com/drive/v3/files';
const DEFAULT_REDIRECT_URI = 'https://tutticancerwarriors.org/api/google-drive/oauth/callback';
const DEFAULT_ACCOUNT_EMAIL = 'tcw@tutticancerwarriors.org';
const OAUTH_SCOPES = [
  'openid',
  'email',
  'https://www.googleapis.com/auth/drive.file',
] as const;

interface GoogleDriveConnection {
  v: 1;
  refreshToken: string;
  connectedEmail: string;
  connectedAt: string;
  grantedScope?: string;
}

interface GoogleTokenResponse {
  access_token?: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
  error?: string;
  error_description?: string;
}

interface GoogleUserInfo {
  email?: string;
  email_verified?: boolean;
}

interface GoogleDriveUploadResponse {
  id?: string;
  name?: string;
  webViewLink?: string;
  error?: {
    message?: string;
  };
}

function configStore() {
  return getStore({name: STORE_NAME, consistency: 'strong'});
}

function requireEnvironment(name: 'GOOGLE_DRIVE_CLIENT_ID' | 'GOOGLE_DRIVE_CLIENT_SECRET'): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is not configured.`);
  return value;
}

function redirectUri(): string {
  return process.env.GOOGLE_DRIVE_OAUTH_REDIRECT_URI?.trim() || DEFAULT_REDIRECT_URI;
}

function expectedAccountEmail(): string {
  return (process.env.GOOGLE_DRIVE_ACCOUNT_EMAIL?.trim() || DEFAULT_ACCOUNT_EMAIL).toLowerCase();
}

function uploadFolderId(): string {
  const value = process.env.GOOGLE_DRIVE_UPLOAD_FOLDER_ID?.trim();
  if (!value) throw new Error('GOOGLE_DRIVE_UPLOAD_FOLDER_ID is not configured.');
  if (!/^[A-Za-z0-9_-]{10,}$/.test(value)) {
    throw new Error('GOOGLE_DRIVE_UPLOAD_FOLDER_ID is invalid.');
  }
  return value;
}

function bufferToArrayBuffer(value: Buffer): ArrayBuffer {
  return value.buffer.slice(
    value.byteOffset,
    value.byteOffset + value.byteLength,
  ) as ArrayBuffer;
}

async function readJsonResponse<T>(response: Response, fallback: string): Promise<T> {
  const payload = await response.json().catch(() => ({})) as T & {
    error?: string | {message?: string};
    error_description?: string;
  };
  if (!response.ok) {
    const errorMessage = typeof payload.error === 'string'
      ? payload.error_description || payload.error
      : payload.error?.message;
    throw new Error(errorMessage || fallback);
  }
  return payload;
}

export function createGoogleDriveOAuthState(): string {
  return randomBytes(32).toString('base64url');
}

export function buildGoogleDriveAuthorizationUrl(state: string): string {
  const url = new URL(GOOGLE_AUTH_URL);
  url.search = new URLSearchParams({
    client_id: requireEnvironment('GOOGLE_DRIVE_CLIENT_ID'),
    redirect_uri: redirectUri(),
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
    include_granted_scopes: 'false',
    scope: OAUTH_SCOPES.join(' '),
    state,
    login_hint: expectedAccountEmail(),
    hd: expectedAccountEmail().split('@')[1] || '',
  }).toString();
  return url.toString();
}

export async function connectGoogleDriveFromAuthorizationCode(code: string): Promise<{
  connectedEmail: string;
}> {
  const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams({
      code,
      client_id: requireEnvironment('GOOGLE_DRIVE_CLIENT_ID'),
      client_secret: requireEnvironment('GOOGLE_DRIVE_CLIENT_SECRET'),
      redirect_uri: redirectUri(),
      grant_type: 'authorization_code',
    }),
    cache: 'no-store',
    signal: AbortSignal.timeout(15_000),
  });
  const tokens = await readJsonResponse<GoogleTokenResponse>(
    tokenResponse,
    'Google did not accept the Drive authorization code.',
  );
  if (!tokens.access_token || !tokens.refresh_token) {
    throw new Error('Google did not return the required offline access token. Reconnect and approve access again.');
  }

  const userResponse = await fetch(GOOGLE_USERINFO_URL, {
    headers: {Authorization: `Bearer ${tokens.access_token}`},
    cache: 'no-store',
    signal: AbortSignal.timeout(10_000),
  });
  const user = await readJsonResponse<GoogleUserInfo>(
    userResponse,
    'Unable to verify the connected Google Workspace account.',
  );
  const email = user.email?.toLowerCase();
  if (!email || user.email_verified !== true || email !== expectedAccountEmail()) {
    throw new Error(`Connect Google Drive using ${expectedAccountEmail()}.`);
  }

  const connection: GoogleDriveConnection = {
    v: 1,
    refreshToken: tokens.refresh_token,
    connectedEmail: email,
    connectedAt: new Date().toISOString(),
    grantedScope: tokens.scope,
  };
  await configStore().set(CONNECTION_KEY, encryptJson(connection), {
    metadata: {kind: 'google-drive-connection', connectedAt: connection.connectedAt},
  });
  return {connectedEmail: email};
}

async function getGoogleDriveConnection(): Promise<GoogleDriveConnection | null> {
  const payload = await configStore().get(CONNECTION_KEY, {
    type: 'text',
    consistency: 'strong',
  });
  if (!payload) return null;
  const connection = decryptJson<GoogleDriveConnection>(payload);
  if (connection.v !== 1 || !connection.refreshToken || !connection.connectedEmail) {
    throw new Error('The stored Google Drive connection is invalid.');
  }
  return connection;
}

export async function getGoogleDriveConnectionStatus(): Promise<{
  connected: boolean;
  connectedEmail?: string;
  connectedAt?: string;
  folderConfigured: boolean;
}> {
  const connection = await getGoogleDriveConnection();
  return {
    connected: Boolean(connection),
    connectedEmail: connection?.connectedEmail,
    connectedAt: connection?.connectedAt,
    folderConfigured: Boolean(process.env.GOOGLE_DRIVE_UPLOAD_FOLDER_ID?.trim()),
  };
}

export async function disconnectGoogleDrive(): Promise<void> {
  await configStore().delete(CONNECTION_KEY);
}

async function getGoogleDriveAccessToken(): Promise<string> {
  const connection = await getGoogleDriveConnection();
  if (!connection) throw new Error('Google Drive is not connected.');

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams({
      client_id: requireEnvironment('GOOGLE_DRIVE_CLIENT_ID'),
      client_secret: requireEnvironment('GOOGLE_DRIVE_CLIENT_SECRET'),
      refresh_token: connection.refreshToken,
      grant_type: 'refresh_token',
    }),
    cache: 'no-store',
    signal: AbortSignal.timeout(15_000),
  });
  const tokens = await readJsonResponse<GoogleTokenResponse>(
    response,
    'Unable to refresh Google Drive access.',
  );
  if (!tokens.access_token) throw new Error('Google did not return an access token.');
  return tokens.access_token;
}

function extensionForMimeType(mimeType: 'application/pdf' | 'image/jpeg' | 'image/png'): string {
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType === 'image/png') return 'png';
  return 'jpg';
}

export async function uploadDreamFileToGoogleDrive(input: {
  buffer: Buffer;
  applicationReference: string;
  fileId: string;
  category: 'medical' | 'photo';
  mimeType: 'application/pdf' | 'image/jpeg' | 'image/png';
}): Promise<{driveFileId: string}> {
  const accessToken = await getGoogleDriveAccessToken();
  const folderId = uploadFolderId();
  const extension = extensionForMimeType(input.mimeType);
  const driveName = `${input.applicationReference}-${input.category}-${input.fileId}.${extension}`;
  const boundary = `tcw_${randomBytes(18).toString('hex')}`;
  const metadata = JSON.stringify({
    name: driveName,
    parents: [folderId],
    description: `TCW Dream Support ${input.category} document. Reference: ${input.applicationReference}.`,
    properties: {
      tcwReference: input.applicationReference,
      tcwCategory: input.category,
    },
  });
  const prefix = Buffer.from(
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n` +
    `--${boundary}\r\nContent-Type: ${input.mimeType}\r\n\r\n`,
    'utf8',
  );
  const suffix = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf8');
  const body = Buffer.concat([prefix, input.buffer, suffix]);
  const uploadUrl = new URL(DRIVE_UPLOAD_URL);
  uploadUrl.search = new URLSearchParams({
    uploadType: 'multipart',
    supportsAllDrives: 'true',
    fields: 'id,name',
  }).toString();

  const response = await fetch(uploadUrl, {
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
  const uploaded = await readJsonResponse<GoogleDriveUploadResponse>(
    response,
    'Google Drive rejected the document upload.',
  );
  if (!uploaded.id) throw new Error('Google Drive did not return a file ID.');
  return {driveFileId: uploaded.id};
}

export async function deleteGoogleDriveFile(driveFileId: string): Promise<void> {
  if (!driveFileId) return;
  const accessToken = await getGoogleDriveAccessToken();
  const url = new URL(`${DRIVE_API_URL}/${encodeURIComponent(driveFileId)}`);
  url.searchParams.set('supportsAllDrives', 'true');
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {Authorization: `Bearer ${accessToken}`},
    cache: 'no-store',
    signal: AbortSignal.timeout(20_000),
  });
  if (response.status === 404) return;
  if (!response.ok) {
    const payload = await response.json().catch(() => ({})) as GoogleDriveUploadResponse;
    throw new Error(payload.error?.message || `Google Drive deletion failed with ${response.status}.`);
  }
}

export function googleDrivePreviewUrl(driveFileId: string): string {
  return `https://drive.google.com/file/d/${encodeURIComponent(driveFileId)}/view`;
}
