import {normalizeLocale, type CancerId, type SiteLocale} from '@/lib/routes';

type GuideSource = {
  label: string;
  href: string;
};

export type BrainGuideTrustContent = {
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

const BRAIN_GUIDE_TRUST: Record<SiteLocale, BrainGuideTrustContent> = {
  en: {
    heading: 'Sources and medical information',
    disclaimer:
      'This page provides general educational information. It does not replace medical advice, diagnosis or treatment from a qualified healthcare professional. Brain and central nervous system tumours are a diverse group of conditions. They may be benign or malignant, and a tumour that spreads to the brain from another part of the body is different from a primary brain tumour. Symptoms vary with the tumour type, size and location and may have many other causes. Contact a healthcare professional about persistent, unexplained or worsening headaches, seizures, nausea or vomiting, vision or speech changes, weakness, balance problems, confusion, personality changes or another neurological change. IARC estimates 324,095 new malignant brain and central nervous system cancer cases and 248,964 deaths worldwide in 2024. These population figures do not include every benign brain tumour and cannot predict an individual outcome; prognosis and treatment depend on the exact tumour type, molecular features, grade, location, age, overall health and response to treatment.',
    sourcesHeading: 'Official sources',
    checkedLabel: 'Sources checked',
    checkedDate: '29 July 2026',
    statsTitle: 'Key Facts',
    stats: [
      {
        value: '324K',
        label: 'New malignant brain and central nervous system cancer cases worldwide in 2024 (IARC estimate)',
      },
      {
        value: '249K',
        label: 'Deaths from malignant brain and central nervous system cancers worldwide in 2024 (IARC estimate)',
      },
    ],
    sources: [
      {
        label: 'International Agency for Research on Cancer — Brain and central nervous system fact sheet',
        href: 'https://gco.iarc.who.int/media/globocan/factsheets/cancers/31-brain-central-nervous-system-fact-sheet.pdf',
      },
      {
        label: 'National Cancer Institute — Brain Tumors: Patient Version',
        href: 'https://www.cancer.gov/types/brain',
      },
      {
        label: 'National Cancer Institute — Adult Central Nervous System Tumors Treatment',
        href: 'https://www.cancer.gov/types/brain/patient/adult-brain-treatment-pdq',
      },
    ],
  },
  ro: {
    heading: 'Surse și informații medicale',
    disclaimer:
      'Această pagină oferă informații educaționale generale. Nu înlocuiește sfatul, diagnosticul sau tratamentul oferit de un profesionist medical calificat. Tumorile cerebrale și ale sistemului nervos central formează un grup divers de afecțiuni. Ele pot fi benigne sau maligne, iar o tumoră care se răspândește la creier dintr-o altă parte a corpului este diferită de o tumoră cerebrală primară. Simptomele diferă în funcție de tipul, dimensiunea și localizarea tumorii și pot avea multe alte cauze. Adresează-te unui medic pentru dureri de cap persistente, inexplicabile sau care se agravează, convulsii, greață ori vărsături, modificări ale vederii sau vorbirii, slăbiciune, probleme de echilibru, confuzie, schimbări de personalitate ori o altă modificare neurologică. IARC estimează 324.095 de cazuri noi de cancere maligne ale creierului și sistemului nervos central și 248.964 de decese la nivel mondial în 2024. Aceste cifre populaționale nu includ toate tumorile cerebrale benigne și nu pot prezice rezultatul unei persoane; prognosticul și tratamentul depind de tipul exact al tumorii, caracteristicile moleculare, grad, localizare, vârstă, starea generală de sănătate și răspunsul la tratament.',
    sourcesHeading: 'Surse oficiale',
    checkedLabel: 'Surse verificate la data de',
    checkedDate: '29 iulie 2026',
    statsTitle: 'Date-cheie',
    stats: [
      {
        value: '324 mii',
        label: 'Cazuri noi de cancere maligne ale creierului și sistemului nervos central la nivel mondial în 2024 (estimare IARC)',
      },
      {
        value: '249 mii',
        label: 'Decese provocate de cancere maligne ale creierului și sistemului nervos central la nivel mondial în 2024 (estimare IARC)',
      },
    ],
    sources: [
      {
        label: 'Agenția Internațională pentru Cercetare în Domeniul Cancerului — Fișă despre creier și sistemul nervos central',
        href: 'https://gco.iarc.who.int/media/globocan/factsheets/cancers/31-brain-central-nervous-system-fact-sheet.pdf',
      },
      {
        label: 'Institutul Național al Cancerului — Tumori cerebrale: versiunea pentru pacienți',
        href: 'https://www.cancer.gov/types/brain',
      },
      {
        label: 'Institutul Național al Cancerului — Tratamentul tumorilor sistemului nervos central la adulți',
        href: 'https://www.cancer.gov/types/brain/patient/adult-brain-treatment-pdq',
      },
    ],
  },
  es: {
    heading: 'Fuentes e información médica',
    disclaimer:
      'Esta página ofrece información educativa general. No sustituye el consejo, diagnóstico ni tratamiento de un profesional sanitario cualificado. Los tumores cerebrales y del sistema nervioso central forman un grupo diverso de enfermedades. Pueden ser benignos o malignos, y un tumor que se disemina al cerebro desde otra parte del cuerpo es diferente de un tumor cerebral primario. Los síntomas varían según el tipo, el tamaño y la ubicación del tumor y pueden tener muchas otras causas. Consulta a un profesional sanitario ante dolores de cabeza persistentes, inexplicables o que empeoran, convulsiones, náuseas o vómitos, cambios en la visión o el habla, debilidad, problemas de equilibrio, confusión, cambios de personalidad u otro cambio neurológico. El IARC estima 324.095 casos nuevos de cánceres malignos de encéfalo y sistema nervioso central y 248.964 muertes en todo el mundo en 2024. Estas cifras poblacionales no incluyen todos los tumores cerebrales benignos y no pueden predecir el resultado de una persona; el pronóstico y el tratamiento dependen del tipo exacto de tumor, las características moleculares, el grado, la ubicación, la edad, el estado general de salud y la respuesta al tratamiento.',
    sourcesHeading: 'Fuentes oficiales',
    checkedLabel: 'Fuentes verificadas el',
    checkedDate: '29 de julio de 2026',
    statsTitle: 'Datos clave',
    stats: [
      {
        value: '324 mil',
        label: 'Casos nuevos de cánceres malignos de encéfalo y sistema nervioso central en todo el mundo en 2024 (estimación del IARC)',
      },
      {
        value: '249 mil',
        label: 'Muertes por cánceres malignos de encéfalo y sistema nervioso central en todo el mundo en 2024 (estimación del IARC)',
      },
    ],
    sources: [
      {
        label: 'Agencia Internacional para la Investigación del Cáncer — Ficha sobre encéfalo y sistema nervioso central',
        href: 'https://gco.iarc.who.int/media/globocan/factsheets/cancers/31-brain-central-nervous-system-fact-sheet.pdf',
      },
      {
        label: 'Instituto Nacional del Cáncer — Tumores cerebrales: versión para pacientes',
        href: 'https://www.cancer.gov/espanol/tipos/cerebro',
      },
      {
        label: 'Instituto Nacional del Cáncer — Tratamiento de los tumores del sistema nervioso central en adultos',
        href: 'https://www.cancer.gov/espanol/tipos/cerebro/paciente/tratamiento-cerebro-adultos-pdq',
      },
    ],
  },
};

export function getBrainGuideTrustContent(
  cancerId: CancerId,
  localeInput: string,
): BrainGuideTrustContent | undefined {
  if (cancerId !== 'brain') return undefined;
  const locale = normalizeLocale(localeInput);
  return BRAIN_GUIDE_TRUST[locale];
}
