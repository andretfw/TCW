import {assertSameOrigin, DreamAuthorizationError} from '@/lib/dream-applications/security';
import {cleanText, privateJson} from '@/lib/connect/security';
import {
  clearConnectSessionCookies,
  connectSessionProfileId,
  consumeConnectAccessToken,
  createConnectSessionCookie,
  revokeAllConnectSessions,
  revokeConnectSession,
} from '@/lib/connect/session';
import {getConnectProfile, getConnectProfileByToken} from '@/lib/connect/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function sessionHeaders(sessionCookie?: string): Headers {
  const headers = new Headers();
  for (const cookie of clearConnectSessionCookies()) {
    headers.append('Set-Cookie', cookie);
  }
  if (sessionCookie) headers.append('Set-Cookie', sessionCookie);
  return headers;
}

export async function GET(request: Request): Promise<Response> {
  const profileId = await connectSessionProfileId(request);
  if (!profileId) {
    return privateJson(
      {authenticated: false},
      {headers: sessionHeaders()},
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
    const accessProfileId = await consumeConnectAccessToken(token);
    let profile = accessProfileId
      ? await getConnectProfile(accessProfileId)
      : null;

    if (!profile) {
      const verificationProfile = await getConnectProfileByToken(token);
      if (verificationProfile?.status === 'pending-verification') {
        profile = verificationProfile;
      }
    }

    if (
      !profile ||
      profile.status === 'closed' ||
      profile.status === 'suspended'
    ) {
      throw new Error('INVALID_PORTAL_LINK');
    }

    const sessionCookie = await createConnectSessionCookie(profile);
    return privateJson(
      {ok: true},
      {headers: sessionHeaders(sessionCookie)},
    );
  } catch (error) {
    if (error instanceof DreamAuthorizationError) {
      return privateJson({error: error.message}, {status: error.status});
    }
    return privateJson(
      {error: 'This TCW Connect access link is invalid, expired, or has already been used.'},
      {status: 401},
    );
  }
}

export async function DELETE(request: Request): Promise<Response> {
  try {
    assertSameOrigin(request);
    const profileId = await connectSessionProfileId(request);
    const body = await request.json().catch(() => ({})) as {
      allDevices?: unknown;
    };

    if (body.allDevices === true && profileId) {
      await revokeAllConnectSessions(profileId);
    } else {
      await revokeConnectSession(request);
    }

    return privateJson(
      {ok: true},
      {headers: sessionHeaders()},
    );
  } catch (error) {
    if (error instanceof DreamAuthorizationError) {
      return privateJson({error: error.message}, {status: error.status});
    }
    return privateJson({error: 'Could not log out.'}, {status: 400});
  }
}
