export const SITE_LOCALES = ['es', 'en', 'ro'] as const;

export type SiteLocale = (typeof SITE_LOCALES)[number];

export type RouteKey =
  | 'home'
  | 'team'
  | 'aboutCancer'
  | 'understandingDiagnosis'
  | 'questionsForDoctor'
  | 'emotionalWellBeing'
  | 'awarenessCalendar'
  | 'getInvolved'
  | 'donate'
  | 'volunteers'
  | 'peerSupport'
  | 'warriors'
  | 'connectSurvivor'
  | 'dreamApplication'
  | 'shareJourney'
  | 'moodBoost'
  | 'mensHealth'
  | 'kidneyCancer'
  | 'pilates'
  | 'privacy'
  | 'terms'
  | 'peerPolicy'
  | 'financials';

const ROUTES: Record<SiteLocale, Record<RouteKey, string>> = {
  es: {
    home: '',
    team: 'team',
    aboutCancer: 'sobre-cancer',
    understandingDiagnosis: 'entender-diagnostico',
    questionsForDoctor: 'preguntas-doctor',
    emotionalWellBeing: 'bienestar-emocional',
    awarenessCalendar: 'calendario-cancer',
    getInvolved: 'involucrate',
    donate: 'donar',
    volunteers: 'voluntarios',
    peerSupport: 'peer-support',
    warriors: 'warriors',
    connectSurvivor: 'connect-survivor',
    dreamApplication: 'dream-application',
    shareJourney: 'share-journey',
    moodBoost: 'warrior-mood-boost',
    mensHealth: 'mens-health-week',
    kidneyCancer: 'world-kidney-cancer-day',
    pilates: 'events/pilates-event',
    privacy: 'privacy',
    terms: 'terms',
    peerPolicy: 'peer-policy',
    financials: 'financials',
  },
  en: {
    home: '',
    team: 'team',
    aboutCancer: 'about-cancer',
    understandingDiagnosis: 'understanding-diagnosis',
    questionsForDoctor: 'questions-for-doctor',
    emotionalWellBeing: 'emotional-wellbeing',
    awarenessCalendar: 'cancer-awareness-calendar',
    getInvolved: 'get-involved',
    donate: 'donate',
    volunteers: 'volunteers',
    peerSupport: 'peer-support',
    warriors: 'warriors',
    connectSurvivor: 'connect-survivor',
    dreamApplication: 'dream-application',
    shareJourney: 'share-journey',
    moodBoost: 'warrior-mood-boost',
    mensHealth: 'mens-health-week',
    kidneyCancer: 'world-kidney-cancer-day',
    pilates: 'events/pilates-event',
    privacy: 'privacy',
    terms: 'terms',
    peerPolicy: 'peer-policy',
    financials: 'financials',
  },
  ro: {
    home: '',
    team: 'team',
    aboutCancer: 'despre-cancer',
    understandingDiagnosis: 'intelegerea-diagnosticului',
    questionsForDoctor: 'intrebari-pentru-medic',
    emotionalWellBeing: 'bunastare-emotionala',
    awarenessCalendar: 'calendar-oncologic',
    getInvolved: 'implica-te',
    donate: 'doneaza',
    volunteers: 'voluntari',
    peerSupport: 'peer-support',
    warriors: 'warriors',
    connectSurvivor: 'connect-survivor',
    dreamApplication: 'dream-application',
    shareJourney: 'share-journey',
    moodBoost: 'warrior-mood-boost',
    mensHealth: 'mens-health-week',
    kidneyCancer: 'world-kidney-cancer-day',
    pilates: 'events/pilates-event',
    privacy: 'privacy',
    terms: 'terms',
    peerPolicy: 'peer-policy',
    financials: 'financials',
  },
};

export function normalizeLocale(locale: string): SiteLocale {
  return SITE_LOCALES.includes(locale as SiteLocale) ? (locale as SiteLocale) : 'es';
}

export function localizedPath(localeInput: string, route: RouteKey): string {
  const locale = normalizeLocale(localeInput);
  const slug = ROUTES[locale][route];
  const prefix = locale === 'es' ? '' : `/${locale}`;

  if (!slug) return prefix || '/';
  return `${prefix}/${slug}`;
}

export function switchLocalePath(pathname: string, newLocaleInput: string): string {
  const newLocale = normalizeLocale(newLocaleInput);
  const segments = pathname.split(/[?#]/)[0].split('/').filter(Boolean);
  const currentLocale = SITE_LOCALES.includes(segments[0] as SiteLocale)
    ? (segments.shift() as SiteLocale)
    : 'es';
  const currentSlug = segments.join('/');

  const currentRoute = (Object.keys(ROUTES[currentLocale]) as RouteKey[]).find(
    (key) => ROUTES[currentLocale][key] === currentSlug,
  ) ?? (Object.keys(ROUTES.es) as RouteKey[]).find(
    (key) => SITE_LOCALES.some((locale) => ROUTES[locale][key] === currentSlug),
  );

  if (currentRoute) return localizedPath(newLocale, currentRoute);

  const prefix = newLocale === 'es' ? '' : `/${newLocale}`;
  return currentSlug ? `${prefix}/${currentSlug}` : prefix || '/';
}
