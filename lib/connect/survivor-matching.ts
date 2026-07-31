import 'server-only';

import {randomUUID} from 'node:crypto';

import {sendConnectExceptionAlert, sendMatchProposalEmail} from './email';
import {calculateMatchScore} from './matching';
import {createAutomaticMatchesForProfile} from './service';
import {
  getConnectProfile,
  listConnectProfiles,
  listMatchProposals,
  mutateConnectProfile,
  saveMatchProposal,
} from './store';
import type {ConnectProfile, MatchProposal} from './types';

const PROPOSAL_TTL_DAYS = 7;

function isProposalOpen(proposal: MatchProposal, now = new Date()): boolean {
  return (
    ['pending-survivor', 'pending-warrior'].includes(proposal.status) &&
    new Date(proposal.expiresAt) > now
  );
}

function hasOpenWarriorProposal(
  warriorId: string,
  proposals: MatchProposal[],
): boolean {
  return proposals.some((proposal) => (
    proposal.warriorId === warriorId && isProposalOpen(proposal)
  ));
}

function reservedCapacity(
  survivorId: string,
  proposals: MatchProposal[],
): number {
  return proposals.filter((proposal) => (
    proposal.survivorId === survivorId && isProposalOpen(proposal)
  )).length;
}

function pairingWasAlreadyOffered(
  survivorId: string,
  warriorId: string,
  proposals: MatchProposal[],
): boolean {
  return proposals.some((proposal) => (
    proposal.survivorId === survivorId && proposal.warriorId === warriorId
  ));
}

async function alert(reference: string, reason: string) {
  try {
    await sendConnectExceptionAlert({reference, reason});
  } catch {
    console.error('Unable to send a TCW Connect exception alert.');
  }
}

export async function createAutomaticMatchesForSurvivor(
  survivorId: string,
): Promise<number> {
  const survivor = await getConnectProfile(survivorId);
  if (
    !survivor ||
    survivor.role !== 'survivor' ||
    survivor.status !== 'active'
  ) {
    return 0;
  }

  const [profiles, initialProposals] = await Promise.all([
    listConnectProfiles(),
    listMatchProposals(),
  ]);
  let proposals = initialProposals;
  const availableCapacity = Math.max(
    0,
    survivor.maxConnections - survivor.activeConnections -
      reservedCapacity(survivor.id, proposals),
  );
  if (availableCapacity === 0) return 0;

  const candidates = profiles
    .filter((profile) => (
      profile.role === 'warrior' &&
      profile.status === 'active' &&
      !hasOpenWarriorProposal(profile.id, proposals) &&
      !pairingWasAlreadyOffered(survivor.id, profile.id, proposals)
    ))
    .map((warrior) => ({
      warrior,
      score: calculateMatchScore(survivor, warrior),
    }))
    .filter((candidate): candidate is {
      warrior: ConnectProfile;
      score: NonNullable<ReturnType<typeof calculateMatchScore>>;
    } => Boolean(candidate.score))
    .sort((a, b) => (
      b.score.score - a.score.score ||
      a.warrior.createdAt.localeCompare(b.warrior.createdAt)
    ));

  let created = 0;
  for (const candidate of candidates) {
    if (created >= availableCapacity) break;
    if (hasOpenWarriorProposal(candidate.warrior.id, proposals)) continue;

    const now = new Date();
    const proposal: MatchProposal = {
      id: randomUUID(),
      survivorId: survivor.id,
      warriorId: candidate.warrior.id,
      score: candidate.score.score,
      reasons: candidate.score.reasons,
      status: 'pending-survivor',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      expiresAt: new Date(
        now.getTime() + PROPOSAL_TTL_DAYS * 24 * 60 * 60 * 1000,
      ).toISOString(),
    };
    await saveMatchProposal(proposal);
    proposals = [...proposals, proposal];
    created += 1;

    try {
      await sendMatchProposalEmail(survivor);
    } catch {
      await alert(candidate.warrior.reference, 'MATCH_EMAIL_FAILED');
    }
  }

  return created;
}

export async function setConnectProfilePausedWithSafeMatching(
  profile: ConnectProfile,
  paused: boolean,
): Promise<void> {
  await mutateConnectProfile(profile.id, (record) => {
    if (record.status === 'closed') throw new Error('PROFILE_CLOSED');
    if (record.activeConnections > 0 && paused) {
      throw new Error('ACTIVE_CONNECTION_EXISTS');
    }
    record.status = paused ? 'paused' : 'active';
    record.updatedAt = new Date().toISOString();
  });

  if (paused) return;
  if (profile.role === 'survivor') {
    await createAutomaticMatchesForSurvivor(profile.id);
  } else {
    await createAutomaticMatchesForProfile(profile.id);
  }
}
