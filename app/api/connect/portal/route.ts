import {assertSameOrigin, DreamAuthorizationError} from '@/lib/dream-applications/security';
import {sendConnectExceptionAlert} from '@/lib/connect/email';
import {cleanText, privateJson} from '@/lib/connect/security';
import {
  buildConnectPortalState,
  createAutomaticMatchesForProfile,
  decideMatchProposal,
  endConnectConnection,
} from '@/lib/connect/service';
import {
  getConnectProfileByToken,
  mutateConnectProfile,
} from '@/lib/connect/store';
import {
  createAutomaticMatchesForSurvivor,
  setConnectProfilePausedWithSafeMatching,
} from '@/lib/connect/survivor-matching';
import type {ConnectProfile} from '@/lib/connect/types';

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

async function profileForToken(value: unknown): Promise<ConnectProfile> {
  const token = cleanText(value, {min: 43, max: 43, required: true});
  const profile = await getConnectProfileByToken(token);
  if (!profile) throw new Error('INVALID_PORTAL_LINK');
  return profile;
}

async function verifyAndActivateProfile(profile: ConnectProfile): Promise<ConnectProfile> {
  if (profile.status !== 'pending-verification') return profile;

  const activatedAt = new Date().toISOString();
  const mutation = await mutateConnectProfile(profile.id, (record) => {
    if (record.status !== 'pending-verification') return false;
    record.status = 'active';
    record.updatedAt = activatedAt;
    return true;
  });
  const activated = mutation?.record || profile;

  if (mutation?.result) {
    const matching = activated.role === 'survivor'
      ? createAutomaticMatchesForSurvivor(activated.id)
      : createAutomaticMatchesForProfile(activated.id);
    try {
      await matching;
    } catch {
      await sendConnectExceptionAlert({
        reference: activated.reference,
        reason: 'POST_VERIFICATION_MATCHING_FAILED',
      }).catch(() => undefined);
    }
  }

  return activated;
}

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const profile = await verifyAndActivateProfile(
      await profileForToken(url.searchParams.get('token')),
    );
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
    const profile = await verifyAndActivateProfile(await profileForToken(body.token));
    const action = cleanText(body.action, {min: 3, max: 30, required: true}) as PortalAction;
    if (!ACTIONS.includes(action)) throw new Error('INVALID_ACTION');

    if (action === 'accept-proposal' || action === 'decline-proposal') {
      await decideMatchProposal({
        profile,
        proposalId: cleanText(body.proposalId, {min: 20, max: 80, required: true}),
        decision: action === 'accept-proposal' ? 'accept' : 'decline',
      });
    } else if (action === 'pause' || action === 'resume') {
      await setConnectProfilePausedWithSafeMatching(profile, action === 'pause');
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
