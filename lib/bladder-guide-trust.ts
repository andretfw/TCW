import {getCervicalGuideTrustContent, type CervicalGuideTrustContent} from '@/lib/cervical-guide-trust';
import {
  getRemainingGuideTrustContentA,
  type RemainingGuideTrustContent,
} from '@/lib/remaining-guide-trust-1';
import {getRemainingGuideTrustContentB} from '@/lib/remaining-guide-trust-2';
import {getRemainingGuideTrustContentC} from '@/lib/remaining-guide-trust-3';
import {getRemainingGuideTrustContentD} from '@/lib/remaining-guide-trust-4';
import {normalizeLocale, type CancerId, type SiteLocale} from '@/lib/routes';
import {getStomachGuideTrustContent, type StomachGuideTrustContent} from '@/lib/stomach-guide-trust';

type GuideSource = {
  label: string;
  href: string;
};

export type BladderGuideTrustContent = {
  heading: string;
  disclaimer: string;
  sourcesHeading: string;
  checkedLabel: string;
  checkedDate: string;
  statsTitle: string;
  stats: [
    {value: string; label: string},
    {value: string; label: string},
  ];
  sources: GuideSource[];
};

const BLADDER_GUIDE_TRUST: Record<SiteLocale, BladderGuideTrustContent> = {
  en: {
    heading: 'Sources and medical information',
    disclaimer:
      'This page provides general educational information. It does not replace medical advice, diagnosis or treatment from a qualified healthcare professional. Blood in the urine is the most common symptom of bladder cancer, but urinary tract infections, kidney or bladder stones and other conditions can cause similar symptoms. Contact a healthcare professional about visible or laboratory-detected blood in the urine, persistent urinary frequency or urgency, pain or burning during urination, difficulty urinating, one-sided lower back pain or another persistent urinary change. IARC estimates 635,264 new bladder cancer cases and 227,626 deaths worldwide in 2024. These population figures cannot predict an individual outcome; prognosis and treatment depend on the cancer type, grade, stage, whether it has invaded the bladder muscle, overall health and response to treatment.',
    sourcesHeading: 'Official sources',
    checkedLabel: 'Sources checked',
    checkedDate: '29 July 2026',
    statsTitle: 'Key Facts',
    stats: [
      {
        value: '635K',
        label: 'New bladder cancer cases worldwide in 2024 (IARC estimate)',
      },
      {
        value: '228K',
        label: 'Deaths from bladder cancer worldwide in 2024 (IARC estimate)',
      },
    ],
    sources: [
      {
        label: 'International Agency for Research on Cancer — Bladder cancer fact sheet',
        href: 'https://gco.iarc.who.int/media/globocan/factsheets/cancers/30-bladder-fact-sheet.pdf',
      },
      {
        label: 'National Cancer Institute — Bladder Cancer: Patient Version',
        href: 'https://www.cancer.gov/types/bladder',
      },
      {
        label: 'National Cancer Institute — Bladder Cancer Symptoms',
        href: 'https://www.cancer.gov/types/bladder/symptoms',
      },
      {
        label: 'National Cancer Institute — Bladder Cancer Diagnosis',
        href: 'https://www.cancer.gov/types/bladder/diagnosis',
      },
      {
        label: 'National Cancer Institute — Bladder Cancer Treatment',
        href: 'https://www.cancer.gov/types/bladder/treatment',
      },
    ],
  },
  ro: {
    heading: 'Surse și informații medicale',
    disclaimer:
      'Această pagină oferă informații educaționale generale. Nu înlocuiește sfatul, diagnosticul sau tratamentul oferit de un profesionist medical calificat. Sângele în urină este cel mai frecvent simptom al cancerului de vezică urinară, însă infecțiile urinare, pietrele la rinichi sau vezică și alte afecțiuni pot provoca simptome asemănătoare. Adresează-te unui medic pentru sânge vizibil sau detectat la analize în urină, urinări frecvente ori urgente persistente, durere sau usturime la urinare, dificultăți la urinare, durere lombară pe o singură parte sau orice altă modificare urinară persistentă. IARC estimează 635.264 de cazuri noi de cancer de vezică urinară și 227.626 de decese la nivel mondial în 2024. Aceste cifre populaționale nu pot prezice rezultatul unei persoane; prognosticul și tratamentul depind de tipul, gradul și stadiul cancerului, de invazia mușchiului vezicii, de starea generală de sănătate și de răspunsul la tratament.',
    sourcesHeading: 'Surse oficiale',
    checkedLabel: 'Surse verificate la data de',
    checkedDate: '29 iulie 2026',
    statsTitle: 'Date-cheie',
    stats: [
      {
        value: '635 mii',
        label: 'Cazuri noi de cancer de vezică urinară la nivel mondial în 2024 (estimare IARC)',
      },
      {
        value: '228 mii',
        label: 'Decese prin cancer de vezică urinară la nivel mondial în 2024 (estimare IARC)',
      },
    ],
    sources: [
      {
        label: 'Agenția Internațională pentru Cercetare în Domeniul Cancerului — Fișă despre cancerul de vezică urinară',
        href: 'https://gco.iarc.who.int/media/globocan/factsheets/cancers/30-bladder-fact-sheet.pdf',
      },
      {
        label: 'Institutul Național al Cancerului — Cancer de vezică urinară: versiunea pentru pacienți',
        href: 'https://www.cancer.gov/types/bladder',
      },
      {
        label: 'Institutul Național al Cancerului — Simptomele cancerului de vezică urinară',
        href: 'https://www.cancer.gov/types/bladder/symptoms',
      },
      {
        label: 'Institutul Național al Cancerului — Diagnosticul cancerului de vezică urinară',
        href: 'https://www.cancer.gov/types/bladder/diagnosis',
      },
      {
        label: 'Institutul Național al Cancerului — Tratamentul cancerului de vezică urinară',
        href: 'https://www.cancer.gov/types/bladder/treatment',
      },
    ],
  },
  es: {
    heading: 'Fuentes e información médica',
    disclaimer:
      'Esta página ofrece información educativa general. No sustituye el consejo, diagnóstico ni tratamiento de un profesional sanitario cualificado. La sangre en la orina es el síntoma más común del cáncer de vejiga, pero las infecciones urinarias, los cálculos renales o vesicales y otras afecciones pueden causar síntomas parecidos. Consulta a un profesional sanitario por sangre visible o detectada en un análisis de orina, aumento persistente de la frecuencia o urgencia urinaria, dolor o ardor al orinar, dificultad para orinar, dolor lumbar en un lado u otro cambio urinario persistente. El IARC estima 635.264 casos nuevos de cáncer de vejiga y 227.626 muertes en todo el mundo en 2024. Estas cifras poblacionales no pueden predecir el resultado de una persona; el pronóstico y el tratamiento dependen del tipo, grado y estadio del cáncer, de si ha invadido el músculo de la vejiga, del estado general de salud y de la respuesta al tratamiento.',
    sourcesHeading: 'Fuentes oficiales',
    checkedLabel: 'Fuentes verificadas el',
    checkedDate: '29 de julio de 2026',
    statsTitle: 'Datos clave',
    stats: [
      {
        value: '635 mil',
        label: 'Casos nuevos de cáncer de vejiga en todo el mundo en 2024 (estimación del IARC)',
      },
      {
        value: '228 mil',
        label: 'Muertes por cáncer de vejiga en todo el mundo en 2024 (estimación del IARC)',
      },
    ],
    sources: [
      {
        label: 'Agencia Internacional para la Investigación del Cáncer — Ficha sobre el cáncer de vejiga',
        href: 'https://gco.iarc.who.int/media/globocan/factsheets/cancers/30-bladder-fact-sheet.pdf',
      },
      {
        label: 'Instituto Nacional del Cáncer — Cáncer de vejiga: versión para pacientes',
        href: 'https://www.cancer.gov/espanol/tipos/vejiga',
      },
      {
        label: 'Instituto Nacional del Cáncer — Síntomas del cáncer de vejiga',
        href: 'https://www.cancer.gov/espanol/tipos/vejiga/sintomas',
      },
      {
        label: 'Instituto Nacional del Cáncer — Diagnóstico del cáncer de vejiga',
        href: 'https://www.cancer.gov/espanol/tipos/vejiga/diagnostico',
      },
      {
        label: 'Instituto Nacional del Cáncer — Tratamiento del cáncer de vejiga',
        href: 'https://www.cancer.gov/espanol/tipos/vejiga/tratamiento',
      },
    ],
  },
};

export function getBladderGuideTrustContent(
  cancerId: CancerId,
  localeInput: string,
): BladderGuideTrustContent | CervicalGuideTrustContent | StomachGuideTrustContent | RemainingGuideTrustContent | undefined {
  if (cancerId === 'cervical') {
    return getCervicalGuideTrustContent(cancerId, localeInput);
  }
  if (cancerId === 'stomach') {
    return getStomachGuideTrustContent(cancerId, localeInput);
  }
  const remainingContent = getRemainingGuideTrustContentA(cancerId, localeInput)
    ?? getRemainingGuideTrustContentB(cancerId, localeInput)
    ?? getRemainingGuideTrustContentC(cancerId, localeInput)
    ?? getRemainingGuideTrustContentD(cancerId, localeInput);
  if (remainingContent) return remainingContent;
  if (cancerId !== 'bladder') return undefined;
  const locale = normalizeLocale(localeInput);
  return BLADDER_GUIDE_TRUST[locale];
}
