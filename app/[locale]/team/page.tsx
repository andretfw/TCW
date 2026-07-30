'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useLocale, useTranslations} from 'next-intl';
import {useState} from 'react';
import {
  ArrowRight,
  BookOpen,
  Heart,
  Sparkles,
  Users,
} from 'lucide-react';
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

export default function TeamPage() {
  const t = useTranslations('teamPage');
  const locale = useLocale();
  const [activeMemberId, setActiveMemberId] = useState<string | null>(null);

  const mobileCopy =
    locale === 'ro'
      ? {open: 'Vezi biografia', close: 'Înapoi', email: 'Trimite un email'}
      : locale === 'es'
        ? {open: 'Ver biografía', close: 'Volver', email: 'Enviar un correo'}
        : {open: 'View biography', close: 'Back', email: 'Send an email'};

  const teamMembers = ['1', '2', '3'].map((id) => ({
    id,
    name: t(`members.${id}.name`),
    role: t(`members.${id}.role`),
    image: t(`members.${id}.image`),
    description: t(`members.${id}.description`),
    email: id === '1' ? 'andreea@tutticancerwarriors.org' : 'tcw@tutticancerwarriors.org',
  }));

  const missionPillars = [
    {
      icon: Heart,
      title: t('mission.wishesTitle'),
      body: t('mission.wishesBody'),
      color: 'bg-fuchsia-50 text-fuchsia-700',
    },
    {
      icon: BookOpen,
      title: t('mission.educationTitle'),
      body: t('mission.educationBody'),
      color: 'bg-purple-50 text-purple-700',
    },
    {
      icon: Users,
      title: t('mission.communityTitle'),
      body: t('mission.communityBody'),
      color: 'bg-violet-50 text-violet-700',
    },
  ];

  return (
    <main className="overflow-hidden bg-[#f8f3fb]">
      <section className="relative border-b border-purple-100 bg-[#f5edfa] pb-24 pt-44 md:pb-28 md:pt-52">
        <ButterflyMark className="pointer-events-none absolute left-[5%] top-44 h-8 w-8 -rotate-12 text-purple-300/70" />
        <ButterflyMark className="pointer-events-none absolute bottom-16 right-[7%] h-6 w-6 rotate-12 text-purple-300/60" />
        <div className="pointer-events-none absolute -right-32 top-28 h-[34rem] w-[34rem] rounded-full bg-white/55 blur-3xl" />

        <div className="container relative mx-auto grid items-center gap-14 px-5 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-purple-700 shadow-sm">
              <Sparkles className="h-4 w-4" />
              {t('eyebrow')}
            </span>
            <h1 className="mt-7 text-5xl font-bold leading-[1.02] tracking-[-0.045em] text-purple-950 md:text-7xl">
              {t('title')}
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-purple-950/70 md:text-xl">
              {t('subtitle')}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#board"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-7 py-4 font-bold text-white shadow-xl shadow-brand-500/20 transition hover:-translate-y-0.5 hover:bg-brand-700"
              >
                {t('meetBoard')}
                <ArrowRight className="h-5 w-5" />
              </a>
              <Link
                href={localizedPath(locale, 'warriors')}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-purple-300 bg-white/70 px-7 py-4 font-bold text-purple-950 transition hover:border-purple-500 hover:bg-white"
              >
                {t('seeImpact')}
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-5 rotate-2 rounded-[2.5rem] bg-gradient-to-br from-purple-300/40 to-fuchsia-200/40 blur-sm" />
            <div className="relative overflow-hidden rounded-[2.25rem] border border-white/80 bg-white/85 p-8 shadow-2xl shadow-purple-900/10 backdrop-blur md:p-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-950 text-white shadow-lg">
                <Heart className="h-7 w-7" fill="currentColor" />
              </div>
              <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-brand-600">
                {t('mission.eyebrow')}
              </p>
              <p className="mt-4 text-3xl font-bold leading-tight tracking-[-0.03em] text-purple-950 md:text-4xl">
                {t('mission.title')}
              </p>
              <div className="mt-8 grid gap-3 border-t border-purple-100 pt-6">
                {missionPillars.map(({icon: Icon, title}) => (
                  <div key={title} className="flex items-center gap-3 text-sm font-semibold text-purple-950/70">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-brand-600">
                      <Icon className="h-4 w-4" />
                    </span>
                    {title}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="container mx-auto px-5 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-brand-600">
              {t('mission.eyebrow')}
            </p>
            <h2 className="mt-4 text-4xl font-bold tracking-[-0.035em] text-purple-950 md:text-5xl">
              {t('mission.title')}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-neutral-600">
              {t('mission.body')}
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-6xl gap-6 md:grid-cols-3">
            {missionPillars.map(({icon: Icon, title, body, color}) => (
              <article
                key={title}
                className="rounded-[2rem] border border-purple-100 bg-[#fbf8fd] p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${color}`}>
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-7 text-2xl font-bold text-purple-950">{title}</h3>
                <p className="mt-4 leading-relaxed text-neutral-600">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="board" className="scroll-mt-32 bg-purple-950 py-20 text-white md:py-28">
        <div className="container mx-auto px-5 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-purple-300">
              {t('board.eyebrow')}
            </p>
            <h2 className="mt-4 text-4xl font-bold tracking-[-0.035em] md:text-5xl">
              {t('board.title')}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-purple-100/80">
              {t('board.body')}
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-6xl gap-6 md:grid-cols-3">
            {teamMembers.map((member) => (
              <article
                key={member.id}
                className="group rounded-[2rem] border border-white/10 bg-white/[0.07] p-7 backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/[0.11]"
              >
                <div className="flex items-center gap-5">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-white/20">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="80px"
                      className="object-cover object-center transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-purple-300">
                      {t('board.memberLabel')}
                    </p>
                    <h3 className="mt-2 text-xl font-bold text-white">{member.name}</h3>
                    <p className="mt-1 text-sm font-semibold text-purple-200">{member.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8f3fb] py-20 md:py-28">
        <div className="container mx-auto px-5 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-brand-600">
              {t('team.eyebrow')}
            </p>
            <h2 className="mt-4 text-4xl font-bold tracking-[-0.035em] text-purple-950 md:text-5xl">
              {t('team.title')}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-neutral-600">
              {t('team.body')}
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3">
            {teamMembers.map((member) => {
              const isFlipped = activeMemberId === member.id;

              return (
                <div key={member.id} className="group h-[540px] w-full [perspective:1000px] sm:h-[500px]">
                  <div
                    className={`relative h-full w-full rounded-[2rem] shadow-xl transition-all duration-700 [transform-style:preserve-3d] lg:group-hover:[transform:rotateY(180deg)] ${
                      isFlipped ? '[transform:rotateY(180deg)]' : ''
                    }`}
                  >
                    <div className="absolute inset-0 flex h-full w-full flex-col items-center justify-center rounded-[2rem] border border-purple-100 bg-white p-8 [backface-visibility:hidden]">
                      <div className="mb-8 h-48 w-48 overflow-hidden rounded-full border-4 border-purple-50 shadow-inner">
                        <Image
                          src={member.image}
                          alt={member.name}
                          width={192}
                          height={192}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <h3 className="mb-2 text-center text-2xl font-bold text-purple-950">
                        {member.name}
                      </h3>
                      <div className="mb-3 h-1 w-12 rounded-full bg-brand-500" />
                      <p className="text-center text-sm font-semibold uppercase tracking-wide text-brand-600">
                        {member.role}
                      </p>
                      <p className="mt-6 hidden text-xs font-medium tracking-wide text-neutral-400 lg:block">
                        {t('hoverHint')}
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveMemberId(member.id)}
                        className="mt-6 min-h-11 rounded-full bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-brand-700 lg:hidden"
                        aria-label={`${mobileCopy.open}: ${member.name}`}
                      >
                        {mobileCopy.open}
                      </button>
                    </div>

                    <div className="absolute inset-0 flex h-full w-full flex-col items-center justify-between overflow-y-auto rounded-[2rem] bg-gradient-to-br from-brand-600 to-purple-950 px-8 py-10 text-center text-white shadow-2xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
                      <div className="flex w-full flex-col items-center">
                        <Sparkles className="mb-6 h-10 w-10 shrink-0 text-brand-200 opacity-70" />
                        <h3 className="mb-1 text-2xl font-bold">{member.name}</h3>
                        <p className="mb-6 text-sm font-medium uppercase tracking-wider text-brand-100">
                          {member.role}
                        </p>
                        <p className="max-w-sm text-base font-light leading-relaxed text-white/90">
                          {member.description}
                        </p>
                      </div>

                      <div className="mt-6 flex items-center gap-4">
                        <a
                          href={`mailto:${member.email}`}
                          aria-label={`${mobileCopy.email}: ${member.name}`}
                          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:bg-white/20"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <rect width="20" height="16" x="2" y="4" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                          </svg>
                        </a>
                        <button
                          type="button"
                          onClick={() => setActiveMemberId(null)}
                          className="min-h-11 rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm font-bold transition-colors hover:bg-white/20 lg:hidden"
                          aria-label={`${mobileCopy.close}: ${member.name}`}
                        >
                          {mobileCopy.close}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 md:py-24">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-purple-800 via-purple-700 to-brand-600 px-7 py-14 text-center text-white shadow-2xl md:px-16 md:py-20">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-purple-200">
            {t('mission.eyebrow')}
          </p>
          <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-bold tracking-[-0.035em] md:text-5xl">
            {t('cta.title')}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-purple-100">
            {t('cta.description')}
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={localizedPath(locale, 'getInvolved')}
              className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 font-bold text-purple-800 transition hover:-translate-y-0.5 hover:bg-purple-50"
            >
              {t('cta.buttonInvolved')}
            </Link>
            <Link
              href={localizedPath(locale, 'donate')}
              className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-7 py-4 font-bold text-white transition hover:bg-white/20"
            >
              {t('cta.buttonDonate')}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
