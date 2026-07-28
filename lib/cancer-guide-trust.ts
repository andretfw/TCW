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

const LUNG_CANCER_TRUST: Record<SiteLocale, CancerGuideTrustContent> = {
  en: {
    heading: 'Sources and medical information',
    disclaimer:
      'This page provides general educational information. It does not replace medical advice, diagnosis or treatment from a qualified healthcare professional. Lung symptoms can have many causes; contact a healthcare professional about a persistent or worsening cough, coughing up blood, shortness of breath, chest pain or unexplained weight loss.',
    sourcesHeading: 'Official sources',
    checkedLabel: 'Sources checked',
    checkedDate: '28 July 2026',
    stats: [
      {
        value: '2.6M',
        label: 'New cases globally in 2024 (WHO estimate)',
      },
      {
        value: '1.86M',
        label: 'Deaths globally in 2024 (WHO estimate)',
      },
    ],
    sources: [
      {
        label: 'World Health Organization — Cancer fact sheet and 2024 global estimates',
        href: 'https://www.who.int/news-room/fact-sheets/detail/cancer',
      },
      {
        label: 'World Health Organization — Lung cancer fact sheet',
        href: 'https://www.who.int/news-room/fact-sheets/detail/lung-cancer',
      },
      {
        label: 'National Cancer Institute — Lung Cancer: Patient Version',
        href: 'https://www.cancer.gov/types/lung',
      },
      {
        label: 'National Cancer Institute — Non-Small Cell Lung Cancer Treatment',
        href: 'https://www.cancer.gov/types/lung/patient/non-small-cell-lung-treatment-pdq',
      },
      {
        label: 'National Cancer Institute — Small Cell Lung Cancer Treatment',
        href: 'https://www.cancer.gov/types/lung/patient/small-cell-lung-treatment-pdq',
      },
    ],
  },
  ro: {
    heading: 'Surse și informații medicale',
    disclaimer:
      'Această pagină oferă informații educaționale generale. Nu înlocuiește sfatul, diagnosticul sau tratamentul oferit de un profesionist medical calificat. Simptomele pulmonare pot avea numeroase cauze; adresează-te unui medic dacă ai tuse persistentă sau care se agravează, tușești sânge, ai dificultăți de respirație, durere în piept ori scădere inexplicabilă în greutate.',
    sourcesHeading: 'Surse oficiale',
    checkedLabel: 'Surse verificate la data de',
    checkedDate: '28 iulie 2026',
    stats: [
      {
        value: '2,6 mil.',
        label: 'Cazuri noi la nivel global în 2024 (estimare OMS)',
      },
      {
        value: '1,86 mil.',
        label: 'Decese la nivel global în 2024 (estimare OMS)',
      },
    ],
    sources: [
      {
        label: 'Organizația Mondială a Sănătății — Fișă despre cancer și estimările globale pentru 2024',
        href: 'https://www.who.int/news-room/fact-sheets/detail/cancer',
      },
      {
        label: 'Organizația Mondială a Sănătății — Fișă informativă despre cancerul pulmonar',
        href: 'https://www.who.int/news-room/fact-sheets/detail/lung-cancer',
      },
      {
        label: 'Institutul Național al Cancerului — Cancer pulmonar: versiunea pentru pacienți',
        href: 'https://www.cancer.gov/types/lung',
      },
      {
        label: 'Institutul Național al Cancerului — Tratamentul cancerului pulmonar fără celule mici',
        href: 'https://www.cancer.gov/types/lung/patient/non-small-cell-lung-treatment-pdq',
      },
      {
        label: 'Institutul Național al Cancerului — Tratamentul cancerului pulmonar cu celule mici',
        href: 'https://www.cancer.gov/types/lung/patient/small-cell-lung-treatment-pdq',
      },
    ],
  },
  es: {
    heading: 'Fuentes e información médica',
    disclaimer:
      'Esta página ofrece información educativa general. No sustituye el consejo, diagnóstico ni tratamiento de un profesional sanitario cualificado. Los síntomas pulmonares pueden tener muchas causas; consulta a un profesional sanitario si tienes tos persistente o que empeora, tos con sangre, dificultad para respirar, dolor en el pecho o pérdida de peso sin explicación.',
    sourcesHeading: 'Fuentes oficiales',
    checkedLabel: 'Fuentes verificadas el',
    checkedDate: '28 de julio de 2026',
    stats: [
      {
        value: '2,6 M',
        label: 'Casos nuevos en todo el mundo en 2024 (estimación de la OMS)',
      },
      {
        value: '1,86 M',
        label: 'Muertes en todo el mundo en 2024 (estimación de la OMS)',
      },
    ],
    sources: [
      {
        label: 'Organización Mundial de la Salud — Ficha sobre el cáncer y estimaciones mundiales de 2024',
        href: 'https://www.who.int/es/news-room/fact-sheets/detail/cancer',
      },
      {
        label: 'Organización Mundial de la Salud — Ficha informativa sobre el cáncer de pulmón',
        href: 'https://www.who.int/es/news-room/fact-sheets/detail/lung-cancer',
      },
      {
        label: 'Instituto Nacional del Cáncer — Cáncer de pulmón: versión para pacientes',
        href: 'https://www.cancer.gov/espanol/tipos/pulmon',
      },
      {
        label: 'Instituto Nacional del Cáncer — Tratamiento del cáncer de pulmón de células no pequeñas',
        href: 'https://www.cancer.gov/espanol/tipos/pulmon/paciente/tratamiento-pulmon-celulas-no-pequenas-pdq',
      },
      {
        label: 'Instituto Nacional del Cáncer — Tratamiento del cáncer de pulmón de células pequeñas',
        href: 'https://www.cancer.gov/espanol/tipos/pulmon/paciente/tratamiento-pulmon-celulas-pequenas-pdq',
      },
    ],
  },
};

const COLORECTAL_CANCER_TRUST: Record<SiteLocale, CancerGuideTrustContent> = {
  en: {
    heading: 'Sources and medical information',
    disclaimer:
      'This page provides general educational information. It does not replace medical advice, diagnosis or treatment from a qualified healthcare professional. Bowel symptoms can have many causes; contact a healthcare professional about persistent changes in bowel habits, blood in the stool, abdominal pain, unexplained weight loss, fatigue or iron-deficiency anaemia.',
    sourcesHeading: 'Official sources',
    checkedLabel: 'Sources checked',
    checkedDate: '28 July 2026',
    stats: [
      {
        value: '2.0M',
        label: 'New cases globally in 2024 (WHO estimate)',
      },
      {
        value: '918K',
        label: 'Deaths globally in 2024 (WHO estimate)',
      },
    ],
    sources: [
      {
        label: 'World Health Organization — Cancer fact sheet and 2024 global estimates',
        href: 'https://www.who.int/news-room/fact-sheets/detail/cancer',
      },
      {
        label: 'World Health Organization — Colorectal cancer fact sheet',
        href: 'https://www.who.int/news-room/fact-sheets/detail/colorectal-cancer',
      },
      {
        label: 'National Cancer Institute — Colorectal Cancer: Patient Version',
        href: 'https://www.cancer.gov/types/colorectal',
      },
      {
        label: 'National Cancer Institute — Colorectal Cancer Screening',
        href: 'https://www.cancer.gov/types/colorectal/patient/colorectal-screening-pdq',
      },
    ],
  },
  ro: {
    heading: 'Surse și informații medicale',
    disclaimer:
      'Această pagină oferă informații educaționale generale. Nu înlocuiește sfatul, diagnosticul sau tratamentul oferit de un profesionist medical calificat. Simptomele intestinale pot avea numeroase cauze; adresează-te unui medic pentru modificări persistente ale tranzitului intestinal, sânge în scaun, dureri abdominale, scădere inexplicabilă în greutate, oboseală sau anemie feriprivă.',
    sourcesHeading: 'Surse oficiale',
    checkedLabel: 'Surse verificate la data de',
    checkedDate: '28 iulie 2026',
    stats: [
      {
        value: '2,0 mil.',
        label: 'Cazuri noi la nivel global în 2024 (estimare OMS)',
      },
      {
        value: '918 mii',
        label: 'Decese la nivel global în 2024 (estimare OMS)',
      },
    ],
    sources: [
      {
        label: 'Organizația Mondială a Sănătății — Fișă despre cancer și estimările globale pentru 2024',
        href: 'https://www.who.int/news-room/fact-sheets/detail/cancer',
      },
      {
        label: 'Organizația Mondială a Sănătății — Fișă informativă despre cancerul colorectal',
        href: 'https://www.who.int/news-room/fact-sheets/detail/colorectal-cancer',
      },
      {
        label: 'Institutul Național al Cancerului — Cancer colorectal: versiunea pentru pacienți',
        href: 'https://www.cancer.gov/types/colorectal',
      },
      {
        label: 'Institutul Național al Cancerului — Screening pentru cancerul colorectal',
        href: 'https://www.cancer.gov/types/colorectal/patient/colorectal-screening-pdq',
      },
    ],
  },
  es: {
    heading: 'Fuentes e información médica',
    disclaimer:
      'Esta página ofrece información educativa general. No sustituye el consejo, diagnóstico ni tratamiento de un profesional sanitario cualificado. Los síntomas intestinales pueden tener muchas causas; consulta a un profesional sanitario si tienes cambios persistentes en los hábitos intestinales, sangre en las heces, dolor abdominal, pérdida de peso sin explicación, cansancio o anemia por falta de hierro.',
    sourcesHeading: 'Fuentes oficiales',
    checkedLabel: 'Fuentes verificadas el',
    checkedDate: '28 de julio de 2026',
    stats: [
      {
        value: '2,0 M',
        label: 'Casos nuevos en todo el mundo en 2024 (estimación de la OMS)',
      },
      {
        value: '918 mil',
        label: 'Muertes en todo el mundo en 2024 (estimación de la OMS)',
      },
    ],
    sources: [
      {
        label: 'Organización Mundial de la Salud — Ficha sobre el cáncer y estimaciones mundiales de 2024',
        href: 'https://www.who.int/es/news-room/fact-sheets/detail/cancer',
      },
      {
        label: 'Organización Mundial de la Salud — Ficha informativa sobre el cáncer colorrectal',
        href: 'https://www.who.int/es/news-room/fact-sheets/detail/colorectal-cancer',
      },
      {
        label: 'Instituto Nacional del Cáncer — Cáncer colorrectal: versión para pacientes',
        href: 'https://www.cancer.gov/espanol/tipos/colorrectal',
      },
      {
        label: 'Instituto Nacional del Cáncer — Detección del cáncer colorrectal',
        href: 'https://www.cancer.gov/espanol/tipos/colorrectal/paciente/deteccion-colorrectal-pdq',
      },
    ],
  },
};

const PROSTATE_CANCER_TRUST: Record<SiteLocale, CancerGuideTrustContent> = {
  en: {
    heading: 'Sources and medical information',
    disclaimer:
      'This page provides general educational information. It does not replace medical advice, diagnosis or treatment from a qualified healthcare professional. Early prostate cancer often causes no symptoms, and urinary symptoms can also be caused by non-cancerous prostate conditions. Prognosis varies by stage, grade, age, overall health and treatment response. Discuss symptoms and the potential benefits and harms of PSA testing with a healthcare professional.',
    sourcesHeading: 'Official sources',
    checkedLabel: 'Sources checked',
    checkedDate: '28 July 2026',
    stats: [
      {
        value: '1.5M',
        label: 'New cases globally in 2024 (WHO estimate)',
      },
      {
        value: '98.2%',
        label: 'Five-year relative survival in the US, all stages combined, 2016–2022 (NCI SEER)',
      },
    ],
    sources: [
      {
        label: 'World Health Organization — Cancer fact sheet and 2024 global estimates',
        href: 'https://www.who.int/news-room/fact-sheets/detail/cancer',
      },
      {
        label: 'National Cancer Institute — Prostate Cancer: Patient Version',
        href: 'https://www.cancer.gov/types/prostate',
      },
      {
        label: 'National Cancer Institute — Understanding Prostate Changes',
        href: 'https://www.cancer.gov/types/prostate/understanding-prostate-changes',
      },
      {
        label: 'National Cancer Institute — Prostate Cancer Treatment',
        href: 'https://www.cancer.gov/types/prostate/patient/prostate-treatment-pdq',
      },
      {
        label: 'National Cancer Institute SEER — Prostate Cancer Stat Facts',
        href: 'https://seer.cancer.gov/statfacts/html/prost.html',
      },
    ],
  },
  ro: {
    heading: 'Surse și informații medicale',
    disclaimer:
      'Această pagină oferă informații educaționale generale. Nu înlocuiește sfatul, diagnosticul sau tratamentul oferit de un profesionist medical calificat. Cancerul de prostată în stadiu incipient nu provoacă adesea simptome, iar simptomele urinare pot fi cauzate și de afecțiuni necanceroase ale prostatei. Prognosticul variază în funcție de stadiu, grad, vârstă, starea generală de sănătate și răspunsul la tratament. Discută cu un medic despre simptome și despre posibilele beneficii și riscuri ale testării PSA.',
    sourcesHeading: 'Surse oficiale',
    checkedLabel: 'Surse verificate la data de',
    checkedDate: '28 iulie 2026',
    stats: [
      {
        value: '1,5 mil.',
        label: 'Cazuri noi la nivel global în 2024 (estimare OMS)',
      },
      {
        value: '98,2%',
        label: 'Supraviețuire relativă la 5 ani în SUA, toate stadiile combinate, 2016–2022 (NCI SEER)',
      },
    ],
    sources: [
      {
        label: 'Organizația Mondială a Sănătății — Fișă despre cancer și estimările globale pentru 2024',
        href: 'https://www.who.int/news-room/fact-sheets/detail/cancer',
      },
      {
        label: 'Institutul Național al Cancerului — Cancer de prostată: versiunea pentru pacienți',
        href: 'https://www.cancer.gov/types/prostate',
      },
      {
        label: 'Institutul Național al Cancerului — Înțelegerea modificărilor prostatei',
        href: 'https://www.cancer.gov/types/prostate/understanding-prostate-changes',
      },
      {
        label: 'Institutul Național al Cancerului — Tratamentul cancerului de prostată',
        href: 'https://www.cancer.gov/types/prostate/patient/prostate-treatment-pdq',
      },
      {
        label: 'Institutul Național al Cancerului SEER — Date statistice despre cancerul de prostată',
        href: 'https://seer.cancer.gov/statfacts/html/prost.html',
      },
    ],
  },
  es: {
    heading: 'Fuentes e información médica',
    disclaimer:
      'Esta página ofrece información educativa general. No sustituye el consejo, diagnóstico ni tratamiento de un profesional sanitario cualificado. El cáncer de próstata en etapa temprana a menudo no causa síntomas, y los síntomas urinarios también pueden deberse a afecciones no cancerosas de la próstata. El pronóstico varía según la etapa, el grado, la edad, el estado general de salud y la respuesta al tratamiento. Consulta a un profesional sanitario sobre los síntomas y sobre los posibles beneficios y riesgos de la prueba del PSA.',
    sourcesHeading: 'Fuentes oficiales',
    checkedLabel: 'Fuentes verificadas el',
    checkedDate: '28 de julio de 2026',
    stats: [
      {
        value: '1,5 M',
        label: 'Casos nuevos en todo el mundo en 2024 (estimación de la OMS)',
      },
      {
        value: '98,2%',
        label: 'Supervivencia relativa a 5 años en EE. UU., todas las etapas combinadas, 2016–2022 (NCI SEER)',
      },
    ],
    sources: [
      {
        label: 'Organización Mundial de la Salud — Ficha sobre el cáncer y estimaciones mundiales de 2024',
        href: 'https://www.who.int/es/news-room/fact-sheets/detail/cancer',
      },
      {
        label: 'Instituto Nacional del Cáncer — Cáncer de próstata: versión para pacientes',
        href: 'https://www.cancer.gov/espanol/tipos/prostata',
      },
      {
        label: 'Instituto Nacional del Cáncer — Cambios y afecciones de la próstata',
        href: 'https://www.cancer.gov/espanol/tipos/prostata/cambios-prostata',
      },
      {
        label: 'Instituto Nacional del Cáncer — Tratamiento del cáncer de próstata',
        href: 'https://www.cancer.gov/espanol/tipos/prostata/paciente/tratamiento-prostata-pdq',
      },
      {
        label: 'Instituto Nacional del Cáncer SEER — Datos estadísticos sobre el cáncer de próstata',
        href: 'https://seer.cancer.gov/statfacts/html/prost.html',
      },
    ],
  },
};

const CANCER_GUIDE_TRUST: Partial<
  Record<CancerId, Record<SiteLocale, CancerGuideTrustContent>>
> = {
  breast: BREAST_CANCER_TRUST,
  lung: LUNG_CANCER_TRUST,
  colorectal: COLORECTAL_CANCER_TRUST,
  prostate: PROSTATE_CANCER_TRUST,
};

export function getCancerGuideTrustContent(
  cancerId: CancerId,
  localeInput: string,
): CancerGuideTrustContent | undefined {
  const locale = normalizeLocale(localeInput);
  return CANCER_GUIDE_TRUST[cancerId]?.[locale];
}
