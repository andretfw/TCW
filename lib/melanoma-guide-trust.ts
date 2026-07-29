import {normalizeLocale, type CancerId, type SiteLocale} from '@/lib/routes';

type GuideSource = {
  label: string;
  href: string;
};

export type MelanomaGuideTrustContent = {
  heading: string;
  disclaimer: string;
  sourcesHeading: string;
  checkedLabel: string;
  checkedDate: string;
  statsTitle?: string;
  stats: [
    {value: string; label: string},
    {value: string; label: string},
  ];
  sources: GuideSource[];
};

const MELANOMA_GUIDE_TRUST: Record<SiteLocale, MelanomaGuideTrustContent> = {
  en: {
    heading: 'Sources and medical information',
    disclaimer:
      'This page provides general educational information. It does not replace medical advice, diagnosis or treatment from a qualified healthcare professional. Melanoma does not always follow the ABCDE pattern. Contact a healthcare professional about a new or changing mole, an unusual skin lesion, bleeding, itching or another persistent skin change. Prognosis varies by stage, tumour thickness, ulceration and other individual factors. NCI SEER reports 94.7% five-year relative survival in the United States across all stages combined for 2016–2022; this population statistic cannot predict an individual outcome.',
    sourcesHeading: 'Official sources',
    checkedLabel: 'Sources checked',
    checkedDate: '28 July 2026',
    stats: [
      {
        value: '330K',
        label: 'New melanoma cases globally in 2022 (IARC estimate)',
      },
      {
        value: 'Almost 60K',
        label: 'Melanoma deaths globally in 2022 (IARC estimate)',
      },
    ],
    sources: [
      {
        label: 'International Agency for Research on Cancer — Skin cancer',
        href: 'https://www.iarc.who.int/cancer-type/skin-cancer/',
      },
      {
        label: 'National Cancer Institute — Melanoma Treatment: Patient Version',
        href: 'https://www.cancer.gov/types/skin/patient/melanoma-treatment-pdq',
      },
      {
        label: 'National Cancer Institute SEER — Melanoma of the Skin Stat Facts',
        href: 'https://seer.cancer.gov/statfacts/html/melan.html',
      },
    ],
  },
  ro: {
    heading: 'Surse și informații medicale',
    disclaimer:
      'Această pagină oferă informații educaționale generale. Nu înlocuiește sfatul, diagnosticul sau tratamentul oferit de un profesionist medical calificat. Melanomul nu respectă întotdeauna regula ABCDE. Adresează-te unui medic pentru o aluniță nouă sau care se modifică, o leziune neobișnuită, sângerare, mâncărime ori o altă modificare persistentă a pielii. Prognosticul variază în funcție de stadiu, grosimea tumorii, ulcerație și alți factori individuali. NCI SEER raportează o supraviețuire relativă la 5 ani de 94,7% în Statele Unite, pentru toate stadiile combinate, în perioada 2016–2022; această statistică populațională nu poate prezice rezultatul unei persoane.',
    sourcesHeading: 'Surse oficiale',
    checkedLabel: 'Surse verificate la data de',
    checkedDate: '28 iulie 2026',
    stats: [
      {
        value: '330 mii',
        label: 'Cazuri noi de melanom la nivel global în 2022 (estimare IARC)',
      },
      {
        value: 'Aproape 60 mii',
        label: 'Decese cauzate de melanom la nivel global în 2022 (estimare IARC)',
      },
    ],
    sources: [
      {
        label: 'Agenția Internațională pentru Cercetare în Domeniul Cancerului — Cancer de piele',
        href: 'https://www.iarc.who.int/cancer-type/skin-cancer/',
      },
      {
        label: 'Institutul Național al Cancerului — Tratamentul melanomului: versiunea pentru pacienți',
        href: 'https://www.cancer.gov/types/skin/patient/melanoma-treatment-pdq',
      },
      {
        label: 'Institutul Național al Cancerului SEER — Date statistice despre melanomul cutanat',
        href: 'https://seer.cancer.gov/statfacts/html/melan.html',
      },
    ],
  },
  es: {
    heading: 'Fuentes e información médica',
    disclaimer:
      'Esta página ofrece información educativa general. No sustituye el consejo, diagnóstico ni tratamiento de un profesional sanitario cualificado. El melanoma no siempre sigue la regla ABCDE. Consulta a un profesional sanitario por un lunar nuevo o que cambia, una lesión cutánea inusual, sangrado, picor u otro cambio persistente en la piel. El pronóstico varía según la etapa, el grosor del tumor, la ulceración y otros factores individuales. NCI SEER informa una supervivencia relativa a 5 años del 94,7% en Estados Unidos, para todas las etapas combinadas, durante 2016–2022; esta estadística poblacional no puede predecir el resultado de una persona.',
    sourcesHeading: 'Fuentes oficiales',
    checkedLabel: 'Fuentes verificadas el',
    checkedDate: '28 de julio de 2026',
    stats: [
      {
        value: '330 mil',
        label: 'Casos nuevos de melanoma en todo el mundo en 2022 (estimación del IARC)',
      },
      {
        value: 'Casi 60 mil',
        label: 'Muertes por melanoma en todo el mundo en 2022 (estimación del IARC)',
      },
    ],
    sources: [
      {
        label: 'Agencia Internacional para la Investigación del Cáncer — Cáncer de piel',
        href: 'https://www.iarc.who.int/cancer-type/skin-cancer/',
      },
      {
        label: 'Instituto Nacional del Cáncer — Tratamiento del melanoma: versión para pacientes',
        href: 'https://www.cancer.gov/espanol/tipos/piel/paciente/tratamiento-melanoma-pdq',
      },
      {
        label: 'Instituto Nacional del Cáncer SEER — Datos estadísticos sobre el melanoma cutáneo',
        href: 'https://seer.cancer.gov/statfacts/html/melan.html',
      },
    ],
  },
};

export function getMelanomaGuideTrustContent(
  cancerId: CancerId,
  localeInput: string,
): MelanomaGuideTrustContent | undefined {
  if (cancerId !== 'skin') return undefined;
  const locale = normalizeLocale(localeInput);
  return MELANOMA_GUIDE_TRUST[locale];
}
