import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { Metadata } from "next";
import "../globals.css";
import Header from './Header';
import Footer from './Footer';
import CookieBanner from '@/components/CookieBanner'; // 1. Importamos el banner

// 1. Configuración dinámica del SEO
export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tutticancerwarriors.org';

  return {
    metadataBase: new URL(baseUrl),
    title: {
      template: '%s | Tutti Cancer Warriors',
      default: 'Tutti Cancer Warriors - Born to Thrive',
    },
    description: t('description'),
    openGraph: {
      title: 'Tutti Cancer Warriors',
      description: t('description'),
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
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Tutti Cancer Warriors',
      description: t('description'),
      images: ['/og-image.png'],
    },
    icons: {
      icon: '/favicon.ico',
    },
  };
}

// 2. El Layout principal
export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="bg-white antialiased">
        <NextIntlClientProvider messages={messages}>
          <Header locale={locale} />
          
          <main className="min-h-screen">
            {children}
          </main>
          
          <Footer />
          
          {/* 2. Añadimos el Banner de Cookies aquí */}
          <CookieBanner />
          
        </NextIntlClientProvider>
      </body>
    </html>
  );
}