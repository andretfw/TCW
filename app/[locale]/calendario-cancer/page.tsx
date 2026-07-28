'use client';

import {BookOpen, Calendar, ExternalLink, Info, Ribbon} from 'lucide-react';
import {useLocale, useTranslations} from 'next-intl';
import {getCancerAwarenessCalendar2026} from '@/lib/cancer-awareness-calendar-2026';

export default function CancerCalendarPage() {
  const t = useTranslations('calendarPage');
  const locale = useLocale();
  const calendar = getCancerAwarenessCalendar2026(locale);

  return (
    <div className="min-h-screen bg-neutral-50 pt-20">
      <section className="rounded-b-[3rem] bg-gradient-to-br from-brand-600 to-purple-800 py-20 text-white shadow-xl">
        <div className="container mx-auto px-4 text-center">
          <Calendar className="mx-auto mb-6 h-20 w-20 text-white/80" />
          <div className="mb-5 inline-flex items-center rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm font-bold tracking-[0.18em] text-white backdrop-blur-sm">
            {calendar.year}
          </div>
          <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl">{t('title')}</h1>
          <p className="mx-auto max-w-3xl text-xl text-purple-100">{t('subtitle')}</p>
        </div>
      </section>

      <main className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <section className="mx-auto mb-10 max-w-5xl rounded-3xl border border-purple-100 bg-white p-6 shadow-lg md:p-8">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-purple-100 p-3 text-purple-700">
                <Info className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-800">{calendar.scopeTitle}</h2>
                <p className="mt-2 leading-relaxed text-neutral-600">{calendar.scopeNote}</p>
              </div>
            </div>
          </section>

          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {calendar.months.map((month, index) => (
              <article
                key={month.name}
                className="group flex h-full flex-col rounded-3xl border border-neutral-100 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <header className="mb-5 flex items-center justify-between border-b border-neutral-100 pb-4">
                  <h2 className="text-2xl font-bold text-neutral-800 transition-colors group-hover:text-brand-600">{month.name}</h2>
                  <span className="text-3xl font-black text-neutral-300 opacity-40">{String(index + 1).padStart(2, '0')}</span>
                </header>

                <div className="mb-6 flex-grow space-y-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">{calendar.awarenessMonthLabel}</p>
                  {month.awareness.length > 0 ? (
                    month.awareness.map((item) => (
                      <a
                        key={`${month.name}-${item.title}`}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`block rounded-xl p-3 transition-transform hover:scale-[1.01] ${item.color}`}
                      >
                        <div className="flex items-start gap-3">
                          <Ribbon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                          <div>
                            <span className="block text-sm font-bold leading-snug">{item.title}</span>
                            <span className="mt-1 block text-xs leading-snug opacity-80">{item.scope}</span>
                            <span className="mt-2 flex items-center gap-1 text-[11px] font-semibold opacity-70">
                              {item.source}
                              <ExternalLink className="h-3 w-3" aria-hidden="true" />
                            </span>
                          </div>
                        </div>
                      </a>
                    ))
                  ) : (
                    <p className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 p-4 text-sm leading-relaxed text-neutral-500">
                      {calendar.emptyMonth}
                    </p>
                  )}
                </div>

                {month.events.length > 0 && (
                  <div className="mt-auto rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">{calendar.keyDatesLabel}</p>
                    <ul className="space-y-3">
                      {month.events.map((event) => (
                        <li key={`${month.name}-${event.date}-${event.name}`}>
                          <a
                            href={event.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-start gap-3 rounded-xl p-1 text-sm text-neutral-700 transition-colors hover:bg-white hover:text-brand-700"
                          >
                            <span className="flex min-h-9 min-w-12 shrink-0 items-center justify-center rounded-lg border border-neutral-100 bg-white px-2 text-center text-xs font-bold text-brand-600 shadow-sm">
                              {event.date}
                            </span>
                            <span className="leading-tight">
                              <span className="flex items-start gap-1 font-semibold">
                                {event.name}
                                <ExternalLink className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
                              </span>
                              <span className="mt-1 block text-xs text-neutral-500">{event.scope}</span>
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            ))}
          </div>

          <section className="mx-auto mt-12 max-w-5xl rounded-3xl border border-brand-100 bg-white p-6 shadow-lg md:p-8">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-brand-100 p-3 text-brand-700">
                <BookOpen className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-800">{calendar.sourceTitle}</h2>
                <p className="mt-2 leading-relaxed text-neutral-600">{calendar.sourceIntro}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href="https://www.cancerresearchuk.org/get-involved/cancer-awareness-calendar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-bold text-brand-800 transition-colors hover:bg-brand-100"
                  >
                    Cancer Research UK
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <a
                    href="https://www.conquer.org/cancer-awareness-months"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-bold text-brand-800 transition-colors hover:bg-brand-100"
                  >
                    Conquer Cancer / ASCO Foundation
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
