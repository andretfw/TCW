import 'server-only';

import {connectPortalUrl, sendConnectEmail} from './email';
import type {ConnectProfile} from './types';

const COPY = {
  en: {
    subject: 'Your secure TCW Connect sign-in link',
    body: (name: string, url: string) => `Hi ${name},\n\nUse the secure link below to access your TCW Connect profile, see your matching status and manage any connection or meeting:\n\n${url}\n\nThe link signs you in on this device. Do not forward it. If you did not request access, you can ignore this email.\n\nWith care,\nTutti Cancer Warriors`,
  },
  ro: {
    subject: 'Linkul tău securizat de acces TCW Connect',
    body: (name: string, url: string) => `Bună, ${name},\n\nFolosește linkul securizat de mai jos pentru a accesa profilul TCW Connect, a vedea stadiul potrivirii și a administra orice conexiune sau întâlnire:\n\n${url}\n\nLinkul te autentifică pe acest dispozitiv. Nu îl trimite altor persoane. Dacă nu ai solicitat accesul, poți ignora acest email.\n\nCu grijă,\nTutti Cancer Warriors`,
  },
  es: {
    subject: 'Tu enlace seguro de acceso a TCW Connect',
    body: (name: string, url: string) => `Hola ${name}:\n\nUsa el enlace seguro para acceder a tu perfil de TCW Connect, revisar el estado de la coincidencia y gestionar cualquier conexión o reunión:\n\n${url}\n\nEl enlace inicia sesión en este dispositivo. No lo compartas. Si no solicitaste acceso, puedes ignorar este correo.\n\nCon cariño,\nTutti Cancer Warriors`,
  },
} as const;

export async function sendConnectAccessEmail(profile: ConnectProfile): Promise<void> {
  const copy = COPY[profile.locale];
  await sendConnectEmail({
    to: profile.email,
    subject: copy.subject,
    body: copy.body(profile.firstName, connectPortalUrl(profile)),
  });
}
