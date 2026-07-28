import {normalizeLocale, type CancerId, type SiteLocale} from '@/lib/routes';

type GuideSource = {
  label: string;
  href: string;
};

export type CervicalGuideTrustContent = {
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

const CERVICAL_GUIDE_TRUST: Record<SiteLocale, CervicalGuideTrustContent> = {
  en: {
    heading: 'Sources and medical information',
    disclaimer:
      'This page provides general educational information. It does not replace medical advice, diagnosis, screening or treatment from a qualified healthcare professional. Persistent infection with high-risk human papillomavirus (HPV) causes almost all cervical cancers, but most HPV infections clear without causing cancer. HPV vaccination and screening according to national guidance can prevent many cases or find precancerous changes before they become cancer. Early cervical cancer may cause no symptoms. Contact a healthcare professional about unusual vaginal bleeding, including bleeding after sex, between periods or after menopause, unusual or foul-smelling vaginal discharge, persistent pelvic or back pain, pain during sex or another persistent change. IARC and WHO estimate about 604,000 new cervical cancer cases and 280,000 deaths worldwide in 2024. These population figures cannot predict an individual outcome; prognosis and treatment depend on the cancer type, stage, overall health, access to timely care and response to treatment.',
    sourcesHeading: 'Official sources',
    checkedLabel: 'Sources checked',
    checkedDate: '28 July 2026',
    statsTitle: 'Key Facts',
    stats: [
      {
        value: '604K',
        label: 'New cervical cancer cases worldwide in 2024 (WHO/IARC estimate)',
      },
      {
        value: '280K',
        label: 'Deaths from cervical cancer worldwide in 2024 (WHO/IARC estimate)',
      },
    ],
    sources: [
      {
        label: 'World Health Organization — Cervical cancer fact sheet',
        href: 'https://www.who.int/news-room/fact-sheets/detail/cervical-cancer',
      },
      {
        label: 'World Health Organization — Cervical cancer screening and prevention guidance',
        href: 'https://www.who.int/publications/i/item/9789240121744',
      },
      {
        label: 'National Cancer Institute — Cervical Cancer: Patient Version',
        href: 'https://www.cancer.gov/types/cervical',
      },
      {
        label: 'National Cancer Institute — Cervical Cancer Symptoms',
        href: 'https://www.cancer.gov/types/cervical/symptoms',
      },
      {
        label: 'National Cancer Institute — Cervical Cancer Treatment',
        href: 'https://www.cancer.gov/types/cervical/treatment',
      },
    ],
  },
  ro: {
    heading: 'Surse și informații medicale',
    disclaimer:
      'Această pagină oferă informații educaționale generale. Nu înlocuiește sfatul, diagnosticul, screeningul sau tratamentul oferit de un profesionist medical calificat. Infecția persistentă cu tipuri de virus papiloma uman (HPV) cu risc înalt cauzează aproape toate cancerele de col uterin, însă majoritatea infecțiilor cu HPV dispar fără să provoace cancer. Vaccinarea anti-HPV și screeningul efectuat conform recomandărilor naționale pot preveni multe cazuri sau pot identifica modificările precanceroase înainte de apariția cancerului. Cancerul de col uterin în stadiu incipient poate să nu provoace simptome. Adresează-te unui medic pentru sângerări vaginale neobișnuite, inclusiv după contact sexual, între menstruații sau după menopauză, secreții vaginale neobișnuite ori urât mirositoare, durere pelvină sau de spate persistentă, durere în timpul contactului sexual ori o altă modificare persistentă. IARC și OMS estimează aproximativ 604.000 de cazuri noi și 280.000 de decese cauzate de cancerul de col uterin la nivel mondial în 2024. Aceste cifre populaționale nu pot prezice rezultatul unei persoane; prognosticul și tratamentul depind de tipul și stadiul cancerului, starea generală de sănătate, accesul la îngrijire la timp și răspunsul la tratament.',
    sourcesHeading: 'Surse oficiale',
    checkedLabel: 'Surse verificate la data de',
    checkedDate: '28 iulie 2026',
    statsTitle: 'Date-cheie',
    stats: [
      {
        value: '604 mii',
        label: 'Cazuri noi de cancer de col uterin la nivel mondial în 2024 (estimare OMS/IARC)',
      },
      {
        value: '280 mii',
        label: 'Decese cauzate de cancerul de col uterin la nivel mondial în 2024 (estimare OMS/IARC)',
      },
    ],
    sources: [
      {
        label: 'Organizația Mondială a Sănătății — Fișă informativă despre cancerul de col uterin',
        href: 'https://www.who.int/news-room/fact-sheets/detail/cervical-cancer',
      },
      {
        label: 'Organizația Mondială a Sănătății — Ghid pentru screening și prevenirea cancerului de col uterin',
        href: 'https://www.who.int/publications/i/item/9789240121744',
      },
      {
        label: 'Institutul Național al Cancerului — Cancer de col uterin: versiunea pentru pacienți',
        href: 'https://www.cancer.gov/types/cervical',
      },
      {
        label: 'Institutul Național al Cancerului — Simptomele cancerului de col uterin',
        href: 'https://www.cancer.gov/types/cervical/symptoms',
      },
      {
        label: 'Institutul Național al Cancerului — Tratamentul cancerului de col uterin',
        href: 'https://www.cancer.gov/types/cervical/treatment',
      },
    ],
  },
  es: {
    heading: 'Fuentes e información médica',
    disclaimer:
      'Esta página ofrece información educativa general. No sustituye el consejo, diagnóstico, cribado ni tratamiento de un profesional sanitario cualificado. La infección persistente por tipos de virus del papiloma humano (VPH) de alto riesgo causa casi todos los cánceres de cuello uterino, pero la mayoría de las infecciones por VPH desaparecen sin causar cáncer. La vacunación contra el VPH y el cribado conforme a las recomendaciones nacionales pueden prevenir muchos casos o detectar cambios precancerosos antes de que se conviertan en cáncer. El cáncer de cuello uterino en etapas iniciales puede no causar síntomas. Consulta a un profesional sanitario ante sangrado vaginal inusual, incluido sangrado después de las relaciones sexuales, entre periodos o después de la menopausia, flujo vaginal inusual o con mal olor, dolor persistente en la pelvis o la espalda, dolor durante las relaciones sexuales u otro cambio persistente. El IARC y la OMS estiman aproximadamente 604.000 casos nuevos y 280.000 muertes por cáncer de cuello uterino en todo el mundo en 2024. Estas cifras poblacionales no pueden predecir el resultado de una persona; el pronóstico y el tratamiento dependen del tipo y la etapa del cáncer, el estado general de salud, el acceso oportuno a la atención y la respuesta al tratamiento.',
    sourcesHeading: 'Fuentes oficiales',
    checkedLabel: 'Fuentes verificadas el',
    checkedDate: '28 de julio de 2026',
    statsTitle: 'Datos clave',
    stats: [
      {
        value: '604 mil',
        label: 'Casos nuevos de cáncer de cuello uterino en todo el mundo en 2024 (estimación OMS/IARC)',
      },
      {
        value: '280 mil',
        label: 'Muertes por cáncer de cuello uterino en todo el mundo en 2024 (estimación OMS/IARC)',
      },
    ],
    sources: [
      {
        label: 'Organización Mundial de la Salud — Ficha informativa sobre el cáncer de cuello uterino',
        href: 'https://www.who.int/es/news-room/fact-sheets/detail/cervical-cancer',
      },
      {
        label: 'Organización Mundial de la Salud — Guía de cribado y prevención del cáncer de cuello uterino',
        href: 'https://www.who.int/publications/i/item/9789240121744',
      },
      {
        label: 'Instituto Nacional del Cáncer — Cáncer de cuello uterino: versión para pacientes',
        href: 'https://www.cancer.gov/espanol/tipos/cuello-uterino',
      },
      {
        label: 'Instituto Nacional del Cáncer — Síntomas del cáncer de cuello uterino',
        href: 'https://www.cancer.gov/espanol/tipos/cuello-uterino/sintomas',
      },
      {
        label: 'Instituto Nacional del Cáncer — Tratamiento del cáncer de cuello uterino',
        href: 'https://www.cancer.gov/espanol/tipos/cuello-uterino/tratamiento',
      },
    ],
  },
};

export function getCervicalGuideTrustContent(
  cancerId: CancerId,
  localeInput: string,
): CervicalGuideTrustContent | undefined {
  if (cancerId !== 'cervical') return undefined;
  const locale = normalizeLocale(localeInput);
  return CERVICAL_GUIDE_TRUST[locale];
}
