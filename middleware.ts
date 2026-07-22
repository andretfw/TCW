import createMiddleware from 'next-intl/middleware';
import {NextRequest, NextResponse} from 'next/server';
import {
  cancerIdFromSlug,
  localizedCancerPath,
  localizedPath,
  resolveRouteKey,
  ROUTES,
  SITE_LOCALES,
  type SiteLocale,
} from './lib/routes';

const intlMiddleware = createMiddleware({
  locales: [...SITE_LOCALES],
  defaultLocale: 'es',
  localePrefix: 'always',
  pathnames: {
    '/': '/',
    '/team': {es: '/equipo', en: '/team', ro: '/echipa'},
    '/sobre-cancer': {es: '/sobre-cancer', en: '/about-cancer', ro: '/despre-cancer'},
    '/sobre-cancer/[id]': {es: '/sobre-cancer/[id]', en: '/about-cancer/[id]', ro: '/despre-cancer/[id]'},
    '/entender-diagnostico': {es: '/entender-diagnostico', en: '/understanding-diagnosis', ro: '/intelegerea-diagnosticului'},
    '/preguntas-doctor': {es: '/preguntas-doctor', en: '/questions-for-doctor', ro: '/intrebari-pentru-medic'},
    '/bienestar-emocional': {es: '/bienestar-emocional', en: '/emotional-wellbeing', ro: '/bunastare-emotionala'},
    '/calendario-cancer': {es: '/calendario-cancer', en: '/cancer-awareness-calendar', ro: '/calendar-oncologic'},
    '/involucrate': {es: '/involucrate', en: '/get-involved', ro: '/implica-te'},
    '/donar': {es: '/donar', en: '/donate', ro: '/doneaza'},
    '/voluntarios': {es: '/voluntarios', en: '/volunteers', ro: '/voluntari'},
    '/peer-support': {es: '/apoyo-entre-pares', en: '/peer-support', ro: '/sprijin-intre-pacienti'},
    '/support-dream': {es: '/apoya-un-sueno', en: '/support-a-dream', ro: '/sustine-un-vis'},
    '/warriors': {es: '/guerreros', en: '/warriors', ro: '/luptatori'},
    '/connect-survivor': {es: '/conecta-con-un-superviviente', en: '/connect-with-a-survivor', ro: '/conecteaza-te-cu-un-supravietuitor'},
    '/dream-application': {es: '/solicitud-sueno', en: '/dream-support-application', ro: '/cerere-sprijin-vis'},
    '/share-journey': {es: '/comparte-tu-historia', en: '/share-your-journey', ro: '/impartaseste-ti-povestea'},
    '/warrior-mood-boost': {es: '/animo-para-guerreros', en: '/warrior-mood-boost', ro: '/doza-de-incurajare'},
    '/mens-health-week': {es: '/semana-salud-masculina', en: '/mens-health-week', ro: '/saptamana-sanatatii-barbatilor'},
    '/world-kidney-cancer-day': {es: '/dia-mundial-cancer-rinon', en: '/world-kidney-cancer-day', ro: '/ziua-mondiala-cancer-renal'},
    '/events/pilates-event': {es: '/eventos/evento-pilates', en: '/events/pilates-event', ro: '/evenimente/eveniment-pilates'},
    '/privacy': {es: '/privacidad', en: '/privacy', ro: '/confidentialitate'},
    '/terms': {es: '/terminos', en: '/terms', ro: '/termeni'},
    '/peer-policy': {es: '/politica-apoyo-entre-pares', en: '/peer-support-policy', ro: '/politica-sprijin-intre-pacienti'},
    '/financials': {es: '/transparencia', en: '/financials', ro: '/transparenta-financiara'},
  },
});

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const segments = pathname.split('/').filter(Boolean);
  const locale = segments[0] as SiteLocale | undefined;

  if (locale && SITE_LOCALES.includes(locale)) {
    const pageSegments = segments.slice(1);
    const localizedCancerRoot = ROUTES[locale].aboutCancer;

    if (pageSegments[0] === localizedCancerRoot && pageSegments[1]) {
      const cancerId = cancerIdFromSlug(locale, pageSegments[1]);
      if (cancerId) {
        const canonicalPath = localizedCancerPath(locale, cancerId);
        if (pathname !== canonicalPath) {
          const url = request.nextUrl.clone();
          url.pathname = canonicalPath;
          return NextResponse.redirect(url, 308);
        }
      }
    } else {
      const slug = pageSegments.join('/');
      const routeKey = resolveRouteKey(slug);

      if (routeKey) {
        const canonicalPath = localizedPath(locale, routeKey);
        if (pathname !== canonicalPath) {
          const url = request.nextUrl.clone();
          url.pathname = canonicalPath;
          return NextResponse.redirect(url, 308);
        }
      }
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(es|en|ro)/:path*', '/((?!_next|_vercel|.*\\..*).*)'],
};
