import {assertSameOrigin, DreamAuthorizationError} from '@/lib/dream-applications/security';
import {cleanText, privateJson} from '@/lib/connect/security';
import {createConnectSessionCookie} from '@/lib/connect/session';
import {getConnectProfileByToken} from '@/lib/connect/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request): Promise<Response> {
  try {
    assertSameOrigin(request);
    const body = await request.json().catch(() => null) as {
      token?: unknown;
    } | null;
    if (!body) throw new Error('INVALID_REQUEST');

    const token = cleanText(body.token, {min: 43, max: 43, required: true});
    const profile = await getConnectProfileByToken(token);
    if (!profile || profile.status === 'closed') {
      throw new Error('INVALID_PORTAL_LINK');
    }

    return privateJson(
      {ok: true},
      {
        headers: {
          'Set-Cookie': createConnectSessionCookie(profile.id),
        },
      },
    );
  } catch (error) {
    if (error instanceof DreamAuthorizationError) {
      return privateJson({error: error.message}, {status: error.status});
    }
    return privateJson(
      {error: 'This private TCW Connect link is invalid or unavailable.'},
      {status: 401},
    );
  }
}
