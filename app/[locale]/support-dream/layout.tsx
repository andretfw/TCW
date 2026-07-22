import type {Metadata} from 'next';
import CampaignGoalReachedNotice from '@/components/CampaignGoalReachedNotice';
import {localizedPath, type SiteLocale} from '@/lib/routes';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://tutticancerwarriors.org';

const SEO_COPY: Record<SiteLocale, {title: string; description: string}> = {
  en: {
    title: 'Support a Cancer Warrior’s Dream',
    description:
      'Help Tutti Cancer Warriors fund meaningful €500 dreams for people living with cancer. Follow each campaign’s verified donation progress.',
  },
  ro: {
    title: 'Susține visul unui warrior oncologic',
    description:
      'Ajută Tutti Cancer Warriors să finanțeze dorințe de până la 500 € pentru persoane care trăiesc cu cancer și urmărește progresul donațiilor verificate.',
  },
  es: {
    title: 'Apoya el sueño de un warrior con cáncer',
    description:
      'Ayuda a Tutti Cancer Warriors a financiar sueños de hasta 500 € para personas que viven con cáncer y sigue el progreso de las donaciones verificadas.',
  },
};

const OPEN_GRAPH_LOCALES: Record<SiteLocale, string> = {
  en: 'en_US',
  ro: 'ro_RO',
  es: 'es_ES',
};

function normalizeLocale(locale: string): SiteLocale {
  return locale === 'en' || locale === 'ro' || locale === 'es' ? locale : 'es';
}

function absoluteSupportDreamUrl(locale: SiteLocale) {
  return `${SITE_URL}${localizedPath(locale, 'supportDream')}`;
}

export function generateMetadata({
  params: {locale: localeParam},
}: {
  params: {locale: string};
}): Metadata {
  const locale = normalizeLocale(localeParam);
  const copy = SEO_COPY[locale];
  const canonical = absoluteSupportDreamUrl(locale);

  const languageAlternates: Record<string, string> = {
    en: absoluteSupportDreamUrl('en'),
    ro: absoluteSupportDreamUrl('ro'),
    es: absoluteSupportDreamUrl('es'),
    'x-default': absoluteSupportDreamUrl('es'),
  };

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical,
      languages: languageAlternates,
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
          alt: 'Tutti Cancer Warriors',
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

export default function SupportDreamLayout({
  children,
  params: {locale: localeParam},
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  const locale = normalizeLocale(localeParam);
  const copy = SEO_COPY[locale];
  const pageUrl = absoluteSupportDreamUrl(locale);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
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
      logo: `${SITE_URL}/TCW_LOGO.png`,
    },
    potentialAction: {
      '@type': 'DonateAction',
      target: pageUrl,
      recipient: {
        '@type': 'NGO',
        name: 'Tutti Cancer Warriors',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <CampaignGoalReachedNotice />
      {children}
    </>
  );
}
