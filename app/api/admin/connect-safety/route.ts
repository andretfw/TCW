import {
  assertSameOrigin,
  DreamAuthorizationError,
  privateJson,
  requireDreamAdmin,
} from '@/lib/dream-applications/security';
import {cleanText} from '@/lib/connect/security';
import {
  approveMentor,
  rejectMentor,
  reviewIncident,
} from '@/lib/connect/safeguarding';
import {
  listConnectIncidents,
  listConnectProfiles,
} from '@/lib/connect/store';
import {
  CONNECT_INCIDENT_STATUSES,
  MENTOR_VERIFICATION_METHODS,
  type ConnectIncidentStatus,
  type MentorVerificationMethod,
} from '@/lib/connect/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function safeProfile<T extends {portalToken: string}>(profile: T): Omit<T, 'portalToken'> {
  const {portalToken: _portalToken, ...safe} = profile;
  return safe;
}

async function dashboardData() {
  const profiles = await listConnectProfiles();
  const byId = new Map(profiles.map((profile) => [profile.id, profile]));
  const mentors = profiles
    .filter((profile) => profile.role === 'survivor')
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .map(safeProfile);
  const incidents = (await listConnectIncidents())
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((incident) => ({
      ...incident,
      reporter: byId.get(incident.reporterProfileId)
        ? safeProfile(byId.get(incident.reporterProfileId)!)
        : undefined,
      reported: byId.get(incident.reportedProfileId)
        ? safeProfile(byId.get(incident.reportedProfileId)!)
        : undefined,
    }));
  return {mentors, incidents};
}

function authResponse(error: unknown): Response | null {
  return error instanceof DreamAuthorizationError
    ? privateJson({error: error.message}, {status: error.status})
    : null;
}

export async function GET(): Promise<Response> {
  try {
    const reviewer = await requireDreamAdmin();
    return privateJson({...await dashboardData(), viewer: {email: reviewer.email}});
  } catch (error) {
    const response = authResponse(error);
    if (response) return response;
    console.error('Unable to load the TCW Connect safety dashboard.');
    return privateJson({error: 'Unable to load TCW Connect safety cases.'}, {status: 503});
  }
}

export async function PATCH(request: Request): Promise<Response> {
  try {
    assertSameOrigin(request);
    const reviewer = await requireDreamAdmin();
    const body = await request.json().catch(() => null) as Record<string, unknown> | null;
    if (!body) return privateJson({error: 'Invalid request.'}, {status: 400});
    const action = cleanText(body.action, {min: 3, max: 40, required: true});
    const note = cleanText(body.note, {max: 2_000}) || undefined;

    if (action === 'approve-mentor') {
      if (body.identityVerified !== true || body.survivorExperienceVerified !== true) {
        return privateJson(
          {error: 'Confirm both identity and survivor experience before approval.'},
          {status: 400},
        );
      }
      const method = cleanText(body.verificationMethod, {min: 3, max: 40, required: true});
      if (!MENTOR_VERIFICATION_METHODS.includes(method as MentorVerificationMethod)) {
        return privateJson({error: 'Choose a valid verification method.'}, {status: 400});
      }
      await approveMentor({
        profileId: cleanText(body.profileId, {min: 20, max: 80, required: true}),
        reviewer: reviewer.email,
        verificationMethod: method as MentorVerificationMethod,
        note,
      });
    } else if (action === 'reject-mentor') {
      if (!note || note.length < 10) {
        return privateJson({error: 'Add a private review note before rejection.'}, {status: 400});
      }
      await rejectMentor({
        profileId: cleanText(body.profileId, {min: 20, max: 80, required: true}),
        reviewer: reviewer.email,
        note,
      });
    } else if (action === 'review-incident') {
      const status = cleanText(body.status, {min: 3, max: 20, required: true});
      if (!CONNECT_INCIDENT_STATUSES.includes(status as ConnectIncidentStatus)) {
        return privateJson({error: 'Choose a valid incident status.'}, {status: 400});
      }
      const profileAction = body.profileAction === 'reinstate' || body.profileAction === 'close'
        ? body.profileAction
        : 'keep-suspended';
      await reviewIncident({
        incidentId: cleanText(body.incidentId, {min: 20, max: 80, required: true}),
        reviewer: reviewer.email,
        status: status as ConnectIncidentStatus,
        note,
        profileAction,
      });
    } else {
      return privateJson({error: 'Unsupported safety action.'}, {status: 400});
    }

    return privateJson({ok: true, ...await dashboardData()});
  } catch (error) {
    const response = authResponse(error);
    if (response) return response;
    const message = error instanceof Error ? error.message : '';
    const status = [
      'MENTOR_NOT_FOUND',
      'INCIDENT_NOT_FOUND',
      'PROFILE_NOT_FOUND',
    ].includes(message) ? 404 : 409;
    console.error('Unable to update the TCW Connect safety case.');
    return privateJson(
      {error: status === 404 ? 'Safety case not found.' : 'This safety update could not be completed.'},
      {status},
    );
  }
}
