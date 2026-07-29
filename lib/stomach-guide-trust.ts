import {normalizeLocale, type CancerId, type SiteLocale} from '@/lib/routes';

type GuideSource = {
  label: string;
  href: string;
};

export type StomachGuideTrustContent = {
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

const STOMACH_GUIDE_TRUST: Record<SiteLocale, StomachGuideTrustContent> = {
  en: {
    heading: 'Sources and medical information',
    disclaimer:
      'This page provides general educational information. It does not replace medical advice, diagnosis or treatment from a qualified healthcare professional. Stomach cancer may cause no symptoms in its early stages. Indigestion, bloating after eating, nausea, loss of appetite, heartburn, stomach pain, vomiting, blood in the stool, unexplained weight loss, jaundice, fluid build-up in the abdomen or trouble swallowing can also have many other causes. Contact a healthcare professional about persistent, unexplained or worsening symptoms; seek urgent medical care for vomiting blood or black or bloody stools. Most stomach cancers are adenocarcinomas, while gastrointestinal stromal tumours and gastric lymphomas are different diseases that may require different treatment. The WHO cancer fact sheet updated on 3 July 2026 reports the latest complete global estimates: about 1.0 million new stomach cancer cases and 642,000 deaths in 2024. These population estimates cannot predict an individual outcome; prognosis and treatment depend on the exact cancer type, stage, tumour features, overall health and response to treatment.',
    sourcesHeading: 'Official sources',
    checkedLabel: 'Sources checked',
    checkedDate: '29 July 2026',
    statsTitle: 'Key Facts',
    stats: [
      {
        value: '1.0M',
        label: 'Latest estimated new stomach cancer cases worldwide — 2024 data (WHO, published 2026)',
      },
      {
        value: '642K',
        label: 'Latest estimated deaths from stomach cancer worldwide — 2024 data (WHO, published 2026)',
      },
    ],
    sources: [
      {
        label: 'World Health Organization — Cancer fact sheet and 2024 global estimates',
        href: 'https://www.who.int/news-room/fact-sheets/detail/cancer',
      },
      {
        label: 'International Agency for Research on Cancer — Global cancer statistics 2024',
        href: 'https://www.iarc.who.int/news-events/global-cancer-statistics-2024-globocan-estimates-of-incidence-and-mortality-worldwide-for-34-cancers-in-186-countries/',
      },
      {
        label: 'National Cancer Institute — Stomach Cancer: Patient Version',
        href: 'https://www.cancer.gov/types/stomach',
      },
      {
        label: 'National Cancer Institute — Stomach Cancer Symptoms',
        href: 'https://www.cancer.gov/types/stomach/symptoms',
      },
      {
        label: 'National Cancer Institute — Stomach Cancer Treatment',
        href: 'https://www.cancer.gov/types/stomach/treatment',
      },
    ],
  },
  ro: {
    heading: 'Surse și informații medicale',
    disclaimer:
      'Această pagină oferă informații educaționale generale. Nu înlocuiește sfatul, diagnosticul sau tratamentul oferit de un profesionist medical calificat. Cancerul de stomac poate să nu provoace simptome în stadiile incipiente. Indigestia, balonarea după masă, greața, pierderea poftei de mâncare, arsurile la stomac, durerea abdominală, vărsăturile, sângele în scaun, scăderea inexplicabilă în greutate, icterul, acumularea de lichid în abdomen sau dificultatea la înghițire pot avea și multe alte cauze. Adresează-te unui medic pentru simptome persistente, inexplicabile sau care se agravează; solicită ajutor medical urgent dacă verși sânge sau ai scaune negre ori cu sânge. Majoritatea cancerelor de stomac sunt adenocarcinoame, în timp ce tumorile stromale gastrointestinale și limfoamele gastrice sunt boli diferite, care pot necesita alte tratamente. Fișa OMS despre cancer, actualizată la 3 iulie 2026, prezintă cele mai recente estimări globale complete: aproximativ 1,0 milion de cazuri noi de cancer de stomac și 642.000 de decese în 2024. Aceste estimări populaționale nu pot prezice rezultatul unei persoane; prognosticul și tratamentul depind de tipul exact de cancer, stadiu, caracteristicile tumorii, starea generală de sănătate și răspunsul la tratament.',
    sourcesHeading: 'Surse oficiale',
    checkedLabel: 'Surse verificate la data de',
    checkedDate: '29 iulie 2026',
    statsTitle: 'Date-cheie',
    stats: [
      {
        value: '1,0 mil.',
        label: 'Cele mai recente cazuri noi estimate la nivel mondial — date din 2024 (OMS, publicate în 2026)',
      },
      {
        value: '642 mii',
        label: 'Cele mai recente decese estimate la nivel mondial — date din 2024 (OMS, publicate în 2026)',
      },
    ],
    sources: [
      {
        label: 'Organizația Mondială a Sănătății — Fișă despre cancer și estimările globale pentru 2024',
        href: 'https://www.who.int/news-room/fact-sheets/detail/cancer',
      },
      {
        label: 'Agenția Internațională pentru Cercetare în Domeniul Cancerului — Statisticile globale despre cancer din 2024',
        href: 'https://www.iarc.who.int/news-events/global-cancer-statistics-2024-globocan-estimates-of-incidence-and-mortality-worldwide-for-34-cancers-in-186-countries/',
      },
      {
        label: 'Institutul Național al Cancerului — Cancer de stomac: versiunea pentru pacienți',
        href: 'https://www.cancer.gov/types/stomach',
      },
      {
        label: 'Institutul Național al Cancerului — Simptomele cancerului de stomac',
        href: 'https://www.cancer.gov/types/stomach/symptoms',
      },
      {
        label: 'Institutul Național al Cancerului — Tratamentul cancerului de stomac',
        href: 'https://www.cancer.gov/types/stomach/treatment',
      },
    ],
  },
  es: {
    heading: 'Fuentes e información médica',
    disclaimer:
      'Esta página ofrece información educativa general. No sustituye el consejo, diagnóstico ni tratamiento de un profesional sanitario cualificado. El cáncer de estómago puede no causar síntomas en sus etapas iniciales. La indigestión, la hinchazón después de comer, las náuseas, la pérdida de apetito, la acidez, el dolor de estómago, los vómitos, la sangre en las heces, la pérdida de peso sin explicación, la ictericia, la acumulación de líquido en el abdomen o la dificultad para tragar también pueden tener muchas otras causas. Consulta a un profesional sanitario ante síntomas persistentes, inexplicables o que empeoran; busca atención médica urgente si vomitas sangre o presentas heces negras o con sangre. La mayoría de los cánceres de estómago son adenocarcinomas, mientras que los tumores del estroma gastrointestinal y los linfomas gástricos son enfermedades diferentes que pueden requerir otros tratamientos. La ficha de la OMS sobre el cáncer, actualizada el 3 de julio de 2026, presenta las estimaciones mundiales completas más recientes: alrededor de 1,0 millón de casos nuevos de cáncer de estómago y 642.000 muertes en 2024. Estas estimaciones poblacionales no pueden predecir el resultado de una persona; el pronóstico y el tratamiento dependen del tipo exacto de cáncer, la etapa, las características del tumor, el estado general de salud y la respuesta al tratamiento.',
    sourcesHeading: 'Fuentes oficiales',
    checkedLabel: 'Fuentes verificadas el',
    checkedDate: '29 de julio de 2026',
    statsTitle: 'Datos clave',
    stats: [
      {
        value: '1,0 M',
        label: 'Casos nuevos mundiales estimados más recientes — datos de 2024 (OMS, publicados en 2026)',
      },
      {
        value: '642 mil',
        label: 'Muertes mundiales estimadas más recientes — datos de 2024 (OMS, publicados en 2026)',
      },
    ],
    sources: [
      {
        label: 'Organización Mundial de la Salud — Ficha sobre el cáncer y estimaciones mundiales de 2024',
        href: 'https://www.who.int/es/news-room/fact-sheets/detail/cancer',
      },
      {
        label: 'Agencia Internacional para la Investigación del Cáncer — Estadísticas mundiales del cáncer de 2024',
        href: 'https://www.iarc.who.int/news-events/global-cancer-statistics-2024-globocan-estimates-of-incidence-and-mortality-worldwide-for-34-cancers-in-186-countries/',
      },
      {
        label: 'Instituto Nacional del Cáncer — Cáncer de estómago: versión para pacientes',
        href: 'https://www.cancer.gov/espanol/tipos/estomago',
      },
      {
        label: 'Instituto Nacional del Cáncer — Síntomas del cáncer de estómago',
        href: 'https://www.cancer.gov/espanol/tipos/estomago/sintomas',
      },
      {
        label: 'Instituto Nacional del Cáncer — Tratamiento del cáncer de estómago',
        href: 'https://www.cancer.gov/espanol/tipos/estomago/tratamiento',
      },
    ],
  },
};

export function getStomachGuideTrustContent(
  cancerId: CancerId,
  localeInput: string,
): StomachGuideTrustContent | undefined {
  if (cancerId !== 'stomach') return undefined;
  const locale = normalizeLocale(localeInput);
  return STOMACH_GUIDE_TRUST[locale];
}
