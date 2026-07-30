'use client';

import Image from 'next/image';
import {useLocale} from 'next-intl';
import Link from 'next/link';
import {useEffect, useState} from 'react';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Heart,
  Home,
  MessageCircle,
  Moon,
  Shield,
  Sparkles,
  Users,
} from 'lucide-react';
import {
  countryFlags,
  getCountryName,
  getHomepageLocale,
  getHomepageWarriors,
  homepageCopy,
} from '@/lib/homepage-content';
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

const pathwayIcons = [Home, Moon, Users, Briefcase, MessageCircle];

export default function HomePageClient() {
  const routeLocale = useLocale();
  const locale = getHomepageLocale(routeLocale);
  const copy = homepageCopy[locale];
  const warriors = getHomepageWarriors(locale);
  const [activeHeroStory, setActiveHeroStory] = useState(0);
  const [storyCarouselStart, setStoryCarouselStart] = useState(0);

  const heroCopy =
    locale === 'ro'
      ? {
          eyebrow: '18 LUPTĂTORI SPRIJINIȚI',
          titleLines: [
            'Oamenii care trăiesc cu cancer',
            'merită mai mult decât',
            'să supraviețuiască.',
          ],
          body: 'Împreună, susținem dorințe importante, ajutor practic și momente care fac viața să se simtă din nou ca viață.',
          support: 'Sprijină un luptător',
          learn: 'Cunoaște-i pe luptători',
          carousel: 'Poveștile luptătorilor',
        }
      : locale === 'es'
        ? {
            eyebrow: '18 WARRIORS APOYADOS',
            titleLines: [
              'Las personas que viven con cáncer',
              'merecen más que',
              'sobrevivir.',
            ],
            body: 'Juntos, apoyamos deseos importantes, ayuda práctica y momentos que hacen que la vida vuelva a sentirse como vida.',
            support: 'Apoya a un warrior',
            learn: 'Conoce a los warriors',
            carousel: 'Historias de warriors',
          }
        : {
            eyebrow: '18 WARRIORS SUPPORTED',
            titleLines: [
              'People living with cancer',
              'deserve more than',
              'survival.',
            ],
            body: 'Together, we help fund meaningful wishes, practical relief and moments that feel like life again.',
            support: 'Support a warrior',
            learn: 'Meet the warriors',
            carousel: 'Warrior stories',
          };

  const heroStoryNames = [
    'Anetra',
    'Janelle',
    'Jeanelle',
    'Elise',
    'Giulia',
    'Maria',
    'Cristina',
    'Laura',
  ];
  const heroStories = heroStoryNames.map(
    (name) => warriors.find((warrior) => warrior.name === name)!,
  );
  const visibleWarriorStories = Array.from({length: 4}, (_, offset) =>
    warriors[(storyCarouselStart + offset) % warriors.length],
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveHeroStory((current) => (current + 1) % heroStories.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [heroStories.length]);

  return (
    <>
      <section className="relative overflow-hidden bg-[#f5edfa] pt-36">
        <ButterflyMark className="pointer-events-none absolute left-[7%] top-44 h-7 w-7 -rotate-[18deg] text-purple-300/80" />
        <ButterflyMark className="pointer-events-none absolute bottom-14 left-[43%] h-5 w-5 rotate-[24deg] text-purple-300/60" />
        <ButterflyMark className="pointer-events-none absolute right-[6%] top-52 h-6 w-6 rotate-[20deg] text-purple-300/70" />
        <div className="relative mx-auto grid min-h-[760px] max-w-[1600px] items-stretch lg:grid-cols-[minmax(0,1.08fr)_minmax(460px,.92fr)]">
          <div className="relative z-10 flex items-center px-6 py-24 md:px-12 lg:px-20 xl:px-28">
            <div className="max-w-2xl">
              <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-[-0.04em] text-purple-950 md:text-6xl xl:text-[4rem]">
                {heroCopy.titleLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-purple-950/75 md:text-xl">
                {heroCopy.body}
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={localizedPath(routeLocale, 'donate')}
                  className="group flex items-center justify-center gap-2 rounded-full bg-brand-600 px-7 py-4 font-semibold text-white shadow-xl shadow-brand-500/20 transition hover:scale-[1.03] hover:bg-brand-700"
                >
                  <Heart className="h-5 w-5" fill="currentColor" />
                  {heroCopy.support}
                </Link>
                <a
                  href="#warrior-stories"
                  className="group flex items-center justify-center gap-2 rounded-full border border-purple-300 bg-white/60 px-7 py-4 font-semibold text-purple-950 shadow-sm transition hover:border-purple-500 hover:bg-white"
                >
                  {heroCopy.learn}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>

          <div className="relative min-h-[520px] overflow-hidden bg-gradient-to-br from-[#e8d8f2] via-[#f2def0] to-[#e6d8f5] p-6 md:p-10 lg:min-h-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,.65),transparent_38%),radial-gradient(circle_at_90%_78%,rgba(255,255,255,.42),transparent_38%)]" />
            <div className="relative h-full min-h-[460px]">
              {heroStories.map((story, index) => (
                <article
                  key={story.name}
                  className={`absolute inset-0 overflow-hidden rounded-[2rem] bg-white shadow-2xl transition-all duration-700 ${
                    index === activeHeroStory ? 'translate-x-0 opacity-100' : 'pointer-events-none translate-x-8 opacity-0'
                  }`}
                  aria-hidden={index !== activeHeroStory}
                >
                  <Image
                    src={story.image}
                    alt={`${story.name}: ${story.support}`}
                    fill
                    priority={index === 0}
                    sizes="(min-width: 1024px) 46vw, 100vw"
                    className={`object-cover ${story.imagePosition ?? 'object-center'}`}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-purple-950/90 via-purple-950/40 to-transparent p-7 pt-28 text-white">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-purple-100">
                      <span>{countryFlags[story.country]} {getCountryName(locale, story.country)}</span>
                    </div>
                    <h2 className="mt-2 text-3xl font-bold">{story.name}</h2>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-white/90">{story.support}</p>
                  </div>
                </article>
              ))}
              <div
                className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2"
                aria-label={heroCopy.carousel}
              >
                {heroStories.map((story, index) => (
                  <button
                    key={story.name}
                    type="button"
                    onClick={() => setActiveHeroStory(index)}
                    className={`h-2.5 rounded-full transition-all ${
                      index === activeHeroStory ? 'w-8 bg-white' : 'w-2.5 bg-white/55 hover:bg-white/80'
                    }`}
                    aria-label={`${story.name}: ${story.support}`}
                    aria-current={index === activeHeroStory}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-24 md:py-32">
        <ButterflyMark className="pointer-events-none absolute right-[9%] top-20 h-8 w-8 rotate-12 text-purple-200" />
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-[.82fr_1.18fr]">
          <div className="relative mx-auto flex h-64 w-64 items-center justify-center rounded-full bg-[#f5edfa] md:h-80 md:w-80">
            <div className="absolute inset-6 rounded-full border border-purple-200" />
            <div className="absolute inset-12 rounded-full border border-purple-300/70" />
            <ButterflyMark className="h-28 w-28 text-purple-500" />
            <Sparkles className="absolute right-7 top-12 h-8 w-8 text-purple-300" />
          </div>
          <div>
            <p className="text-sm font-bold tracking-[0.18em] text-purple-600">{copy.mission.eyebrow}</p>
            <h2 className="mt-5 max-w-3xl text-4xl font-bold leading-tight tracking-[-0.03em] text-purple-950 md:text-5xl">
              {copy.mission.title}
            </h2>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-neutral-600 md:text-xl">
              {copy.mission.body}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#faf7fc] py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold tracking-[0.18em] text-purple-600">{copy.pathways.eyebrow}</p>
            <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em] text-purple-950 md:text-5xl">
              {copy.pathways.title}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-neutral-600">{copy.pathways.body}</p>
          </div>
          <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {copy.pathways.items.map((item, index) => {
              const Icon = pathwayIcons[index];
              return (
                <article
                  key={item.title}
                  className="group rounded-[1.75rem] border border-purple-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-purple-200 hover:shadow-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-700 transition group-hover:bg-purple-600 group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-purple-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-600">{item.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-purple-950 py-12 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_50%,rgba(192,132,252,.23),transparent_32%),radial-gradient(circle_at_85%_45%,rgba(244,114,182,.16),transparent_30%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 text-center sm:grid-cols-3 sm:divide-x sm:divide-white/15">
          <div>
            <p className="text-4xl font-bold md:text-5xl">€{IMPACT.fundsGrantedEur.toLocaleString('en-US')}</p>
            <p className="mt-2 text-sm text-purple-100">{copy.impact.funds}</p>
          </div>
          <div>
            <p className="text-4xl font-bold md:text-5xl">{IMPACT.dreamsFulfilled}</p>
            <p className="mt-2 text-sm text-purple-100">{copy.impact.dreams}</p>
          </div>
          <div>
            <p className="text-4xl font-bold md:text-5xl">{IMPACT.warriorsSupported}</p>
            <p className="mt-2 text-sm text-purple-100">{copy.impact.warriors}</p>
          </div>
        </div>
      </section>

      <section id="warrior-stories" className="scroll-mt-24 bg-white py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-bold tracking-[0.18em] text-purple-600">{copy.stories.eyebrow}</p>
              <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em] text-purple-950 md:text-5xl">
                {copy.stories.title}
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-neutral-600">{copy.stories.body}</p>
            </div>
            <Link
              href={localizedPath(routeLocale, 'warriors')}
              className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-purple-200 px-6 py-3 font-semibold text-purple-800 transition hover:border-purple-500 hover:bg-purple-50 lg:self-auto"
            >
              {copy.stories.viewAll}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div
            className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            aria-label={copy.stories.carouselLabel}
            aria-live="polite"
          >
            {visibleWarriorStories.map((warrior, index) => {
              const photoProtected = warrior.name === 'D.' || warrior.name === 'Mirela' || warrior.name === 'Iulia';
              const responsiveVisibility =
                index === 0
                  ? 'flex'
                  : index === 1
                    ? 'hidden sm:flex'
                    : 'hidden lg:flex';
              return (
                <Link
                  key={warrior.name}
                  href={localizedPath(routeLocale, 'warriors')}
                  className={`group flex-col overflow-hidden rounded-[1.6rem] border border-purple-100 bg-[#fdfbfe] shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${responsiveVisibility}`}
                >
                  <div className="relative h-56 overflow-hidden bg-gradient-to-br from-purple-100 via-[#f6eefa] to-pink-50">
                    <Image
                      src={warrior.image}
                      alt={photoProtected ? `${warrior.name}, ${copy.stories.photoProtected.toLowerCase()}` : warrior.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className={`object-cover transition duration-700 group-hover:scale-[1.04] ${warrior.imagePosition ?? 'object-center'}`}
                    />
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-purple-950/70 to-transparent" />
                    <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-purple-950 shadow-sm backdrop-blur">
                      {countryFlags[warrior.country]} {getCountryName(locale, warrior.country)}
                    </div>
                    {warrior.memorial && (
                      <div className="absolute right-4 top-4 rounded-full bg-purple-950/85 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                        {copy.stories.memorial}
                      </div>
                    )}
                    {photoProtected && (
                      <div className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-purple-950/80 px-2.5 py-1.5 text-xs font-semibold text-white backdrop-blur">
                        <Shield className="h-3.5 w-3.5" />
                        <span className="sr-only">{copy.stories.photoProtected}</span>
                      </div>
                    )}
                    <h3 className="absolute bottom-4 left-5 text-2xl font-bold text-white">{warrior.name}</h3>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-purple-600">
                      {copy.stories.supported}
                    </p>
                    <p className="mt-2 line-clamp-2 text-base font-semibold leading-snug text-neutral-900">
                      {warrior.support}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-7 flex items-center justify-between">
            <p className="text-sm font-semibold text-purple-800">
              {storyCarouselStart + 1} / {warriors.length}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setStoryCarouselStart((current) => (current - 1 + warriors.length) % warriors.length)
                }
                aria-label={copy.stories.previous}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-purple-200 bg-white text-purple-800 transition hover:border-purple-500 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setStoryCarouselStart((current) => (current + 1) % warriors.length)
                }
                aria-label={copy.stories.next}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-700 text-white shadow-lg shadow-purple-500/20 transition hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f5edfa] py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold tracking-[0.18em] text-purple-600">{copy.next.eyebrow}</p>
            <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em] text-purple-950 md:text-5xl">
              {copy.next.title}
            </h2>
          </div>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {[
              {content: copy.next.apply, icon: Sparkles, route: 'dreamApplication' as const},
              {content: copy.next.learn, icon: BookOpen, route: 'aboutCancer' as const},
              {content: copy.next.peers, icon: Users, route: 'peerSupport' as const},
            ].map(({content, icon: Icon, route}) => (
              <Link
                key={content.title}
                href={localizedPath(routeLocale, route)}
                className="group rounded-[2rem] border border-purple-100 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-purple-300 hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-700 transition group-hover:bg-purple-600 group-hover:text-white">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-7 text-2xl font-bold text-purple-950">{content.title}</h3>
                <p className="mt-3 leading-relaxed text-neutral-600">{content.body}</p>
                <span className="mt-7 inline-flex items-center gap-2 font-semibold text-purple-700">
                  {content.cta}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-purple-950 via-purple-800 to-brand-700 py-24 text-white md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_25%,rgba(255,255,255,.12),transparent_30%),radial-gradient(circle_at_78%_70%,rgba(216,180,254,.18),transparent_34%)]" />
        <ButterflyMark className="pointer-events-none absolute left-[10%] top-16 h-8 w-8 -rotate-12 text-purple-300/70" />
        <ButterflyMark className="pointer-events-none absolute bottom-16 right-[12%] h-12 w-12 rotate-[18deg] text-purple-200/50" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <p className="text-sm font-bold tracking-[0.2em] text-purple-200">{copy.final.eyebrow}</p>
          <h2 className="mt-5 text-4xl font-bold leading-tight tracking-[-0.03em] md:text-6xl">
            {copy.final.title}
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-purple-100">{copy.final.body}</p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={localizedPath(routeLocale, 'supportDream')}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-purple-800 shadow-xl transition hover:scale-[1.03]"
            >
              <Heart className="h-5 w-5" fill="currentColor" />
              {copy.final.donate}
            </Link>
            <a
              href="#warrior-stories"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 py-4 font-bold text-white backdrop-blur transition hover:bg-white/20"
            >
              {copy.final.stories}
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
