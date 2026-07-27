import type {Metadata} from 'next';
import HomePageClient from './HomePageClient';
import {localizedPath, type SiteLocale} from '@/lib/routes';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://tutticancerwarriors.org';

const SEO_COPY: Record<SiteLocale, {title: string; description: string}> = {
  en: {
    title: 'Cancer Support, Hope and Dream Grants',
    description:
      'Tutti Cancer Warriors is a Romanian NGO supporting people affected by cancer worldwide through dream grants, peer support, education and community.',
  },
  ro: {
    title: 'Sprijin oncologic, speranță și dorințe împlinite',
    description:
      'Tutti Cancer Warriors este un ONG românesc care sprijină persoanele afectate de cancer prin granturi pentru dorințe, educație și comunitate.',
  },
  es: {
    title: 'Apoyo contra el cáncer, esperanza y sueños',
    description:
      'Tutti Cancer Warriors es una ONG rumana que apoya a personas afectadas por el cáncer mediante sueños, apoyo entre pacientes, educación y comunidad.',
  },
};

const OPEN_GRAPH_LOCALES: Record<SiteLocale, string> = {
  en: 'en_US',
  ro: 'ro_RO',
  es: 'es_ES',
};

const SOCIAL_PROFILES = [
  'https://www.facebook.com/people/Tutti-Cancer-Warriors/61574889407716/',
  'https://www.instagram.com/tutticancerwarriors/',
  'https://x.com/NGOTCW',
];

function normalizeLocale(locale: string): SiteLocale {
  return locale === 'en' || locale === 'ro' || locale === 'es' ? locale : 'es';
}

function absoluteHomeUrl(locale: SiteLocale) {
  return `${SITE_URL}${localizedPath(locale, 'home')}`;
}

function languageAlternates() {
  return {
    en: absoluteHomeUrl('en'),
    ro: absoluteHomeUrl('ro'),
    es: absoluteHomeUrl('es'),
    'x-default': absoluteHomeUrl('es'),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale: localeParam} = await params;
  const locale = normalizeLocale(localeParam);
  const copy = SEO_COPY[locale];
  const canonical = absoluteHomeUrl(locale);

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical,
      languages: languageAlternates(),
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
          alt: 'Tutti Cancer Warriors nonprofit organisation',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${copy.title} | Tutti Cancer Warriors`,
      description: copy.description,
      images: ['/TCW_LOGO.png'],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale: localeParam} = await params;
  const locale = normalizeLocale(localeParam);
  const copy = SEO_COPY[locale];
  const pageUrl = absoluteHomeUrl(locale);
  const organisationId = `${SITE_URL}/#organization`;
  const websiteId = `${SITE_URL}/#website`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'NGO',
        '@id': organisationId,
        name: 'Tutti Cancer Warriors',
        legalName: 'Asociația Tutti Cancer Warriors',
        alternateName: 'TCW',
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/TCW_LOGO.png`,
          width: 800,
          height: 600,
        },
        email: 'tcw@tutticancerwarriors.org',
        taxID: '50156252',
        identifier: {
          '@type': 'PropertyValue',
          propertyID: 'Romanian tax identification number (CIF)',
          value: '50156252',
        },
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'RO',
        },
        areaServed: 'Worldwide',
        sameAs: SOCIAL_PROFILES,
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'tcw@tutticancerwarriors.org',
          contactType: 'nonprofit support',
          availableLanguage: ['English', 'Romanian', 'Spanish'],
        },
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: SITE_URL,
        name: 'Tutti Cancer Warriors',
        alternateName: 'TCW',
        inLanguage: ['en', 'ro', 'es'],
        publisher: {'@id': organisationId},
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: copy.title,
        description: copy.description,
        inLanguage: locale,
        isPartOf: {'@id': websiteId},
        about: {'@id': organisationId},
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/TCW_LOGO.png`,
        },
        potentialAction: {
          '@type': 'DonateAction',
          target: `${SITE_URL}${localizedPath(locale, 'donate')}`,
          recipient: {'@id': organisationId},
        },
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
      <HomePageClient />
    </>
  );
}
