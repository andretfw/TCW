import {normalizeLocale} from '@/lib/routes';
import type {CancerAwarenessCalendar2026, MonthDefinition} from '@/lib/cancer-awareness-calendar-types';
import {CANCER_AWARENESS_MONTHS_1} from '@/lib/cancer-awareness-calendar-months-1';
import {CANCER_AWARENESS_MONTHS_2} from '@/lib/cancer-awareness-calendar-months-2';
import {CANCER_AWARENESS_MONTHS_3} from '@/lib/cancer-awareness-calendar-months-3';
import {CANCER_AWARENESS_MONTHS_4} from '@/lib/cancer-awareness-calendar-months-4';

const MONTHS: MonthDefinition[] = [
  ...CANCER_AWARENESS_MONTHS_1,
  ...CANCER_AWARENESS_MONTHS_2,
  ...CANCER_AWARENESS_MONTHS_3,
  ...CANCER_AWARENESS_MONTHS_4,
];

const UI = {
  awarenessMonthLabel: {
    en: 'Awareness campaigns',
    ro: 'Campanii de conștientizare',
    es: 'Campañas de concienciación',
  },
  keyDatesLabel: {
    en: 'Key dates in 2026',
    ro: 'Date importante în 2026',
    es: 'Fechas clave de 2026',
  },
  emptyMonth: {
    en: 'No major, widely recognised cancer-specific awareness month was verified for December. Cancer education and support continue year-round.',
    ro: 'Nu a fost identificată pentru decembrie o lună majoră de conștientizare dedicată unui anumit tip de cancer. Educația și sprijinul continuă pe tot parcursul anului.',
    es: 'No se verificó para diciembre un mes importante y ampliamente reconocido dedicado a un cáncer específico. La educación y el apoyo continúan durante todo el año.',
  },
  scopeTitle: {
    en: 'How to use this calendar',
    ro: 'Cum să folosești acest calendar',
    es: 'Cómo usar este calendario',
  },
  scopeNote: {
    en: 'Cancer awareness months are not governed by one global authority. Some campaigns are worldwide, while others are established by organisations in particular countries. Dates shown are for 2026.',
    ro: 'Lunile de conștientizare a cancerului nu sunt stabilite de o singură autoritate globală. Unele campanii sunt mondiale, iar altele sunt organizate în anumite țări. Datele afișate sunt pentru 2026.',
    es: 'Los meses de concienciación sobre el cáncer no dependen de una única autoridad mundial. Algunas campañas son globales y otras pertenecen a organizaciones de países concretos. Las fechas mostradas corresponden a 2026.',
  },
  sourceTitle: {
    en: 'Reference sources',
    ro: 'Surse de referință',
    es: 'Fuentes de referencia',
  },
  sourceIntro: {
    en: 'The calendar combines established awareness calendars with official campaign websites. Campaign dates can change, so the linked organiser remains the final reference.',
    ro: 'Calendarul combină calendare de conștientizare consacrate cu site-urile oficiale ale campaniilor. Datele se pot modifica, astfel că organizatorul indicat în link rămâne sursa finală.',
    es: 'El calendario combina calendarios de concienciación consolidados con los sitios oficiales de las campañas. Las fechas pueden cambiar, por lo que el organizador enlazado sigue siendo la referencia final.',
  },
} as const;

export function getCancerAwarenessCalendar2026(localeInput: string): CancerAwarenessCalendar2026 {
  const locale = normalizeLocale(localeInput);

  return {
    year: 2026,
    awarenessMonthLabel: UI.awarenessMonthLabel[locale],
    keyDatesLabel: UI.keyDatesLabel[locale],
    emptyMonth: UI.emptyMonth[locale],
    scopeTitle: UI.scopeTitle[locale],
    scopeNote: UI.scopeNote[locale],
    sourceTitle: UI.sourceTitle[locale],
    sourceIntro: UI.sourceIntro[locale],
    months: MONTHS.map((month) => ({
      name: month.name[locale],
      awareness: month.awareness.map((item) => ({
        title: item.title[locale],
        scope: item.scope[locale],
        href: item.href,
        source: item.source,
        color: item.color,
      })),
      events: month.events.map((event) => ({
        date: event.date,
        name: event.name[locale],
        scope: event.scope[locale],
        href: event.href,
        source: event.source,
      })),
    })),
  };
}
