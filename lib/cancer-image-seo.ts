import type {CancerImagePresentation} from '@/lib/cancer-images';
import {normalizeLocale, type SiteLocale} from '@/lib/routes';

export type CancerImageRole = 'card' | 'hero' | 'overview' | 'social';

type AltCopy = {
  illustration: string;
  photo: string;
  card: (media: string, title: string) => string;
  hero: (media: string, title: string) => string;
  overview: (media: string, title: string) => string;
  social: (media: string, title: string) => string;
};

const ALT_COPY: Record<SiteLocale, AltCopy> = {
  en: {
    illustration: 'Medical illustration',
    photo: 'Medical image',
    card: (media, title) => `${media} for the ${title} information guide`,
    hero: (media, title) => `${media} for the ${title} guide`,
    overview: (media, title) => `${media} accompanying the ${title} overview`,
    social: (media, title) => `${media} for the ${title} guide from Tutti Cancer Warriors`,
  },
  ro: {
    illustration: 'Ilustrație medicală',
    photo: 'Imagine medicală',
    card: (media, title) => `${media} pentru ghidul informativ despre ${title}`,
    hero: (media, title) => `${media} pentru ghidul despre ${title}`,
    overview: (media, title) => `${media} care însoțește prezentarea despre ${title}`,
    social: (media, title) => `${media} pentru ghidul despre ${title} de la Tutti Cancer Warriors`,
  },
  es: {
    illustration: 'Ilustración médica',
    photo: 'Imagen médica',
    card: (media, title) => `${media} para la guía informativa sobre ${title}`,
    hero: (media, title) => `${media} para la guía sobre ${title}`,
    overview: (media, title) => `${media} que acompaña la descripción de ${title}`,
    social: (media, title) => `${media} para la guía sobre ${title} de Tutti Cancer Warriors`,
  },
};

export function getCancerGuideImageAlt(
  title: string,
  localeInput: string,
  role: CancerImageRole,
  presentation: CancerImagePresentation = 'illustration',
) {
  const copy = ALT_COPY[normalizeLocale(localeInput)];
  return copy[role](copy[presentation], title);
}
