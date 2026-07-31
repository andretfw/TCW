import {randomUUID} from 'node:crypto';

import {
  assertSameOrigin,
  DreamAuthorizationError,
  privateJson,
  requireConfiguredDreamBoard,
  requireDreamBoardMember,
} from '@/lib/dream-applications/security';
import {mutateDreamApplication} from '@/lib/dream-applications/store';
import {
  DREAM_BOARD_DECISIONS,
  type DreamApplicationFile,
  type DreamApplicationRecord,
  type DreamBoardDecision,
} from '@/lib/dream-applications/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

class DreamVoteError extends Error {
  constructor(
    message: string,
    public readonly status: 400 | 404 | 409,
  ) {
    super(message);
    this.name = 'DreamVoteError';
  }
}

function applicationForReviewer(application: DreamApplicationRecord) {
  return {
    ...application,
    boardVotes: application.boardVotes || [],
    files: application.files.map((file: DreamApplicationFile) => ({
      id: file.id,
      category: file.category,
      originalName: file.originalName,
      mimeType: file.mimeType,
      size: file.size,
      uploadedAt: file.uploadedAt,
    })),
  };
}

export async function POST(
  request: Request,
  {params}: {params: Promise<{id: string}>},
): Promise<Response> {
  try {
    assertSameOrigin(request);
    const reviewer = await requireDreamBoardMember();
    const boardEmails = requireConfiguredDreamBoard();
    const {id} = await params;
    const body = await request.json() as {decision?: unknown};
    if (
      typeof body.decision !== 'string' ||
      !DREAM_BOARD_DECISIONS.includes(body.decision as DreamBoardDecision)
    ) {
      return privateJson({error: 'Choose Approve or Reject.'}, {status: 400});
    }

    const decision = body.decision as DreamBoardDecision;
    const nowIso = new Date().toISOString();
    const mutation = await mutateDreamApplication(id, (application) => {
      if (application.status === 'draft') {
        throw new DreamVoteError('Application not found.', 404);
      }
      if (application.status !== 'board_review') {
        throw new DreamVoteError('Board voting is closed for this application.', 409);
      }

      const votes = application.boardVotes || [];
      const existingIndex = votes.findIndex(
        (vote) => vote.voterEmail === reviewer.email,
      );
      if (existingIndex >= 0) {
        const existing = votes[existingIndex];
        votes[existingIndex] = {
          ...existing,
          decision,
          updatedAt: nowIso,
        };
      } else {
        votes.push({
          id: randomUUID(),
          voterEmail: reviewer.email,
          decision,
          createdAt: nowIso,
          updatedAt: nowIso,
        });
      }
      application.boardVotes = votes;
      application.history.push({
        id: randomUUID(),
        type: 'board_vote_cast',
        decision,
        actor: reviewer.email,
        createdAt: nowIso,
      });

      const validVotes = votes.filter((vote) => boardEmails.includes(vote.voterEmail));
      const approvals = validVotes.filter((vote) => vote.decision === 'approve').length;
      const rejections = validVotes.filter((vote) => vote.decision === 'reject').length;
      const totalVotes = validVotes.length;
      const majorityDecision = approvals === rejections
        ? undefined
        : approvals > rejections
          ? 'approve'
          : 'reject';

      application.updatedAt = nowIso;
      return {
        approvals,
        rejections,
        totalVotes,
        totalBoardMembers: boardEmails.length,
        allVotesReceived: totalVotes === boardEmails.length,
        majorityDecision,
        canFinalize: totalVotes >= 2 && Boolean(majorityDecision),
      };
    });

    if (!mutation) {
      return privateJson({error: 'Application not found.'}, {status: 404});
    }

    return privateJson({
      application: applicationForReviewer(mutation.record),
      voteSummary: mutation.result,
      currentVote: (mutation.record.boardVotes || []).find(
        (vote) => vote.voterEmail === reviewer.email,
      )?.decision,
    });
  } catch (error) {
    if (error instanceof DreamAuthorizationError) {
      return privateJson({error: error.message}, {status: error.status});
    }
    if (error instanceof DreamVoteError) {
      return privateJson({error: error.message}, {status: error.status});
    }
    console.error('Unable to save Dream board vote', error);
    return privateJson({error: 'Unable to save your board vote.'}, {status: 503});
  }
}
