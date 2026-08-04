import {assertSameOrigin, DreamAuthorizationError} from '@/lib/dream-applications/security';
import {
  sendConnectExceptionAlert,
  sendMentorReviewPendingEmail,
} from '@/lib/connect/email';
import {cleanText, privateJson} from '@/lib/connect/security';
import {reportAndBlock} from '@/lib/connect/safeguarding';
import {connectSessionProfileId} from '@/lib/connect/session';
import {
  buildConnectPortalState,
  createAutomaticMatchesForProfile,
  decideMatchProposal,
  endConnectConnection,
} from '@/lib/connect/service';
import {
  getConnectProfile,
  getConnectProfileByToken,
  mutateConnectProfile,
} from '@/lib/connect/store';
import {
  createAutomaticMatchesForSurvivor,
  setConnectProfilePausedWithSafeMatching,
} from '@/lib/connect/survivor-matching';
import {
  CONNECT_INCIDENT_CATEGORIES,
  type ConnectIncidentCategory,
  type ConnectProfile,
} from '@/lib/connect/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ACTIONS = [
  'accept-proposal',
  'decline-proposal',
  'pause',
  'resume',
  'end',
  'end-rematch',
  'report-block',
] as const;
type PortalAction = (typeof ACTIONS)[number];

async function profileForRequest(
  request: Request,
  fallbackToken?: unknown,
): Promise<ConnectProfile> {
  const sessionProfileId = connectSessionProfileId(request);
  if (sessionProfileId) {
    const sessionProfile = await getConnectProfile(sessionProfileId);
    if (sessionProfile && sessionProfile.status !== 'closed') return sessionProfile;
  }

  const token = cleanText(fallbackToken, {min: 43, max: 43, required: true});
  const profile = await getConnectProfileByToken(token);
  if (!profile || profile.status === 'closed') {
    throw new Error('INVALID_PORTAL_LINK');
  }
  return profile;
}

async function verifyAndActivateProfile(profile: ConnectProfile): Promise<ConnectProfile> {
  if (profile.status !== 'pending-verification') return profile;

  const verifiedAt = new Date().toISOString();
  const mutation = await mutateConnectProfile(profile.id, (record) => {
    if (record.status !== 'pending-verification') return false;
    record.emailVerifiedAt = verifiedAt;
    if (record.role === 'survivor') {
      record.status = 'pending-review';
      record.mentorReview = {
        status: 'pending',
        identityVerified: false,
        survivorExperienceVerified: false,
      };
    } else {
      record.status = 'active';
    }
    record.updatedAt = verifiedAt;
    return true;
  });
  const activated = mutation?.record || profile;

  if (mutation?.result) {
    if (activated.role === 'survivor') {
      await Promise.allSettled([
        sendMentorReviewPendingEmail(activated),
        sendConnectExceptionAlert({
          reference: activated.reference,
          reason: 'MENTOR_REVIEW_REQUIRED',
        }),
      ]);
    } else {
      try {
        await createAutomaticMatchesForProfile(activated.id);
      } catch {
        await sendConnectExceptionAlert({
          reference: activated.reference,
          reason: 'POST_VERIFICATION_MATCHING_FAILED',
        }).catch(() => undefined);
      }
    }
  }

  return activated;
}

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const profile = await verifyAndActivateProfile(
      await profileForRequest(request, url.searchParams.get('token')),
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
    const profile = await verifyAndActivateProfile(
      await profileForRequest(request, body.token),
    );
    const action = cleanText(body.action, {min: 3, max: 30, required: true}) as PortalAction;
    if (!ACTIONS.includes(action)) throw new Error('INVALID_ACTION');

    if (action === 'accept-proposal' || action === 'decline-proposal') {
      await decideMatchProposal({
        profile,
        proposalId: cleanText(body.proposalId, {min: 20, max: 80, required: true}),
        decision: action === 'accept-proposal' ? 'accept' : 'decline',
        safetyConfirmed: action === 'accept-proposal' && body.safetyConfirmed === true,
      });
    } else if (action === 'report-block') {
      const category = cleanText(body.category, {min: 3, max: 40, required: true});
      if (!CONNECT_INCIDENT_CATEGORIES.includes(category as ConnectIncidentCategory)) {
        throw new Error('INVALID_REPORT_CATEGORY');
      }
      await reportAndBlock({
        reporter: profile,
        proposalId: body.proposalId
          ? cleanText(body.proposalId, {min: 20, max: 80, required: true})
          : undefined,
        connectionId: body.connectionId
          ? cleanText(body.connectionId, {min: 20, max: 80, required: true})
          : undefined,
        category: category as ConnectIncidentCategory,
        details: cleanText(body.details, {max: 1_000}) || undefined,
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

    const refreshed = await getConnectProfile(profile.id);
    if (!refreshed) throw new Error('INVALID_PORTAL_LINK');
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
