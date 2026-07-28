import {normalizeLocale, type CancerId, type SiteLocale} from '@/lib/routes';

type GuideSource = {
  label: string;
  href: string;
};

export type OvarianGuideTrustContent = {
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

const OVARIAN_GUIDE_TRUST: Record<SiteLocale, OvarianGuideTrustContent> = {
  en: {
    heading: 'Sources and medical information',
    disclaimer:
      'This page provides general educational information. It does not replace medical advice, diagnosis or treatment from a qualified healthcare professional. Ovarian epithelial, fallopian tube and primary peritoneal cancers may not cause early signs or symptoms. Contact a healthcare professional about persistent or worsening abdominal or pelvic pain, swelling or pressure, bloating, urinary urgency or frequency, trouble eating or feeling full, constipation or another concerning change. IARC estimates 330,731 new ovarian cancer cases and 203,850 deaths worldwide in 2024. NCI SEER reports 52.0% five-year relative survival in the United States across all stages combined for 2016–2022. This population statistic cannot predict an individual outcome; prognosis and treatment depend on the cancer type, stage, overall health and response to treatment.',
    sourcesHeading: 'Official sources',
    checkedLabel: 'Sources checked',
    checkedDate: '28 July 2026',
    stats: [
      {
        value: '331K',
        label: 'New ovarian cancer cases globally in 2024 (IARC estimate)',
      },
      {
        value: '52.0%',
        label: 'Five-year relative survival in the US, all stages combined, 2016–2022 (NCI SEER)',
      },
    ],
    sources: [
      {
        label: 'International Agency for Research on Cancer — Ovary fact sheet',
        href: 'https://gco.iarc.who.int/media/globocan/factsheets/cancers/25-ovary-fact-sheet.pdf',
      },
      {
        label: 'National Cancer Institute — Ovarian, Fallopian Tube, and Primary Peritoneal Cancer: Patient Version',
        href: 'https://www.cancer.gov/types/ovarian',
      },
      {
        label: 'National Cancer Institute — Ovarian Epithelial, Fallopian Tube, and Primary Peritoneal Cancer Treatment',
        href: 'https://www.cancer.gov/types/ovarian/patient/ovarian-epithelial-treatment-pdq',
      },
      {
        label: 'National Cancer Institute SEER — Ovarian Cancer Stat Facts',
        href: 'https://seer.cancer.gov/statfacts/html/ovary.html',
      },
    ],
  },
  ro: {
    heading: 'Surse și informații medicale',
    disclaimer:
      'Această pagină oferă informații educaționale generale. Nu înlocuiește sfatul, diagnosticul sau tratamentul oferit de un profesionist medical calificat. Cancerele epiteliale ovariene, ale trompelor uterine și peritoneale primare pot să nu provoace semne sau simptome timpurii. Adresează-te unui medic pentru durere abdominală sau pelvină persistentă ori care se agravează, umflare sau presiune, balonare, nevoie urgentă sau frecventă de a urina, dificultăți la alimentație sau senzație rapidă de sațietate, constipație ori o altă modificare îngrijorătoare. IARC estimează 330.731 de cazuri noi de cancer ovarian și 203.850 de decese la nivel mondial în 2024. NCI SEER raportează o supraviețuire relativă la 5 ani de 52,0% în Statele Unite, pentru toate stadiile combinate, în perioada 2016–2022. Această statistică populațională nu poate prezice rezultatul unei persoane; prognosticul și tratamentul depind de tipul și stadiul cancerului, starea generală de sănătate și răspunsul la tratament.',
    sourcesHeading: 'Surse oficiale',
    checkedLabel: 'Surse verificate la data de',
    checkedDate: '28 iulie 2026',
    stats: [
      {
        value: '331 mii',
        label: 'Cazuri noi de cancer ovarian la nivel global în 2024 (estimare IARC)',
      },
      {
        value: '52,0%',
        label: 'Supraviețuire relativă la 5 ani în SUA, toate stadiile combinate, 2016–2022 (NCI SEER)',
      },
    ],
    sources: [
      {
        label: 'Agenția Internațională pentru Cercetare în Domeniul Cancerului — Fișă despre cancerul ovarian',
        href: 'https://gco.iarc.who.int/media/globocan/factsheets/cancers/25-ovary-fact-sheet.pdf',
      },
      {
        label: 'Institutul Național al Cancerului — Cancer ovarian, al trompelor uterine și peritoneal primar: versiunea pentru pacienți',
        href: 'https://www.cancer.gov/types/ovarian',
      },
      {
        label: 'Institutul Național al Cancerului — Tratamentul cancerelor epiteliale ovariene, ale trompelor uterine și peritoneale primare',
        href: 'https://www.cancer.gov/types/ovarian/patient/ovarian-epithelial-treatment-pdq',
      },
      {
        label: 'Institutul Național al Cancerului SEER — Date statistice despre cancerul ovarian',
        href: 'https://seer.cancer.gov/statfacts/html/ovary.html',
      },
    ],
  },
  es: {
    heading: 'Fuentes e información médica',
    disclaimer:
      'Esta página ofrece información educativa general. No sustituye el consejo, diagnóstico ni tratamiento de un profesional sanitario cualificado. Los cánceres epiteliales de ovario, de trompas de Falopio y primarios de peritoneo pueden no causar signos o síntomas tempranos. Consulta a un profesional sanitario ante dolor abdominal o pélvico persistente o que empeora, hinchazón o presión, distensión abdominal, necesidad urgente o frecuente de orinar, dificultad para comer o sensación de llenura, estreñimiento u otro cambio preocupante. El IARC estima 330.731 casos nuevos de cáncer de ovario y 203.850 muertes en todo el mundo en 2024. NCI SEER informa una supervivencia relativa a 5 años del 52,0% en Estados Unidos, para todas las etapas combinadas, durante 2016–2022. Esta estadística poblacional no puede predecir el resultado de una persona; el pronóstico y el tratamiento dependen del tipo y la etapa del cáncer, del estado general de salud y de la respuesta al tratamiento.',
    sourcesHeading: 'Fuentes oficiales',
    checkedLabel: 'Fuentes verificadas el',
    checkedDate: '28 de julio de 2026',
    stats: [
      {
        value: '331 mil',
        label: 'Casos nuevos de cáncer de ovario en todo el mundo en 2024 (estimación del IARC)',
      },
      {
        value: '52,0%',
        label: 'Supervivencia relativa a 5 años en EE. UU., todas las etapas combinadas, 2016–2022 (NCI SEER)',
      },
    ],
    sources: [
      {
        label: 'Agencia Internacional para la Investigación del Cáncer — Ficha sobre el cáncer de ovario',
        href: 'https://gco.iarc.who.int/media/globocan/factsheets/cancers/25-ovary-fact-sheet.pdf',
      },
      {
        label: 'Instituto Nacional del Cáncer — Cáncer de ovario, de trompas de Falopio y primario de peritoneo: versión para pacientes',
        href: 'https://www.cancer.gov/espanol/tipos/ovario',
      },
      {
        label: 'Instituto Nacional del Cáncer — Tratamiento de los cánceres epitelial de ovario, de trompas de Falopio y primario de peritoneo',
        href: 'https://www.cancer.gov/espanol/tipos/ovario/paciente/tratamiento-epitelial-ovario-pdq',
      },
      {
        label: 'Instituto Nacional del Cáncer SEER — Datos estadísticos sobre el cáncer de ovario',
        href: 'https://seer.cancer.gov/statfacts/html/ovary.html',
      },
    ],
  },
};

export function getOvarianGuideTrustContent(
  cancerId: CancerId,
  localeInput: string,
): OvarianGuideTrustContent | undefined {
  if (cancerId !== 'ovarian') return undefined;
  const locale = normalizeLocale(localeInput);
  return OVARIAN_GUIDE_TRUST[locale];
}
