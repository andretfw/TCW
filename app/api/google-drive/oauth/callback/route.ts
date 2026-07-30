import { timingSafeEqual } from 'node:crypto';

import { connectGoogleDriveFromAuthorizationCode } from '@/lib/dream-applications/google-drive';
import {
  DreamAuthorizationError,
  privateJson,
  requireDreamAdmin,
} from '@/lib/dream-applications/security';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const STATE_COOKIE = 'tcw_google_drive_oauth_state';

function readCookie(request: Request, name: string): string | undefined {
  const header = request.headers.get('cookie');
  if (!header) return undefined;
  for (const entry of header.split(';')) {
    const [key, ...parts] = entry.trim().split('=');
    if (key === name) return decodeURIComponent(parts.join('='));
  }
  return undefined;
}

function statesMatch(actual?: string | null, expected?: string): boolean {
  if (!actual || !expected) return false;
  const actualBuffer = Buffer.from(actual, 'utf8');
  const expectedBuffer = Buffer.from(expected, 'utf8');
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}

function clearStateCookie(response: Response): Response {
  response.headers.append(
    'Set-Cookie',
    `${STATE_COOKIE}=; Max-Age=0; Path=/api/google-drive/oauth/callback; HttpOnly; Secure; SameSite=Lax`,
  );
  return response;
}

export async function GET(request: Request): Promise<Response> {
  try {
    await requireDreamAdmin();
    const url = new URL(request.url);
    const oauthError = url.searchParams.get('error');
    if (oauthError) {
      return clearStateCookie(
        privateJson({error: 'Google Drive authorization was cancelled or denied.'}, {status: 400}),
      );
    }

    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const expectedState = readCookie(request, STATE_COOKIE);
    if (!code || !statesMatch(state, expectedState)) {
      return clearStateCookie(
        privateJson({error: 'Invalid or expired Google Drive authorization session.'}, {status: 400}),
      );
    }

    await connectGoogleDriveFromAuthorizationCode(code);
    const redirect = new URL('/admin/dream-applications?drive=connected', request.url);
    return clearStateCookie(Response.redirect(redirect, 303));
  } catch (error) {
    if (error instanceof DreamAuthorizationError) {
      return clearStateCookie(privateJson({error: error.message}, {status: error.status}));
    }
    console.error('Unable to complete Google Drive authorization', error);
    const redirect = new URL('/admin/dream-applications?drive=error', request.url);
    return clearStateCookie(Response.redirect(redirect, 303));
  }
}
