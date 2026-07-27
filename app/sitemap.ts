import type {MetadataRoute} from 'next';
import {
  CANCER_SLUGS,
  localizedCancerPath,
  localizedPath,
  ROUTES,
  SITE_LOCALES,
  type CancerId,
  type RouteKey,
  type SiteLocale,
} from '@/lib/routes';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://tutticancerwarriors.org';

function absoluteUrl(path: string) {
  return `${SITE_URL}${path}`;
}

function routeAlternates(route: RouteKey): Record<string, string> {
  return {
    en: absoluteUrl(localizedPath('en', route)),
    ro: absoluteUrl(localizedPath('ro', route)),
    es: absoluteUrl(localizedPath('es', route)),
    'x-default': absoluteUrl(localizedPath('es', route)),
  };
}

function cancerAlternates(cancerId: CancerId): Record<string, string> {
  return {
    en: absoluteUrl(localizedCancerPath('en', cancerId)),
    ro: absoluteUrl(localizedCancerPath('ro', cancerId)),
    es: absoluteUrl(localizedCancerPath('es', cancerId)),
    'x-default': absoluteUrl(localizedCancerPath('es', cancerId)),
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const routeKeys = Object.keys(ROUTES.en) as RouteKey[];
  const cancerIds = Object.keys(CANCER_SLUGS.en) as CancerId[];

  const mainPages: MetadataRoute.Sitemap = routeKeys.flatMap((route) =>
    SITE_LOCALES.map((locale: SiteLocale) => ({
      url: absoluteUrl(localizedPath(locale, route)),
      alternates: {
        languages: routeAlternates(route),
      },
    })),
  );

  const cancerPages: MetadataRoute.Sitemap = cancerIds.flatMap((cancerId) =>
    SITE_LOCALES.map((locale: SiteLocale) => ({
      url: absoluteUrl(localizedCancerPath(locale, cancerId)),
      alternates: {
        languages: cancerAlternates(cancerId),
      },
    })),
  );

  return [...mainPages, ...cancerPages];
}
