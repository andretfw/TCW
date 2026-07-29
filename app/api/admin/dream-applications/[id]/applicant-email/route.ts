import {randomUUID} from 'node:crypto';

import {
  buildDreamApplicantDecisionEmail,
  sendDreamApplicantDecisionEmail,
} from '@/lib/dream-applications/decision-email';
import {
  assertSameOrigin,
  DreamAuthorizationError,
  privateJson,
  requireDreamAdmin,
} from '@/lib/dream-applications/security';
import {
  getDreamApplication,
  mutateDreamApplication,
} from '@/lib/dream-applications/store';
import {
  DREAM_APPLICANT_EMAIL_KINDS,
  type DreamApplicantEmailDelivery,
  type DreamApplicantEmailKind,
} from '@/lib/dream-applications/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function parseKind(value: unknown): DreamApplicantEmailKind {
  if (
    typeof value !== 'string'
    || !DREAM_APPLICANT_EMAIL_KINDS.includes(value as DreamApplicantEmailKind)
  ) {
    throw new Error('A valid applicant email type is required.');
  }
  return value as DreamApplicantEmailKind;
}

function parseInformationRequest(value: unknown, kind: DreamApplicantEmailKind): string | undefined {
  if (kind !== 'more_info_requested') return undefined;
  if (typeof value !== 'string') throw new Error('Please describe the information needed.');
  const request = value.trim();
  if (request.length < 5) throw new Error('Please describe the information needed.');
  if (request.length > 2_000) throw new Error('The information request must be 2,000 characters or fewer.');
  return request;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Email delivery failed.';
}

export async function POST(
  request: Request,
  {params}: {params: Promise<{id: string}>},
): Promise<Response> {
  try {
    assertSameOrigin(request);
    const adminEmail = await requireDreamAdmin();
    const {id} = await params;
    const body = await request.json() as {
      mode?: unknown;
      kind?: unknown;
      informationRequest?: unknown;
    };
    const mode = body.mode === 'send' ? 'send' : body.mode === 'preview' ? 'preview' : null;
    if (!mode) return privateJson({error: 'A valid email action is required.'}, {status: 400});

    const kind = parseKind(body.kind);
    const informationRequest = parseInformationRequest(body.informationRequest, kind);
    const application = await getDreamApplication(id);
    if (!application || application.status === 'draft') {
      return privateJson({error: 'Application not found.'}, {status: 404});
    }
    if (application.status !== kind) {
      return privateJson({
        error: `This email can only be used while the application status is ${kind}.`,
      }, {status: 409});
    }

    const preview = buildDreamApplicantDecisionEmail({
      application,
      kind,
      informationRequest,
    });
    if (mode === 'preview') {
      return privateJson({preview});
    }

    const attemptedAt = new Date().toISOString();
    const delivery: DreamApplicantEmailDelivery = {
      id: randomUUID(),
      kind,
      subject: preview.subject,
      body: preview.body,
      requestedBy: adminEmail,
      attemptedAt,
    };

    try {
      await sendDreamApplicantDecisionEmail(preview);
      delivery.sentAt = new Date().toISOString();
    } catch (sendError) {
      delivery.error = errorMessage(sendError);
    }

    const mutation = await mutateDreamApplication(id, (current) => {
      if (current.status !== kind) {
        throw new Error('The application status changed before the email attempt was recorded.');
      }
      current.applicantEmailDeliveries = [
        ...(current.applicantEmailDeliveries || []),
        delivery,
      ];
      current.updatedAt = new Date().toISOString();
      return true;
    });
    if (!mutation) return privateJson({error: 'Application not found.'}, {status: 404});

    return privateJson({
      delivery,
      sent: Boolean(delivery.sentAt),
      error: delivery.error,
    }, {status: delivery.sentAt ? 200 : 502});
  } catch (error) {
    if (error instanceof DreamAuthorizationError) {
      return privateJson({error: error.message}, {status: error.status});
    }
    const message = errorMessage(error);
    const isValidation = message.includes('required')
      || message.includes('characters')
      || message.includes('describe');
    console.error('Unable to process Dream applicant email', error);
    return privateJson(
      {error: isValidation ? message : 'Unable to process this applicant email.'},
      {status: isValidation ? 400 : 503},
    );
  }
}
