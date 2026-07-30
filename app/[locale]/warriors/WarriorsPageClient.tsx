'use client';

import Image from 'next/image';
import {useLocale} from 'next-intl';
import Link from 'next/link';
import {useEffect, useState} from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  Shield,
  Sparkles,
  X,
} from 'lucide-react';
import {
  countryFlags,
  getCountryName,
  getHomepageLocale,
  getHomepageWarriors,
  type HomepageWarrior,
  type WarriorCountry,
} from '@/lib/homepage-content';
import {IMPACT} from '@/lib/impact';
import {localizedPath} from '@/lib/routes';

type CountryFilter = 'ALL' | WarriorCountry;

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

function storyImages(warrior: HomepageWarrior): string[] {
  if (warrior.name === 'Janelle') {
    return ['/janelle-ysc-summit-1.jpg', '/janelle-ysc-summit-2.jpg'];
  }
  return [warrior.image];
}

export default function WarriorsPageClient() {
  const routeLocale = useLocale();
  const locale = getHomepageLocale(routeLocale);
  const warriors = getHomepageWarriors(locale);
  const [countryFilter, setCountryFilter] = useState<CountryFilter>('ALL');
  const [selectedStory, setSelectedStory] = useState<HomepageWarrior | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const copy =
    locale === 'ro'
      ? {
          eyebrow: '18 OAMENI · 18 POVEȘTI',
          title: 'Fiecare om este mai mult decât un diagnostic.',
          subtitle:
            'Descoperă oamenii pe care comunitatea noastră i-a sprijinit și dorințele personale care au adus odihnă, stabilitate, bucurie sau un nou început.',
          supported: 'luptători sprijiniți',
          wishes: 'dorințe importante susținute',
          funds: 'oferiți ca sprijin direct',
          galleryEyebrow: 'POVEȘTILE LUPTĂTORILOR',
          galleryTitle: 'Sprijinul arată diferit pentru fiecare om.',
          galleryBody:
            'Poți vedea toate poveștile sau le poți filtra după țară. Fiecare dorință a pornit de la ceea ce conta cu adevărat pentru persoana respectivă.',
          all: 'Toate țările',
          filterLabel: 'Filtrează poveștile după țară',
          supportLabel: 'Ce am susținut',
          readStory: 'Citește povestea',
          identityProtected: 'Identitate protejată',
          memorial: 'În memoriam',
          close: 'Închide povestea',
          previous: 'Imaginea anterioară',
          next: 'Imaginea următoare',
          image: 'Imaginea',
          modalEyebrow: 'O DORINȚĂ SUSȚINUTĂ',
          donate: 'Susține următoarea dorință',
          apply: 'Aplică pentru sprijin',
          finalEyebrow: 'MAI MULT LOC PENTRU VIAȚĂ',
          finalTitle: 'Următoarea poveste poate începe cu tine.',
          finalBody:
            'O donație sau o cerere de sprijin poate transforma o nevoie personală într-un moment concret de ușurare, apropiere sau speranță.',
        }
      : locale === 'es'
        ? {
            eyebrow: '18 PERSONAS · 18 HISTORIAS',
            title: 'Cada persona es mucho más que un diagnóstico.',
            subtitle:
              'Conoce a las personas apoyadas por nuestra comunidad y los deseos personales que aportaron descanso, estabilidad, alegría o un nuevo comienzo.',
            supported: 'warriors apoyados',
            wishes: 'deseos importantes apoyados',
            funds: 'entregados en apoyo directo',
            galleryEyebrow: 'HISTORIAS DE WARRIORS',
            galleryTitle: 'El apoyo es diferente para cada persona.',
            galleryBody:
              'Puedes ver todas las historias o filtrarlas por país. Cada deseo nació de lo que realmente importaba para esa persona.',
            all: 'Todos los países',
            filterLabel: 'Filtrar historias por país',
            supportLabel: 'Lo que apoyamos',
            readStory: 'Leer la historia',
            identityProtected: 'Identidad protegida',
            memorial: 'En memoria',
            close: 'Cerrar la historia',
            previous: 'Imagen anterior',
            next: 'Imagen siguiente',
            image: 'Imagen',
            modalEyebrow: 'UN DESEO APOYADO',
            donate: 'Apoya el próximo deseo',
            apply: 'Solicita apoyo',
            finalEyebrow: 'MÁS ESPACIO PARA LA VIDA',
            finalTitle: 'La próxima historia puede empezar contigo.',
            finalBody:
              'Una donación o una solicitud puede convertir una necesidad personal en un momento real de alivio, conexión o esperanza.',
          }
        : {
            eyebrow: '18 PEOPLE · 18 STORIES',
            title: 'Every person is more than a diagnosis.',
            subtitle:
              'Meet the people our community has supported and the personal wishes that created rest, stability, joy or a meaningful new beginning.',
            supported: 'warriors supported',
            wishes: 'meaningful wishes supported',
            funds: 'provided in direct support',
            galleryEyebrow: 'WARRIOR STORIES',
            galleryTitle: 'Support looks different for everyone.',
            galleryBody:
              'View every story or filter by country. Each wish began with what genuinely mattered to that person at that moment.',
            all: 'All countries',
            filterLabel: 'Filter stories by country',
            supportLabel: 'What we supported',
            readStory: 'Read their story',
            identityProtected: 'Identity protected',
            memorial: 'In memory',
            close: 'Close story',
            previous: 'Previous image',
            next: 'Next image',
            image: 'Image',
            modalEyebrow: 'A WISH SUPPORTED',
            donate: 'Support the next wish',
            apply: 'Apply for support',
            finalEyebrow: 'MORE ROOM FOR LIFE',
            finalTitle: 'The next story can begin with you.',
            finalBody:
              'A donation or an application can turn a personal need into a real moment of relief, connection or hope.',
          };

  const filteredWarriors =
    countryFilter === 'ALL'
      ? warriors
      : warriors.filter((warrior) => warrior.country === countryFilter);

  const selectedImages = selectedStory ? storyImages(selectedStory) : [];

  const closeStory = () => {
    setSelectedStory(null);
    setSelectedImageIndex(0);
  };

  const openStory = (warrior: HomepageWarrior) => {
    setSelectedImageIndex(0);
    setSelectedStory(warrior);
  };

  const showPreviousImage = () => {
    setSelectedImageIndex((current) => (current - 1 + selectedImages.length) % selectedImages.length);
  };

  const showNextImage = () => {
    setSelectedImageIndex((current) => (current + 1) % selectedImages.length);
  };

  useEffect(() => {
    if (!selectedStory) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedStory(null);
        setSelectedImageIndex(0);
      }
      if (selectedImages.length > 1 && event.key === 'ArrowLeft') {
        setSelectedImageIndex(
          (current) => (current - 1 + selectedImages.length) % selectedImages.length,
        );
      }
      if (selectedImages.length > 1 && event.key === 'ArrowRight') {
        setSelectedImageIndex((current) => (current + 1) % selectedImages.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedImages.length, selectedStory]);

  const countries: WarriorCountry[] = ['US', 'UK', 'RO'];

  return (
    <main className="min-h-screen bg-white pt-20">
      <section className="relative overflow-hidden bg-[#f5edfa]">
        <ButterflyMark className="pointer-events-none absolute left-[6%] top-20 h-7 w-7 -rotate-12 text-purple-300/70" />
        <ButterflyMark className="pointer-events-none absolute bottom-16 right-[7%] h-10 w-10 rotate-[18deg] text-purple-300/50" />
        <div className="mx-auto grid min-h-[650px] max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-[1.02fr_.98fr] lg:py-24">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/70 px-4 py-2 text-xs font-bold tracking-[0.16em] text-purple-900 shadow-sm">
              <ButterflyMark className="h-4 w-4 text-purple-500" />
              {copy.eyebrow}
            </div>
            <h1 className="mt-7 max-w-2xl text-5xl font-bold leading-[1.04] tracking-[-0.04em] text-purple-950 md:text-6xl">
              {copy.title}
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-purple-950/75 md:text-xl">
              {copy.subtitle}
            </p>
            <a
              href="#stories"
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-purple-700 px-7 py-4 font-semibold text-white shadow-xl shadow-purple-500/20 transition hover:scale-[1.02] hover:bg-purple-800"
            >
              {copy.galleryEyebrow}
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>

          <div className="relative mx-auto h-[470px] w-full max-w-xl">
            <div className="absolute left-[2%] top-[12%] h-[72%] w-[42%] -rotate-6 overflow-hidden rounded-[2rem] border-4 border-white shadow-2xl">
              <Image
                src="/anetra-home.jpg"
                alt="Anetra"
                fill
                priority
                sizes="(min-width: 1024px) 22vw, 42vw"
                className="object-cover object-[center_25%]"
              />
            </div>
            <div className="absolute left-[31%] top-0 z-10 h-[82%] w-[43%] rotate-2 overflow-hidden rounded-[2rem] border-4 border-white shadow-2xl">
              <Image
                src="/warriors/cristina.webp"
                alt="Cristina"
                fill
                priority
                sizes="(min-width: 1024px) 22vw, 42vw"
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-[1%] h-[70%] w-[40%] rotate-6 overflow-hidden rounded-[2rem] border-4 border-white shadow-2xl">
              <Image
                src="/warriors/laura.webp"
                alt="Laura"
                fill
                priority
                sizes="(min-width: 1024px) 20vw, 40vw"
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-5 left-[24%] z-20 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-purple-600 text-white shadow-xl">
              <Heart className="h-7 w-7" fill="currentColor" />
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-20 -mt-8 px-6">
        <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] border border-purple-100 bg-white shadow-xl sm:grid-cols-3 sm:divide-x sm:divide-purple-100">
          <div className="px-7 py-7 text-center">
            <p className="text-4xl font-bold text-purple-950">{IMPACT.warriorsSupported}</p>
            <p className="mt-1 text-sm text-neutral-500">{copy.supported}</p>
          </div>
          <div className="border-t border-purple-100 px-7 py-7 text-center sm:border-t-0">
            <p className="text-4xl font-bold text-purple-950">{IMPACT.dreamsFulfilled}</p>
            <p className="mt-1 text-sm text-neutral-500">{copy.wishes}</p>
          </div>
          <div className="border-t border-purple-100 px-7 py-7 text-center sm:border-t-0">
            <p className="text-4xl font-bold text-purple-950">
              €{IMPACT.fundsGrantedEur.toLocaleString('en-US')}
            </p>
            <p className="mt-1 text-sm text-neutral-500">{copy.funds}</p>
          </div>
        </div>
      </section>

      <section id="stories" className="scroll-mt-24 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <p className="text-sm font-bold tracking-[0.18em] text-purple-600">{copy.galleryEyebrow}</p>
            <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em] text-purple-950 md:text-5xl">
              {copy.galleryTitle}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-neutral-600">{copy.galleryBody}</p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3" role="group" aria-label={copy.filterLabel}>
            <button
              type="button"
              onClick={() => setCountryFilter('ALL')}
              aria-pressed={countryFilter === 'ALL'}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                countryFilter === 'ALL'
                  ? 'bg-purple-700 text-white shadow-lg shadow-purple-500/20'
                  : 'border border-purple-200 bg-white text-purple-900 hover:border-purple-400'
              }`}
            >
              {copy.all} · {warriors.length}
            </button>
            {countries.map((country) => {
              const count = warriors.filter((warrior) => warrior.country === country).length;
              return (
                <button
                  key={country}
                  type="button"
                  onClick={() => setCountryFilter(country)}
                  aria-pressed={countryFilter === country}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                    countryFilter === country
                      ? 'bg-purple-700 text-white shadow-lg shadow-purple-500/20'
                      : 'border border-purple-200 bg-white text-purple-900 hover:border-purple-400'
                  }`}
                >
                  {countryFlags[country]} {getCountryName(locale, country)} · {count}
                </button>
              );
            })}
          </div>

          <div className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {filteredWarriors.map((warrior) => {
              const photoProtected =
                warrior.name === 'D.' || warrior.name === 'Mirela' || warrior.name === 'Iulia';
              return (
                <article
                  key={warrior.name}
                  className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-purple-100 bg-[#fdfbfe] shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-80 overflow-hidden bg-purple-100">
                    <Image
                      src={warrior.image}
                      alt={
                        photoProtected
                          ? `${warrior.name}, ${copy.identityProtected.toLowerCase()}`
                          : warrior.name
                      }
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className={`object-cover transition duration-700 group-hover:scale-[1.03] ${
                        warrior.imagePosition ?? 'object-center'
                      }`}
                    />
                    <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-purple-950/70 to-transparent" />
                    <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-purple-950 shadow-sm backdrop-blur">
                      <MapPin className="h-3.5 w-3.5 text-purple-600" />
                      {countryFlags[warrior.country]} {getCountryName(locale, warrior.country)}
                    </div>
                    {warrior.memorial && (
                      <div className="absolute right-4 top-4 rounded-full bg-purple-950/85 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                        {copy.memorial}
                      </div>
                    )}
                    {photoProtected && (
                      <div className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-purple-950/80 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                        <Shield className="h-3.5 w-3.5" />
                        {copy.identityProtected}
                      </div>
                    )}
                    <h3 className="absolute bottom-4 left-5 text-3xl font-bold text-white">{warrior.name}</h3>
                  </div>

                  <div className="flex flex-1 flex-col p-7">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-purple-600">
                      {copy.supportLabel}
                    </p>
                    <p className="mt-2 text-xl font-bold leading-snug text-purple-950">{warrior.support}</p>
                    <p className="mt-4 line-clamp-3 leading-relaxed text-neutral-600">{warrior.story}</p>
                    <button
                      type="button"
                      onClick={() => openStory(warrior)}
                      className="mt-7 inline-flex items-center gap-2 self-start font-semibold text-purple-700 transition hover:text-purple-900"
                    >
                      {copy.readStory}
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-purple-950 via-purple-800 to-brand-700 py-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(255,255,255,.12),transparent_30%),radial-gradient(circle_at_80%_70%,rgba(216,180,254,.18),transparent_34%)]" />
        <ButterflyMark className="pointer-events-none absolute left-[9%] top-14 h-8 w-8 -rotate-12 text-purple-300/70" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <p className="text-sm font-bold tracking-[0.2em] text-purple-200">{copy.finalEyebrow}</p>
          <h2 className="mt-5 text-4xl font-bold tracking-[-0.03em] md:text-6xl">{copy.finalTitle}</h2>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-purple-100">{copy.finalBody}</p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={localizedPath(routeLocale, 'supportDream')}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-purple-800 shadow-xl transition hover:scale-[1.03]"
            >
              <Heart className="h-5 w-5" fill="currentColor" />
              {copy.donate}
            </Link>
            <Link
              href={localizedPath(routeLocale, 'dreamApplication')}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 py-4 font-bold text-white backdrop-blur transition hover:bg-white/20"
            >
              {copy.apply}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {selectedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 cursor-default bg-purple-950/75 backdrop-blur-sm"
            onClick={closeStory}
            aria-label={copy.close}
          />
          <article
            role="dialog"
            aria-modal="true"
            aria-labelledby="warrior-story-title"
            className="relative grid max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[2rem] bg-white shadow-2xl md:grid-cols-[.95fr_1.05fr]"
          >
            <button
              type="button"
              onClick={closeStory}
              aria-label={copy.close}
              className="absolute right-4 top-4 z-30 rounded-full bg-white/90 p-2.5 text-purple-950 shadow-lg transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="relative min-h-[22rem] overflow-hidden bg-purple-100 md:min-h-[42rem]">
              <Image
                src={selectedImages[selectedImageIndex]}
                alt={`${selectedStory.name}: ${copy.image} ${selectedImageIndex + 1}`}
                fill
                priority
                sizes="(min-width: 768px) 48vw, 100vw"
                className={
                  selectedStory.name === 'Janelle'
                    ? 'object-contain'
                    : `object-cover ${selectedStory.imagePosition ?? 'object-center'}`
                }
              />
              {selectedImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={showPreviousImage}
                    aria-label={copy.previous}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 text-purple-950 shadow-lg transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    type="button"
                    onClick={showNextImage}
                    aria-label={copy.next}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 text-purple-950 shadow-lg transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-purple-950/65 px-3 py-2 backdrop-blur">
                    {selectedImages.map((image, index) => (
                      <button
                        key={image}
                        type="button"
                        onClick={() => setSelectedImageIndex(index)}
                        aria-label={`${copy.image} ${index + 1}`}
                        aria-current={selectedImageIndex === index}
                        className={`h-2.5 rounded-full transition ${
                          selectedImageIndex === index ? 'w-7 bg-white' : 'w-2.5 bg-white/50 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col justify-center p-8 md:p-12">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-purple-100 px-3 py-1.5 text-xs font-bold text-purple-800">
                  {countryFlags[selectedStory.country]} {getCountryName(locale, selectedStory.country)}
                </span>
                {selectedStory.memorial && (
                  <span className="rounded-full bg-purple-950 px-3 py-1.5 text-xs font-bold text-white">
                    {copy.memorial}
                  </span>
                )}
              </div>
              <p className="mt-8 text-xs font-bold tracking-[0.16em] text-purple-600">{copy.modalEyebrow}</p>
              <h2 id="warrior-story-title" className="mt-3 text-4xl font-bold tracking-[-0.03em] text-purple-950">
                {selectedStory.name}
              </h2>
              <h3 className="mt-5 text-2xl font-bold leading-snug text-purple-700">{selectedStory.support}</h3>
              <p className="mt-6 text-lg leading-relaxed text-neutral-600">{selectedStory.story}</p>
              <Link
                href={localizedPath(routeLocale, 'supportDream')}
                className="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-purple-700 px-7 py-4 font-bold text-white shadow-lg transition hover:bg-purple-800"
              >
                <Heart className="h-5 w-5" fill="currentColor" />
                {copy.donate}
              </Link>
            </div>
          </article>
        </div>
      )}
    </main>
  );
}
