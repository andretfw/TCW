import {assertSameOrigin, DreamAuthorizationError} from '@/lib/dream-applications/security';
import {cleanText, privateJson} from '@/lib/connect/security';
import {
  clearConnectSessionCookie,
  connectSessionProfileId,
  createConnectSessionCookie,
} from '@/lib/connect/session';
import {getConnectProfile, getConnectProfileByToken} from '@/lib/connect/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request): Promise<Response> {
  const profileId = connectSessionProfileId(request);
  if (!profileId) return privateJson({authenticated: false});

  const profile = await getConnectProfile(profileId);
  if (!profile || profile.status === 'closed') {
    return privateJson(
      {authenticated: false},
      {headers: {'Set-Cookie': clearConnectSessionCookie()}},
    );
  }

  return privateJson({authenticated: true});
}

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

export async function DELETE(request: Request): Promise<Response> {
  try {
    assertSameOrigin(request);
    return privateJson(
      {ok: true},
      {headers: {'Set-Cookie': clearConnectSessionCookie()}},
    );
  } catch (error) {
    if (error instanceof DreamAuthorizationError) {
      return privateJson({error: error.message}, {status: error.status});
    }
    return privateJson({error: 'Could not log out.'}, {status: 400});
  }
}
