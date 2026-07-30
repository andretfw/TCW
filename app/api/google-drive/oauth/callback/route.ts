import {connectGoogleDriveFromAuthorizationCode} from '@/lib/dream-applications/google-drive';
import {
  assertAndConsumeGoogleDriveOAuthState,
  GoogleDriveOAuthStateError,
} from '@/lib/dream-applications/google-drive-oauth-state';
import {
  DreamAuthorizationError,
  privateJson,
  requireDreamAdmin,
} from '@/lib/dream-applications/security';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const STATE_COOKIE = 'tcw_google_drive_oauth_state';
const DEFAULT_SITE_URL = 'https://tutticancerwarriors.org';

function readCookie(request: Request, name: string): string | undefined {
  const header = request.headers.get('cookie');
  if (!header) return undefined;
  for (const entry of header.split(';')) {
    const [key, ...parts] = entry.trim().split('=');
    if (key !== name) continue;
    try {
      return decodeURIComponent(parts.join('='));
    } catch {
      return undefined;
    }
  }
  return undefined;
}

function clearStateCookie(response: Response): Response {
  response.headers.append(
    'Set-Cookie',
    `${STATE_COOKIE}=; Max-Age=0; Path=/api/google-drive/oauth/callback; HttpOnly; Secure; SameSite=Lax`,
  );
  return response;
}

function adminRedirect(status: 'connected' | 'error'): URL {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL;
  const redirect = new URL('/admin/dream-applications', siteUrl);
  redirect.searchParams.set('drive', status);
  return redirect;
}

export async function GET(request: Request): Promise<Response> {
  try {
    const admin = await requireDreamAdmin();
    const url = new URL(request.url);

    await assertAndConsumeGoogleDriveOAuthState({
      state: url.searchParams.get('state'),
      cookieState: readCookie(request, STATE_COOKIE),
      adminEmail: admin.email,
    });

    const oauthError = url.searchParams.get('error');
    if (oauthError) {
      return clearStateCookie(
        privateJson(
          {error: 'Google Drive authorization was cancelled or denied.'},
          {status: 400},
        ),
      );
    }

    const code = url.searchParams.get('code');
    if (!code || code.length > 4096) {
      throw new GoogleDriveOAuthStateError();
    }

    await connectGoogleDriveFromAuthorizationCode(code);
    return clearStateCookie(Response.redirect(adminRedirect('connected'), 303));
  } catch (error) {
    if (error instanceof GoogleDriveOAuthStateError) {
      return clearStateCookie(privateJson({error: error.message}, {status: 400}));
    }
    if (error instanceof DreamAuthorizationError) {
      return clearStateCookie(
        privateJson({error: error.message}, {status: error.status}),
      );
    }
    console.error('Unable to complete Google Drive authorization.');
    return clearStateCookie(Response.redirect(adminRedirect('error'), 303));
  }
}
