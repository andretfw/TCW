import {
  assertSameOrigin,
  DreamAuthorizationError,
  privateJson,
  requireDreamReviewerIdentityContext,
} from '@/lib/dream-applications/security';
import {sendDreamSecurityCodeEmail} from '@/lib/dream-applications/email';
import {
  clearReviewerSecurityCookie,
  hasReviewerSecuritySession,
  issueReviewerSecurityCode,
  revokeAllReviewerSecuritySessions,
  revokeCurrentReviewerSecuritySession,
  verifyReviewerSecurityCode,
} from '@/lib/dream-applications/reviewer-session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function cookieHeaders(cookie?: string): Headers {
  const headers = new Headers();
  if (cookie) headers.append('Set-Cookie', cookie);
  return headers;
}

export async function GET(): Promise<Response> {
  try {
    const reviewer = await requireDreamReviewerIdentityContext();
    return privateJson({
      authenticated: true,
      verified: await hasReviewerSecuritySession(reviewer.email),
      email: reviewer.email,
    });
  } catch (error) {
    if (error instanceof DreamAuthorizationError) {
      return privateJson({error: error.message}, {status: error.status});
    }
    return privateJson({error: 'Unable to verify secure access.'}, {status: 503});
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    assertSameOrigin(request);
    const reviewer = await requireDreamReviewerIdentityContext();
    const body = await request.json().catch(() => null) as {
      action?: unknown;
      code?: unknown;
    } | null;
    if (!body || (body.action !== 'request' && body.action !== 'verify')) {
      return privateJson({error: 'Invalid security request.'}, {status: 400});
    }

    if (body.action === 'request') {
      const code = await issueReviewerSecurityCode(reviewer.email);
      try {
        await sendDreamSecurityCodeEmail(reviewer.email, code);
      } catch {
        console.error('Unable to deliver a TCW reviewer security code.');
        return privateJson(
          {error: 'The security code could not be delivered. Please try again.'},
          {status: 503},
        );
      }
      return privateJson({ok: true}, {status: 202});
    }

    const code = typeof body.code === 'string' ? body.code.trim() : '';
    const sessionCookie = await verifyReviewerSecurityCode(reviewer.email, code);
    return privateJson(
      {ok: true, verified: true},
      {headers: cookieHeaders(sessionCookie)},
    );
  } catch (error) {
    if (error instanceof DreamAuthorizationError) {
      return privateJson({error: error.message}, {status: error.status});
    }
    const message = error instanceof Error ? error.message : '';
    if (message === 'REVIEWER_CODE_RATE_LIMITED') {
      return privateJson(
        {error: 'A code was already sent. Please wait a minute before requesting another.'},
        {status: 429},
      );
    }
    if (message === 'INVALID_REVIEWER_CODE') {
      return privateJson(
        {error: 'That security code is invalid or expired.'},
        {status: 401},
      );
    }
    return privateJson({error: 'Unable to complete secure verification.'}, {status: 503});
  }
}

export async function DELETE(request: Request): Promise<Response> {
  try {
    assertSameOrigin(request);
    const reviewer = await requireDreamReviewerIdentityContext();
    const body = await request.json().catch(() => ({})) as {allDevices?: unknown};

    if (body.allDevices === true) {
      await revokeAllReviewerSecuritySessions(reviewer.email);
    } else {
      await revokeCurrentReviewerSecuritySession();
    }

    return privateJson(
      {ok: true},
      {headers: cookieHeaders(clearReviewerSecurityCookie())},
    );
  } catch (error) {
    if (error instanceof DreamAuthorizationError) {
      return privateJson(
        {error: error.message},
        {
          status: error.status,
          headers: cookieHeaders(clearReviewerSecurityCookie()),
        },
      );
    }
    return privateJson(
      {error: 'Unable to end the secure session.'},
      {status: 503},
    );
  }
}
