import {normalizeLocale, type CancerId, type SiteLocale} from '@/lib/routes';

type GuideSource = {
  label: string;
  href: string;
};

type CancerGuideTrustContent = {
  heading: string;
  disclaimer: string;
  sourcesHeading: string;
  checkedLabel: string;
  checkedDate: string;
  stats: [
    {value: string; label: string},
    {value: string; label: string},
  ];
  sources: GuideSource[];
};

const BREAST_CANCER_TRUST: Record<SiteLocale, CancerGuideTrustContent> = {
  en: {
    heading: 'Sources and medical information',
    disclaimer:
      'This page provides general educational information. It does not replace medical advice, diagnosis or treatment from a qualified healthcare professional. Contact a healthcare professional about any new or persistent breast change.',
    sourcesHeading: 'Official sources',
    checkedLabel: 'Sources checked',
    checkedDate: '28 July 2026',
    stats: [
      {
        value: '2.4M',
        label: 'Women diagnosed globally in 2024 (WHO estimate)',
      },
      {
        value: '694K',
        label: 'Deaths globally in 2024 (WHO estimate)',
      },
    ],
    sources: [
      {
        label: 'World Health Organization — Breast cancer fact sheet',
        href: 'https://www.who.int/news-room/fact-sheets/detail/breast-cancer',
      },
      {
        label: 'National Cancer Institute — Signs and Symptoms of Breast Cancer',
        href: 'https://www.cancer.gov/types/breast/symptoms',
      },
      {
        label: 'National Cancer Institute — Treatment for Breast Cancer',
        href: 'https://www.cancer.gov/types/breast/treatment',
      },
      {
        label: 'National Cancer Institute — Prognosis and Survival Rates',
        href: 'https://www.cancer.gov/types/breast/survival',
      },
    ],
  },
  ro: {
    heading: 'Surse și informații medicale',
    disclaimer:
      'Această pagină oferă informații educaționale generale. Nu înlocuiește sfatul, diagnosticul sau tratamentul oferit de un profesionist medical calificat. Adresează-te unui medic pentru orice modificare nouă sau persistentă a sânului.',
    sourcesHeading: 'Surse oficiale',
    checkedLabel: 'Surse verificate la data de',
    checkedDate: '28 iulie 2026',
    stats: [
      {
        value: '2,4 mil.',
        label: 'Femei diagnosticate la nivel global în 2024 (estimare OMS)',
      },
      {
        value: '694 mii',
        label: 'Decese la nivel global în 2024 (estimare OMS)',
      },
    ],
    sources: [
      {
        label: 'Organizația Mondială a Sănătății — Fișă informativă despre cancerul de sân',
        href: 'https://www.who.int/news-room/fact-sheets/detail/breast-cancer',
      },
      {
        label: 'Institutul Național al Cancerului — Semne și simptome ale cancerului de sân',
        href: 'https://www.cancer.gov/types/breast/symptoms',
      },
      {
        label: 'Institutul Național al Cancerului — Tratamentul cancerului de sân',
        href: 'https://www.cancer.gov/types/breast/treatment',
      },
      {
        label: 'Institutul Național al Cancerului — Prognostic și rate de supraviețuire',
        href: 'https://www.cancer.gov/types/breast/survival',
      },
    ],
  },
  es: {
    heading: 'Fuentes e información médica',
    disclaimer:
      'Esta página ofrece información educativa general. No sustituye el consejo, diagnóstico ni tratamiento de un profesional sanitario cualificado. Consulta a un profesional sanitario ante cualquier cambio nuevo o persistente en la mama.',
    sourcesHeading: 'Fuentes oficiales',
    checkedLabel: 'Fuentes verificadas el',
    checkedDate: '28 de julio de 2026',
    stats: [
      {
        value: '2,4 M',
        label: 'Mujeres diagnosticadas en todo el mundo en 2024 (estimación de la OMS)',
      },
      {
        value: '694 mil',
        label: 'Muertes en todo el mundo en 2024 (estimación de la OMS)',
      },
    ],
    sources: [
      {
        label: 'Organización Mundial de la Salud — Ficha informativa sobre el cáncer de mama',
        href: 'https://www.who.int/es/news-room/fact-sheets/detail/breast-cancer',
      },
      {
        label: 'Instituto Nacional del Cáncer — Información sobre el cáncer de mama',
        href: 'https://www.cancer.gov/espanol/tipos/seno',
      },
      {
        label: 'Instituto Nacional del Cáncer — Tratamiento del cáncer de mama',
        href: 'https://www.cancer.gov/espanol/tipos/seno/tratamiento-mama',
      },
      {
        label: 'Instituto Nacional del Cáncer — Pronóstico y tasas de supervivencia',
        href: 'https://www.cancer.gov/types/breast/survival',
      },
    ],
  },
};

export function getCancerGuideTrustContent(
  cancerId: CancerId,
  localeInput: string,
): CancerGuideTrustContent | undefined {
  if (cancerId !== 'breast') return undefined;
  const locale = normalizeLocale(localeInput);
  return BREAST_CANCER_TRUST[locale];
}
