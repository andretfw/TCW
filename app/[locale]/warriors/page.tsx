import type {Metadata} from 'next';
import WarriorsPageClient from './WarriorsPageClient';
import {localizedPath, normalizeLocale, type SiteLocale} from '@/lib/routes';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://tutticancerwarriors.org';

const SEO_COPY: Record<SiteLocale, {title: string; description: string; collectionName: string}> = {
  en: {
    title: 'Cancer Warrior Stories and Fulfilled Dreams',
    description:
      'Meet cancer warriors supported by Tutti Cancer Warriors, discover their fulfilled dreams and see the impact of compassionate community support.',
    collectionName: 'Cancer warrior stories and fulfilled dreams',
  },
  ro: {
    title: 'Povești ale persoanelor afectate de cancer și dorințe împlinite',
    description:
      'Descoperă poveștile persoanelor sprijinite de Tutti Cancer Warriors, dorințele lor împlinite și impactul unei comunități care le este alături.',
    collectionName: 'Povești și dorințe împlinite',
  },
  es: {
    title: 'Historias de personas con cáncer y sueños cumplidos',
    description:
      'Conoce las historias de personas apoyadas por Tutti Cancer Warriors, sus sueños cumplidos y el impacto de una comunidad solidaria.',
    collectionName: 'Historias y sueños cumplidos',
  },
};

const OPEN_GRAPH_LOCALES: Record<SiteLocale, string> = {
  en: 'en_US',
  ro: 'ro_RO',
  es: 'es_ES',
};

const STORY_NAMES = [
  'Anetra',
  'Janelle',
  'Jeanelle',
  'Susan',
  'Taya',
  'D.',
  'Jocelyn',
  'Monica',
  'Penny',
  'Wren',
  'Elise',
  'Giulia',
  'Maria',
  'Dan',
  'Laura',
  'Cristina',
  'Mirela',
  'Iulia',
];

function absoluteWarriorsUrl(locale: SiteLocale) {
  return `${SITE_URL}${localizedPath(locale, 'warriors')}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale: localeParam} = await params;
  const locale = normalizeLocale(localeParam);
  const copy = SEO_COPY[locale];
  const canonical = absoluteWarriorsUrl(locale);

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical,
      languages: {
        en: absoluteWarriorsUrl('en'),
        ro: absoluteWarriorsUrl('ro'),
        es: absoluteWarriorsUrl('es'),
        'x-default': absoluteWarriorsUrl('es'),
      },
    },
    openGraph: {
      title: `${copy.title} | Tutti Cancer Warriors`,
      description: copy.description,
      url: canonical,
      siteName: 'Tutti Cancer Warriors',
      locale: OPEN_GRAPH_LOCALES[locale],
      alternateLocale: Object.values(OPEN_GRAPH_LOCALES).filter(
        (value) => value !== OPEN_GRAPH_LOCALES[locale],
      ),
      type: 'website',
      images: [
        {
          url: '/TCW_LOGO.png',
          width: 800,
          height: 600,
          alt: 'Tutti Cancer Warriors stories and impact',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${copy.title} | Tutti Cancer Warriors`,
      description: copy.description,
      images: ['/TCW_LOGO.png'],
    },
  };
}

export default async function WarriorsPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale: localeParam} = await params;
  const locale = normalizeLocale(localeParam);
  const copy = SEO_COPY[locale];
  const pageUrl = absoluteWarriorsUrl(locale);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: copy.title,
        description: copy.description,
        inLanguage: locale,
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          url: SITE_URL,
          name: 'Tutti Cancer Warriors',
        },
        about: {
          '@type': 'NGO',
          '@id': `${SITE_URL}/#organization`,
          name: 'Tutti Cancer Warriors',
          url: SITE_URL,
        },
        mainEntity: {
          '@id': `${pageUrl}#stories`,
        },
      },
      {
        '@type': 'ItemList',
        '@id': `${pageUrl}#stories`,
        name: copy.collectionName,
        numberOfItems: STORY_NAMES.length,
        itemListOrder: 'https://schema.org/ItemListOrderAscending',
        itemListElement: STORY_NAMES.map((name, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'CreativeWork',
            name,
          },
        })),
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
      <WarriorsPageClient />
    </>
  );
}
