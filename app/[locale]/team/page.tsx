'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

export default function TeamPage() {
  const t = useTranslations('teamPage');
  const locale = useLocale();
  const [activeMemberId, setActiveMemberId] = useState<string | null>(null);
  const mobileCopy = locale === 'ro'
    ? { open: 'Vezi biografia', close: 'Înapoi' }
    : locale === 'es'
      ? { open: 'Ver biografía', close: 'Volver' }
      : { open: 'View biography', close: 'Back' };

  const teamMembers = [
    {
      id: '1',
      name: t('members.1.name'),
      role: t('members.1.role'),
      image: t('members.1.image'),
      description: t('members.1.description'),
      email: 'andreea@tutticancerwarriors.org',
    },
    {
      id: '2',
      name: t('members.2.name'),
      role: t('members.2.role'),
      image: t('members.2.image'),
      description: t('members.2.description'),
      email: 'tcw@tutticancerwarriors.org',
    },
    {
      id: '3',
      name: t('members.3.name'),
      role: t('members.3.role'),
      image: t('members.3.image'),
      description: t('members.3.description'),
      email: 'tcw@tutticancerwarriors.org',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center bg-neutral-50 pb-24">
      <section className="relative flex w-full flex-col items-center overflow-hidden bg-white pb-20 pt-32 text-center">
        <div className="pointer-events-none absolute left-0 top-0 z-0 h-full w-full overflow-hidden opacity-40">
          <svg className="absolute left-0 top-0 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 transform text-purple-50" fill="currentColor" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg className="absolute bottom-0 right-0 h-[30rem] w-[30rem] translate-x-1/3 translate-y-1/3 transform text-brand-50" fill="currentColor" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" />
          </svg>
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <span className="mb-4 block text-sm font-bold uppercase tracking-wider text-brand-600">Tutti Cancer Warriors</span>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-neutral-900 md:text-6xl">{t('title')}</h1>
          <p className="mx-auto max-w-2xl text-xl leading-relaxed text-neutral-600">{t('subtitle')}</p>
        </div>
      </section>

      <section className="container relative z-20 mx-auto -mt-8 px-4">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-3">
          {teamMembers.map((member) => {
            const isFlipped = activeMemberId === member.id;

            return (
              <div key={member.id} className="group h-[540px] w-full [perspective:1000px] sm:h-[500px]">
                <div
                  className={`relative h-full w-full rounded-2xl shadow-xl transition-all duration-700 [transform-style:preserve-3d] lg:group-hover:[transform:rotateY(180deg)] ${
                    isFlipped ? '[transform:rotateY(180deg)]' : ''
                  }`}
                >
                  <div className="absolute inset-0 flex h-full w-full flex-col items-center justify-center rounded-2xl border border-neutral-100 bg-white p-8 [backface-visibility:hidden]">
                    <div className="mb-8 h-48 w-48 overflow-hidden rounded-full border-4 border-purple-50 shadow-inner">
                      <Image src={member.image} alt={member.name} width={192} height={192} className="h-full w-full object-cover object-center" />
                    </div>
                    <h3 className="mb-2 text-center text-2xl font-bold text-neutral-900">{member.name}</h3>
                    <div className="mb-3 h-1 w-12 rounded-full bg-brand-500" />
                    <p className="text-center text-sm font-semibold uppercase tracking-wide text-brand-600">{member.role}</p>
                    <p className="mt-6 hidden text-xs font-medium tracking-wide text-neutral-400 lg:block">{t('hoverHint')}</p>
                    <button
                      type="button"
                      onClick={() => setActiveMemberId(member.id)}
                      className="mt-6 min-h-11 rounded-full bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-brand-700 lg:hidden"
                      aria-label={`${mobileCopy.open}: ${member.name}`}
                    >
                      {mobileCopy.open}
                    </button>
                  </div>

                  <div className="absolute inset-0 flex h-full w-full flex-col items-center justify-between overflow-y-auto rounded-2xl bg-gradient-to-br from-brand-600 to-purple-800 px-8 py-10 text-center text-slate-200 shadow-2xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <div className="flex w-full flex-col items-center">
                      <svg className="mb-6 h-10 w-10 shrink-0 text-brand-300 opacity-40" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                      <h3 className="mb-1 text-2xl font-bold text-white">{member.name}</h3>
                      <p className="mb-6 text-sm font-medium uppercase tracking-wider text-brand-200">{member.role}</p>
                      <p className="max-w-sm text-base font-light leading-relaxed text-white/90">{member.description}</p>
                    </div>

                    <div className="mt-6 flex items-center gap-4">
                      <a href={`mailto:${member.email}`} aria-label={`Email ${member.name}`} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:bg-white/20">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                      </a>
                      <button
                        type="button"
                        onClick={() => setActiveMemberId(null)}
                        className="min-h-11 rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-white/20 lg:hidden"
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
      </section>
    </div>
  );
}
