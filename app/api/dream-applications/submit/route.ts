import { randomUUID } from 'node:crypto';

import { uploadTokensMatch } from '@/lib/dream-applications/crypto';
import { assertSameOrigin, DreamAuthorizationError, privateJson } from '@/lib/dream-applications/security';
import { getDreamApplication, saveDreamApplication } from '@/lib/dream-applications/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALERT_FORM_NAME = 'dream-application-server-alert';
const ALERT_ATTEMPTS = 3;

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
  const alertUrl = new URL('/dream-application-notification.html', request.url);
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

    if (!body.applicationId || !body.uploadToken) {
      return privateJson({error: 'Invalid submission session.'}, {status: 400});
    }

    const application = await getDreamApplication(body.applicationId);
    if (
      !application ||
      application.status !== 'draft' ||
      !uploadTokensMatch(body.uploadToken, application.uploadTokenHash) ||
      !application.draftExpiresAt ||
      new Date(application.draftExpiresAt) <= new Date()
    ) {
      return privateJson({error: 'This submission session has expired.'}, {status: 410});
    }
    if (!application.files.some((file) => file.category === 'medical')) {
      return privateJson({error: 'A diagnosis-verification document is required.'}, {status: 400});
    }

    const now = new Date().toISOString();
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
    await saveDreamApplication(application);

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

    console.error('Unable to finalize Dream Support application', error);
    return privateJson(
      {error: 'The application could not be finalized. Your uploads have not been made public.'},
      {status: 503},
    );
  }
}
