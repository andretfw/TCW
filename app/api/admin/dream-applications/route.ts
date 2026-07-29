import { randomUUID } from 'node:crypto';

import {
  assertSameOrigin,
  DreamAuthorizationError,
  privateJson,
  requireDreamReviewer,
} from '@/lib/dream-applications/security';
import {
  deleteDreamApplication,
  getDreamApplication,
  listDreamApplications,
  retentionDateFrom,
  saveDreamApplication,
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
} from '@/lib/dream-applications/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function authorizationResponse(error: unknown): Response | null {
  if (error instanceof DreamAuthorizationError) {
    return privateJson({error: error.message}, {status: error.status});
  }
  return null;
}

function applicationForReviewer(application: DreamApplicationRecord) {
  return {
    ...application,
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
    await requireDreamReviewer();
    const applications = (await listDreamApplications())
      .filter((application) => application.status !== 'draft')
      .map(toDreamListItem);
    return privateJson({applications});
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
    const reviewer = await requireDreamReviewer();
    const body = await request.json() as {
      applicationId?: string;
      status?: unknown;
      reviewerNote?: unknown;
    };
    if (!body.applicationId) {
      return privateJson({error: 'Application ID is required.'}, {status: 400});
    }

    const application = await getDreamApplication(body.applicationId);
    if (!application || application.status === 'draft') {
      return privateJson({error: 'Application not found.'}, {status: 404});
    }

    const now = new Date();
    const actor = reviewer.email || reviewer.id;
    const nextStatus = body.status === undefined
      ? application.status
      : validateDreamStatus(body.status);
    const note = validateReviewerNote(body.reviewerNote);

    if (nextStatus === 'draft') {
      return privateJson({error: 'A submitted application cannot return to draft.'}, {status: 400});
    }

    if (nextStatus !== application.status) {
      application.history.push({
        id: randomUUID(),
        type: 'status_changed',
        fromStatus: application.status,
        toStatus: nextStatus,
        actor,
        createdAt: now.toISOString(),
      });
      application.status = nextStatus;
    }

    if (note) {
      application.reviewerNotes.push({
        id: randomUUID(),
        body: note,
        author: actor,
        createdAt: now.toISOString(),
      });
      application.history.push({
        id: randomUUID(),
        type: 'note_added',
        actor,
        createdAt: now.toISOString(),
      });
    }

    application.retentionDeleteAt = ['declined', 'closed'].includes(nextStatus)
      ? application.retentionDeleteAt || retentionDateFrom(now)
      : undefined;
    application.updatedAt = now.toISOString();
    await saveDreamApplication(application);
    return privateJson({
      application: applicationForReviewer(application),
    });
  } catch (error) {
    const authResponse = authorizationResponse(error);
    if (authResponse) return authResponse;
    if (error instanceof DreamValidationError) {
      return privateJson({error: error.message, field: error.field}, {status: 400});
    }
    console.error('Unable to update Dream application', error);
    return privateJson({error: 'Unable to update this application.'}, {status: 503});
  }
}

export async function DELETE(request: Request): Promise<Response> {
  try {
    assertSameOrigin(request);
    await requireDreamReviewer();
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
