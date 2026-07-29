import 'server-only';

import {
  getGoogleWorkspaceAccessToken,
  GOOGLE_GMAIL_SEND_SCOPE,
  googleWorkspaceAccountEmail,
} from './google-drive';
import type {DreamApplicationRecord} from './types';

const GMAIL_SEND_URL = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send';
const DEFAULT_SITE_URL = 'https://tutticancerwarriors.org';

interface GmailSendResponse {
  id?: string;
  error?: {
    message?: string;
  };
}

interface EmailMessage {
  to: string;
  subject: string;
  body: string;
}

export interface DreamSubmissionEmailResult {
  applicantSent: boolean;
  tcwSent: boolean;
  applicantError?: string;
  tcwError?: string;
}

export interface DreamBoardReviewEmailResult {
  sent: string[];
  failed: Array<{email: string; error: string}>;
}

const APPLICANT_COPY = {
  en: {
    subject: (reference: string) => `We received your TCW Dream application — ${reference}`,
    body: (firstName: string, reference: string) => `Hi, dear ${firstName} 💜

We have received your Dream Support application.
Your application number is ${reference}.

Our board will review it soon, and we’ll contact you if we need any additional information.

With hugs,
Tutti Cancer Warriors
tutticancerwarriors.org`,
  },
  ro: {
    subject: (reference: string) => `Am primit cererea ta TCW Dream — ${reference}`,
    body: (firstName: string, reference: string) => `Bună, dragă ${firstName} 💜

Am primit cererea ta pentru Dream Support.
Numărul cererii tale este ${reference}.

Consiliul nostru o va analiza în curând și te vom contacta dacă avem nevoie de informații suplimentare.

Cu drag,
Tutti Cancer Warriors
tutticancerwarriors.org`,
  },
  es: {
    subject: (reference: string) => `Hemos recibido tu solicitud TCW Dream — ${reference}`,
    body: (firstName: string, reference: string) => `Hola, querida ${firstName} 💜

Hemos recibido tu solicitud de Dream Support.
El número de tu solicitud es ${reference}.

Nuestro equipo la revisará pronto y nos pondremos en contacto contigo si necesitamos información adicional.

Con cariño,
Tutti Cancer Warriors
tutticancerwarriors.org`,
  },
} satisfies Record<
  DreamApplicationRecord['locale'],
  {
    subject: (reference: string) => string;
    body: (firstName: string, reference: string) => string;
  }
>;

function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] || fullName.trim();
}

function sanitizeHeader(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

function encodeHeader(value: string): string {
  const clean = sanitizeHeader(value);
  if (/^[\x20-\x7E]*$/.test(clean)) return clean;
  return `=?UTF-8?B?${Buffer.from(clean, 'utf8').toString('base64')}?=`;
}

function wrapBase64(value: string): string {
  return value.match(/.{1,76}/g)?.join('\r\n') || '';
}

function rawMessage(from: string, message: EmailMessage): string {
  const safeFrom = sanitizeHeader(from);
  const safeTo = sanitizeHeader(message.to);
  if (!safeFrom || !safeTo || /[<>]/.test(safeTo)) {
    throw new Error('The email address is invalid.');
  }

  const encodedBody = wrapBase64(Buffer.from(message.body, 'utf8').toString('base64'));
  const mime = [
    `From: Tutti Cancer Warriors <${safeFrom}>`,
    `Reply-To: ${safeFrom}`,
    `To: ${safeTo}`,
    `Subject: ${encodeHeader(message.subject)}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    encodedBody,
  ].join('\r\n');

  return Buffer.from(mime, 'utf8').toString('base64url');
}

async function sendGmailMessage(
  accessToken: string,
  from: string,
  message: EmailMessage,
): Promise<void> {
  const response = await fetch(GMAIL_SEND_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({raw: rawMessage(from, message)}),
    cache: 'no-store',
    signal: AbortSignal.timeout(15_000),
  });
  const payload = await response.json().catch(() => ({})) as GmailSendResponse;
  if (!response.ok || !payload.id) {
    throw new Error(payload.error?.message || `Gmail returned ${response.status}.`);
  }
}

function tcwAlertBody(
  reference: string,
  locale: DreamApplicationRecord['locale'],
  submittedAt: string,
  dashboardUrl: string,
): string {
  return `A new Dream Support application has been submitted.

Application: ${reference}
Language: ${locale.toUpperCase()}
Submitted: ${submittedAt}

Review it securely in the TCW dashboard:
${dashboardUrl}

For privacy, applicant details and medical information are not included in this email.`;
}

function boardReviewBody(reference: string, reviewUrl: string): string {
  return `Hi,

Dream Support application ${reference} is ready for board review.

Please sign in to the secure TCW dashboard, review the application and submit your vote:
${reviewUrl}

For confidentiality, applicant details and medical information are not included in this email.

Thank you 💜
Tutti Cancer Warriors`;
}

function boardReminderBody(reference: string, reviewUrl: string): string {
  return `Hi,

Just a gentle reminder that Dream Support application ${reference} is still waiting for your board vote.

Please sign in to the secure TCW dashboard to review it and submit your decision:
${reviewUrl}

For confidentiality, applicant details and medical information are not included in this email.

Thank you 💜
Tutti Cancer Warriors`;
}

function boardReviewUrl(applicationId: string): string {
  return new URL(
    `/admin/dream-applications/board/${encodeURIComponent(applicationId)}`,
    process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL,
  ).toString();
}

function errorMessage(result: PromiseRejectedResult): string {
  return result.reason instanceof Error ? result.reason.message : 'Email delivery failed.';
}

export async function sendDreamSubmissionEmails(input: {
  application: DreamApplicationRecord;
  submittedAt: string;
  dashboardUrl?: string;
}): Promise<DreamSubmissionEmailResult> {
  const accessToken = await getGoogleWorkspaceAccessToken(GOOGLE_GMAIL_SEND_SCOPE);
  const from = googleWorkspaceAccountEmail();
  const copy = APPLICANT_COPY[input.application.locale];
  const dashboardUrl =
    input.dashboardUrl ||
    new URL('/admin/dream-applications', process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).toString();

  const applicantMessage: EmailMessage = {
    to: input.application.email,
    subject: copy.subject(input.application.reference),
    body: copy.body(firstName(input.application.fullName), input.application.reference),
  };
  const tcwMessage: EmailMessage = {
    to: from,
    subject: `New Dream Support application — ${input.application.reference}`,
    body: tcwAlertBody(
      input.application.reference,
      input.application.locale,
      input.submittedAt,
      dashboardUrl,
    ),
  };

  const [applicantResult, tcwResult] = await Promise.allSettled([
    sendGmailMessage(accessToken, from, applicantMessage),
    sendGmailMessage(accessToken, from, tcwMessage),
  ]);

  return {
    applicantSent: applicantResult.status === 'fulfilled',
    tcwSent: tcwResult.status === 'fulfilled',
    applicantError:
      applicantResult.status === 'rejected' ? errorMessage(applicantResult) : undefined,
    tcwError: tcwResult.status === 'rejected' ? errorMessage(tcwResult) : undefined,
  };
}

export async function sendDreamBoardReviewEmails(input: {
  application: DreamApplicationRecord;
  recipients: string[];
}): Promise<DreamBoardReviewEmailResult> {
  const recipients = [...new Set(input.recipients.map((email) => email.trim().toLowerCase()).filter(Boolean))];
  if (recipients.length === 0) return {sent: [], failed: []};

  const accessToken = await getGoogleWorkspaceAccessToken(GOOGLE_GMAIL_SEND_SCOPE);
  const from = googleWorkspaceAccountEmail();
  const reviewUrl = boardReviewUrl(input.application.id);

  const results = await Promise.allSettled(
    recipients.map((email) => sendGmailMessage(accessToken, from, {
      to: email,
      subject: `Board review requested — ${input.application.reference}`,
      body: boardReviewBody(input.application.reference, reviewUrl),
    })),
  );

  const sent: string[] = [];
  const failed: Array<{email: string; error: string}> = [];
  results.forEach((result, index) => {
    const email = recipients[index];
    if (result.status === 'fulfilled') sent.push(email);
    else failed.push({email, error: errorMessage(result)});
  });

  return {sent, failed};
}

export async function sendDreamBoardReminderEmail(input: {
  application: DreamApplicationRecord;
  recipient: string;
}): Promise<void> {
  const recipient = input.recipient.trim().toLowerCase();
  if (!recipient) throw new Error('Board reminder recipient is required.');

  const accessToken = await getGoogleWorkspaceAccessToken(GOOGLE_GMAIL_SEND_SCOPE);
  const from = googleWorkspaceAccountEmail();
  await sendGmailMessage(accessToken, from, {
    to: recipient,
    subject: `Reminder: board vote needed — ${input.application.reference}`,
    body: boardReminderBody(input.application.reference, boardReviewUrl(input.application.id)),
  });
}
