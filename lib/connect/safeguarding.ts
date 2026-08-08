import 'server-only';

import {randomBytes, randomUUID} from 'node:crypto';

import {
  sendConnectExceptionAlert,
  sendConnectWelcomeEmail,
  sendMentorReviewDecisionEmail,
} from './email';
import {cancelConnectMeeting} from './google-calendar';
import {revokeAllConnectSessions} from './session';
import {createAutomaticMatchesForProfile} from './service';
import {
  getConnectIncident,
  getConnectProfile,
  getMatchProposal,
  listConnectConnections,
  listConnectProfiles,
  listMatchProposals,
  mutateConnectConnection,
  mutateConnectIncident,
  mutateConnectProfile,
  mutateMatchProposal,
  saveConnectIncident,
} from './store';
import type {
  ConnectIncident,
  ConnectIncidentCategory,
  ConnectIncidentStatus,
  ConnectProfile,
  ConnectProfileStatus,
  MentorVerificationMethod,
} from './types';

function incidentReference(): string {
  return `TCWI-${new Date().getUTCFullYear()}-${randomBytes(4).toString('hex').toUpperCase()}`;
}

async function alert(reference: string, reason: string): Promise<void> {
  await sendConnectExceptionAlert({reference, reason}).catch(() => {
    console.error('Unable to send a TCW Connect safeguarding alert.');
  });
}

export async function approveMentor(input: {
  profileId: string;
  reviewer: string;
  verificationMethod: MentorVerificationMethod;
  note?: string;
}): Promise<ConnectProfile> {
  const now = new Date().toISOString();
  const mutation = await mutateConnectProfile(input.profileId, (profile) => {
    if (profile.role !== 'survivor') throw new Error('MENTOR_NOT_FOUND');
    if (
      profile.status === 'closed' ||
      profile.status === 'suspended' ||
      profile.mentorReview?.status === 'approved'
    ) {
      throw new Error('MENTOR_NOT_REVIEWABLE');
    }
    profile.mentorReview = {
      status: 'approved',
      identityVerified: true,
      survivorExperienceVerified: true,
      verificationMethod: input.verificationMethod,
      reviewedAt: now,
      reviewedBy: input.reviewer,
      note: input.note,
    };
    profile.status = profile.activeConnections > 0 ? 'matched' : 'active';
    profile.suspendedAt = undefined;
    profile.suspensionIncidentId = undefined;
    profile.updatedAt = now;
  });
  if (!mutation) throw new Error('MENTOR_NOT_FOUND');

  await Promise.allSettled([
    sendConnectWelcomeEmail(mutation.record),
    createAutomaticMatchesForProfile(mutation.record.id),
  ]);
  return mutation.record;
}

export async function rejectMentor(input: {
  profileId: string;
  reviewer: string;
  note: string;
}): Promise<ConnectProfile> {
  const now = new Date().toISOString();
  const mutation = await mutateConnectProfile(input.profileId, (profile) => {
    if (profile.role !== 'survivor') throw new Error('MENTOR_NOT_FOUND');
    if (
      profile.status === 'closed' ||
      profile.status === 'suspended' ||
      profile.activeConnections > 0 ||
      profile.mentorReview?.status === 'approved'
    ) {
      throw new Error('MENTOR_NOT_REVIEWABLE');
    }
    profile.mentorReview = {
      status: 'rejected',
      identityVerified: false,
      survivorExperienceVerified: false,
      reviewedAt: now,
      reviewedBy: input.reviewer,
      note: input.note,
    };
    profile.status = 'review-rejected';
    profile.updatedAt = now;
  });
  if (!mutation) throw new Error('MENTOR_NOT_FOUND');

  const proposals = await listMatchProposals();
  for (const proposal of proposals.filter((item) => (
    item.survivorId === mutation.record.id &&
    ['pending-survivor', 'pending-warrior'].includes(item.status)
  ))) {
    await mutateMatchProposal(proposal.id, (record) => {
      if (!['pending-survivor', 'pending-warrior'].includes(record.status)) return;
      record.status = 'cancelled';
      record.updatedAt = now;
    });
  }

  await sendMentorReviewDecisionEmail(mutation.record, false).catch(() => (
    alert(mutation.record.reference, 'MENTOR_REVIEW_EMAIL_FAILED')
  ));
  return mutation.record;
}

function counterpartId(
  profileId: string,
  survivorId: string,
  warriorId: string,
): string | null {
  if (profileId === survivorId) return warriorId;
  if (profileId === warriorId) return survivorId;
  return null;
}

export async function reportAndBlock(input: {
  reporter: ConnectProfile;
  proposalId?: string;
  connectionId?: string;
  category: ConnectIncidentCategory;
  details?: string;
}): Promise<ConnectIncident> {
  if (Boolean(input.proposalId) === Boolean(input.connectionId)) {
    throw new Error('REPORT_TARGET_REQUIRED');
  }

  let reportedProfileId: string | null = null;
  if (input.proposalId) {
    const proposal = await getMatchProposal(input.proposalId);
    if (!proposal) throw new Error('REPORT_TARGET_NOT_FOUND');
    reportedProfileId = counterpartId(
      input.reporter.id,
      proposal.survivorId,
      proposal.warriorId,
    );
  } else {
    const connections = await listConnectConnections();
    const connection = connections.find((item) => item.id === input.connectionId);
    if (!connection || connection.status === 'ended') {
      throw new Error('REPORT_TARGET_NOT_FOUND');
    }
    reportedProfileId = counterpartId(
      input.reporter.id,
      connection.survivorId,
      connection.warriorId,
    );
  }
  if (!reportedProfileId) throw new Error('REPORT_TARGET_NOT_FOUND');

  const reported = await getConnectProfile(reportedProfileId);
  if (!reported) throw new Error('REPORT_TARGET_NOT_FOUND');

  const now = new Date().toISOString();
  const incident: ConnectIncident = {
    id: randomUUID(),
    reference: incidentReference(),
    reporterProfileId: input.reporter.id,
    reportedProfileId: reported.id,
    reporterPreviousStatus: input.reporter.status,
    reportedPreviousStatus: reported.status,
    sourceProposalId: input.proposalId,
    sourceConnectionId: input.connectionId,
    category: input.category,
    details: input.details,
    status: 'open',
    affectedConnectionIds: [],
    meetingCancellationFailures: [],
    history: [{
      id: randomUUID(),
      action: 'reported-and-blocked',
      actor: input.reporter.reference,
      createdAt: now,
    }],
    createdAt: now,
    updatedAt: now,
  };
  await saveConnectIncident(incident);

  const proposals = await listMatchProposals();
  for (const proposal of proposals.filter((item) => (
    ['pending-survivor', 'pending-warrior'].includes(item.status) &&
    (item.survivorId === reported.id || item.warriorId === reported.id)
  ))) {
    await mutateMatchProposal(proposal.id, (record) => {
      if (!['pending-survivor', 'pending-warrior'].includes(record.status)) return;
      record.status = 'cancelled';
      record.cancelledForIncidentId = incident.id;
      record.updatedAt = now;
    });
  }

  const allProfiles = await listConnectProfiles();
  const connections = (await listConnectConnections()).filter((connection) => (
    connection.status !== 'ended' &&
    (connection.survivorId === reported.id || connection.warriorId === reported.id)
  ));
  const affectedCounterparts = new Set<string>();

  for (const connection of connections) {
    incident.affectedConnectionIds.push(connection.id);
    const otherId = counterpartId(
      reported.id,
      connection.survivorId,
      connection.warriorId,
    );
    if (otherId) affectedCounterparts.add(otherId);

    const ended = await mutateConnectConnection(connection.id, (record) => {
      if (record.status === 'ended') return undefined;
      record.status = 'ended';
      record.schedulingClaim = undefined;
      record.endedAt = now;
      record.endedBy = input.reporter.role;
      record.endedReason = 'safety-block';
      record.incidentId = incident.id;
      record.updatedAt = now;
      return record.meeting?.eventId;
    });
    if (ended?.result) {
      try {
        await cancelConnectMeeting(ended.result);
      } catch {
        incident.meetingCancellationFailures.push(connection.id);
      }
    }
  }

  for (const profile of allProfiles.filter((item) => affectedCounterparts.has(item.id))) {
    await mutateConnectProfile(profile.id, (record) => {
      record.activeConnections = Math.max(0, record.activeConnections - 1);
      record.meetingReservations = (record.meetingReservations || []).filter(
        (reservation) =>
          !incident.affectedConnectionIds.includes(reservation.connectionId),
      );
      if (record.status !== 'closed' && record.status !== 'suspended') {
        record.status = 'paused';
      }
      record.updatedAt = now;
    });
  }

  await mutateConnectProfile(reported.id, (record) => {
    record.status = 'suspended';
    record.activeConnections = 0;
    record.meetingReservations = (record.meetingReservations || []).filter(
      (reservation) =>
        !incident.affectedConnectionIds.includes(reservation.connectionId),
    );
    record.suspendedAt = now;
    record.suspensionIncidentId = incident.id;
    record.updatedAt = now;
  });
  await revokeAllConnectSessions(reported.id).catch(() => (
    alert(reported.reference, 'SESSION_REVOCATION_NEEDS_REVIEW')
  ));
  if (input.reporter.id !== reported.id) {
    await mutateConnectProfile(input.reporter.id, (record) => {
      record.meetingReservations = (record.meetingReservations || []).filter(
        (reservation) =>
          !incident.affectedConnectionIds.includes(reservation.connectionId),
      );
      if (record.status !== 'closed' && record.status !== 'suspended') {
        record.status = 'paused';
      }
      record.updatedAt = now;
    });
  }

  incident.updatedAt = new Date().toISOString();
  if (incident.meetingCancellationFailures.length > 0) {
    incident.history.push({
      id: randomUUID(),
      action: 'calendar-cancellation-needs-review',
      actor: 'system',
      createdAt: incident.updatedAt,
    });
  }
  await mutateConnectIncident(incident.id, (record) => {
    record.affectedConnectionIds = incident.affectedConnectionIds;
    record.meetingCancellationFailures = incident.meetingCancellationFailures;
    record.history = incident.history;
    record.updatedAt = incident.updatedAt;
  });

  await alert(incident.reference, 'SAFETY_REPORT_OPENED');
  return incident;
}

export async function reviewIncident(input: {
  incidentId: string;
  reviewer: string;
  status: ConnectIncidentStatus;
  note?: string;
  profileAction?: 'keep-suspended' | 'reinstate' | 'close';
}): Promise<ConnectIncident> {
  const incident = await getConnectIncident(input.incidentId);
  if (!incident) throw new Error('INCIDENT_NOT_FOUND');

  const profile = input.profileAction && input.profileAction !== 'keep-suspended'
    ? await getConnectProfile(incident.reportedProfileId)
    : null;
  if (input.profileAction && input.profileAction !== 'keep-suspended' && !profile) {
    throw new Error('PROFILE_NOT_FOUND');
  }
  if (
    input.profileAction === 'reinstate' &&
    profile?.role === 'survivor' &&
    profile.mentorReview?.status !== 'approved'
  ) {
    throw new Error('MENTOR_APPROVAL_REQUIRED');
  }

  const now = new Date().toISOString();
  const incidentMutation = await mutateConnectIncident(input.incidentId, (record) => {
    record.status = input.status;
    record.reviewedAt = now;
    record.reviewedBy = input.reviewer;
    record.reviewNote = input.note;
    record.history.push({
      id: randomUUID(),
      action: `review-${input.status}`,
      actor: input.reviewer,
      note: input.note,
      createdAt: now,
    });
    record.updatedAt = now;
  });
  if (!incidentMutation) throw new Error('INCIDENT_NOT_FOUND');

  if (profile && input.profileAction && input.profileAction !== 'keep-suspended') {
    const nextStatus: ConnectProfileStatus = input.profileAction === 'reinstate'
      ? 'active'
      : 'closed';
    await mutateConnectProfile(profile.id, (record) => {
      record.status = nextStatus;
      record.suspendedAt = undefined;
      record.suspensionIncidentId = undefined;
      record.updatedAt = now;
    });
    if (nextStatus === 'active') {
      await createAutomaticMatchesForProfile(profile.id).catch(() => (
        alert(profile.reference, 'POST_REINSTATEMENT_MATCHING_FAILED')
      ));
    } else {
      await revokeAllConnectSessions(profile.id).catch(() => (
        alert(profile.reference, 'SESSION_REVOCATION_NEEDS_REVIEW')
      ));
    }
  }

  return incidentMutation.record;
}
