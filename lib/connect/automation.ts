import 'server-only';

import {
  sendConnectCheckIn,
  sendConnectProposalReminder,
} from './automation-email';
import {sendConnectExceptionAlert} from './email';
import {createAutomaticMatchesForProfile} from './service';
import {
  getConnectProfile,
  listConnectConnections,
  listMatchProposals,
  mutateConnectConnection,
  mutateMatchProposal,
} from './store';
import type {ConnectConnection, MatchProposal} from './types';

const DAY_MS = 24 * 60 * 60 * 1000;
const FIRST_REMINDER_AFTER_MS = DAY_MS;
const SECOND_REMINDER_AFTER_MS = 3 * DAY_MS;
const FIRST_CHECK_IN_AFTER_MS = 7 * DAY_MS;
const MONTH_CHECK_IN_AFTER_MS = 30 * DAY_MS;

function isOpenProposal(proposal: MatchProposal): boolean {
  return ['pending-survivor', 'pending-warrior'].includes(proposal.status);
}

function waitingProfileId(proposal: MatchProposal): string {
  return proposal.status === 'pending-survivor'
    ? proposal.survivorId
    : proposal.warriorId;
}

async function safeAlert(reference: string, reason: string): Promise<void> {
  try {
    await sendConnectExceptionAlert({reference, reason});
  } catch {
    console.error('Unable to send a TCW Connect automation alert.');
  }
}

async function processProposal(
  proposal: MatchProposal,
  now: Date,
): Promise<{expired: number; reminded: number}> {
  if (!isOpenProposal(proposal)) return {expired: 0, reminded: 0};

  if (new Date(proposal.expiresAt) <= now) {
    const updated = await mutateMatchProposal(proposal.id, (record) => {
      if (!isOpenProposal(record)) return false;
      record.status = 'expired';
      record.updatedAt = now.toISOString();
      return true;
    });
    if (updated?.result) {
      await createAutomaticMatchesForProfile(proposal.warriorId).catch(async () => {
        const warrior = await getConnectProfile(proposal.warriorId);
        if (warrior) await safeAlert(warrior.reference, 'EXPIRED_PROPOSAL_REMATCH_FAILED');
      });
      return {expired: 1, reminded: 0};
    }
    return {expired: 0, reminded: 0};
  }

  const reminderCount = proposal.reminderCount || 0;
  const proposalAge = now.getTime() - new Date(proposal.createdAt).getTime();
  const reminderDue = (
    (reminderCount === 0 && proposalAge >= FIRST_REMINDER_AFTER_MS) ||
    (reminderCount === 1 && proposalAge >= SECOND_REMINDER_AFTER_MS)
  );
  if (!reminderDue) return {expired: 0, reminded: 0};

  const profile = await getConnectProfile(waitingProfileId(proposal));
  if (!profile) return {expired: 0, reminded: 0};

  try {
    await sendConnectProposalReminder(profile);
    await mutateMatchProposal(proposal.id, (record) => {
      record.reminderCount = (record.reminderCount || 0) + 1;
      record.lastReminderAt = now.toISOString();
      record.updatedAt = now.toISOString();
    });
    return {expired: 0, reminded: 1};
  } catch {
    await safeAlert(profile.reference, 'PROPOSAL_REMINDER_FAILED');
    return {expired: 0, reminded: 0};
  }
}

async function sendConnectionCheckIn(
  connection: ConnectConnection,
  month: boolean,
  now: Date,
): Promise<boolean> {
  const [survivor, warrior] = await Promise.all([
    getConnectProfile(connection.survivorId),
    getConnectProfile(connection.warriorId),
  ]);
  if (!survivor || !warrior) return false;

  const results = await Promise.allSettled([
    sendConnectCheckIn({profile: survivor, counterpart: warrior, month}),
    sendConnectCheckIn({profile: warrior, counterpart: survivor, month}),
  ]);
  const delivered = results.some((result) => result.status === 'fulfilled');
  if (!delivered) {
    await safeAlert(warrior.reference, month
      ? 'MONTH_CHECK_IN_FAILED'
      : 'FIRST_CHECK_IN_FAILED');
    return false;
  }

  await mutateConnectConnection(connection.id, (record) => {
    if (month) record.monthCheckInSentAt = now.toISOString();
    else record.firstCheckInSentAt = now.toISOString();
    record.updatedAt = now.toISOString();
  });
  return true;
}

async function processConnection(
  connection: ConnectConnection,
  now: Date,
): Promise<{activated: number; checkedIn: number}> {
  if (connection.status === 'ended' || !connection.meeting) {
    return {activated: 0, checkedIn: 0};
  }

  const meetingEnd = new Date(connection.meeting.endsAt);
  if (meetingEnd > now) return {activated: 0, checkedIn: 0};

  let activated = 0;
  if (connection.status === 'scheduled') {
    const updated = await mutateConnectConnection(connection.id, (record) => {
      if (record.status !== 'scheduled') return false;
      record.status = 'active';
      record.updatedAt = now.toISOString();
      return true;
    });
    if (updated?.result) activated = 1;
  }

  const elapsed = now.getTime() - meetingEnd.getTime();
  if (!connection.firstCheckInSentAt && elapsed >= FIRST_CHECK_IN_AFTER_MS) {
    const sent = await sendConnectionCheckIn(connection, false, now);
    return {activated, checkedIn: sent ? 1 : 0};
  }
  if (!connection.monthCheckInSentAt && elapsed >= MONTH_CHECK_IN_AFTER_MS) {
    const sent = await sendConnectionCheckIn(connection, true, now);
    return {activated, checkedIn: sent ? 1 : 0};
  }
  return {activated, checkedIn: 0};
}

export async function runConnectAutomation(now = new Date()): Promise<{
  expired: number;
  reminded: number;
  activated: number;
  checkedIn: number;
}> {
  const [proposals, connections] = await Promise.all([
    listMatchProposals(),
    listConnectConnections(),
  ]);

  let expired = 0;
  let reminded = 0;
  for (const proposal of proposals) {
    const result = await processProposal(proposal, now);
    expired += result.expired;
    reminded += result.reminded;
  }

  let activated = 0;
  let checkedIn = 0;
  for (const connection of connections) {
    const result = await processConnection(connection, now);
    activated += result.activated;
    checkedIn += result.checkedIn;
  }

  return {expired, reminded, activated, checkedIn};
}
