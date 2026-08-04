import 'server-only';

import {connectPortalUrl, sendConnectEmail} from './email';
import type {ConnectProfile} from './types';

const COPY = {
  en: {
    subject: 'Confirm your private TCW Connect profile',
    body: (name: string, url: string) => `Hi ${name},\n\nOpen the private link below to confirm your email and activate your TCW Connect profile:\n\n${url}\n\nMatching will begin only after you open this link. Do not forward it; it gives access to your private TCW Connect page.\n\nWith care,\nTutti Cancer Warriors`,
  },
  ro: {
    subject: 'Confirmă profilul tău privat TCW Connect',
    body: (name: string, url: string) => `Bună, ${name},\n\nDeschide linkul privat de mai jos pentru a confirma adresa de email și a activa profilul TCW Connect:\n\n${url}\n\nPotrivirea va începe numai după ce deschizi acest link. Nu îl trimite altor persoane; oferă acces la pagina ta privată TCW Connect.\n\nCu grijă,\nTutti Cancer Warriors`,
  },
  es: {
    subject: 'Confirma tu perfil privado de TCW Connect',
    body: (name: string, url: string) => `Hola, ${name}:\n\nAbre el enlace privado para confirmar tu correo y activar tu perfil de TCW Connect:\n\n${url}\n\nLas coincidencias comenzarán solo después de abrir este enlace. No lo compartas; da acceso a tu página privada de TCW Connect.\n\nCon cariño,\nTutti Cancer Warriors`,
  },
} as const;

export async function sendConnectVerificationEmail(
  profile: ConnectProfile,
): Promise<void> {
  const copy = COPY[profile.locale];
  const mentorNote = profile.role === 'survivor'
    ? {
        en: '\n\nAfter email confirmation, your mentor profile will remain private while TCW verifies your identity and survivor experience. Matching begins only after approval.',
        ro: '\n\nDupă confirmarea emailului, profilul de mentor rămâne privat cât timp TCW verifică identitatea și experiența oncologică. Potrivirea începe numai după aprobare.',
        es: '\n\nDespués de confirmar el correo, tu perfil de mentor seguirá privado mientras TCW verifica tu identidad y experiencia. Las coincidencias comienzan solo tras la aprobación.',
      }[profile.locale]
    : '';
  await sendConnectEmail({
    to: profile.email,
    subject: copy.subject,
    body: `${copy.body(profile.firstName, connectPortalUrl(profile))}${mentorNote}`,
  });
}
