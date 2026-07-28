import {normalizeLocale, type CancerId, type SiteLocale} from '@/lib/routes';

type GuideSource = {
  label: string;
  href: string;
};

export type ChildhoodGuideTrustContent = {
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

const CHILDHOOD_GUIDE_TRUST: Record<SiteLocale, ChildhoodGuideTrustContent> = {
  en: {
    heading: 'Sources and medical information',
    disclaimer:
      'This page provides general educational information. It does not replace medical advice, diagnosis or treatment from a qualified healthcare professional. Childhood cancers are a diverse group of diseases and may differ from adult cancers in how they develop, spread and respond to treatment. Symptoms vary by cancer type and may have many other causes. Contact a healthcare professional about persistent, unexplained or worsening changes in a child’s health, including unusual swelling, pain, bleeding or bruising, fever, fatigue, weight loss, headaches, vomiting, vision changes or neurological symptoms. WHO estimates that about 400,000 children and adolescents aged 0–19 develop cancer each year. In high-income countries, more than 80% of children with cancer are cured, while in most low- and middle-income countries fewer than 30% are cured. NCI reports that about 85% of children diagnosed with cancer in the United States are alive at least five years after diagnosis. These population figures cannot predict an individual outcome; prognosis depends on the cancer type, age, biology, stage, access to specialist care and response to treatment.',
    sourcesHeading: 'Official sources',
    checkedLabel: 'Sources checked',
    checkedDate: '28 July 2026',
    statsTitle: 'Key Facts',
    stats: [
      {
        value: '400K',
        label: 'Children and adolescents aged 0–19 estimated to develop cancer worldwide each year (WHO)',
      },
      {
        value: '85%',
        label: 'Children diagnosed with cancer in the US alive at least five years after diagnosis (NCI)',
      },
    ],
    sources: [
      {
        label: 'World Health Organization — Childhood cancer fact sheet',
        href: 'https://www.who.int/news-room/fact-sheets/detail/cancer-in-children',
      },
      {
        label: 'World Health Organization — Global Initiative for Childhood Cancer',
        href: 'https://www.who.int/initiatives/the-global-initiative-for-childhood-cancer/',
      },
      {
        label: 'International Agency for Research on Cancer — Childhood cancer',
        href: 'https://www.iarc.who.int/cancer-type/childhood-cancer/',
      },
      {
        label: 'National Cancer Institute — Childhood Cancers',
        href: 'https://www.cancer.gov/types/childhood-cancers',
      },
      {
        label: 'National Cancer Institute — Cancer in Children and Adolescents',
        href: 'https://www.cancer.gov/types/childhood-cancers/child-adolescent-cancers-fact-sheet',
      },
    ],
  },
  ro: {
    heading: 'Surse și informații medicale',
    disclaimer:
      'Această pagină oferă informații educaționale generale. Nu înlocuiește sfatul, diagnosticul sau tratamentul oferit de un profesionist medical calificat. Cancerele copilăriei reprezintă un grup divers de boli și pot fi diferite de cancerele adulților în modul în care apar, se răspândesc și răspund la tratament. Simptomele diferă în funcție de tipul de cancer și pot avea multe alte cauze. Adresează-te unui medic pentru modificări persistente, inexplicabile sau care se agravează în starea de sănătate a unui copil, inclusiv umflături neobișnuite, durere, sângerări sau vânătăi, febră, oboseală, scădere în greutate, dureri de cap, vărsături, modificări ale vederii ori simptome neurologice. OMS estimează că aproximativ 400.000 de copii și adolescenți cu vârste între 0 și 19 ani dezvoltă cancer în fiecare an. În țările cu venituri ridicate, peste 80% dintre copiii cu cancer sunt vindecați, în timp ce în majoritatea țărilor cu venituri mici și medii sunt vindecați mai puțin de 30%. NCI raportează că aproximativ 85% dintre copiii diagnosticați cu cancer în Statele Unite sunt în viață la cel puțin cinci ani după diagnostic. Aceste cifre populaționale nu pot prezice rezultatul unei persoane; prognosticul depinde de tipul cancerului, vârstă, biologia bolii, stadiu, accesul la îngrijire specializată și răspunsul la tratament.',
    sourcesHeading: 'Surse oficiale',
    checkedLabel: 'Surse verificate la data de',
    checkedDate: '28 iulie 2026',
    statsTitle: 'Date-cheie',
    stats: [
      {
        value: '400 mii',
        label: 'Copii și adolescenți de 0–19 ani estimați să dezvolte cancer la nivel mondial în fiecare an (OMS)',
      },
      {
        value: '85%',
        label: 'Copii diagnosticați cu cancer în SUA care sunt în viață la cel puțin cinci ani după diagnostic (NCI)',
      },
    ],
    sources: [
      {
        label: 'Organizația Mondială a Sănătății — Fișă informativă despre cancerul infantil',
        href: 'https://www.who.int/news-room/fact-sheets/detail/cancer-in-children',
      },
      {
        label: 'Organizația Mondială a Sănătății — Inițiativa globală pentru cancerul infantil',
        href: 'https://www.who.int/initiatives/the-global-initiative-for-childhood-cancer/',
      },
      {
        label: 'Agenția Internațională pentru Cercetare în Domeniul Cancerului — Cancerul copilăriei',
        href: 'https://www.iarc.who.int/cancer-type/childhood-cancer/',
      },
      {
        label: 'Institutul Național al Cancerului — Cancerele copilăriei',
        href: 'https://www.cancer.gov/types/childhood-cancers',
      },
      {
        label: 'Institutul Național al Cancerului — Cancerul la copii și adolescenți',
        href: 'https://www.cancer.gov/types/childhood-cancers/child-adolescent-cancers-fact-sheet',
      },
    ],
  },
  es: {
    heading: 'Fuentes e información médica',
    disclaimer:
      'Esta página ofrece información educativa general. No sustituye el consejo, diagnóstico ni tratamiento de un profesional sanitario cualificado. Los cánceres infantiles forman un grupo diverso de enfermedades y pueden diferir de los cánceres en adultos en la forma en que se desarrollan, se propagan y responden al tratamiento. Los síntomas varían según el tipo de cáncer y pueden tener muchas otras causas. Consulta a un profesional sanitario ante cambios persistentes, inexplicables o que empeoran en la salud de un niño, como hinchazón inusual, dolor, sangrado o moretones, fiebre, cansancio, pérdida de peso, dolor de cabeza, vómitos, cambios en la visión o síntomas neurológicos. La OMS estima que unos 400.000 niños y adolescentes de 0 a 19 años desarrollan cáncer cada año. En los países de ingreso alto, más del 80% de los niños con cáncer se curan, mientras que en la mayoría de los países de ingreso bajo y mediano se curan menos del 30%. El NCI informa que aproximadamente el 85% de los niños diagnosticados con cáncer en Estados Unidos siguen vivos al menos cinco años después del diagnóstico. Estas cifras poblacionales no pueden predecir el resultado de una persona; el pronóstico depende del tipo de cáncer, la edad, la biología de la enfermedad, la etapa, el acceso a atención especializada y la respuesta al tratamiento.',
    sourcesHeading: 'Fuentes oficiales',
    checkedLabel: 'Fuentes verificadas el',
    checkedDate: '28 de julio de 2026',
    statsTitle: 'Datos clave',
    stats: [
      {
        value: '400 mil',
        label: 'Niños y adolescentes de 0–19 años que se estima desarrollan cáncer en todo el mundo cada año (OMS)',
      },
      {
        value: '85%',
        label: 'Niños diagnosticados con cáncer en EE. UU. que siguen vivos al menos cinco años después del diagnóstico (NCI)',
      },
    ],
    sources: [
      {
        label: 'Organización Mundial de la Salud — Ficha informativa sobre el cáncer infantil',
        href: 'https://www.who.int/es/news-room/fact-sheets/detail/cancer-in-children',
      },
      {
        label: 'Organización Mundial de la Salud — Iniciativa Mundial contra el Cáncer Infantil',
        href: 'https://www.who.int/initiatives/the-global-initiative-for-childhood-cancer/',
      },
      {
        label: 'Agencia Internacional para la Investigación del Cáncer — Cáncer infantil',
        href: 'https://www.iarc.who.int/cancer-type/childhood-cancer/',
      },
      {
        label: 'Instituto Nacional del Cáncer — Cánceres infantiles',
        href: 'https://www.cancer.gov/espanol/tipos/infantil',
      },
      {
        label: 'Instituto Nacional del Cáncer — Cáncer en niños y adolescentes',
        href: 'https://www.cancer.gov/espanol/tipos/infantil/hoja-informativa-ninos-adolescentes',
      },
    ],
  },
};

export function getChildhoodGuideTrustContent(
  cancerId: CancerId,
  localeInput: string,
): ChildhoodGuideTrustContent | undefined {
  if (cancerId !== 'childhood') return undefined;
  const locale = normalizeLocale(localeInput);
  return CHILDHOOD_GUIDE_TRUST[locale];
}
