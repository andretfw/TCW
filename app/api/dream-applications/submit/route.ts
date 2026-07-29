import { randomUUID } from 'node:crypto';

import { uploadTokensMatch } from '@/lib/dream-applications/crypto';
import { assertSameOrigin, DreamAuthorizationError, privateJson } from '@/lib/dream-applications/security';
import { mutateDreamApplication } from '@/lib/dream-applications/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALERT_FORM_NAME = 'dream-application-server-alert';
const ALERT_ATTEMPTS = 3;
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

async function sendReferenceOnlyAlert(
  request: Request,
  reference: string,
  locale: string,
  submittedAt: string,
): Promise<void> {
  const body = new URLSearchParams({
    'form-name': ALERT_FORM_NAME,
    'application-reference': reference,
    'application-locale': locale,
    'submitted-at': submittedAt,
    'bot-field': '',
  });
  const trustedBaseUrl =
    process.env.DEPLOY_PRIME_URL ||
    process.env.URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    new URL(request.url).origin;
  const alertUrl = new URL('/dream-application-notification.html', trustedBaseUrl);
  let lastError: unknown;

  for (let attempt = 1; attempt <= ALERT_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(alertUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: body.toString(),
        cache: 'no-store',
        signal: AbortSignal.timeout(5_000),
      });
      if (!response.ok) {
        throw new Error(`Netlify Forms returned ${response.status}.`);
      }
      return;
    } catch (error) {
      lastError = error;
      if (attempt < ALERT_ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 200));
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Unable to send application alert.');
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
    let notificationSent = true;
    try {
      await sendReferenceOnlyAlert(
        request,
        application.reference,
        application.locale,
        now,
      );
    } catch (alertError) {
      notificationSent = false;
      console.error(
        `Dream application ${application.reference} was saved, but its reference-only alert failed.`,
        alertError,
      );
    }

    return privateJson({
      ok: true,
      reference: application.reference,
      submittedAt: now,
      notificationSent,
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
