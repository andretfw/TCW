import createMiddleware from 'next-intl/middleware';
import {locales} from './i18n';

export default createMiddleware({
  locales,
  defaultLocale: 'es',
  localePrefix: 'always', // Forzamos el prefijo para evitar las discrepancias de Andrea
  
  pathnames: {
    '/': '/',
    
    // Páginas principales
    '/donar': {
      es: '/donar',
      en: '/donate',
      ro: '/doneaza'
    },
    '/involucrate': {
      es: '/involucrate',
      en: '/get-involved', // Punto 4 y 5 de Andrea
      ro: '/implica-te'
    },
    '/team': {
      es: '/equipo',
      en: '/team',
      ro: '/echipa'
    },
    '/warriors': {
      es: '/guerreros',
      en: '/warriors',
      ro: '/razboinici'
    },

    // Páginas de Salud y Bienestar (Captura 1)
    '/bienestar-emocional': {
      es: '/bienestar-emocional',
      en: '/emotional-wellbeing',
      ro: '/bunastare-emotionala'
    },
    '/calendario-cancer': {
      es: '/calendario-cancer',
      en: '/cancer-calendar',
      ro: '/calendar-cancer'
    },
    '/entender-diagnostico': {
      es: '/entender-diagnostico',
      en: '/understanding-diagnosis',
      ro: '/intelegerea-diagnosticului'
    },
    '/preguntas-doctor': {
      es: '/preguntas-doctor',
      en: '/questions-for-doctor',
      ro: '/intrebari-pentru-doctor'
    },
    '/sobre-cancer': {
      es: '/sobre-cancer',
      en: '/about-cancer',
      ro: '/despre-cancer'
    },

    // Eventos y Dream (Captura 2)
    '/events/pilates-event': {
      es: '/eventos/evento-pilates', // Punto 7 de Andrea
      en: '/events/pilates-event',
      ro: '/evenimente/eveniment-pilates'
    },
    '/support-dream': {
      es: '/apoya-un-sueno',
      en: '/support-a-dream',
      ro: '/sustine-un-vis'
    },
    '/dream-application': {
      es: '/solicitud-sueno',
      en: '/dream-application',
      ro: '/cerere-vis'
    },

    // Políticas y Legal
    '/peer-policy': {
      es: '/politica-companeros',
      en: '/peer-policy', // La que Andrea dice que desapareció
      ro: '/politica-pe-pair'
    },
    '/privacy': {
      es: '/privacidad',
      en: '/privacy',
      ro: '/confidentialitate'
    },
    '/terms': {
      es: '/terminos',
      en: '/terms',
      ro: '/termeni'
    },
    '/financials': {
      es: '/transparencia', // Punto 1 del textato viejo
      en: '/financials',
      ro: '/financiare'
    },

    // Otros
    '/connect-survivor': {
      es: '/conecta-con-superviviente',
      en: '/connect-with-a-survivor',
      ro: '/conecteaza-te-cu-un-supravietuitor'
    },
    '/voluntarios': {
      es: '/voluntarios',
      en: '/volunteers',
      ro: '/voluntari'
    }
  }
});

export const config = {
  // Matcher optimizado para ignorar estáticos y coger todas tus rutas
  matcher: ['/', '/(es|en|ro)/:path*', '/((?!_next|_vercel|.*\\..*).*)']
};