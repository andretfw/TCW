import 'server-only';

import {
  getGoogleWorkspaceAccessToken,
  GOOGLE_GMAIL_SEND_SCOPE,
  googleWorkspaceAccountEmail,
} from '@/lib/dream-applications/google-drive';

import type {
  ConnectConnection,
  ConnectLocale,
  ConnectProfile,
} from './types';

const GMAIL_SEND_URL = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send';
const DEFAULT_SITE_URL = 'https://tutticancerwarriors.org';

interface GmailSendResponse {
  id?: string;
  error?: {message?: string};
}

interface EmailMessage {
  to: string;
  subject: string;
  body: string;
}

const COPY: Record<ConnectLocale, {
  welcomeSubject: string;
  welcomeBody: (name: string, url: string) => string;
  proposalSubject: string;
  proposalBody: (name: string, url: string) => string;
  nextStepSubject: string;
  nextStepBody: (name: string, url: string) => string;
  connectedSubject: string;
  connectedBody: (name: string, otherName: string, url: string) => string;
  scheduledSubject: string;
  scheduledBody: (
    name: string,
    otherName: string,
    startsAt: string,
    meetUrl: string,
    portalUrl: string,
  ) => string;
}> = {
  en: {
    welcomeSubject: 'Your private TCW Connect profile is ready',
    welcomeBody: (name, url) => `Hi ${name},\n\nYour TCW Connect profile is active. We will automatically look for a compatible peer-support connection.\n\nUse this private link to review matches, pause your profile or manage a connection:\n${url}\n\nDo not forward this link. It gives access to your private TCW Connect page.\n\nWith care,\nTutti Cancer Warriors`,
    proposalSubject: 'A TCW Connect match is waiting for you',
    proposalBody: (name, url) => `Hi ${name},\n\nWe found a compatible peer-support match. Open your private TCW Connect page to see the limited profile and accept or decline.\n\n${url}\n\nYour contact details are not shared unless both people accept.\n\nTutti Cancer Warriors`,
    nextStepSubject: 'Your TCW Connect match accepted',
    nextStepBody: (name, url) => `Hi ${name},\n\nThe proposed peer-support connection has accepted. Open your private page to review the limited profile and decide whether you would like to connect.\n\n${url}\n\nTutti Cancer Warriors`,
    connectedSubject: 'Your TCW Connect connection is confirmed',
    connectedBody: (name, otherName, url) => `Hi ${name},\n\nYou and ${otherName} both accepted the connection. TCW is now finding the first compatible time from the availability you selected.\n\nManage the connection here:\n${url}\n\nTutti Cancer Warriors`,
    scheduledSubject: 'Your TCW Connect Google Meet is scheduled',
    scheduledBody: (name, otherName, startsAt, meetUrl, portalUrl) => `Hi ${name},\n\nYour first TCW Connect conversation with ${otherName} is scheduled for:\n${startsAt}\n\nJoin Google Meet:\n${meetUrl}\n\nManage or end the connection:\n${portalUrl}\n\nThis is peer support, not medical care. Please do not record or transcribe the conversation.\n\nTutti Cancer Warriors`,
  },
  ro: {
    welcomeSubject: 'Profilul tău privat TCW Connect este pregătit',
    welcomeBody: (name, url) => `Bună, ${name},\n\nProfilul tău TCW Connect este activ. Sistemul va căuta automat o conexiune compatibilă de sprijin între persoane cu experiență oncologică.\n\nFolosește linkul privat pentru a vedea potrivirile, a pune profilul pe pauză sau a administra conexiunea:\n${url}\n\nNu trimite acest link altor persoane. El oferă acces la pagina ta privată TCW Connect.\n\nCu grijă,\nTutti Cancer Warriors`,
    proposalSubject: 'Ai o potrivire nouă în TCW Connect',
    proposalBody: (name, url) => `Bună, ${name},\n\nAm găsit o potrivire compatibilă pentru sprijin. Deschide pagina ta privată TCW Connect pentru a vedea profilul limitat și pentru a accepta sau refuza.\n\n${url}\n\nDatele de contact nu sunt distribuite decât dacă ambele persoane acceptă.\n\nTutti Cancer Warriors`,
    nextStepSubject: 'Potrivirea ta TCW Connect a acceptat',
    nextStepBody: (name, url) => `Bună, ${name},\n\nPersoana propusă a acceptat conexiunea. Deschide pagina privată pentru a vedea profilul limitat și pentru a decide dacă dorești să vă conectați.\n\n${url}\n\nTutti Cancer Warriors`,
    connectedSubject: 'Conexiunea ta TCW Connect este confirmată',
    connectedBody: (name, otherName, url) => `Bună, ${name},\n\nTu și ${otherName} ați acceptat conexiunea. TCW caută acum automat primul interval compatibil din disponibilitatea selectată.\n\nAdministrează conexiunea aici:\n${url}\n\nTutti Cancer Warriors`,
    scheduledSubject: 'Întâlnirea ta TCW Connect pe Google Meet a fost programată',
    scheduledBody: (name, otherName, startsAt, meetUrl, portalUrl) => `Bună, ${name},\n\nPrima conversație TCW Connect cu ${otherName} este programată pentru:\n${startsAt}\n\nIntră pe Google Meet:\n${meetUrl}\n\nAdministrează sau încheie conexiunea:\n${portalUrl}\n\nAcesta este sprijin între persoane, nu îngrijire medicală. Te rugăm să nu înregistrezi sau transcrii conversația.\n\nTutti Cancer Warriors`,
  },
  es: {
    welcomeSubject: 'Tu perfil privado de TCW Connect está listo',
    welcomeBody: (name, url) => `Hola, ${name}:\n\nTu perfil de TCW Connect está activo. El sistema buscará automáticamente una conexión de apoyo compatible.\n\nUsa este enlace privado para revisar coincidencias, pausar tu perfil o gestionar una conexión:\n${url}\n\nNo compartas este enlace. Da acceso a tu página privada de TCW Connect.\n\nCon cariño,\nTutti Cancer Warriors`,
    proposalSubject: 'Tienes una nueva coincidencia en TCW Connect',
    proposalBody: (name, url) => `Hola, ${name}:\n\nEncontramos una coincidencia compatible para apoyo entre pares. Abre tu página privada de TCW Connect para ver el perfil limitado y aceptar o rechazar.\n\n${url}\n\nLos datos de contacto no se comparten hasta que ambas personas acepten.\n\nTutti Cancer Warriors`,
    nextStepSubject: 'Tu coincidencia de TCW Connect ha aceptado',
    nextStepBody: (name, url) => `Hola, ${name}:\n\nLa conexión propuesta ha aceptado. Abre tu página privada para revisar el perfil limitado y decidir si deseas conectar.\n\n${url}\n\nTutti Cancer Warriors`,
    connectedSubject: 'Tu conexión de TCW Connect está confirmada',
    connectedBody: (name, otherName, url) => `Hola, ${name}:\n\nTú y ${otherName} habéis aceptado la conexión. TCW está buscando automáticamente el primer horario compatible según vuestra disponibilidad.\n\nGestiona la conexión aquí:\n${url}\n\nTutti Cancer Warriors`,
    scheduledSubject: 'Tu Google Meet de TCW Connect está programado',
    scheduledBody: (name, otherName, startsAt, meetUrl, portalUrl) => `Hola, ${name}:\n\nTu primera conversación de TCW Connect con ${otherName} está programada para:\n${startsAt}\n\nÚnete a Google Meet:\n${meetUrl}\n\nGestiona o finaliza la conexión:\n${portalUrl}\n\nEsto es apoyo entre pares, no atención médica. No grabes ni transcribas la conversación.\n\nTutti Cancer Warriors`,
  },
};

function portalPath(locale: ConnectLocale): string {
  if (locale === 'ro') {
    return '/ro/conecteaza-te-cu-un-supravietuitor/conexiunea-mea';
  }
  if (locale === 'es') {
    return '/es/conecta-con-un-superviviente/mi-conexion';
  }
  return '/en/connect-with-a-survivor/my-connection';
}

export function connectPortalUrl(profile: ConnectProfile): string {
  const url = new URL(
    portalPath(profile.locale),
    process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL,
  );
  url.searchParams.set('token', profile.portalToken);
  return url.toString();
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
  const body = wrapBase64(Buffer.from(message.body, 'utf8').toString('base64'));
  const mime = [
    `From: Tutti Cancer Warriors <${safeFrom}>`,
    `Reply-To: ${safeFrom}`,
    `To: ${safeTo}`,
    `Subject: ${encodeHeader(message.subject)}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    body,
  ].join('\r\n');
  return Buffer.from(mime, 'utf8').toString('base64url');
}

export async function sendConnectEmail(message: EmailMessage): Promise<void> {
  const accessToken = await getGoogleWorkspaceAccessToken(GOOGLE_GMAIL_SEND_SCOPE);
  const from = googleWorkspaceAccountEmail();
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

export async function sendConnectWelcomeEmail(profile: ConnectProfile): Promise<void> {
  const copy = COPY[profile.locale];
  await sendConnectEmail({
    to: profile.email,
    subject: copy.welcomeSubject,
    body: copy.welcomeBody(profile.firstName, connectPortalUrl(profile)),
  });
}

export async function sendMatchProposalEmail(profile: ConnectProfile): Promise<void> {
  const copy = COPY[profile.locale];
  await sendConnectEmail({
    to: profile.email,
    subject: copy.proposalSubject,
    body: copy.proposalBody(profile.firstName, connectPortalUrl(profile)),
  });
}

export async function sendWarriorDecisionEmail(profile: ConnectProfile): Promise<void> {
  const copy = COPY[profile.locale];
  await sendConnectEmail({
    to: profile.email,
    subject: copy.nextStepSubject,
    body: copy.nextStepBody(profile.firstName, connectPortalUrl(profile)),
  });
}

export async function sendConnectionConfirmedEmail(
  profile: ConnectProfile,
  counterpart: ConnectProfile,
): Promise<void> {
  const copy = COPY[profile.locale];
  await sendConnectEmail({
    to: profile.email,
    subject: copy.connectedSubject,
    body: copy.connectedBody(
      profile.firstName,
      counterpart.firstName,
      connectPortalUrl(profile),
    ),
  });
}

export async function sendMeetingScheduledEmail(
  profile: ConnectProfile,
  counterpart: ConnectProfile,
  connection: ConnectConnection,
): Promise<void> {
  if (!connection.meeting) return;
  const copy = COPY[profile.locale];
  const startsAt = new Intl.DateTimeFormat(
    profile.locale === 'ro' ? 'ro-RO' : profile.locale === 'es' ? 'es-ES' : 'en-GB',
    {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: profile.timezone,
    },
  ).format(new Date(connection.meeting.startsAt));
  await sendConnectEmail({
    to: profile.email,
    subject: copy.scheduledSubject,
    body: copy.scheduledBody(
      profile.firstName,
      counterpart.firstName,
      startsAt,
      connection.meeting.meetUrl,
      connectPortalUrl(profile),
    ),
  });
}

export async function sendConnectExceptionAlert(input: {
  reference: string;
  reason: string;
}): Promise<void> {
  const to = googleWorkspaceAccountEmail();
  await sendConnectEmail({
    to,
    subject: `TCW Connect needs attention — ${input.reference}`,
    body: `A TCW Connect case needs manual attention.\n\nReference: ${input.reference}\nReason: ${input.reason}\n\nNo participant health information is included in this email.`,
  });
}
