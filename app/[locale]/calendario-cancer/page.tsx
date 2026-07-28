'use client';

import {Calendar, Ribbon} from 'lucide-react';
import {useLocale, useTranslations} from 'next-intl';
import {getCancerAwarenessCalendar2026} from '@/lib/cancer-awareness-calendar-2026';

export default function CancerCalendarPage() {
  const t = useTranslations('calendarPage');
  const locale = useLocale();
  const calendar = getCancerAwarenessCalendar2026(locale);

  return (
    <div className="min-h-screen bg-neutral-50 pt-20">
      <section className="border-b border-brand-100 bg-gradient-to-b from-brand-50 to-white py-14 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <Calendar className="mx-auto mb-5 h-12 w-12 text-brand-600 md:h-14 md:w-14" aria-hidden="true" />
          <span className="mb-4 inline-flex rounded-full bg-brand-100 px-4 py-1.5 text-sm font-bold tracking-[0.16em] text-brand-700">
            {calendar.year}
          </span>
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-neutral-900 md:text-6xl">
            {t('title')}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-neutral-600 md:text-lg">
            {t('subtitle')}
          </p>
        </div>
      </section>

      <main className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <p className="mx-auto mb-10 max-w-3xl text-center text-sm leading-relaxed text-neutral-500 md:text-base">
            {calendar.scopeNote}
          </p>

          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {calendar.months.map((month, index) => (
              <article
                key={month.name}
                className="flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm md:p-6"
              >
                <header className="mb-5 flex items-center justify-between border-b border-neutral-100 pb-4">
                  <h2 className="text-2xl font-bold text-neutral-900">{month.name}</h2>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-600">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </header>

                <section className="flex-grow">
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-neutral-400">
                    {calendar.awarenessMonthLabel}
                  </h3>

                  {month.awareness.length > 0 ? (
                    <ul className="space-y-3">
                      {month.awareness.map((item) => (
                        <li key={`${month.name}-${item.title}`} className="flex items-start gap-3 text-sm leading-relaxed text-neutral-700">
                          <Ribbon className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
                          <span className="font-medium">{item.title}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm leading-relaxed text-neutral-500">{calendar.emptyMonth}</p>
                  )}
                </section>

                {month.events.length > 0 && (
                  <section className="mt-6 border-t border-neutral-100 pt-5">
                    <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-neutral-400">
                      {calendar.keyDatesLabel}
                    </h3>
                    <ul className="space-y-3">
                      {month.events.map((event) => (
                        <li key={`${month.name}-${event.date}-${event.name}`} className="flex items-start gap-3">
                          <span className="flex min-h-8 min-w-12 shrink-0 items-center justify-center rounded-lg bg-brand-50 px-2 text-center text-xs font-bold text-brand-700">
                            {event.date}
                          </span>
                          <span className="pt-1 text-sm font-medium leading-snug text-neutral-700">{event.name}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </article>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
