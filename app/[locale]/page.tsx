'use client';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Heart, Target, TrendingUp, ArrowRight, Sparkles, Quote } from 'lucide-react';
import { IMPACT } from '@/lib/impact';
import { localizedPath } from '@/lib/routes';

export default function HomePage() {
  const t = useTranslations();
  const locale = useLocale();

  const heroBadge =
    locale === 'ro'
      ? `${IMPACT.dreamsFulfilled} vise împlinite în 2026`
      : locale === 'en'
        ? `${IMPACT.dreamsFulfilled} dreams fulfilled in 2026`
        : `${IMPACT.dreamsFulfilled} sueños cumplidos en 2026`;

  const warriors = [
    {
      name: 'Anetra',
      age: 46,
      dream: t('warriorsList.anetra.dream'),
      story: t('warriorsList.anetra.story'),
      image: '/anetra-home.jpg',
    },
    {
      name: 'Janelle',
      age: 40,
      dream: t('warriorsList.janelle.dream'),
      story: t('warriorsList.janelle.story'),
      image: '/janelle-home.jpg',
    },
    {
      name: 'Jeanelle',
      age: 37,
      dream: t('warriorsList.jeanelle.dream'),
      story: t('warriorsList.jeanelle.story'),
      image: '/jeanelle-home.jpg',
    },
  ];

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src="https://cdn.pixabay.com/video/2023/03/01/152798-803733100_large.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-32 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-medium mb-8 shadow-lg border border-white/30 animate-pulse">
            <Sparkles className="w-4 h-4" />
            <span>{heroBadge}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6 drop-shadow-2xl">
            {t('hero.title1')}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-purple-300 to-pink-300">
              {t('hero.title2')}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/95 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-lg">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={localizedPath(locale, 'donate')}
              className="group px-8 py-4 bg-brand-600 text-white font-semibold rounded-full shadow-2xl hover:bg-brand-700 hover:shadow-brand-300/50 hover:scale-110 transition-all flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5" fill="currentColor" />
              {t('hero.ctaDonate')}
            </Link>
            <Link
              href={localizedPath(locale, 'warriors')}
              className="px-8 py-4 bg-white/20 backdrop-blur-md text-white font-semibold rounded-full shadow-2xl hover:bg-white/30 border-2 border-white/40 hover:border-white/60 hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              {t('hero.ctaStories')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              {t('impact.title')} <span className="text-brand-600">{t('impact.titleHighlight')}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="group bg-gradient-to-br from-white to-brand-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-brand-100">
              <div className="w-14 h-14 bg-brand-100 rounded-xl flex items-center justify-center text-brand-600 mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7" />
              </div>
              <div className="text-4xl font-bold text-brand-600 mb-2">
                €{IMPACT.fundsGrantedEur.toLocaleString('en-US')}
              </div>
              <div className="text-neutral-600 font-medium">{t('impact.donated')}</div>
            </div>

            <div className="group bg-gradient-to-br from-white to-purple-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-purple-100">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                <Target className="w-7 h-7" />
              </div>
              <div className="text-4xl font-bold text-purple-600 mb-2">{IMPACT.dreamsFulfilled}</div>
              <div className="text-neutral-600 font-medium">{t('impact.dreamsFulfilled')}</div>
            </div>

            <div className="group bg-gradient-to-br from-white to-pink-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-pink-100">
              <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600 mb-4 group-hover:scale-110 transition-transform">
                <Heart className="w-7 h-7" fill="currentColor" />
              </div>
              <div className="text-4xl font-bold text-pink-600 mb-2">{IMPACT.warriorsSupported}</div>
              <div className="text-neutral-600 font-medium">{t('impact.warriorsSupported')}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-white to-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-4 py-2 bg-brand-100 text-brand-600 rounded-full text-sm font-medium mb-4">
              {t('stories.badge')}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              {t.rich('stories.title', {
                highlight: (chunks) => <span className="text-brand-600">{chunks}</span>,
              })}
            </h2>
            <p className="text-xl text-neutral-600">{t('stories.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {warriors.map((warrior, index) => (
              <div key={warrior.name} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2">
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={warrior.image}
                    alt={warrior.name}
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                      index === 0 ? 'object-[center_25%]' : index === 1 ? 'object-top' : 'object-center'
                    }`}
                  />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-brand-600 text-white text-xs font-semibold rounded-full">
                    {t('stories.tag')}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-neutral-900 mb-2">{warrior.name}, {warrior.age}</h3>
                  <p className="text-brand-600 font-semibold mb-3">{warrior.dream}</p>
                  <p className="text-neutral-600 leading-relaxed">{warrior.story}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href={localizedPath(locale, 'warriors')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 text-white font-semibold rounded-full hover:bg-brand-700 hover:shadow-lg transition-all"
            >
              {t('stories.readMore')}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Quote className="w-16 h-16 text-brand-200 mx-auto mb-6" />
            <blockquote className="text-2xl md:text-3xl font-medium text-neutral-800 mb-8 leading-relaxed">
              “{t.rich('testimonial.quote', {
                bold: (chunks) => <span className="text-brand-600 font-bold">{chunks}</span>,
              })}”
            </blockquote>
            <cite className="text-neutral-500 not-italic">{t('testimonial.author')}</cite>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-brand-600 via-purple-600 to-brand-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent_60%)]" />
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{t('finalCta.title')} 💜</h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed">{t('finalCta.subtitle')}</p>
          <Link
            href={localizedPath(locale, 'donate')}
            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-brand-600 font-bold rounded-full shadow-2xl hover:shadow-white/30 hover:scale-105 transition-all"
          >
            {t('finalCta.button')}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
