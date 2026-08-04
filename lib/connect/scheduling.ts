import type {
  ConnectConnection,
  ConnectRole,
  ConnectSchedulingClaim,
} from './types';

const SCHEDULING_CLAIM_TTL_MINUTES = 10;

export function schedulingSlotsOverlap(
  left: {startsAt: string; endsAt: string},
  right: {startsAt: string; endsAt: string},
): boolean {
  return (
    new Date(left.startsAt).getTime() < new Date(right.endsAt).getTime() &&
    new Date(right.startsAt).getTime() < new Date(left.endsAt).getTime()
  );
}

export interface SchedulingSelectionResult {
  alreadyScheduled: boolean;
  selectionChanged: boolean;
  shouldCreateMeeting: boolean;
  claim?: ConnectSchedulingClaim;
}

export function schedulingClaimIsStale(
  claim: ConnectSchedulingClaim,
  now = new Date(),
): boolean {
  const claimedAt = new Date(claim.claimedAt).getTime();
  return (
    !Number.isFinite(claimedAt) ||
    claimedAt <= now.getTime() - SCHEDULING_CLAIM_TTL_MINUTES * 60 * 1000
  );
}

export function selectSchedulingOption(
  connection: ConnectConnection,
  role: ConnectRole,
  optionId: string,
  claimId: string,
  now = new Date(),
): SchedulingSelectionResult {
  if (connection.meeting || connection.status === 'scheduled') {
    return {
      alreadyScheduled: true,
      selectionChanged: false,
      shouldCreateMeeting: false,
    };
  }
  if (connection.status !== 'needs-scheduling') {
    throw new Error('CONNECTION_NOT_SCHEDULABLE');
  }

  const option = connection.schedulingOptions?.find(
    (candidate) => candidate.id === optionId,
  );
  if (!option || new Date(option.startsAt).getTime() <= now.getTime()) {
    throw new Error('SCHEDULING_OPTION_UNAVAILABLE');
  }

  if (
    connection.schedulingClaim &&
    !schedulingClaimIsStale(connection.schedulingClaim, now)
  ) {
    return {
      alreadyScheduled: false,
      selectionChanged: false,
      shouldCreateMeeting: false,
    };
  }
  connection.schedulingClaim = undefined;

  const previous = connection.schedulingSelections?.[role];
  const selectedAt = now.toISOString();
  connection.schedulingSelections = {
    ...connection.schedulingSelections,
    [role]: {optionId, selectedAt},
  };
  connection.schedulingError = undefined;
  connection.updatedAt = selectedAt;

  const counterpartRole: ConnectRole = role === 'survivor' ? 'warrior' : 'survivor';
  const counterpart = connection.schedulingSelections[counterpartRole];
  if (counterpart?.optionId !== optionId) {
    return {
      alreadyScheduled: false,
      selectionChanged: previous?.optionId !== optionId,
      shouldCreateMeeting: false,
    };
  }

  const claim: ConnectSchedulingClaim = {
    id: claimId,
    optionId,
    claimedAt: selectedAt,
  };
  connection.schedulingClaim = claim;
  return {
    alreadyScheduled: false,
    selectionChanged: previous?.optionId !== optionId,
    shouldCreateMeeting: true,
    claim,
  };
}
