import 'server-only';

import {connectAccessPortalUrl, sendConnectEmail} from './email';
import type {ConnectProfile} from './types';

const COPY = {
  en: {
    reminderSubject: 'Reminder: your TCW Connect match is waiting',
    reminderBody: (name: string, url: string) => `Hi ${name},\n\nA private TCW Connect match is still waiting for your decision. Open your private page to review the limited profile and accept or decline:\n\n${url}\n\nThe proposal will expire automatically if no decision is made.\n\nTutti Cancer Warriors`,
    checkInSubject: 'How is your TCW Connect connection going?',
    checkInBody: (name: string, otherName: string, url: string, month: boolean) => `Hi ${name},\n\n${month ? 'It has been about one month' : 'It has been about one week'} since your TCW Connect conversation with ${otherName}.\n\nOpen your private page if you would like to continue, end the connection or request another match:\n\n${url}\n\nIf something felt unsafe or inappropriate, reply directly to this email so TCW can help.\n\nTutti Cancer Warriors`,
  },
  ro: {
    reminderSubject: 'Reamintire: potrivirea ta TCW Connect așteaptă',
    reminderBody: (name: string, url: string) => `Bună, ${name},\n\nO potrivire privată TCW Connect încă așteaptă decizia ta. Deschide pagina privată pentru a vedea profilul limitat și pentru a accepta sau refuza:\n\n${url}\n\nPropunerea va expira automat dacă nu este luată nicio decizie.\n\nTutti Cancer Warriors`,
    checkInSubject: 'Cum merge conexiunea ta TCW Connect?',
    checkInBody: (name: string, otherName: string, url: string, month: boolean) => `Bună, ${name},\n\nA trecut aproximativ ${month ? 'o lună' : 'o săptămână'} de la conversația TCW Connect cu ${otherName}.\n\nDeschide pagina privată dacă dorești să continuați, să închei conexiunea sau să ceri altă potrivire:\n\n${url}\n\nDacă ceva ți s-a părut nesigur sau nepotrivit, răspunde direct la acest email, iar TCW te va ajuta.\n\nTutti Cancer Warriors`,
  },
  es: {
    reminderSubject: 'Recordatorio: tu coincidencia de TCW Connect espera',
    reminderBody: (name: string, url: string) => `Hola, ${name}:\n\nUna coincidencia privada de TCW Connect sigue esperando tu decisión. Abre tu página privada para revisar el perfil limitado y aceptar o rechazar:\n\n${url}\n\nLa propuesta caducará automáticamente si no se toma una decisión.\n\nTutti Cancer Warriors`,
    checkInSubject: '¿Cómo va tu conexión de TCW Connect?',
    checkInBody: (name: string, otherName: string, url: string, month: boolean) => `Hola, ${name}:\n\nHa pasado aproximadamente ${month ? 'un mes' : 'una semana'} desde tu conversación de TCW Connect con ${otherName}.\n\nAbre tu página privada si deseas continuar, finalizar la conexión o pedir otra coincidencia:\n\n${url}\n\nSi algo te pareció inseguro o inapropiado, responde directamente a este correo para que TCW pueda ayudarte.\n\nTutti Cancer Warriors`,
  },
} as const;

export async function sendConnectProposalReminder(
  profile: ConnectProfile,
): Promise<void> {
  const copy = COPY[profile.locale];
  await sendConnectEmail({
    to: profile.email,
    subject: copy.reminderSubject,
    body: copy.reminderBody(profile.firstName, await connectAccessPortalUrl(profile)),
  });
}

export async function sendConnectCheckIn(input: {
  profile: ConnectProfile;
  counterpart: ConnectProfile;
  month: boolean;
}): Promise<void> {
  const copy = COPY[input.profile.locale];
  await sendConnectEmail({
    to: input.profile.email,
    subject: copy.checkInSubject,
    body: copy.checkInBody(
      input.profile.firstName,
      input.counterpart.firstName,
      await connectAccessPortalUrl(input.profile),
      input.month,
    ),
  });
}
