import 'server-only';

import {randomUUID} from 'node:crypto';

import {
  sendConnectExceptionAlert,
  sendConnectionConfirmedEmail,
  sendMatchProposalEmail,
  sendMeetingScheduledEmail,
  sendWarriorDecisionEmail,
} from './email';
import {cancelConnectMeeting, createConnectMeeting} from './google-calendar';
import {
  findNextCommonMeetingSlots,
  rankSurvivors,
} from './matching';
import {
  schedulingClaimIsStale,
  schedulingSlotsOverlap,
  selectSchedulingOption,
} from './scheduling';
import {publicProfile} from './security';
import {
  getConnectConnection,
  getConnectProfile,
  getMatchProposal,
  listConnectConnections,
  listConnectProfiles,
  listMatchProposals,
  mutateConnectConnection,
  mutateConnectProfile,
  mutateMatchProposal,
  saveConnectConnection,
  saveMatchProposal,
} from './store';
import type {
  ConnectConnection,
  ConnectPortalState,
  ConnectProfile,
  ConnectRole,
  ConnectSchedulingOption,
  MatchProposal,
} from './types';

const PROPOSAL_TTL_DAYS = 7;
const SCHEDULING_OPTION_COUNT = 3;

function isProposalOpen(proposal: MatchProposal, now = new Date()): boolean {
  return (
    ['pending-survivor', 'pending-warrior'].includes(proposal.status) &&
    new Date(proposal.expiresAt) > now
  );
}

function proposalsForProfile(
  profile: ConnectProfile,
  proposals: MatchProposal[],
): MatchProposal[] {
  return proposals.filter((proposal) => (
    profile.role === 'survivor'
      ? proposal.survivorId === profile.id
      : proposal.warriorId === profile.id
  ));
}

function hasOpenWarriorProposal(
  warriorId: string,
  proposals: MatchProposal[],
): boolean {
  return proposals.some((proposal) => (
    proposal.warriorId === warriorId && isProposalOpen(proposal)
  ));
}

function survivorReservedCapacity(
  survivorId: string,
  proposals: MatchProposal[],
): number {
  return proposals.filter((proposal) => (
    proposal.survivorId === survivorId && isProposalOpen(proposal)
  )).length;
}

async function safeExceptionAlert(reference: string, reason: string) {
  try {
    await sendConnectExceptionAlert({reference, reason});
  } catch {
    console.error('Unable to send a TCW Connect exception alert.');
  }
}

async function proposeBestSurvivor(
  warrior: ConnectProfile,
  profiles: ConnectProfile[],
  proposals: MatchProposal[],
): Promise<MatchProposal | null> {
  if (warrior.role !== 'warrior' || warrior.status !== 'active') return null;
  if (hasOpenWarriorProposal(warrior.id, proposals)) return null;

  const survivors = profiles.filter((profile) => (
    profile.role === 'survivor' &&
    profile.status === 'active' &&
    profile.mentorReview?.status === 'approved' &&
    profile.activeConnections + survivorReservedCapacity(profile.id, proposals)
      < profile.maxConnections
  ));
  const ranked = rankSurvivors(warrior, survivors, proposals);
  const best = ranked[0];
  if (!best) return null;

  const now = new Date();
  const proposal: MatchProposal = {
    id: randomUUID(),
    survivorId: best.survivor.id,
    warriorId: warrior.id,
    score: best.score.score,
    reasons: best.score.reasons,
    status: 'pending-survivor',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    expiresAt: new Date(
      now.getTime() + PROPOSAL_TTL_DAYS * 24 * 60 * 60 * 1000,
    ).toISOString(),
  };
  await saveMatchProposal(proposal);

  try {
    await sendMatchProposalEmail(best.survivor);
  } catch {
    await safeExceptionAlert(warrior.reference, 'MATCH_EMAIL_FAILED');
  }

  return proposal;
}

export async function createAutomaticMatchesForProfile(
  profileId: string,
): Promise<number> {
  const profile = await getConnectProfile(profileId);
  if (!profile || profile.status !== 'active') return 0;
  if (profile.role === 'survivor' && profile.mentorReview?.status !== 'approved') {
    return 0;
  }

  const profiles = await listConnectProfiles();
  let proposals = await listMatchProposals();
  let created = 0;

  if (profile.role === 'warrior') {
    return (await proposeBestSurvivor(profile, profiles, proposals)) ? 1 : 0;
  }

  const capacity = Math.max(
    0,
    profile.maxConnections - profile.activeConnections -
      survivorReservedCapacity(profile.id, proposals),
  );
  if (capacity === 0) return 0;

  const warriors = profiles
    .filter((candidate) => (
      candidate.role === 'warrior' &&
      candidate.status === 'active' &&
      !hasOpenWarriorProposal(candidate.id, proposals)
    ))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  for (const warrior of warriors) {
    if (created >= capacity) break;
    const proposal = await proposeBestSurvivor(warrior, profiles, proposals);
    if (!proposal || proposal.survivorId !== profile.id) continue;
    proposals = [...proposals, proposal];
    created += 1;
  }

  return created;
}

async function connectionForProposal(
  proposalId: string,
): Promise<ConnectConnection | null> {
  const connections = await listConnectConnections();
  return connections.find((connection) => connection.proposalId === proposalId) || null;
}

function createSchedulingOptions(
  survivor: ConnectProfile,
  warrior: ConnectProfile,
  now = new Date(),
): ConnectSchedulingOption[] {
  const reserved = [
    ...(survivor.meetingReservations || []),
    ...(warrior.meetingReservations || []),
  ].filter((reservation) => new Date(reservation.endsAt) > now);

  return findNextCommonMeetingSlots(
    survivor,
    warrior,
    now,
    10,
  )
    .filter((slot) => (
      !reserved.some((reservation) => schedulingSlotsOverlap(slot, reservation))
    ))
    .slice(0, SCHEDULING_OPTION_COUNT)
    .map((slot) => ({id: randomUUID(), ...slot}));
}

async function ensureSchedulingOptions(
  connection: ConnectConnection,
  survivor: ConnectProfile,
  warrior: ConnectProfile,
): Promise<ConnectConnection> {
  if (
    connection.meeting ||
    connection.status === 'ended' ||
    connection.schedulingError === 'NO_SHARED_AVAILABILITY'
  ) {
    return connection;
  }

  const now = new Date();
  const currentOptions = connection.schedulingOptions || [];
  const hasFutureOption = currentOptions.some(
    (option) => new Date(option.startsAt) > now,
  );
  const staleClaim = Boolean(
    connection.schedulingClaim &&
    schedulingClaimIsStale(connection.schedulingClaim, now),
  );
  const refreshForConflict =
    connection.schedulingError === 'SCHEDULING_OPTION_CONFLICT';
  if (hasFutureOption && !staleClaim && !refreshForConflict) return connection;

  const nextOptions = hasFutureOption && !refreshForConflict
    ? currentOptions
    : createSchedulingOptions(survivor, warrior, now);
  const updated = await mutateConnectConnection(connection.id, (record) => {
    if (
      record.meeting ||
      record.status !== 'needs-scheduling' ||
      record.schedulingError === 'NO_SHARED_AVAILABILITY'
    ) {
      return false;
    }

    const recordHasFutureOption = (record.schedulingOptions || []).some(
      (option) => new Date(option.startsAt) > now,
    );
    const recordHasStaleClaim = Boolean(
      record.schedulingClaim &&
      schedulingClaimIsStale(record.schedulingClaim, now),
    );
    const recordNeedsConflictRefresh =
      record.schedulingError === 'SCHEDULING_OPTION_CONFLICT';
    if (record.schedulingClaim && !recordHasStaleClaim) return false;
    if (
      recordHasFutureOption &&
      !recordHasStaleClaim &&
      !recordNeedsConflictRefresh
    ) {
      return false;
    }

    record.schedulingClaim = undefined;
    if (recordHasStaleClaim && recordHasFutureOption) {
      record.schedulingError = 'CALENDAR_SCHEDULING_FAILED';
    }
    if (!recordHasFutureOption || recordNeedsConflictRefresh) {
      record.schedulingOptions = nextOptions;
      record.schedulingSelections = undefined;
      record.schedulingError = nextOptions.length
        ? undefined
        : 'NO_SHARED_AVAILABILITY';
    }
    record.updatedAt = now.toISOString();
    return true;
  });

  const prepared = updated?.record || connection;
  if (updated?.result && !prepared.schedulingOptions?.length) {
    await safeExceptionAlert(warrior.reference, 'NO_SHARED_AVAILABILITY');
  }
  return prepared;
}

async function storedMeetingConflicts(
  connection: ConnectConnection,
  option: ConnectSchedulingOption,
): Promise<boolean> {
  const connections = await listConnectConnections();
  return connections.some((candidate) => (
    candidate.id !== connection.id &&
    candidate.status !== 'ended' &&
    Boolean(candidate.meeting) &&
    (
      candidate.survivorId === connection.survivorId ||
      candidate.survivorId === connection.warriorId ||
      candidate.warriorId === connection.survivorId ||
      candidate.warriorId === connection.warriorId
    ) &&
    schedulingSlotsOverlap(option, candidate.meeting!)
  ));
}

async function reserveProfileMeeting(input: {
  profileId: string;
  connectionId: string;
  claimId: string;
  option: ConnectSchedulingOption;
}): Promise<boolean> {
  const now = new Date();
  const updated = await mutateConnectProfile(input.profileId, (record) => {
    const reservations = (record.meetingReservations || []).filter(
      (reservation) => new Date(reservation.endsAt) > now,
    );
    const existing = reservations.some((reservation) => (
      reservation.connectionId === input.connectionId &&
      reservation.claimId === input.claimId
    ));
    if (existing) {
      record.meetingReservations = reservations;
      return true;
    }
    if (
      reservations.some((reservation) =>
        schedulingSlotsOverlap(input.option, reservation))
    ) {
      record.meetingReservations = reservations;
      return false;
    }

    record.meetingReservations = [...reservations, {
      connectionId: input.connectionId,
      claimId: input.claimId,
      startsAt: input.option.startsAt,
      endsAt: input.option.endsAt,
      createdAt: now.toISOString(),
    }];
    record.updatedAt = now.toISOString();
    return true;
  });
  return Boolean(updated?.result);
}

async function releaseMeetingReservations(
  profileIds: string[],
  connectionId: string,
  claimId?: string,
): Promise<boolean> {
  const results = await Promise.allSettled(profileIds.map((profileId) =>
    mutateConnectProfile(profileId, (record) => {
      const before = record.meetingReservations || [];
      record.meetingReservations = before.filter((reservation) => !(
        reservation.connectionId === connectionId &&
        (!claimId || reservation.claimId === claimId)
      ));
      if (record.meetingReservations.length !== before.length) {
        record.updatedAt = new Date().toISOString();
      }
    })));
  return results.every((result) => result.status === 'fulfilled');
}

async function reserveMeetingForParticipants(
  connection: ConnectConnection,
  claimId: string,
  option: ConnectSchedulingOption,
): Promise<boolean> {
  const survivorReserved = await reserveProfileMeeting({
    profileId: connection.survivorId,
    connectionId: connection.id,
    claimId,
    option,
  });
  if (!survivorReserved) return false;

  try {
    const warriorReserved = await reserveProfileMeeting({
      profileId: connection.warriorId,
      connectionId: connection.id,
      claimId,
      option,
    });
    if (warriorReserved) return true;
  } catch (error) {
    await releaseMeetingReservations(
      [connection.survivorId],
      connection.id,
      claimId,
    );
    throw error;
  }

  await releaseMeetingReservations(
    [connection.survivorId],
    connection.id,
    claimId,
  );
  return false;
}

async function markSchedulingOptionConflict(
  connectionId: string,
  claimId: string,
): Promise<void> {
  await mutateConnectConnection(connectionId, (record) => {
    if (record.schedulingClaim?.id !== claimId) return;
    record.schedulingClaim = undefined;
    record.schedulingSelections = undefined;
    record.schedulingError = 'SCHEDULING_OPTION_CONFLICT';
    record.updatedAt = new Date().toISOString();
  });
}

async function createMeetingForClaim(
  connection: ConnectConnection,
  survivor: ConnectProfile,
  warrior: ConnectProfile,
): Promise<void> {
  const claim = connection.schedulingClaim;
  const option = connection.schedulingOptions?.find(
    (candidate) => candidate.id === claim?.optionId,
  );
  if (!claim || !option) throw new Error('SCHEDULING_CLAIM_INVALID');

  let meeting: Awaited<ReturnType<typeof createConnectMeeting>> | undefined;
  let reservationsHeld = false;
  try {
    if (
      !['active', 'matched'].includes(survivor.status) ||
      !['active', 'matched'].includes(warrior.status)
    ) {
      throw new Error('CONNECTION_NOT_SCHEDULABLE');
    }

    if (
      await storedMeetingConflicts(connection, option) ||
      !await reserveMeetingForParticipants(connection, claim.id, option)
    ) {
      await markSchedulingOptionConflict(connection.id, claim.id);
      return;
    }
    reservationsHeld = true;

    const createdMeeting = await createConnectMeeting({
      survivor,
      warrior,
      ...option,
    });
    meeting = createdMeeting;
    const updated = await mutateConnectConnection(connection.id, (record) => {
      if (
        record.status !== 'needs-scheduling' ||
        record.schedulingClaim?.id !== claim.id
      ) {
        throw new Error('SCHEDULING_CLAIM_LOST');
      }
      record.status = 'scheduled';
      record.meeting = createdMeeting;
      record.schedulingClaim = undefined;
      record.schedulingError = undefined;
      record.updatedAt = new Date().toISOString();
    });
    if (!updated) throw new Error('CONNECTION_NOT_FOUND');

    await Promise.allSettled([
      sendMeetingScheduledEmail(survivor, warrior, updated.record),
      sendMeetingScheduledEmail(warrior, survivor, updated.record),
    ]);
  } catch {
    if (meeting) {
      try {
        await cancelConnectMeeting(meeting.eventId);
      } catch {
        await safeExceptionAlert(warrior.reference, 'ORPHAN_MEETING_CANCELLATION_FAILED');
      }
    }
    if (reservationsHeld) {
      const released = await releaseMeetingReservations(
        [connection.survivorId, connection.warriorId],
        connection.id,
        claim.id,
      );
      if (!released) {
        await safeExceptionAlert(
          warrior.reference,
          'MEETING_RESERVATION_RELEASE_FAILED',
        );
      }
    }
    await mutateConnectConnection(connection.id, (record) => {
      if (record.schedulingClaim?.id === claim.id) {
        record.schedulingClaim = undefined;
      }
      if (record.status === 'needs-scheduling') {
        record.schedulingError = 'CALENDAR_SCHEDULING_FAILED';
        record.updatedAt = new Date().toISOString();
      }
    }).catch(() => undefined);
    await safeExceptionAlert(warrior.reference, 'CALENDAR_SCHEDULING_FAILED');
  }
}

async function createAcceptedConnection(
  proposal: MatchProposal,
): Promise<ConnectConnection> {
  const existing = await connectionForProposal(proposal.id);
  if (existing) return existing;

  const [survivor, warrior] = await Promise.all([
    getConnectProfile(proposal.survivorId),
    getConnectProfile(proposal.warriorId),
  ]);
  if (!survivor || !warrior) throw new Error('CONNECT_PROFILE_NOT_FOUND');

  const now = new Date().toISOString();
  const schedulingOptions = createSchedulingOptions(survivor, warrior);
  const connection: ConnectConnection = {
    id: randomUUID(),
    proposalId: proposal.id,
    survivorId: survivor.id,
    warriorId: warrior.id,
    status: 'needs-scheduling',
    schedulingOptions,
    schedulingError: schedulingOptions.length
      ? undefined
      : 'NO_SHARED_AVAILABILITY',
    createdAt: now,
    updatedAt: now,
  };
  await saveConnectConnection(connection);

  await Promise.all([
    mutateConnectProfile(survivor.id, (profile) => {
      profile.activeConnections += 1;
      profile.status = profile.activeConnections >= profile.maxConnections
        ? 'matched'
        : 'active';
      profile.updatedAt = now;
    }),
    mutateConnectProfile(warrior.id, (profile) => {
      profile.status = 'matched';
      profile.activeConnections = 1;
      profile.updatedAt = now;
    }),
  ]);

  await Promise.allSettled([
    sendConnectionConfirmedEmail(survivor, warrior),
    sendConnectionConfirmedEmail(warrior, survivor),
  ]);
  if (!schedulingOptions.length) {
    await safeExceptionAlert(warrior.reference, 'NO_SHARED_AVAILABILITY');
  }

  return connection;
}

export async function chooseConnectMeetingTime(input: {
  profile: ConnectProfile;
  connectionId: string;
  optionId: string;
}): Promise<void> {
  const connection = await getConnectConnection(input.connectionId);
  if (!connection || connection.status === 'ended') {
    throw new Error('CONNECTION_NOT_FOUND');
  }

  const role: ConnectRole | undefined = connection.survivorId === input.profile.id
    ? 'survivor'
    : connection.warriorId === input.profile.id
      ? 'warrior'
      : undefined;
  if (!role || !['active', 'matched'].includes(input.profile.status)) {
    throw new Error('CONNECTION_NOT_FOUND');
  }

  const selected = await mutateConnectConnection(connection.id, (record) =>
    selectSchedulingOption(
      record,
      role,
      input.optionId,
      randomUUID(),
      new Date(),
    ));
  if (!selected) throw new Error('CONNECTION_NOT_FOUND');
  if (!selected.result.shouldCreateMeeting || !selected.result.claim) return;

  const [survivor, warrior] = await Promise.all([
    getConnectProfile(selected.record.survivorId),
    getConnectProfile(selected.record.warriorId),
  ]);
  if (!survivor || !warrior) throw new Error('CONNECT_PROFILE_NOT_FOUND');
  await createMeetingForClaim(selected.record, survivor, warrior);
}

export async function decideMatchProposal(input: {
  profile: ConnectProfile;
  proposalId: string;
  decision: 'accept' | 'decline';
  safetyConfirmed?: boolean;
}): Promise<void> {
  const proposal = await getMatchProposal(input.proposalId);
  if (!proposal) throw new Error('PROPOSAL_NOT_FOUND');

  const isSurvivor = input.profile.role === 'survivor'
    && proposal.survivorId === input.profile.id;
  const isWarrior = input.profile.role === 'warrior'
    && proposal.warriorId === input.profile.id;
  if (!isSurvivor && !isWarrior) throw new Error('PROPOSAL_NOT_FOUND');
  if (new Date(proposal.expiresAt) <= new Date()) throw new Error('PROPOSAL_EXPIRED');

  if (input.decision === 'decline') {
    const updated = await mutateMatchProposal(proposal.id, (record) => {
      if (!isProposalOpen(record)) throw new Error('PROPOSAL_NOT_ACTIVE');
      record.status = 'declined';
      record.declinedBy = input.profile.role;
      record.updatedAt = new Date().toISOString();
    });
    if (!updated) throw new Error('PROPOSAL_NOT_FOUND');
    await createAutomaticMatchesForProfile(proposal.warriorId);
    return;
  }

  const [currentSurvivor, currentWarrior] = await Promise.all([
    getConnectProfile(proposal.survivorId),
    getConnectProfile(proposal.warriorId),
  ]);
  if (!currentSurvivor || !currentWarrior) {
    throw new Error('CONNECT_PROFILE_NOT_FOUND');
  }
  if (
    currentSurvivor.mentorReview?.status !== 'approved' ||
    !['active', 'matched'].includes(currentSurvivor.status) ||
    currentWarrior.status !== 'active'
  ) {
    throw new Error('PROPOSAL_NOT_ACTIVE');
  }
  if (!input.safetyConfirmed) {
    throw new Error('SAFETY_CONFIRMATION_REQUIRED');
  }

  if (isSurvivor) {
    if (proposal.status !== 'pending-survivor') throw new Error('PROPOSAL_NOT_ACTIVE');
    const updated = await mutateMatchProposal(proposal.id, (record) => {
      if (record.status !== 'pending-survivor') throw new Error('PROPOSAL_NOT_ACTIVE');
      const now = new Date().toISOString();
      record.status = 'pending-warrior';
      record.survivorAcceptedAt = now;
      record.survivorSafetyConfirmedAt = now;
      record.updatedAt = now;
    });
    if (!updated) throw new Error('PROPOSAL_NOT_FOUND');
    const warrior = await getConnectProfile(proposal.warriorId);
    if (warrior) {
      try {
        await sendWarriorDecisionEmail(warrior);
      } catch {
        await safeExceptionAlert(warrior.reference, 'WARRIOR_MATCH_EMAIL_FAILED');
      }
    }
    return;
  }

  if (proposal.status !== 'pending-warrior') throw new Error('PROPOSAL_NOT_ACTIVE');
  const updated = await mutateMatchProposal(proposal.id, (record) => {
    if (record.status !== 'pending-warrior') throw new Error('PROPOSAL_NOT_ACTIVE');
    const now = new Date().toISOString();
    record.status = 'accepted';
    record.warriorAcceptedAt = now;
    record.warriorSafetyConfirmedAt = now;
    record.updatedAt = now;
  });
  if (!updated) throw new Error('PROPOSAL_NOT_FOUND');
  await createAcceptedConnection(updated.record);
}

export async function setConnectProfilePaused(
  profile: ConnectProfile,
  paused: boolean,
): Promise<void> {
  await mutateConnectProfile(profile.id, (record) => {
    if (!['active', 'paused'].includes(record.status)) {
      throw new Error('PROFILE_NOT_MANAGEABLE');
    }
    if (record.role === 'survivor' && record.mentorReview?.status !== 'approved') {
      throw new Error('MENTOR_APPROVAL_REQUIRED');
    }
    if (record.activeConnections > 0 && paused) {
      throw new Error('ACTIVE_CONNECTION_EXISTS');
    }
    record.status = paused ? 'paused' : 'active';
    record.updatedAt = new Date().toISOString();
  });
  if (!paused) await createAutomaticMatchesForProfile(profile.id);
}

export async function endConnectConnection(input: {
  profile: ConnectProfile;
  connectionId: string;
  rematch: boolean;
}): Promise<void> {
  const connection = await getConnectConnection(input.connectionId);
  if (!connection || connection.status === 'ended') throw new Error('CONNECTION_NOT_FOUND');
  const belongs = connection.survivorId === input.profile.id
    || connection.warriorId === input.profile.id;
  if (!belongs) throw new Error('CONNECTION_NOT_FOUND');

  const [survivor, warrior] = await Promise.all([
    getConnectProfile(connection.survivorId),
    getConnectProfile(connection.warriorId),
  ]);
  if (!survivor || !warrior) throw new Error('CONNECT_PROFILE_NOT_FOUND');

  const now = new Date().toISOString();
  const ended = await mutateConnectConnection(connection.id, (record) => {
    if (record.status === 'ended') throw new Error('CONNECTION_NOT_FOUND');
    record.status = 'ended';
    record.schedulingClaim = undefined;
    record.endedAt = now;
    record.endedBy = input.profile.role;
    record.endedReason = 'participant-ended';
    record.updatedAt = now;
    return record.meeting?.eventId;
  });
  if (!ended) throw new Error('CONNECTION_NOT_FOUND');
  if (ended.result) {
    try {
      await cancelConnectMeeting(ended.result);
    } catch {
      await safeExceptionAlert(input.profile.reference, 'CALENDAR_CANCELLATION_FAILED');
    }
  }
  await Promise.all([
    mutateConnectProfile(survivor.id, (record) => {
      record.activeConnections = Math.max(0, record.activeConnections - 1);
      record.meetingReservations = (record.meetingReservations || []).filter(
        (reservation) => reservation.connectionId !== connection.id,
      );
      record.status = 'active';
      record.updatedAt = now;
    }),
    mutateConnectProfile(warrior.id, (record) => {
      record.activeConnections = 0;
      record.meetingReservations = (record.meetingReservations || []).filter(
        (reservation) => reservation.connectionId !== connection.id,
      );
      record.status = input.rematch ? 'active' : 'paused';
      record.updatedAt = now;
    }),
  ]);

  if (input.rematch) await createAutomaticMatchesForProfile(warrior.id);
}

export async function buildConnectPortalState(
  profile: ConnectProfile,
): Promise<ConnectPortalState> {
  const [proposals, connections] = await Promise.all([
    listMatchProposals(),
    listConnectConnections(),
  ]);

  let activeConnection = connections
    .filter((connection) => (
      connection.status !== 'ended' &&
      (connection.survivorId === profile.id || connection.warriorId === profile.id)
    ))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];

  let connectionState: ConnectPortalState['connection'];
  if (activeConnection) {
    const counterpartId = activeConnection.survivorId === profile.id
      ? activeConnection.warriorId
      : activeConnection.survivorId;
    const counterpart = await getConnectProfile(counterpartId);
    if (counterpart) {
      const survivor = profile.role === 'survivor' ? profile : counterpart;
      const warrior = profile.role === 'warrior' ? profile : counterpart;
      activeConnection = await ensureSchedulingOptions(
        activeConnection,
        survivor,
        warrior,
      );
      connectionState = {
        id: activeConnection.id,
        status: activeConnection.status,
        counterpart: publicProfile(counterpart),
        meeting: activeConnection.meeting,
        schedulingOptions: activeConnection.schedulingOptions,
        selectedOptionId:
          activeConnection.schedulingSelections?.[profile.role]?.optionId,
        counterpartSelectedOptionId:
          activeConnection.schedulingSelections?.[counterpart.role]?.optionId,
        schedulingInProgress: Boolean(activeConnection.schedulingClaim),
        schedulingError: Boolean(activeConnection.schedulingError),
      };
    }
  }

  const visibleProposal = proposalsForProfile(profile, proposals)
    .filter((proposal) => (
      (profile.role === 'survivor' && proposal.status === 'pending-survivor') ||
      (profile.role === 'warrior' && proposal.status === 'pending-warrior')
    ))
    .filter((proposal) => new Date(proposal.expiresAt) > new Date())
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];

  let proposalState: ConnectPortalState['proposal'];
  if (visibleProposal) {
    const counterpartId = profile.role === 'survivor'
      ? visibleProposal.warriorId
      : visibleProposal.survivorId;
    const counterpart = await getConnectProfile(counterpartId);
    if (counterpart) {
      proposalState = {
        id: visibleProposal.id,
        status: visibleProposal.status,
        score: visibleProposal.score,
        reasons: visibleProposal.reasons,
        counterpart: publicProfile(counterpart),
        expiresAt: visibleProposal.expiresAt,
      };
    }
  }

  return {
    profile: {
      ...publicProfile(profile),
      reference: profile.reference,
      status: profile.status,
      availability: profile.availability,
    },
    proposal: proposalState,
    connection: connectionState,
  };
}
