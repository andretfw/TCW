import createMiddleware from 'next-intl/middleware';
import {locales} from './i18n';

export default createMiddleware({
  locales,
  defaultLocale: 'es',
  localePrefix: 'always',
  pathnames: {
    '/': '/',
    '/team': {
      es: '/equipo',
      en: '/team',
      ro: '/echipa'
    },
    '/sobre-cancer': {
      es: '/sobre-cancer',
      en: '/about-cancer',
      ro: '/despre-cancer'
    },
    '/entender-diagnostico': {
      es: '/entender-diagnostico',
      en: '/understanding-diagnosis',
      ro: '/intelegerea-diagnosticului'
    },
    '/preguntas-doctor': {
      es: '/preguntas-doctor',
      en: '/questions-for-doctor',
      ro: '/intrebari-pentru-medic'
    },
    '/bienestar-emocional': {
      es: '/bienestar-emocional',
      en: '/emotional-wellbeing',
      ro: '/bunastare-emotionala'
    },
    '/calendario-cancer': {
      es: '/calendario-cancer',
      en: '/cancer-awareness-calendar',
      ro: '/calendar-oncologic'
    },
    '/involucrate': {
      es: '/involucrate',
      en: '/get-involved',
      ro: '/implica-te'
    },
    '/donar': {
      es: '/donar',
      en: '/donate',
      ro: '/doneaza'
    },
    '/voluntarios': {
      es: '/voluntarios',
      en: '/volunteers',
      ro: '/voluntari'
    },
    '/peer-support': {
      es: '/apoyo-entre-pares',
      en: '/peer-support',
      ro: '/sprijin-intre-pacienti'
    },
    '/support-dream': {
      es: '/apoya-un-sueno',
      en: '/support-a-dream',
      ro: '/sustine-un-vis'
    },
    '/warriors': {
      es: '/guerreros',
      en: '/warriors',
      ro: '/luptatori'
    },
    '/connect-survivor': {
      es: '/conecta-con-un-superviviente',
      en: '/connect-with-a-survivor',
      ro: '/conecteaza-te-cu-un-supravietuitor'
    },
    '/dream-application': {
      es: '/solicitud-sueno',
      en: '/dream-support-application',
      ro: '/cerere-sprijin-vis'
    },
    '/share-journey': {
      es: '/comparte-tu-historia',
      en: '/share-your-journey',
      ro: '/impartaseste-ti-povestea'
    },
    '/warrior-mood-boost': {
      es: '/animo-para-guerreros',
      en: '/warrior-mood-boost',
      ro: '/doza-de-incurajare'
    },
    '/mens-health-week': {
      es: '/semana-salud-masculina',
      en: '/mens-health-week',
      ro: '/saptamana-sanatatii-barbatilor'
    },
    '/world-kidney-cancer-day': {
      es: '/dia-mundial-cancer-rinon',
      en: '/world-kidney-cancer-day',
      ro: '/ziua-mondiala-cancer-renal'
    },
    '/events/pilates-event': {
      es: '/eventos/evento-pilates',
      en: '/events/pilates-event',
      ro: '/evenimente/eveniment-pilates'
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
    '/peer-policy': {
      es: '/politica-apoyo-entre-pares',
      en: '/peer-support-policy',
      ro: '/politica-sprijin-intre-pacienti'
    },
    '/financials': {
      es: '/transparencia',
      en: '/financials',
      ro: '/transparenta-financiara'
    }
  }
});

export const config = {
  matcher: ['/', '/(es|en|ro)/:path*', '/((?!_next|_vercel|.*\\..*).*)']
};
