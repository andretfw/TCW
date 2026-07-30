import {buildGoogleDriveAuthorizationUrl} from '@/lib/dream-applications/google-drive';
import {createGoogleDriveOAuthState} from '@/lib/dream-applications/google-drive-oauth-state';
import {
  DreamAuthorizationError,
  privateJson,
  requireDreamAdmin,
} from '@/lib/dream-applications/security';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const STATE_COOKIE = 'tcw_google_drive_oauth_state';

export async function GET(): Promise<Response> {
  try {
    const admin = await requireDreamAdmin();
    const state = await createGoogleDriveOAuthState(admin.email);
    return new Response(null, {
      status: 302,
      headers: {
        'Cache-Control': 'no-store, private',
        Location: buildGoogleDriveAuthorizationUrl(state),
        'Set-Cookie': `${STATE_COOKIE}=${state}; Max-Age=600; Path=/api/google-drive/oauth/callback; HttpOnly; Secure; SameSite=Lax`,
      },
    });
  } catch (error) {
    if (error instanceof DreamAuthorizationError) {
      return privateJson({error: error.message}, {status: error.status});
    }
    console.error('Unable to start Google Drive authorization.');
    return privateJson(
      {error: 'Google Drive authorization is temporarily unavailable.'},
      {status: 503},
    );
  }
}
