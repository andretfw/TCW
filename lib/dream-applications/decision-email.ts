import 'server-only';

import {
  getGoogleWorkspaceAccessToken,
  GOOGLE_GMAIL_SEND_SCOPE,
  googleWorkspaceAccountEmail,
} from './google-drive';
import type {
  DreamApplicantEmailKind,
  DreamApplicationRecord,
} from './types';

const GMAIL_SEND_URL = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send';

interface GmailSendResponse {
  id?: string;
  error?: {
    message?: string;
  };
}

export interface DreamApplicantEmailPreview {
  kind: DreamApplicantEmailKind;
  to: string;
  subject: string;
  body: string;
}

type LocaleCopy = Record<
  DreamApplicationRecord['locale'],
  {
    moreInfoSubject: (reference: string) => string;
    moreInfoBody: (firstName: string, reference: string, request: string) => string;
    approvedSubject: (reference: string) => string;
    approvedBody: (firstName: string, reference: string) => string;
    declinedSubject: (reference: string) => string;
    declinedBody: (firstName: string, reference: string) => string;
  }
>;

const COPY: LocaleCopy = {
  en: {
    moreInfoSubject: (reference) => `More information needed for your TCW Dream application — ${reference}`,
    moreInfoBody: (firstName, reference, request) => `Hi, dear ${firstName} 💜

Thank you for your Dream Support application.

Before our board can continue reviewing application ${reference}, we need the following information:

${request}

Please reply directly to this email and include your application number ${reference}.

With care,
Tutti Cancer Warriors
tutticancerwarriors.org`,
    approvedSubject: (reference) => `Your TCW Dream application has been approved — ${reference}`,
    approvedBody: (firstName, reference) => `Hi, dear ${firstName} 💜

We are happy to let you know that the TCW board has approved your Dream Support application ${reference}.

Your application can now move to the next preparation stage. This is not yet confirmation that funds have been transferred or arrangements completed. We will contact you shortly about the contract and next steps.

With hugs,
Tutti Cancer Warriors
tutticancerwarriors.org`,
    declinedSubject: (reference) => `Update about your TCW Dream application — ${reference}`,
    declinedBody: (firstName, reference) => `Hi, dear ${firstName} 💜

Thank you for trusting us with your Dream Support application ${reference}.

After careful review, our board was unable to approve the application at this time. This decision does not diminish your story, your strength, or the importance of your dream.

We are sending you our warmest thoughts.

With care,
Tutti Cancer Warriors
tutticancerwarriors.org`,
  },
  ro: {
    moreInfoSubject: (reference) => `Avem nevoie de informații suplimentare pentru cererea TCW Dream — ${reference}`,
    moreInfoBody: (firstName, reference, request) => `Bună, dragă ${firstName} 💜

Îți mulțumim pentru cererea Dream Support.

Înainte ca boardul nostru să poată continua analiza cererii ${reference}, avem nevoie de următoarele informații:

${request}

Te rugăm să răspunzi direct la acest e-mail și să menționezi numărul cererii ${reference}.

Cu drag,
Tutti Cancer Warriors
tutticancerwarriors.org`,
    approvedSubject: (reference) => `Cererea ta TCW Dream a fost aprobată — ${reference}`,
    approvedBody: (firstName, reference) => `Bună, dragă ${firstName} 💜

Ne bucurăm să îți spunem că boardul TCW a aprobat cererea ta Dream Support ${reference}.

Cererea poate trece acum la etapa următoare de pregătire. Acest mesaj nu reprezintă încă o confirmare că fondurile au fost transferate sau că toate aranjamentele au fost finalizate. Te vom contacta în curând pentru contract și pașii următori.

Cu drag și îmbrățișări,
Tutti Cancer Warriors
tutticancerwarriors.org`,
    declinedSubject: (reference) => `Actualizare privind cererea ta TCW Dream — ${reference}`,
    declinedBody: (firstName, reference) => `Bună, dragă ${firstName} 💜

Îți mulțumim pentru încrederea cu care ne-ai trimis cererea Dream Support ${reference}.

După o analiză atentă, boardul nostru nu a putut aproba cererea în acest moment. Această decizie nu diminuează povestea ta, puterea ta sau importanța visului tău.

Îți trimitem cele mai calde gânduri.

Cu drag,
Tutti Cancer Warriors
tutticancerwarriors.org`,
  },
  es: {
    moreInfoSubject: (reference) => `Necesitamos más información para tu solicitud TCW Dream — ${reference}`,
    moreInfoBody: (firstName, reference, request) => `Hola, querida ${firstName} 💜

Gracias por tu solicitud de Dream Support.

Antes de que nuestro equipo pueda continuar revisando la solicitud ${reference}, necesitamos la siguiente información:

${request}

Por favor, responde directamente a este correo e incluye el número de solicitud ${reference}.

Con cariño,
Tutti Cancer Warriors
tutticancerwarriors.org`,
    approvedSubject: (reference) => `Tu solicitud TCW Dream ha sido aprobada — ${reference}`,
    approvedBody: (firstName, reference) => `Hola, querida ${firstName} 💜

Nos alegra comunicarte que el equipo de TCW ha aprobado tu solicitud de Dream Support ${reference}.

Tu solicitud puede pasar ahora a la siguiente etapa de preparación. Este mensaje todavía no confirma que los fondos hayan sido transferidos ni que los preparativos estén finalizados. Nos pondremos en contacto contigo pronto para el contrato y los próximos pasos.

Con un abrazo,
Tutti Cancer Warriors
tutticancerwarriors.org`,
    declinedSubject: (reference) => `Actualización sobre tu solicitud TCW Dream — ${reference}`,
    declinedBody: (firstName, reference) => `Hola, querida ${firstName} 💜

Gracias por confiar en nosotros con tu solicitud de Dream Support ${reference}.

Después de revisarla cuidadosamente, nuestro equipo no ha podido aprobar la solicitud en este momento. Esta decisión no disminuye tu historia, tu fortaleza ni la importancia de tu sueño.

Te enviamos nuestros mejores deseos.

Con cariño,
Tutti Cancer Warriors
tutticancerwarriors.org`,
  },
};

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

function rawMessage(from: string, preview: DreamApplicantEmailPreview): string {
  const safeFrom = sanitizeHeader(from);
  const safeTo = sanitizeHeader(preview.to);
  if (!safeFrom || !safeTo || /[<>]/.test(safeTo)) {
    throw new Error('The email address is invalid.');
  }

  const encodedBody = wrapBase64(Buffer.from(preview.body, 'utf8').toString('base64'));
  const mime = [
    `From: Tutti Cancer Warriors <${safeFrom}>`,
    `Reply-To: ${safeFrom}`,
    `To: ${safeTo}`,
    `Subject: ${encodeHeader(preview.subject)}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    encodedBody,
  ].join('\r\n');

  return Buffer.from(mime, 'utf8').toString('base64url');
}

export function buildDreamApplicantDecisionEmail(input: {
  application: DreamApplicationRecord;
  kind: DreamApplicantEmailKind;
  informationRequest?: string;
}): DreamApplicantEmailPreview {
  const {application, kind} = input;
  const copy = COPY[application.locale];
  const name = firstName(application.fullName);

  if (kind === 'more_info_requested') {
    const request = input.informationRequest?.trim() || '';
    if (!request) throw new Error('The requested information is required.');
    return {
      kind,
      to: application.email,
      subject: copy.moreInfoSubject(application.reference),
      body: copy.moreInfoBody(name, application.reference, request),
    };
  }

  if (kind === 'approved') {
    return {
      kind,
      to: application.email,
      subject: copy.approvedSubject(application.reference),
      body: copy.approvedBody(name, application.reference),
    };
  }

  return {
    kind,
    to: application.email,
    subject: copy.declinedSubject(application.reference),
    body: copy.declinedBody(name, application.reference),
  };
}

export async function sendDreamApplicantDecisionEmail(
  preview: DreamApplicantEmailPreview,
): Promise<void> {
  const accessToken = await getGoogleWorkspaceAccessToken(GOOGLE_GMAIL_SEND_SCOPE);
  const from = googleWorkspaceAccountEmail();
  const response = await fetch(GMAIL_SEND_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({raw: rawMessage(from, preview)}),
    cache: 'no-store',
    signal: AbortSignal.timeout(15_000),
  });
  const payload = await response.json().catch(() => ({})) as GmailSendResponse;
  if (!response.ok || !payload.id) {
    throw new Error(payload.error?.message || `Gmail returned ${response.status}.`);
  }
}
