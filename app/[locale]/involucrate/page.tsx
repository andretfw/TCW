'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight, Gift, Handshake, Heart, Receipt, Star, Users } from 'lucide-react';
import { localizedPath } from '@/lib/routes';

export default function GetInvolvedPage() {
  const t = useTranslations('getInvolved');
  const locale = useLocale();

  const ways = [
    {
      icon: Heart,
      title: t('donateTitle'),
      description: t('donateDesc'),
      link: localizedPath(locale, 'donate'),
      gradient: 'from-rose-400 to-red-500',
      shadow: 'shadow-rose-100',
      external: false,
    },
    {
      icon: Users,
      title: t('volunteerTitle'),
      description: t('volunteerDesc'),
      link: localizedPath(locale, 'volunteers'),
      gradient: 'from-violet-400 to-purple-500',
      shadow: 'shadow-purple-100',
      external: false,
    },
    {
      icon: Handshake,
      title: t('peerTitle'),
      description: t('peerDesc'),
      link: localizedPath(locale, 'peerSupport'),
      gradient: 'from-cyan-400 to-blue-500',
      shadow: 'shadow-cyan-100',
      external: false,
    },
    {
      icon: Star,
      title: t('dreamTitle'),
      description: t('dreamDesc'),
      link: localizedPath(locale, 'supportDream'),
      gradient: 'from-amber-400 to-orange-500',
      shadow: 'shadow-orange-100',
      external: false,
    },
    {
      icon: Gift,
      title: t('fundraiseTitle'),
      description: t('fundraiseDesc'),
      link: 'https://better.giving/donate/1293778',
      gradient: 'from-emerald-400 to-green-500',
      shadow: 'shadow-emerald-100',
      external: true,
    },
    {
      icon: Receipt,
      title: t('taxTitle'),
      description: t('taxDesc'),
      link: 'https://redirectioneaza.ro/tutticancerwarriors/',
      gradient: 'from-blue-400 to-indigo-500',
      shadow: 'shadow-blue-100',
      external: true,
    },
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      <section className="bg-gradient-to-br from-brand-50 to-white py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6 inline-block animate-pulse rounded-full bg-brand-100 p-4">
            <Heart className="h-12 w-12 text-brand-600" fill="currentColor" />
          </div>
          <h1 className="mb-6 text-6xl font-bold text-neutral-900">{t('title')}</h1>
          <p className="mx-auto max-w-2xl text-2xl leading-relaxed text-neutral-600">{t('subtitle')}</p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {ways.map((way, index) => {
              const Icon = way.icon;
              const cardClasses = `group relative flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-100 bg-white p-10 shadow-xl ${way.shadow} transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl`;
              const cardContent = (
                <>
                  <div className={`absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-gradient-to-br ${way.gradient} opacity-10 transition-transform duration-500 group-hover:scale-150`} />
                  <div className={`mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${way.gradient} text-white shadow-lg`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="mb-4 text-3xl font-bold text-neutral-900 transition-colors group-hover:text-brand-600">{way.title}</h3>
                  <p className="mb-8 flex-grow text-lg leading-relaxed text-neutral-600">{way.description}</p>
                  <div className="mt-auto flex items-center gap-3 text-lg font-bold transition-all group-hover:gap-5">
                    <span className="bg-gradient-to-r from-neutral-900 to-neutral-600 bg-clip-text text-transparent group-hover:from-brand-600 group-hover:to-purple-600">
                      {t('learnMore')}
                    </span>
                    <div className="rounded-full bg-neutral-100 p-2 text-neutral-900 transition-colors group-hover:bg-brand-100 group-hover:text-brand-600">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>
                </>
              );

              return way.external ? (
                <a key={index} href={way.link} target="_blank" rel="noopener noreferrer" className={cardClasses}>
                  {cardContent}
                </a>
              ) : (
                <Link key={index} href={way.link} className={cardClasses}>
                  {cardContent}
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
