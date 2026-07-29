import { randomUUID } from 'node:crypto';

import { sendDreamBoardReviewEmails } from '@/lib/dream-applications/email';
import {
  assertSameOrigin,
  DreamAuthorizationError,
  privateJson,
  requireConfiguredDreamBoard,
  requireDreamAdmin,
  requireDreamReviewerContext,
} from '@/lib/dream-applications/security';
import {
  deleteDreamApplication,
  getDreamApplication,
  listDreamApplications,
  mutateDreamApplication,
  retentionDateFrom,
  toDreamListItem,
} from '@/lib/dream-applications/store';
import {
  DreamValidationError,
  validateDreamStatus,
  validateReviewerNote,
} from '@/lib/dream-applications/validation';
import type {
  DreamApplicationFile,
  DreamApplicationRecord,
  DreamApplicationStatus,
} from '@/lib/dream-applications/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

class DreamAdminUpdateError extends Error {
  constructor(
    message: string,
    public readonly status: 400 | 404,
  ) {
    super(message);
    this.name = 'DreamAdminUpdateError';
  }
}

function authorizationResponse(error: unknown): Response | null {
  if (error instanceof DreamAuthorizationError) {
    return privateJson({error: error.message}, {status: error.status});
  }
  return null;
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

export async function GET(): Promise<Response> {
  try {
    const reviewer = await requireDreamReviewerContext();
    const applications = (await listDreamApplications())
      .filter((application) => application.status !== 'draft')
      .filter((application) => reviewer.isAdmin || application.status === 'board_review')
      .map(toDreamListItem);
    return privateJson({
      applications,
      viewer: {
        email: reviewer.email,
        isAdmin: reviewer.isAdmin,
        isBoardMember: reviewer.isBoardMember,
      },
    });
  } catch (error) {
    const authResponse = authorizationResponse(error);
    if (authResponse) return authResponse;
    console.error('Unable to list Dream applications', error);
    return privateJson({error: 'Unable to load applications.'}, {status: 503});
  }
}

export async function PATCH(request: Request): Promise<Response> {
  try {
    assertSameOrigin(request);
    const reviewer = await requireDreamReviewerContext();
    const body = await request.json() as {
      applicationId?: string;
      status?: unknown;
      reviewerNote?: unknown;
    };
    if (!body.applicationId) {
      return privateJson({error: 'Application ID is required.'}, {status: 400});
    }

    const requestedStatus: DreamApplicationStatus | undefined = body.status === undefined
      ? undefined
      : validateDreamStatus(body.status);
    const note = validateReviewerNote(body.reviewerNote);
    if (requestedStatus === 'draft') {
      return privateJson({error: 'A submitted application cannot return to draft.'}, {status: 400});
    }
    if (requestedStatus && !reviewer.isAdmin) {
      throw new DreamAuthorizationError('Only the TCW administrator can change workflow status.', 403);
    }

    const boardEmails = requestedStatus === 'board_review'
      ? requireConfiguredDreamBoard()
      : [];
    const now = new Date();
    const nowIso = now.toISOString();
    const actor = reviewer.email;
    const mutation = await mutateDreamApplication(body.applicationId, (application) => {
      if (application.status === 'draft') {
        throw new DreamAdminUpdateError('Application not found.', 404);
      }

      const nextStatus = requestedStatus || application.status;
      const enteredBoardReview = nextStatus === 'board_review' && application.status !== 'board_review';
      if (nextStatus !== application.status) {
        application.history.push({
          id: randomUUID(),
          type: 'status_changed',
          fromStatus: application.status,
          toStatus: nextStatus,
          actor,
          createdAt: nowIso,
        });
        application.status = nextStatus;
      }

      if (enteredBoardReview) {
        application.boardVotes = [];
        application.boardReviewNotifiedAt = {};
        application.boardReminderSentAt = {};
        application.boardReminderClaimedAt = {};
      }

      if (note) {
        application.reviewerNotes.push({
          id: randomUUID(),
          body: note,
          author: actor,
          createdAt: nowIso,
        });
        application.history.push({
          id: randomUUID(),
          type: 'note_added',
          actor,
          createdAt: nowIso,
        });
      }

      application.retentionDeleteAt = nextStatus === 'declined'
        ? application.retentionDeleteAt || retentionDateFrom(now)
        : undefined;
      application.updatedAt = nowIso;
      return {enteredBoardReview};
    });
    if (!mutation) {
      return privateJson({error: 'Application not found.'}, {status: 404});
    }

    let responseRecord = mutation.record;
    let boardNotification: {sent: string[]; failed: Array<{email: string; error: string}>} | undefined;
    if (mutation.result.enteredBoardReview) {
      try {
        boardNotification = await sendDreamBoardReviewEmails({
          application: mutation.record,
          recipients: boardEmails.filter((email) => email !== actor),
        });

        if (boardNotification.sent.length > 0) {
          const deliveredAt = new Date().toISOString();
          const deliveryMutation = await mutateDreamApplication(body.applicationId, (application) => {
            if (application.status !== 'board_review') return false;

            const notifiedAt = {...(application.boardReviewNotifiedAt || {})};
            for (const email of boardNotification?.sent || []) {
              notifiedAt[email] = notifiedAt[email] || deliveredAt;
            }
            application.boardReviewNotifiedAt = notifiedAt;
            application.updatedAt = deliveredAt;
            return true;
          });
          if (deliveryMutation?.result) responseRecord = deliveryMutation.record;
        }

        if (boardNotification.failed.length > 0) {
          console.error(
            `Board review email delivery failed for ${mutation.record.reference}.`,
            boardNotification.failed,
          );
        }
      } catch (notificationError) {
        console.error(
          `Application ${mutation.record.reference} entered board review, but board notifications failed.`,
          notificationError,
        );
      }
    }

    return privateJson({
      application: applicationForReviewer(responseRecord),
      boardNotification,
    });
  } catch (error) {
    const authResponse = authorizationResponse(error);
    if (authResponse) return authResponse;
    if (error instanceof DreamValidationError) {
      return privateJson({error: error.message, field: error.field}, {status: 400});
    }
    if (error instanceof DreamAdminUpdateError) {
      return privateJson({error: error.message}, {status: error.status});
    }
    console.error('Unable to update Dream application', error);
    return privateJson({error: 'Unable to update this application.'}, {status: 503});
  }
}

export async function DELETE(request: Request): Promise<Response> {
  try {
    assertSameOrigin(request);
    await requireDreamAdmin();
    const body = await request.json() as {applicationId?: string};
    if (!body.applicationId) {
      return privateJson({error: 'Application ID is required.'}, {status: 400});
    }

    const application = await getDreamApplication(body.applicationId);
    if (!application) {
      return privateJson({error: 'Application not found.'}, {status: 404});
    }

    await deleteDreamApplication(application);
    return privateJson({ok: true});
  } catch (error) {
    const authResponse = authorizationResponse(error);
    if (authResponse) return authResponse;
    console.error('Unable to delete Dream application', error);
    return privateJson({error: 'Unable to delete this application.'}, {status: 503});
  }
}
