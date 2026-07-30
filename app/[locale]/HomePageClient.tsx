'use client';

import Image from 'next/image';
import {useLocale, useTranslations} from 'next-intl';
import Link from 'next/link';
import {useEffect, useState} from 'react';
import {
  ArrowRight,
  Heart,
  Quote,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';
import {IMPACT} from '@/lib/impact';
import {localizedPath} from '@/lib/routes';

function ButterflyMark({className = ''}: {className?: string}) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path d="M23.7 24.8C16.8 10.8 5.8 11.9 7.5 22.1c1.5 9 10.8 9.2 16.2 3.6Z" fill="currentColor" />
      <path d="M24.3 24.8C31.2 10.8 42.2 11.9 40.5 22.1c-1.5 9-10.8 9.2-16.2 3.6Z" fill="currentColor" />
      <path d="M23.8 25.1c-5.2 3.8-9.3 10.5-5.2 13.4 3.3 2.3 5.7-3 5.4-11.3h.1c-.3 8.3 2.1 13.6 5.4 11.3 4.1-2.9 0-9.6-5.2-13.4h-.5Z" fill="currentColor" />
      <path d="M24 25v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function HomePageClient() {
  const t = useTranslations();
  const locale = useLocale();
  const [activeHeroStory, setActiveHeroStory] = useState(0);

  const heroBadge =
    locale === 'ro'
      ? `${IMPACT.dreamsFulfilled} vise împlinite în 2026`
      : locale === 'en'
        ? `${IMPACT.dreamsFulfilled} dreams fulfilled in 2026`
        : `${IMPACT.dreamsFulfilled} sueños cumplidos en 2026`;

  const warriors = [
    {
      name: 'Anetra',
      dream: t('warriorsList.anetra.dream'),
      story: t('warriorsList.anetra.story'),
      image: '/anetra-home.jpg',
    },
    {
      name: 'Janelle',
      dream: t('warriorsList.janelle.dream'),
      story: t('warriorsList.janelle.story'),
      image: '/janelle-home.jpg',
    },
    {
      name: 'Jeanelle',
      dream: t('warriorsList.jeanelle.dream'),
      story: t('warriorsList.jeanelle.story'),
      image: '/jeanelle-home.jpg',
    },
  ];

  const heroCopy = locale === 'ro'
    ? {
        eyebrow: '18 WARRIORI SPRIJINIȚI',
        title: 'Oamenii care trăiesc cu cancer merită mai mult decât să supraviețuiască.',
        body: 'Împreună, susținem dorințe importante, ajutor practic și momente care fac viața să se simtă din nou ca viață.',
        support: 'Sprijină un warrior',
        learn: 'Cum ajutăm',
      }
    : locale === 'es'
      ? {
          eyebrow: '18 WARRIORS APOYADOS',
          title: 'Las personas que viven con cáncer merecen más que sobrevivir.',
          body: 'Juntos, apoyamos deseos importantes, ayuda práctica y momentos que hacen que la vida vuelva a sentirse como vida.',
          support: 'Apoya a un warrior',
          learn: 'Cómo ayudamos',
        }
      : {
          eyebrow: '18 WARRIORS SUPPORTED',
          title: 'People living with cancer deserve more than survival.',
          body: 'Together, we help fund meaningful wishes, practical relief and moments that feel like life again.',
          support: 'Support a warrior',
          learn: 'How we help',
        };

  const heroStories = warriors.map((warrior, index) => ({
    ...warrior,
    caption: locale === 'ro'
      ? ['Un loc liniștit pentru odihnă', 'Sprijin pentru un nou început', 'Mai mult loc pentru viață'][index]
      : locale === 'es'
        ? ['Un lugar tranquilo para descansar', 'Apoyo para un nuevo comienzo', 'Más espacio para la vida'][index]
        : ['A peaceful place to rest', 'Support for a new beginning', 'More room for life'][index],
  }));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveHeroStory((current) => (current + 1) % heroStories.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [heroStories.length]);

  return (
    <>
      <section className="relative overflow-hidden bg-[#f5edfa]">
        <ButterflyMark className="pointer-events-none absolute left-[7%] top-16 h-7 w-7 rotate-[-18deg] text-purple-300/80" />
        <ButterflyMark className="pointer-events-none absolute bottom-14 left-[43%] h-5 w-5 rotate-[24deg] text-purple-300/60" />
        <ButterflyMark className="pointer-events-none absolute right-[6%] top-24 h-6 w-6 rotate-[20deg] text-purple-300/70" />
        <div className="relative mx-auto grid min-h-[760px] max-w-[1600px] items-stretch lg:grid-cols-[minmax(0,1.08fr)_minmax(460px,.92fr)]">
          <div className="relative z-10 flex items-center px-6 py-24 md:px-12 lg:px-20 xl:px-28">
            <div className="max-w-2xl">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/70 px-4 py-2 text-xs font-bold tracking-[0.16em] text-purple-900 shadow-sm backdrop-blur">
                <ButterflyMark className="h-4 w-4 text-purple-500" />
                <span>{heroCopy.eyebrow}</span>
              </div>
              <h1 className="max-w-xl text-5xl font-bold leading-[1.04] tracking-[-0.04em] text-purple-950 md:text-6xl xl:text-7xl">
                {heroCopy.title}
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-purple-950/75 md:text-xl">
                {heroCopy.body}
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={localizedPath(locale, 'donate')}
                  className="group flex items-center justify-center gap-2 rounded-full bg-brand-600 px-7 py-4 font-semibold text-white shadow-xl shadow-brand-500/20 transition hover:scale-[1.03] hover:bg-brand-700"
                >
                  <Heart className="w-5 h-5" fill="currentColor" />
                  {heroCopy.support}
                </Link>
                <Link
                  href={localizedPath(locale, 'warriors')}
                  className="group flex items-center justify-center gap-2 rounded-full border border-purple-300 bg-white/60 px-7 py-4 font-semibold text-purple-950 shadow-sm transition hover:border-purple-500 hover:bg-white"
                >
                  {heroCopy.learn}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
          <div className="relative min-h-[520px] overflow-hidden bg-gradient-to-br from-[#e8d8f2] via-[#f2def0] to-[#e6d8f5] p-6 md:p-10 lg:min-h-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,.65),transparent_38%),radial-gradient(circle_at_90%_78%,rgba(255,255,255,.42),transparent_38%)]" />
            <div className="relative h-full min-h-[460px]">
              {heroStories.map((story, index) => (
                <article
                  key={story.name}
                  className={`absolute inset-0 overflow-hidden rounded-[2rem] bg-white shadow-2xl transition-all duration-700 ${index === activeHeroStory ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}
                  aria-hidden={index !== activeHeroStory}
                >
                  <Image
                    src={story.image}
                    alt={`${story.name}: ${story.caption}`}
                    fill
                    priority={index === 0}
                    sizes="(min-width: 1024px) 46vw, 100vw"
                    className={`object-cover ${index === 0 ? 'object-[center_25%]' : index === 1 ? 'object-top' : 'object-center'}`}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-purple-950/80 via-purple-950/30 to-transparent p-7 pt-28 text-white">
                    <p className="text-xs font-bold uppercase tracking-[0.17em] text-purple-100">{heroBadge}</p>
                    <h2 className="mt-2 text-3xl font-bold">{story.caption}</h2>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-white/90">{story.dream}</p>
                  </div>
                </article>
              ))}
              <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2" aria-label="Warrior stories">
                {heroStories.map((story, index) => (
                  <button key={story.name} type="button" onClick={() => setActiveHeroStory(index)} className={`h-2.5 rounded-full transition-all ${index === activeHeroStory ? 'w-8 bg-white' : 'w-2.5 bg-white/55 hover:bg-white/80'}`} aria-label={`${story.name} story`} aria-current={index === activeHeroStory} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              {t('impact.title')}{' '}
              <span className="text-brand-600">{t('impact.titleHighlight')}</span>
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
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {IMPACT.dreamsFulfilled}
              </div>
              <div className="text-neutral-600 font-medium">
                {t('impact.dreamsFulfilled')}
              </div>
            </div>

            <div className="group bg-gradient-to-br from-white to-pink-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-pink-100">
              <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600 mb-4 group-hover:scale-110 transition-transform">
                <Heart className="w-7 h-7" fill="currentColor" />
              </div>
              <div className="text-4xl font-bold text-pink-600 mb-2">
                {IMPACT.warriorsSupported}
              </div>
              <div className="text-neutral-600 font-medium">
                {t('impact.warriorsSupported')}
              </div>
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
              <div
                key={warrior.name}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2"
              >
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={warrior.image}
                    alt={warrior.name}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className={`object-cover transition-transform duration-500 group-hover:scale-110 ${
                      index === 0
                        ? 'object-[center_25%]'
                        : index === 1
                          ? 'object-top'
                          : 'object-center'
                    }`}
                  />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-brand-600 text-white text-xs font-semibold rounded-full">
                    {t('stories.tag')}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                    {warrior.name}
                  </h3>
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
              “
              {t.rich('testimonial.quote', {
                bold: (chunks) => <span className="text-brand-600 font-bold">{chunks}</span>,
              })}
              ”
            </blockquote>
            <cite className="text-neutral-500 not-italic">{t('testimonial.author')}</cite>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-brand-600 via-purple-600 to-brand-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent_60%)]" />
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('finalCta.title')} 💜
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('finalCta.subtitle')}
          </p>
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
