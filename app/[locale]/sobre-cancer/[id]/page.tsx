import type {Metadata} from 'next';
import {notFound, permanentRedirect} from 'next/navigation';
import CancerDetailPageClient from './CancerDetailPageClient';
import enMessages from '@/messages/en.json';
import roMessages from '@/messages/ro.json';
import esMessages from '@/messages/es.json';
import {getAdditionalCancerGuideContent} from '@/lib/additional-cancer-guides';
import {getAdditionalCancerGuideBatch2Content} from '@/lib/additional-cancer-guides-2';
import {getAdditionalCancerGuideBatch3Content} from '@/lib/additional-cancer-guides-3';
import {getCancerData} from '@/lib/cancer-data';
import {
  CANCER_SLUGS,
  SITE_LOCALES,
  cancerIdFromSlug,
  localizedCancerPath,
  localizedPath,
  type CancerId,
  type SiteLocale,
} from '@/lib/routes';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://tutticancerwarriors.org';

const OPEN_GRAPH_LOCALES: Record<SiteLocale, string> = {
  en: 'en_US',
  ro: 'ro_RO',
  es: 'es_ES',
};

const MESSAGES = {
  en: enMessages,
  ro: roMessages,
  es: esMessages,
};

type GuideMessages = {
  nav?: {
    home?: string;
    aboutCancer?: string;
  };
  cancerDetails?: Record<
    string,
    {
      title?: string;
      shortDescription?: string;
    }
  >;
};

type ResolvedGuide = {
  locale: SiteLocale;
  cancerId: CancerId;
  canonicalSlug: string;
  title: string;
  description: string;
  homeLabel: string;
  libraryLabel: string;
  image: string;
};

function isSupportedLocale(locale: string): locale is SiteLocale {
  return SITE_LOCALES.includes(locale as SiteLocale);
}

function resolveGuide(localeParam: string, slug: string): ResolvedGuide | null {
  if (!isSupportedLocale(localeParam)) return null;

  const locale = localeParam;
  const cancerId = cancerIdFromSlug(locale, slug);
  if (!cancerId) return null;

  const cancerData = getCancerData(cancerId);
  if (!cancerData) return null;

  const messages = MESSAGES[locale] as GuideMessages;
  const translatedCopy = messages.cancerDetails?.[cancerId];
  const additionalCopy = getAdditionalCancerGuideContent(cancerId, locale)
    ?? getAdditionalCancerGuideBatch2Content(cancerId, locale)
    ?? getAdditionalCancerGuideBatch3Content(cancerId, locale);
  const title = additionalCopy?.title ?? translatedCopy?.title;
  const description = additionalCopy?.shortDescription ?? translatedCopy?.shortDescription;
  if (!title || !description) return null;

  return {
    locale,
    cancerId,
    canonicalSlug: CANCER_SLUGS[locale][cancerId],
    title,
    description,
    homeLabel: messages.nav?.home || 'Home',
    libraryLabel: messages.nav?.aboutCancer || 'About Cancer',
    image: cancerData.image,
  };
}

function absoluteCancerUrl(locale: SiteLocale, cancerId: CancerId) {
  return `${SITE_URL}${localizedCancerPath(locale, cancerId)}`;
}

function absoluteLibraryUrl(locale: SiteLocale) {
  return `${SITE_URL}${localizedPath(locale, 'aboutCancer')}`;
}

export function generateStaticParams() {
  const cancerIds = Object.keys(CANCER_SLUGS.en) as CancerId[];

  return SITE_LOCALES.flatMap((locale) =>
    cancerIds.map((cancerId) => ({
      locale,
      id: CANCER_SLUGS[locale][cancerId],
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string; id: string}>;
}): Promise<Metadata> {
  const {locale: localeParam, id} = await params;
  const guide = resolveGuide(localeParam, id);
  if (!guide) notFound();

  const canonical = absoluteCancerUrl(guide.locale, guide.cancerId);

  return {
    title: guide.title,
    description: guide.description,
    alternates: {
      canonical,
      languages: {
        en: absoluteCancerUrl('en', guide.cancerId),
        ro: absoluteCancerUrl('ro', guide.cancerId),
        es: absoluteCancerUrl('es', guide.cancerId),
        'x-default': absoluteCancerUrl('es', guide.cancerId),
      },
    },
    openGraph: {
      title: `${guide.title} | Tutti Cancer Warriors`,
      description: guide.description,
      url: canonical,
      siteName: 'Tutti Cancer Warriors',
      locale: OPEN_GRAPH_LOCALES[guide.locale],
      alternateLocale: Object.values(OPEN_GRAPH_LOCALES).filter(
        (value) => value !== OPEN_GRAPH_LOCALES[guide.locale],
      ),
      type: 'article',
      images: [
        {
          url: guide.image,
          alt: `${guide.title} - Tutti Cancer Warriors`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${guide.title} | Tutti Cancer Warriors`,
      description: guide.description,
      images: [guide.image],
    },
  };
}

export default async function CancerDetailPage({
  params,
}: {
  params: Promise<{locale: string; id: string}>;
}) {
  const {locale: localeParam, id} = await params;
  const guide = resolveGuide(localeParam, id);
  if (!guide) notFound();

  if (id !== guide.canonicalSlug) {
    permanentRedirect(localizedCancerPath(guide.locale, guide.cancerId));
  }

  const pageUrl = absoluteCancerUrl(guide.locale, guide.cancerId);
  const libraryUrl = absoluteLibraryUrl(guide.locale);
  const conditionId = `${pageUrl}#condition`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalWebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: guide.title,
        description: guide.description,
        inLanguage: guide.locale,
        isAccessibleForFree: true,
        educationalUse: 'patient education',
        specialty: 'https://schema.org/Oncologic',
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          url: SITE_URL,
          name: 'Tutti Cancer Warriors',
        },
        publisher: {
          '@type': 'NGO',
          '@id': `${SITE_URL}/#organization`,
          name: 'Tutti Cancer Warriors',
          url: SITE_URL,
        },
        about: {
          '@id': conditionId,
        },
        mainEntity: {
          '@id': conditionId,
        },
        breadcrumb: {
          '@id': `${pageUrl}#breadcrumb`,
        },
      },
      {
        '@type': 'MedicalCondition',
        '@id': conditionId,
        name: guide.title,
        description: guide.description,
        url: pageUrl,
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: guide.homeLabel,
            item: `${SITE_URL}${localizedPath(guide.locale, 'home')}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: guide.libraryLabel,
            item: libraryUrl,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: guide.title,
            item: pageUrl,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <CancerDetailPageClient params={params} />
    </>
  );
}
