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
  const now = new Date();
  const routeKeys = Object.keys(ROUTES.en) as RouteKey[];
  const cancerIds = Object.keys(CANCER_SLUGS.en) as CancerId[];

  const mainPages: MetadataRoute.Sitemap = routeKeys.flatMap((route) =>
    SITE_LOCALES.map((locale: SiteLocale) => ({
      url: absoluteUrl(localizedPath(locale, route)),
      lastModified: now,
      changeFrequency:
        route === 'supportDream' || route === 'home' ? 'daily' : 'monthly',
      priority:
        route === 'home' ? 1 : route === 'supportDream' || route === 'donate' ? 0.9 : 0.7,
      alternates: {
        languages: routeAlternates(route),
      },
    })),
  );

  const cancerPages: MetadataRoute.Sitemap = cancerIds.flatMap((cancerId) =>
    SITE_LOCALES.map((locale: SiteLocale) => ({
      url: absoluteUrl(localizedCancerPath(locale, cancerId)),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: {
        languages: cancerAlternates(cancerId),
      },
    })),
  );

  return [...mainPages, ...cancerPages];
}
