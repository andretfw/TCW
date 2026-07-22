import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import '../globals.css';
import Header from './Header';
import Footer from './Footer';
import CookieBanner from '@/components/CookieBanner';
import IntlProvider from '@/components/IntlProvider';
import {SITE_LOCALES, type SiteLocale} from '@/lib/routes';

function isSupportedLocale(locale: string): locale is SiteLocale {
  return SITE_LOCALES.includes(locale as SiteLocale);
}

async function loadMessages(locale: SiteLocale) {
  return (await import(`../../messages/${locale}.json`)).default;
}

export function generateStaticParams() {
  return SITE_LOCALES.map((locale) => ({locale}));
}

export async function generateMetadata({
  params: {locale},
}: {
  params: {locale: string};
}): Promise<Metadata> {
  if (!isSupportedLocale(locale)) return {};

  const messages = await loadMessages(locale);
  const description =
    messages.metadata?.description ??
    'Tutti Cancer Warriors supports people affected by cancer through practical help, awareness and community.';
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tutticancerwarriors.org';

  return {
    metadataBase: new URL(baseUrl),
    title: {
      template: '%s | Tutti Cancer Warriors',
      default: 'Tutti Cancer Warriors - Born to Thrive',
    },
    description,
    openGraph: {
      title: 'Tutti Cancer Warriors',
      description,
      url: baseUrl,
      siteName: 'Tutti Cancer Warriors',
      images: [
        {
          url: '/TCW_LOGO.png',
          width: 800,
          height: 600,
          alt: 'Tutti Cancer Warriors NGO',
        },
      ],
      locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Tutti Cancer Warriors',
      description,
      images: ['/og-image.png'],
    },
    icons: {
      icon: '/favicon.ico',
    },
  };
}

export default async function LocaleLayout({
  children,
  params: {locale},
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  if (!isSupportedLocale(locale)) notFound();

  const messages = await loadMessages(locale);

  return (
    <html lang={locale}>
      <body className="bg-white antialiased">
        <IntlProvider locale={locale} messages={messages}>
          <Header locale={locale} />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CookieBanner />
        </IntlProvider>
      </body>
    </html>
  );
}
