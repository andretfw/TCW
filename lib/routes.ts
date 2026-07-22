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
  | 'supportDream'
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

export const ROUTES: Record<SiteLocale, Record<RouteKey, string>> = {
  es: {
    home: '', team: 'equipo', aboutCancer: 'sobre-cancer', understandingDiagnosis: 'entender-diagnostico',
    questionsForDoctor: 'preguntas-doctor', emotionalWellBeing: 'bienestar-emocional', awarenessCalendar: 'calendario-cancer',
    getInvolved: 'involucrate', donate: 'donar', volunteers: 'voluntarios', peerSupport: 'apoyo-entre-pares',
    supportDream: 'apoya-un-sueno', warriors: 'guerreros', connectSurvivor: 'conecta-con-un-superviviente',
    dreamApplication: 'solicitud-sueno', shareJourney: 'comparte-tu-historia', moodBoost: 'animo-para-guerreros',
    mensHealth: 'semana-salud-masculina', kidneyCancer: 'dia-mundial-cancer-rinon', pilates: 'eventos/evento-pilates',
    privacy: 'privacidad', terms: 'terminos', peerPolicy: 'politica-apoyo-entre-pares', financials: 'transparencia',
  },
  en: {
    home: '', team: 'team', aboutCancer: 'about-cancer', understandingDiagnosis: 'understanding-diagnosis',
    questionsForDoctor: 'questions-for-doctor', emotionalWellBeing: 'emotional-wellbeing', awarenessCalendar: 'cancer-awareness-calendar',
    getInvolved: 'get-involved', donate: 'donate', volunteers: 'volunteers', peerSupport: 'peer-support',
    supportDream: 'support-a-dream', warriors: 'warriors', connectSurvivor: 'connect-with-a-survivor',
    dreamApplication: 'dream-support-application', shareJourney: 'share-your-journey', moodBoost: 'warrior-mood-boost',
    mensHealth: 'mens-health-week', kidneyCancer: 'world-kidney-cancer-day', pilates: 'events/pilates-event',
    privacy: 'privacy', terms: 'terms', peerPolicy: 'peer-support-policy', financials: 'financials',
  },
  ro: {
    home: '', team: 'echipa', aboutCancer: 'despre-cancer', understandingDiagnosis: 'intelegerea-diagnosticului',
    questionsForDoctor: 'intrebari-pentru-medic', emotionalWellBeing: 'bunastare-emotionala', awarenessCalendar: 'calendar-oncologic',
    getInvolved: 'implica-te', donate: 'doneaza', volunteers: 'voluntari', peerSupport: 'sprijin-intre-pacienti',
    supportDream: 'sustine-un-vis', warriors: 'luptatori', connectSurvivor: 'conecteaza-te-cu-un-supravietuitor',
    dreamApplication: 'cerere-sprijin-vis', shareJourney: 'impartaseste-ti-povestea', moodBoost: 'doza-de-incurajare',
    mensHealth: 'saptamana-sanatatii-barbatilor', kidneyCancer: 'ziua-mondiala-cancer-renal', pilates: 'evenimente/eveniment-pilates',
    privacy: 'confidentialitate', terms: 'termeni', peerPolicy: 'politica-sprijin-intre-pacienti', financials: 'transparenta-financiara',
  },
};

export const INTERNAL_ROUTE_SLUGS: Record<RouteKey, string> = {
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
  supportDream: 'support-dream',
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
};

export const CANCER_SLUGS = {
  es: {
    breast: 'mama', lung: 'pulmon', colorectal: 'colorrectal', prostate: 'prostata', skin: 'piel', kidney: 'rinon',
    leukemia: 'leucemia', liver: 'higado', pancreatic: 'pancreas', ovarian: 'ovario', childhood: 'infantil', brain: 'cerebro',
    bladder: 'vejiga', cervical: 'cuello-uterino', stomach: 'estomago', testicular: 'testiculo', thyroid: 'tiroides', uterine: 'utero',
    lymphoma: 'linfoma', myeloma: 'mieloma', esophageal: 'esofago', 'head-neck': 'cabeza-cuello', bone: 'hueso', sarcoma: 'sarcoma',
    gallbladder: 'vesicula-biliar', 'bile-duct': 'vias-biliares', anal: 'anal', penile: 'pene', vaginal: 'vagina', vulvar: 'vulva',
    eye: 'ojo', oral: 'boca', throat: 'garganta', 'small-intestine': 'intestino-delgado', thymus: 'timo',
  },
  en: {
    breast: 'breast', lung: 'lung', colorectal: 'colorectal', prostate: 'prostate', skin: 'skin', kidney: 'kidney',
    leukemia: 'leukemia', liver: 'liver', pancreatic: 'pancreatic', ovarian: 'ovarian', childhood: 'childhood', brain: 'brain',
    bladder: 'bladder', cervical: 'cervical', stomach: 'stomach', testicular: 'testicular', thyroid: 'thyroid', uterine: 'uterine',
    lymphoma: 'lymphoma', myeloma: 'myeloma', esophageal: 'esophageal', 'head-neck': 'head-neck', bone: 'bone', sarcoma: 'sarcoma',
    gallbladder: 'gallbladder', 'bile-duct': 'bile-duct', anal: 'anal', penile: 'penile', vaginal: 'vaginal', vulvar: 'vulvar',
    eye: 'eye', oral: 'oral', throat: 'throat', 'small-intestine': 'small-intestine', thymus: 'thymus',
  },
  ro: {
    breast: 'san', lung: 'plaman', colorectal: 'colorectal', prostate: 'prostata', skin: 'piele', kidney: 'rinichi',
    leukemia: 'leucemie', liver: 'ficat', pancreatic: 'pancreas', ovarian: 'ovarian', childhood: 'copii', brain: 'creier',
    bladder: 'vezica', cervical: 'col-uterin', stomach: 'stomac', testicular: 'testicular', thyroid: 'tiroida', uterine: 'uter',
    lymphoma: 'limfom', myeloma: 'mielom', esophageal: 'esofag', 'head-neck': 'cap-gat', bone: 'os', sarcoma: 'sarcom',
    gallbladder: 'vezica-biliara', 'bile-duct': 'cai-biliare', anal: 'anal', penile: 'penis', vaginal: 'vaginal', vulvar: 'vulvar',
    eye: 'ochi', oral: 'oral', throat: 'gat', 'small-intestine': 'intestin-subtire', thymus: 'timus',
  },
} as const;

export type CancerId = keyof typeof CANCER_SLUGS.en;

export function normalizeLocale(locale: string): SiteLocale {
  return SITE_LOCALES.includes(locale as SiteLocale) ? (locale as SiteLocale) : 'es';
}

export function localizedPath(localeInput: string, route: RouteKey): string {
  const locale = normalizeLocale(localeInput);
  const slug = ROUTES[locale][route];
  return slug ? `/${locale}/${slug}` : `/${locale}`;
}

export function localizedCancerPath(localeInput: string, cancerId: string): string {
  const locale = normalizeLocale(localeInput);
  const slug = CANCER_SLUGS[locale][cancerId as CancerId] ?? cancerId;
  return `${localizedPath(locale, 'aboutCancer')}/${slug}`;
}

export function cancerIdFromSlug(localeInput: string, slug: string): CancerId | undefined {
  const locale = normalizeLocale(localeInput);
  return (Object.keys(CANCER_SLUGS[locale]) as CancerId[]).find((id) => CANCER_SLUGS[locale][id] === slug)
    ?? (Object.keys(CANCER_SLUGS.en) as CancerId[]).find((id) => id === slug);
}

export function resolveRouteKey(slug: string): RouteKey | undefined {
  const routeKeys = Object.keys(INTERNAL_ROUTE_SLUGS) as RouteKey[];
  return routeKeys.find((key) =>
    INTERNAL_ROUTE_SLUGS[key] === slug || SITE_LOCALES.some((locale) => ROUTES[locale][key] === slug),
  );
}

export function switchLocalePath(pathname: string, newLocaleInput: string): string {
  const newLocale = normalizeLocale(newLocaleInput);
  const segments = pathname.split(/[?#]/)[0].split('/').filter(Boolean);
  const currentLocale = SITE_LOCALES.includes(segments[0] as SiteLocale)
    ? (segments.shift() as SiteLocale)
    : 'es';
  const currentSlug = segments.join('/');

  const cancerLibrarySlug = ROUTES[currentLocale].aboutCancer;
  if (segments[0] === cancerLibrarySlug && segments[1]) {
    const cancerId = cancerIdFromSlug(currentLocale, segments[1]);
    if (cancerId) return localizedCancerPath(newLocale, cancerId);
  }

  const currentRoute = resolveRouteKey(currentSlug);
  return currentRoute ? localizedPath(newLocale, currentRoute) : currentSlug ? `/${newLocale}/${currentSlug}` : `/${newLocale}`;
}
