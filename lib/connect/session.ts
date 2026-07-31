import 'server-only';

import {decryptJson, encryptJson} from '@/lib/dream-applications/crypto';

const COOKIE_NAME = 'tcw_connect_session';
const SESSION_TTL_SECONDS = 12 * 60 * 60;

interface ConnectSession {
  v: 1;
  profileId: string;
  expiresAt: string;
}

function readCookie(request: Request, name: string): string | undefined {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return undefined;

  for (const part of cookieHeader.split(';')) {
    const separator = part.indexOf('=');
    if (separator < 0) continue;
    const key = part.slice(0, separator).trim();
    if (key !== name) continue;
    return part.slice(separator + 1).trim();
  }
  return undefined;
}

export function createConnectSessionCookie(profileId: string): string {
  const session: ConnectSession = {
    v: 1,
    profileId,
    expiresAt: new Date(
      Date.now() + SESSION_TTL_SECONDS * 1000,
    ).toISOString(),
  };
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${COOKIE_NAME}=${encodeURIComponent(encryptJson(session))}; Path=/api/connect/portal; HttpOnly; SameSite=Strict; Max-Age=${SESSION_TTL_SECONDS}${secure}`;
}

export function connectSessionProfileId(request: Request): string | null {
  const value = readCookie(request, COOKIE_NAME);
  if (!value) return null;

  try {
    const session = decryptJson<ConnectSession>(decodeURIComponent(value));
    if (
      session.v !== 1 ||
      !session.profileId ||
      new Date(session.expiresAt) <= new Date()
    ) {
      return null;
    }
    return session.profileId;
  } catch {
    return null;
  }
}
