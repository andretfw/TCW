import {randomUUID} from 'node:crypto';

import {
  buildDreamBoardReviewEmailPreview,
  sendDreamBoardReviewEmails,
} from '@/lib/dream-applications/email';
import {
  assertSameOrigin,
  DreamAuthorizationError,
  privateJson,
  requireConfiguredDreamBoard,
  requireDreamAdmin,
} from '@/lib/dream-applications/security';
import {
  getDreamApplication,
  mutateDreamApplication,
} from '@/lib/dream-applications/store';
import type {
  DreamApplicationFile,
  DreamApplicationRecord,
  DreamApplicationStatus,
} from '@/lib/dream-applications/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_SOURCE_STATUSES: DreamApplicationStatus[] = [
  'new',
  'under_review',
  'more_info_requested',
  'board_review',
];

class BoardReviewRequestError extends Error {
  constructor(
    message: string,
    public readonly status: 400 | 404 | 409,
  ) {
    super(message);
    this.name = 'BoardReviewRequestError';
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

function emailState(application: DreamApplicationRecord, recipients: string[]) {
  const alreadySent = recipients.filter((email) => Boolean(application.boardReviewNotifiedAt?.[email]));
  const pendingRecipients = recipients.filter((email) => !application.boardReviewNotifiedAt?.[email]);
  return {alreadySent, pendingRecipients};
}

export async function POST(
  request: Request,
  {params}: {params: Promise<{id: string}>},
): Promise<Response> {
  try {
    assertSameOrigin(request);
    const admin = await requireDreamAdmin();
    const boardEmails = requireConfiguredDreamBoard();
    const {id} = await params;
    const body = await request.json() as {mode?: unknown};
    const mode = body.mode === 'preview' ? 'preview' : body.mode === 'send' ? 'send' : null;
    if (!mode) throw new BoardReviewRequestError('A valid board review email action is required.', 400);

    const existing = await getDreamApplication(id);
    if (!existing || existing.status === 'draft') {
      throw new BoardReviewRequestError('Application not found.', 404);
    }
    if (!ALLOWED_SOURCE_STATUSES.includes(existing.status)) {
      throw new BoardReviewRequestError(
        'This application cannot be moved to Board review from its current status.',
        409,
      );
    }

    const preview = buildDreamBoardReviewEmailPreview({
      application: existing,
      recipients: boardEmails,
    });
    if (mode === 'preview') {
      return privateJson({
        preview,
        ...emailState(existing, preview.recipients),
      });
    }

    const nowIso = new Date().toISOString();
    const transition = await mutateDreamApplication(id, (application) => {
      if (!ALLOWED_SOURCE_STATUSES.includes(application.status)) {
        throw new BoardReviewRequestError(
          'The application status changed before the board review action was confirmed.',
          409,
        );
      }

      const enteredBoardReview = application.status !== 'board_review';
      if (enteredBoardReview) {
        const previousStatus = application.status;
        application.status = 'board_review';
        application.boardVotes = [];
        application.boardReviewNotifiedAt = {};
        application.boardReminderSentAt = {};
        application.boardReminderClaimedAt = {};
        application.retentionDeleteAt = undefined;
        application.history.push({
          id: randomUUID(),
          type: 'status_changed',
          fromStatus: previousStatus,
          toStatus: 'board_review',
          actor: admin.email,
          createdAt: nowIso,
        });
      }
      application.updatedAt = nowIso;
      return {enteredBoardReview};
    });
    if (!transition) throw new BoardReviewRequestError('Application not found.', 404);

    const pendingRecipients = emailState(
      transition.record,
      preview.recipients,
    ).pendingRecipients;
    if (pendingRecipients.length === 0) {
      return privateJson({
        application: applicationForReviewer(transition.record),
        preview,
        boardNotification: {sent: [], failed: []},
        alreadySent: preview.recipients,
        pendingRecipients: [],
        movedToBoardReview: transition.result.enteredBoardReview,
      });
    }

    const boardNotification = await sendDreamBoardReviewEmails({
      application: transition.record,
      recipients: pendingRecipients,
    });

    let responseRecord = transition.record;
    if (boardNotification.sent.length > 0) {
      const deliveredAt = new Date().toISOString();
      const deliveryMutation = await mutateDreamApplication(id, (application) => {
        if (application.status !== 'board_review') return false;
        const notifiedAt = {...(application.boardReviewNotifiedAt || {})};
        for (const email of boardNotification.sent) {
          notifiedAt[email] = notifiedAt[email] || deliveredAt;
        }
        application.boardReviewNotifiedAt = notifiedAt;
        application.updatedAt = deliveredAt;
        return true;
      });
      if (deliveryMutation?.result) responseRecord = deliveryMutation.record;
    }

    const state = emailState(responseRecord, preview.recipients);
    return privateJson({
      application: applicationForReviewer(responseRecord),
      preview,
      boardNotification,
      ...state,
      movedToBoardReview: transition.result.enteredBoardReview,
    });
  } catch (error) {
    if (error instanceof DreamAuthorizationError) {
      return privateJson({error: error.message}, {status: error.status});
    }
    if (error instanceof BoardReviewRequestError) {
      return privateJson({error: error.message}, {status: error.status});
    }
    console.error('Unable to process Dream board review email', error);
    return privateJson({error: 'Unable to prepare or send the board review email.'}, {status: 503});
  }
}
