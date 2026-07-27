import type {Metadata} from 'next';
import DonatePageClient from './DonatePageClient';
import {localizedPath, normalizeLocale, type SiteLocale} from '@/lib/routes';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://tutticancerwarriors.org';

const SEO_COPY: Record<SiteLocale, {title: string; description: string}> = {
  en: {
    title: 'Donate to Support Cancer Warriors',
    description:
      'Support Tutti Cancer Warriors through PayPal, bank transfer, crypto, Better Giving or Romania’s Form 230 and help fulfil meaningful dreams.',
  },
  ro: {
    title: 'Donează pentru persoanele afectate de cancer',
    description:
      'Susține Tutti Cancer Warriors prin PayPal, transfer bancar, crypto, Better Giving sau Formularul 230 și ajută-ne să împlinim dorințe cu sens.',
  },
  es: {
    title: 'Dona para apoyar a personas con cáncer',
    description:
      'Apoya a Tutti Cancer Warriors mediante PayPal, transferencia bancaria, cripto, Better Giving o el Formulario 230 y ayúdanos a cumplir sueños.',
  },
};

const OPEN_GRAPH_LOCALES: Record<SiteLocale, string> = {
  en: 'en_GB',
  ro: 'ro_RO',
  es: 'es_ES',
};

function absoluteDonateUrl(locale: SiteLocale) {
  return `${SITE_URL}${localizedPath(locale, 'donate')}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale: localeParam} = await params;
  const locale = normalizeLocale(localeParam);
  const copy = SEO_COPY[locale];
  const canonical = absoluteDonateUrl(locale);

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical,
      languages: {
        en: absoluteDonateUrl('en'),
        ro: absoluteDonateUrl('ro'),
        es: absoluteDonateUrl('es'),
        'x-default': absoluteDonateUrl('es'),
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

export default async function DonatePage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale: localeParam} = await params;
  const locale = normalizeLocale(localeParam);
  const copy = SEO_COPY[locale];
  const pageUrl = absoluteDonateUrl(locale);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
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
        },
        potentialAction: {
          '@id': `${pageUrl}#donate-action`,
        },
      },
      {
        '@type': 'DonateAction',
        '@id': `${pageUrl}#donate-action`,
        target: pageUrl,
        recipient: {
          '@type': 'NGO',
          '@id': `${SITE_URL}/#organization`,
          name: 'Tutti Cancer Warriors',
          url: SITE_URL,
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
      <DonatePageClient />
    </>
  );
}
