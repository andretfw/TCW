import type {Metadata} from 'next';
import AboutCancerPageClient from './AboutCancerPageClient';
import {
  localizedCancerPath,
  localizedPath,
  normalizeLocale,
  type CancerId,
  type SiteLocale,
} from '@/lib/routes';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://tutticancerwarriors.org';

const SEO_COPY: Record<SiteLocale, {title: string; description: string}> = {
  en: {
    title: 'Cancer Types and Information Guides',
    description:
      'Explore 35 educational guides about cancer types, symptoms, diagnosis, treatment and support from Tutti Cancer Warriors.',
  },
  ro: {
    title: 'Tipuri de cancer și ghiduri informative',
    description:
      'Explorează 35 de ghiduri educaționale despre tipuri de cancer, simptome, diagnostic, tratament și sprijin de la Tutti Cancer Warriors.',
  },
  es: {
    title: 'Tipos de cáncer y guías informativas',
    description:
      'Explora 35 guías educativas sobre tipos de cáncer, síntomas, diagnóstico, tratamiento y apoyo de Tutti Cancer Warriors.',
  },
};

const OPEN_GRAPH_LOCALES: Record<SiteLocale, string> = {
  en: 'en_US',
  ro: 'ro_RO',
  es: 'es_ES',
};

const CANCER_IDS: CancerId[] = [
  'breast',
  'lung',
  'colorectal',
  'prostate',
  'skin',
  'kidney',
  'leukemia',
  'liver',
  'pancreatic',
  'ovarian',
  'childhood',
  'brain',
  'bladder',
  'cervical',
  'stomach',
  'testicular',
  'thyroid',
  'uterine',
  'lymphoma',
  'myeloma',
  'esophageal',
  'head-neck',
  'bone',
  'sarcoma',
  'gallbladder',
  'bile-duct',
  'anal',
  'penile',
  'vaginal',
  'vulvar',
  'eye',
  'oral',
  'throat',
  'small-intestine',
  'thymus',
];

function absoluteAboutCancerUrl(locale: SiteLocale) {
  return `${SITE_URL}${localizedPath(locale, 'aboutCancer')}`;
}

function absoluteCancerUrl(locale: SiteLocale, cancerId: CancerId) {
  return `${SITE_URL}${localizedCancerPath(locale, cancerId)}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale: localeParam} = await params;
  const locale = normalizeLocale(localeParam);
  const copy = SEO_COPY[locale];
  const canonical = absoluteAboutCancerUrl(locale);

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical,
      languages: {
        en: absoluteAboutCancerUrl('en'),
        ro: absoluteAboutCancerUrl('ro'),
        es: absoluteAboutCancerUrl('es'),
        'x-default': absoluteAboutCancerUrl('es'),
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
          alt: 'Tutti Cancer Warriors cancer information guides',
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

export default async function AboutCancerPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale: localeParam} = await params;
  const locale = normalizeLocale(localeParam);
  const copy = SEO_COPY[locale];
  const pageUrl = absoluteAboutCancerUrl(locale);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['CollectionPage', 'MedicalWebPage'],
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
        publisher: {
          '@type': 'NGO',
          '@id': `${SITE_URL}/#organization`,
          name: 'Tutti Cancer Warriors',
          url: SITE_URL,
        },
        mainEntity: {
          '@id': `${pageUrl}#cancer-guides`,
        },
      },
      {
        '@type': 'ItemList',
        '@id': `${pageUrl}#cancer-guides`,
        name: copy.title,
        numberOfItems: CANCER_IDS.length,
        itemListElement: CANCER_IDS.map((cancerId, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: absoluteCancerUrl(locale, cancerId),
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
      <AboutCancerPageClient params={params} />
    </>
  );
}
