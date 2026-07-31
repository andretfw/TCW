import {assertSameOrigin, DreamAuthorizationError} from '@/lib/dream-applications/security';
import {sendConnectAccessEmail} from '@/lib/connect/access-email';
import {cleanText, normalizeEmail, privateJson} from '@/lib/connect/security';
import {enforceConnectRateLimit, listConnectProfiles} from '@/lib/connect/store';
import {CONNECT_ROLES, type ConnectRole} from '@/lib/connect/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function clientIdentifier(request: Request, email: string): string {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const address = forwarded || request.headers.get('x-nf-client-connection-ip') || 'unknown';
  return `login:${address}:${email}`;
}

export async function POST(request: Request): Promise<Response> {
  try {
    assertSameOrigin(request);
    const body = await request.json().catch(() => null) as {
      email?: unknown;
      role?: unknown;
    } | null;
    if (!body) throw new Error('INVALID_REQUEST');

    const email = normalizeEmail(
      cleanText(body.email, {min: 3, max: 254, required: true}),
    );
    const role = cleanText(body.role, {min: 3, max: 20, required: true}) as ConnectRole;
    if (!CONNECT_ROLES.includes(role)) throw new Error('INVALID_ROLE');

    await enforceConnectRateLimit(clientIdentifier(request, email));

    const profiles = await listConnectProfiles();
    const profile = profiles.find((candidate) => (
      candidate.email === email &&
      candidate.role === role &&
      candidate.status !== 'closed'
    ));

    if (profile) {
      await sendConnectAccessEmail(profile).catch(() => {
        console.error('TCW Connect access email could not be sent.');
      });
    }

    // Always return the same response so this endpoint does not reveal whether
    // an email address is registered in the peer-support program.
    return privateJson({ok: true}, {status: 202});
  } catch (error) {
    if (error instanceof DreamAuthorizationError) {
      return privateJson({error: error.message}, {status: error.status});
    }
    const message = error instanceof Error ? error.message : '';
    if (message === 'RATE_LIMITED' || message === 'RATE_LIMIT_BUSY') {
      return privateJson(
        {error: 'Too many access requests. Try again later.'},
        {status: 429},
      );
    }
    return privateJson({error: 'Invalid access request.'}, {status: 400});
  }
}
