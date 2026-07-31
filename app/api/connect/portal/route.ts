import {assertSameOrigin, DreamAuthorizationError} from '@/lib/dream-applications/security';
import {cleanText, privateJson} from '@/lib/connect/security';
import {
  buildConnectPortalState,
  decideMatchProposal,
  endConnectConnection,
  setConnectProfilePaused,
} from '@/lib/connect/service';
import {getConnectProfileByToken} from '@/lib/connect/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ACTIONS = [
  'accept-proposal',
  'decline-proposal',
  'pause',
  'resume',
  'end',
  'end-rematch',
] as const;
type PortalAction = (typeof ACTIONS)[number];

async function profileForToken(value: unknown) {
  const token = cleanText(value, {min: 43, max: 43, required: true});
  const profile = await getConnectProfileByToken(token);
  if (!profile) throw new Error('INVALID_PORTAL_LINK');
  return profile;
}

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const profile = await profileForToken(url.searchParams.get('token'));
    return privateJson(await buildConnectPortalState(profile));
  } catch {
    return privateJson(
      {error: 'This private TCW Connect link is invalid or unavailable.'},
      {status: 401},
    );
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    assertSameOrigin(request);
    const body = await request.json().catch(() => null) as Record<string, unknown> | null;
    if (!body) throw new Error('INVALID_REQUEST');
    const profile = await profileForToken(body.token);
    const action = cleanText(body.action, {min: 3, max: 30, required: true}) as PortalAction;
    if (!ACTIONS.includes(action)) throw new Error('INVALID_ACTION');

    if (action === 'accept-proposal' || action === 'decline-proposal') {
      await decideMatchProposal({
        profile,
        proposalId: cleanText(body.proposalId, {min: 20, max: 80, required: true}),
        decision: action === 'accept-proposal' ? 'accept' : 'decline',
      });
    } else if (action === 'pause' || action === 'resume') {
      await setConnectProfilePaused(profile, action === 'pause');
    } else {
      await endConnectConnection({
        profile,
        connectionId: cleanText(body.connectionId, {min: 20, max: 80, required: true}),
        rematch: action === 'end-rematch',
      });
    }

    const refreshed = await profileForToken(body.token);
    return privateJson({ok: true, state: await buildConnectPortalState(refreshed)});
  } catch (error) {
    if (error instanceof DreamAuthorizationError) {
      return privateJson({error: error.message}, {status: error.status});
    }
    const message = error instanceof Error ? error.message : '';
    const status = message === 'INVALID_PORTAL_LINK' ? 401 : 409;
    console.error('TCW Connect portal action could not be completed.');
    return privateJson(
      {
        error: status === 401
          ? 'This private TCW Connect link is invalid or unavailable.'
          : 'This action could not be completed. Refresh the page and try again.',
      },
      {status},
    );
  }
}
