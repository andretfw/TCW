import { randomUUID } from 'node:crypto';

import { uploadTokensMatch } from '@/lib/dream-applications/crypto';
import { sendDreamSubmissionEmails } from '@/lib/dream-applications/email';
import { assertSameOrigin, DreamAuthorizationError, privateJson } from '@/lib/dream-applications/security';
import { mutateDreamApplication } from '@/lib/dream-applications/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const APPLICATION_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

class DreamSubmissionError extends Error {
  constructor(
    message: string,
    public readonly status: 400 | 410,
  ) {
    super(message);
    this.name = 'DreamSubmissionError';
  }
}

function trustedSiteOrigin(request: Request): string {
  return (
    process.env.URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.DEPLOY_PRIME_URL ||
    new URL(request.url).origin
  );
}

export async function POST(request: Request): Promise<Response> {
  try {
    assertSameOrigin(request);
    const body = await request.json() as {
      applicationId?: string;
      uploadToken?: string;
    };

    if (
      !body.applicationId ||
      !APPLICATION_ID_PATTERN.test(body.applicationId) ||
      !body.uploadToken
    ) {
      return privateJson({error: 'Invalid submission session.'}, {status: 400});
    }

    const applicationId = body.applicationId;
    const uploadToken = body.uploadToken;
    const now = new Date().toISOString();
    const mutation = await mutateDreamApplication(applicationId, (application) => {
      if (
        application.status !== 'draft' ||
        !uploadTokensMatch(uploadToken, application.uploadTokenHash) ||
        !application.draftExpiresAt ||
        new Date(application.draftExpiresAt) <= new Date()
      ) {
        throw new DreamSubmissionError('This submission session has expired.', 410);
      }
      if (!application.files.some((file) => file.category === 'medical')) {
        throw new DreamSubmissionError('A diagnosis-verification document is required.', 400);
      }
      if (!application.files.some((file) => file.category === 'identity')) {
        throw new DreamSubmissionError('An ID or passport document is required.', 400);
      }

      application.status = 'new';
      application.submittedAt = now;
      application.updatedAt = now;
      application.draftExpiresAt = undefined;
      application.uploadTokenHash = undefined;
      application.history.push({
        id: randomUUID(),
        type: 'submitted',
        toStatus: 'new',
        actor: 'applicant',
        createdAt: now,
      });
    });
    if (!mutation) {
      throw new DreamSubmissionError('This submission session has expired.', 410);
    }

    const application = mutation.record;
    let applicantEmailSent = false;
    let tcwNotificationSent = false;
    try {
      const emailResult = await sendDreamSubmissionEmails({
        application,
        submittedAt: now,
        dashboardUrl: new URL('/admin/dream-applications', trustedSiteOrigin(request)).toString(),
      });
      applicantEmailSent = emailResult.applicantSent;
      tcwNotificationSent = emailResult.tcwSent;

      if (emailResult.applicantError) {
        console.error(
          `Dream application ${application.reference} was saved, but the applicant confirmation email failed: ${emailResult.applicantError}`,
        );
      }
      if (emailResult.tcwError) {
        console.error(
          `Dream application ${application.reference} was saved, but the TCW notification email failed: ${emailResult.tcwError}`,
        );
      }
    } catch (emailError) {
      console.error(
        `Dream application ${application.reference} was saved, but submission emails could not be started.`,
        emailError,
      );
    }

    return privateJson({
      ok: true,
      reference: application.reference,
      submittedAt: now,
      applicantEmailSent,
      tcwNotificationSent,
      notificationSent: tcwNotificationSent,
    });
  } catch (error) {
    if (error instanceof DreamAuthorizationError) {
      return privateJson({error: error.message}, {status: error.status});
    }
    if (error instanceof DreamSubmissionError) {
      return privateJson({error: error.message}, {status: error.status});
    }

    console.error('Unable to finalize Dream Support application', error);
    return privateJson(
      {error: 'The application could not be finalized. Your uploads have not been made public.'},
      {status: 503},
    );
  }
}
