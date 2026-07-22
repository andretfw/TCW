'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Activity, Calendar, CheckCircle, Heart, Info, Share2 } from 'lucide-react';
import { localizedPath } from '@/lib/routes';

export default function KidneyCancerDayPage() {
  const t = useTranslations('kidneyCancerDay');
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-neutral-50 pt-20">
      <section className="relative overflow-hidden rounded-b-[4rem] bg-gradient-to-br from-orange-500 to-red-600 py-24 text-white shadow-2xl">
        <div className="absolute right-0 top-0 -mr-20 -mt-20 h-96 w-96 animate-pulse rounded-full bg-yellow-400/20 blur-3xl" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 backdrop-blur-sm">
            <Calendar className="h-4 w-4 text-orange-100" />
            <span className="font-medium text-orange-50">{t('date')}</span>
          </div>
          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight md:text-6xl">{t('title')}</h1>
          <p className="mx-auto mb-10 max-w-3xl text-xl font-light text-orange-100 md:text-2xl">{t('theme')}</p>
          <Link
            href={localizedPath(locale, 'donate')}
            className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-lg font-bold text-orange-700 shadow-lg transition-all hover:scale-105 hover:bg-orange-50"
          >
            <Heart className="h-5 w-5 fill-current text-orange-600" />
            {t('ctaButton')}
          </Link>
        </div>
      </section>

      <section className="relative overflow-hidden py-24">
        <div className="absolute left-0 top-1/2 -z-10 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-orange-100/50 blur-3xl" />
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="relative order-2 h-[400px] overflow-hidden rounded-[3rem] shadow-2xl lg:order-1 lg:h-[500px]">
              <Image
                src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
                alt="Active healthy lifestyle sunset"
                fill
                className="object-cover transition-transform duration-700 hover:scale-110"
              />
              <div className="absolute inset-0 bg-orange-900/10" />
            </div>
            <div className="order-1 lg:order-2">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 shadow-sm">
                <Info className="h-8 w-8 text-orange-600" />
              </div>
              <h2 className="mb-6 text-4xl font-bold leading-tight text-neutral-900">{t('whyTitle')}</h2>
              <p className="mb-8 text-xl leading-relaxed text-neutral-600">{t('whyText')}</p>
              <div className="inline-flex items-center gap-2 border-b-2 border-orange-200 pb-1 font-bold text-orange-600">
                <Activity className="h-5 w-5" />
                <span>Early detection saves lives.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 pt-10">
        <div className="container mx-auto max-w-5xl">
          <div className="rounded-[2.5rem] border-2 border-orange-100 bg-white p-10 shadow-xl transition-colors hover:border-orange-300 md:p-16">
            <h2 className="mb-12 flex items-center justify-center gap-3 text-center text-3xl font-bold text-neutral-900">
              <Activity className="h-8 w-8 text-orange-500" />
              {t('factsTitle')}
            </h2>
            <ul className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
              {[1, 2, 3, 4, 5].map((number) => (
                <li key={number} className="flex items-start gap-4 rounded-2xl bg-orange-50/50 p-4 transition-colors hover:bg-orange-100">
                  <CheckCircle className="mt-1 h-6 w-6 flex-shrink-0 text-orange-500" />
                  <span className="text-lg font-medium leading-snug text-neutral-700">{t(`fact${number}` as any)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-neutral-900 py-20 text-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <div className="mb-10">
            <Share2 className="mx-auto mb-4 h-12 w-12 text-orange-400" />
            <h2 className="mb-6 text-4xl font-bold">{t('socialTitle')}</h2>
            <p className="mx-auto max-w-2xl text-xl text-neutral-400">{t('socialText')}</p>
          </div>
          <div className="relative overflow-hidden rounded-[2rem] border border-neutral-700 bg-neutral-800 p-10 shadow-2xl transition-colors hover:border-orange-500/50">
            <p className="relative z-10 mb-8 font-serif text-2xl italic leading-relaxed text-neutral-200 md:text-3xl">“{t('quote1')}”</p>
            <div className="relative z-10 flex flex-wrap justify-center gap-4">
              <span className="rounded-full bg-neutral-700 px-6 py-2 text-sm font-medium text-orange-200">#WorldKidneyCancerDay</span>
              <span className="rounded-full bg-neutral-700 px-6 py-2 text-sm font-medium text-orange-200">#KidneyLove</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
