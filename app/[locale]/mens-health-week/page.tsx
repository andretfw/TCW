'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Activity, ArrowRight, Brain, Calendar, Heart, Instagram, Share2, Twitter, User } from 'lucide-react';
import { localizedPath } from '@/lib/routes';

export default function MensHealthWeekPage() {
  const t = useTranslations('mensHealthWeek');
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-white pt-20">
      <section className="relative z-10 overflow-hidden rounded-b-[4rem] bg-gradient-to-br from-blue-700 to-indigo-900 py-24 text-white shadow-2xl">
        <div className="absolute right-0 top-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 backdrop-blur-sm">
            <Calendar className="h-4 w-4 text-blue-200" />
            <span className="font-medium text-blue-100">{t('date')}</span>
          </div>
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight drop-shadow-lg md:text-7xl">{t('title')}</h1>
          <p className="mx-auto mb-10 max-w-3xl text-xl font-light text-blue-100 md:text-2xl">{t('theme')}</p>
          <Link
            href={localizedPath(locale, 'donate')}
            className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-lg font-bold text-blue-900 shadow-xl transition-all hover:scale-105 hover:bg-blue-50"
          >
            <Heart className="h-5 w-5 fill-current text-blue-600" />
            {t('ctaButton')}
          </Link>
        </div>
      </section>

      <section className="overflow-hidden py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col items-center gap-16 lg:flex-row">
            <div className="lg:w-1/2">
              <div className="mb-6 inline-block rounded-2xl bg-blue-50 p-3">
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="mb-6 text-4xl font-bold leading-tight text-neutral-900 md:text-5xl">{t('welcomeTitle')}</h2>
              <p className="mb-8 text-xl leading-relaxed text-neutral-600">{t('welcomeText')}</p>
              <div className="space-y-4 border-l-4 border-blue-200 pl-6">
                <p className="text-lg font-medium text-neutral-800">“Closing the Gap” means taking action today.</p>
                <div className="flex items-center gap-2 font-bold text-blue-600">
                  <span>Read the full report</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
            <div className="relative w-full lg:w-1/2">
              <div className="absolute right-10 top-10 -z-10 h-full w-full rotate-3 rounded-[3rem] bg-blue-100" />
              <div className="relative h-[500px] w-full overflow-hidden rounded-[3rem] border-4 border-white shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
                  alt="Men supporting men group"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[4rem] bg-neutral-50 py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-neutral-900 md:text-4xl">{t('factsTitle')}</h2>
            <div className="mx-auto mt-4 h-1.5 w-24 rounded-full bg-blue-500" />
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { icon: User, title: t('fact1Title'), text: t('fact1Text'), className: 'bg-blue-100 text-blue-600' },
              { icon: Brain, title: t('fact2Title'), text: t('fact2Text'), className: 'bg-indigo-100 text-indigo-600' },
              { icon: Activity, title: t('fact3Title'), text: t('fact3Text'), className: 'bg-cyan-100 text-cyan-600' },
            ].map((fact) => {
              const Icon = fact.icon;
              return (
                <div key={fact.title} className="rounded-[2rem] bg-white p-10 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                  <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${fact.className}`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-neutral-900">{fact.title}</h3>
                  <p className="leading-relaxed text-neutral-600">{fact.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="relative overflow-hidden rounded-[3rem] bg-neutral-900 p-12 text-center shadow-2xl md:p-16">
            <div className="relative z-10">
              <Share2 className="mx-auto mb-6 h-12 w-12 animate-bounce text-blue-400" />
              <h2 className="mb-6 text-3xl font-bold text-white md:text-5xl">{t('socialTitle')}</h2>
              <p className="mx-auto mb-12 max-w-2xl text-xl text-neutral-400">{t('socialText')}</p>
              <div className="grid grid-cols-1 gap-6 text-left md:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition-colors hover:bg-white/10">
                  <div className="mb-4 flex items-center gap-3 font-bold text-blue-400"><Twitter className="h-5 w-5" /> Twitter / X</div>
                  <p className="text-lg italic text-neutral-200">“{t('quote1')}”</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition-colors hover:bg-white/10">
                  <div className="mb-4 flex items-center gap-3 font-bold text-pink-400"><Instagram className="h-5 w-5" /> Instagram</div>
                  <p className="text-lg italic text-neutral-200">“{t('quote3')}”</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
