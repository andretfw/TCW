'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, Flower2, Heart, Quote, Sparkles, Target, Users } from 'lucide-react';
import { localizedPath } from '@/lib/routes';

export default function PilatesEventPage() {
  const t = useTranslations('pilatesEvent');
  const locale = useLocale();
  const carouselImages = ['/pilates-1.jpg', '/pilates-3.jpg', '/pilates-2.jpg', '/pilates-4.jpg'];
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => setCurrentIndex((previous) => (previous === 0 ? carouselImages.length - 1 : previous - 1));
  const nextSlide = () => setCurrentIndex((previous) => (previous === carouselImages.length - 1 ? 0 : previous + 1));

  return (
    <div className="min-h-screen overflow-hidden bg-white font-sans">
      <section className="relative flex h-[85vh] min-h-[600px] w-full items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 animate-slow-zoom">
          <Image src="/pilates-hero.jpg" alt="Pilates Event GT Race" fill className="object-cover object-center brightness-[0.4]" priority />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-90" />
        <div className="relative z-20 mx-auto flex max-w-5xl animate-fade-in-up flex-col items-center px-4 text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-bold text-white shadow-xl backdrop-blur-md">
            <Flower2 className="h-5 w-5 text-brand-300" />
            <span className="uppercase tracking-widest">{t('badge')}</span>
          </div>
          <h1 className="mb-8 text-4xl font-extrabold leading-tight text-brand-300 drop-shadow-2xl md:text-6xl lg:text-7xl">{t('title')}</h1>
          <div className="mb-8 h-1.5 w-24 rounded-full bg-brand-500 shadow-[0_0_15px_rgba(236,72,153,0.5)]" />
        </div>
      </section>

      <section className="relative z-30 bg-slate-50 py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 lg:grid-cols-12">
            <div className="relative lg:col-span-5">
              <div className="absolute -left-10 -top-10 text-brand-200/50"><Quote className="h-32 w-32 rotate-180" /></div>
              <h2 className="relative z-10 text-3xl font-bold leading-tight text-neutral-800 md:text-5xl">“{t('quote')}”</h2>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-600"><Sparkles className="h-6 w-6" /></div>
                <div>
                  <p className="font-bold text-neutral-900">Tutti Cancer Warriors</p>
                  <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">& GT Race Marbella</p>
                </div>
              </div>
            </div>
            <div className="prose prose-lg text-neutral-700 md:prose-xl lg:col-span-7">
              <p className="mb-6 font-medium leading-relaxed text-neutral-800">{t('p1')}</p>
              <p className="my-8 border-l-4 border-brand-200 pl-6 italic leading-relaxed">{t('p2')}</p>
            </div>
          </div>

          <div className="mx-auto mt-24 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { icon: Users, text: t('stats.women'), className: 'bg-rose-50 text-rose-500' },
              { icon: Target, text: t('stats.purpose'), className: 'bg-purple-50 text-purple-500' },
              { icon: Heart, text: t('stats.impact'), className: 'bg-brand-50 text-brand-500' },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.text} className="flex flex-col items-center rounded-3xl border border-neutral-100 bg-white p-8 text-center shadow-xl transition-transform duration-300 hover:-translate-y-2">
                  <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${stat.className}`}><Icon className="h-8 w-8" /></div>
                  <h3 className="mb-2 text-2xl font-bold text-neutral-800">{stat.text}</h3>
                  <div className="h-1 w-10 rounded-full bg-neutral-200" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative bg-white py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-neutral-800 md:text-5xl">{t('galleryTitle')}</h2>
            <p className="text-xl text-neutral-600">{t('gallerySubtitle')}</p>
          </div>
          <div className="group relative h-[500px] w-full overflow-hidden rounded-3xl bg-neutral-900 shadow-2xl md:h-[700px]">
            {carouselImages.map((source, index) => (
              <div key={source} className={`absolute inset-0 transition-opacity duration-700 ${currentIndex === index ? 'z-10 opacity-100' : 'z-0 opacity-0'}`}>
                <Image src={source} alt="Background Blur" fill className="scale-110 object-cover opacity-40 blur-2xl" />
                <Image src={source} alt={`Pilates Event ${index + 1}`} fill className="object-contain p-4 md:p-8" />
              </div>
            ))}
            <button onClick={prevSlide} className="absolute left-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white opacity-0 shadow-lg backdrop-blur-md transition-all hover:bg-white hover:text-brand-600 group-hover:opacity-100 md:h-16 md:w-16" aria-label="Previous image">
              <ChevronLeft className="h-8 w-8" />
            </button>
            <button onClick={nextSlide} className="absolute right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white opacity-0 shadow-lg backdrop-blur-md transition-all hover:bg-white hover:text-brand-600 group-hover:opacity-100 md:h-16 md:w-16" aria-label="Next image">
              <ChevronRight className="h-8 w-8" />
            </button>
            <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-3">
              {carouselImages.map((source, index) => (
                <button key={source} onClick={() => setCurrentIndex(index)} className={`rounded-full transition-all duration-300 ${currentIndex === index ? 'h-3 w-10 bg-brand-500' : 'h-3 w-3 bg-white/50 hover:bg-white'}`} aria-label={`Go to image ${index + 1}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-neutral-950 py-32">
        <div className="relative z-10 container mx-auto px-4 text-center">
          <Heart className="mx-auto mb-8 h-16 w-16 animate-pulse text-brand-500" fill="currentColor" />
          <h2 className="mx-auto mb-10 max-w-3xl text-4xl font-bold leading-tight text-white md:text-6xl">{t('ctaTitle')}</h2>
          <Link
            href={localizedPath(locale, 'donate')}
            className="group inline-flex items-center justify-center gap-3 rounded-full bg-brand-600 px-12 py-5 text-xl font-bold text-white shadow-[0_0_30px_rgba(236,72,153,0.3)] transition-all hover:-translate-y-1 hover:bg-brand-500"
          >
            {t('button')}
            <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-2" />
          </Link>
        </div>
      </section>

      <style jsx global>{`
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.15); }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slow-zoom { animation: slow-zoom 20s ease-in-out infinite alternate; }
        .animate-fade-in-up { animation: fade-in-up 1s ease-out forwards; }
      `}</style>
    </div>
  );
}
