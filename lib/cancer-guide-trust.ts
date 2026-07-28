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
        href: 'https://www.cancer.gov/espanol/tipos/prostata/significado-cambios-en-la-prostata',
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

const KIDNEY_CANCER_TRUST: Record<SiteLocale, CancerGuideTrustContent> = {
  en: {
    heading: 'Sources and medical information',
    disclaimer:
      'This page provides general educational information. It does not replace medical advice, diagnosis or treatment from a qualified healthcare professional. Kidney cancer may cause no signs or symptoms in its early stages. Contact a healthcare professional about blood in the urine, persistent pain in the side or back, a lump in the abdomen, unexplained weight loss, fatigue or fever. Prognosis varies by cancer type, stage, age, overall health and treatment response. NCI SEER reports 79.2% five-year relative survival in the United States for kidney and renal pelvis cancer, all stages combined, for 2016–2022; this population statistic cannot predict an individual outcome.',
    sourcesHeading: 'Official sources',
    checkedLabel: 'Sources checked',
    checkedDate: '28 July 2026',
    stats: [
      {
        value: '443K',
        label: 'New kidney cancer cases globally in 2024 (IARC estimate)',
      },
      {
        value: '79.2%',
        label: 'Five-year relative survival in the US, all stages combined, 2016–2022 (NCI SEER)',
      },
    ],
    sources: [
      {
        label: 'International Agency for Research on Cancer — Kidney fact sheet',
        href: 'https://gco.iarc.who.int/media/globocan/factsheets/cancers/29-kidney-fact-sheet.pdf',
      },
      {
        label: 'National Cancer Institute — Kidney Cancer: Patient Version',
        href: 'https://www.cancer.gov/types/kidney',
      },
      {
        label: 'National Cancer Institute — Renal Cell Cancer Treatment: Patient Version',
        href: 'https://www.cancer.gov/types/kidney/patient/kidney-treatment-pdq',
      },
      {
        label: 'National Cancer Institute SEER — Kidney and Renal Pelvis Cancer Stat Facts',
        href: 'https://seer.cancer.gov/statfacts/html/kidrp.html',
      },
    ],
  },
  ro: {
    heading: 'Surse și informații medicale',
    disclaimer:
      'Această pagină oferă informații educaționale generale. Nu înlocuiește sfatul, diagnosticul sau tratamentul oferit de un profesionist medical calificat. Cancerul renal poate să nu provoace semne sau simptome în stadiile incipiente. Adresează-te unui medic dacă observi sânge în urină, durere persistentă în lateral sau spate, un nodul în abdomen, scădere inexplicabilă în greutate, oboseală ori febră. Prognosticul variază în funcție de tipul cancerului, stadiu, vârstă, starea generală de sănătate și răspunsul la tratament. NCI SEER raportează o supraviețuire relativă la 5 ani de 79,2% în Statele Unite pentru cancerul de rinichi și pelvis renal, toate stadiile combinate, în perioada 2016–2022; această statistică populațională nu poate prezice rezultatul unei persoane.',
    sourcesHeading: 'Surse oficiale',
    checkedLabel: 'Surse verificate la data de',
    checkedDate: '28 iulie 2026',
    stats: [
      {
        value: '443 mii',
        label: 'Cazuri noi de cancer renal la nivel global în 2024 (estimare IARC)',
      },
      {
        value: '79,2%',
        label: 'Supraviețuire relativă la 5 ani în SUA, toate stadiile combinate, 2016–2022 (NCI SEER)',
      },
    ],
    sources: [
      {
        label: 'Agenția Internațională pentru Cercetare în Domeniul Cancerului — Fișă despre cancerul renal',
        href: 'https://gco.iarc.who.int/media/globocan/factsheets/cancers/29-kidney-fact-sheet.pdf',
      },
      {
        label: 'Institutul Național al Cancerului — Cancer renal: versiunea pentru pacienți',
        href: 'https://www.cancer.gov/types/kidney',
      },
      {
        label: 'Institutul Național al Cancerului — Tratamentul cancerului cu celule renale: versiunea pentru pacienți',
        href: 'https://www.cancer.gov/types/kidney/patient/kidney-treatment-pdq',
      },
      {
        label: 'Institutul Național al Cancerului SEER — Date statistice despre cancerul de rinichi și pelvis renal',
        href: 'https://seer.cancer.gov/statfacts/html/kidrp.html',
      },
    ],
  },
  es: {
    heading: 'Fuentes e información médica',
    disclaimer:
      'Esta página ofrece información educativa general. No sustituye el consejo, diagnóstico ni tratamiento de un profesional sanitario cualificado. El cáncer de riñón puede no causar signos ni síntomas en las etapas iniciales. Consulta a un profesional sanitario si observas sangre en la orina, dolor persistente en el costado o la espalda, un bulto en el abdomen, pérdida de peso sin explicación, cansancio o fiebre. El pronóstico varía según el tipo de cáncer, la etapa, la edad, el estado general de salud y la respuesta al tratamiento. NCI SEER informa una supervivencia relativa a 5 años del 79,2% en Estados Unidos para el cáncer de riñón y pelvis renal, todas las etapas combinadas, durante 2016–2022; esta estadística poblacional no puede predecir el resultado de una persona.',
    sourcesHeading: 'Fuentes oficiales',
    checkedLabel: 'Fuentes verificadas el',
    checkedDate: '28 de julio de 2026',
    stats: [
      {
        value: '443 mil',
        label: 'Casos nuevos de cáncer de riñón en todo el mundo en 2024 (estimación del IARC)',
      },
      {
        value: '79,2%',
        label: 'Supervivencia relativa a 5 años en EE. UU., todas las etapas combinadas, 2016–2022 (NCI SEER)',
      },
    ],
    sources: [
      {
        label: 'Agencia Internacional para la Investigación del Cáncer — Ficha sobre el cáncer de riñón',
        href: 'https://gco.iarc.who.int/media/globocan/factsheets/cancers/29-kidney-fact-sheet.pdf',
      },
      {
        label: 'Instituto Nacional del Cáncer — Cáncer de riñón: versión para pacientes',
        href: 'https://www.cancer.gov/espanol/tipos/rinon',
      },
      {
        label: 'Instituto Nacional del Cáncer — Tratamiento del cáncer de células renales: versión para pacientes',
        href: 'https://www.cancer.gov/espanol/tipos/rinon/paciente/tratamiento-rinon-pdq',
      },
      {
        label: 'Instituto Nacional del Cáncer SEER — Datos estadísticos sobre el cáncer de riñón y pelvis renal',
        href: 'https://seer.cancer.gov/statfacts/html/kidrp.html',
      },
    ],
  },
};

const LEUKEMIA_CANCER_TRUST: Record<SiteLocale, CancerGuideTrustContent> = {
  en: {
    heading: 'Sources and medical information',
    disclaimer:
      'This page provides general educational information. It does not replace medical advice, diagnosis or treatment from a qualified healthcare professional. Leukemia is a broad term for cancers of the blood cells; symptoms, treatment and outlook differ substantially by type and age. Contact a healthcare professional about persistent or concerning symptoms such as unexplained fatigue, fever, frequent infections, easy bruising or bleeding, swollen lymph nodes, bone pain or night sweats. NCI SEER reports 68.6% five-year relative survival for leukemia in the United States for 2016–2022. This population average combines different leukemia types and cannot predict an individual outcome.',
    sourcesHeading: 'Official sources',
    checkedLabel: 'Sources checked',
    checkedDate: '28 July 2026',
    stats: [
      {
        value: '495K',
        label: 'New leukemia cases globally in 2024 (IARC estimate)',
      },
      {
        value: '68.6%',
        label: 'Five-year relative survival in the US, all leukemia types combined, 2016–2022 (NCI SEER)',
      },
    ],
    sources: [
      {
        label: 'International Agency for Research on Cancer — Leukaemia fact sheet',
        href: 'https://gco.iarc.who.int/media/globocan/factsheets/cancers/36-leukaemia-fact-sheet.pdf',
      },
      {
        label: 'National Cancer Institute — Leukemia: Patient Version',
        href: 'https://www.cancer.gov/types/leukemia',
      },
      {
        label: 'National Cancer Institute — Acute Lymphoblastic Leukemia Treatment',
        href: 'https://www.cancer.gov/types/leukemia/patient/adult-all-treatment-pdq',
      },
      {
        label: 'National Cancer Institute — Acute Myeloid Leukemia Treatment',
        href: 'https://www.cancer.gov/types/leukemia/patient/adult-aml-treatment-pdq',
      },
      {
        label: 'National Cancer Institute SEER — Leukemia Cancer Stat Facts',
        href: 'https://seer.cancer.gov/statfacts/html/leuks.html',
      },
    ],
  },
  ro: {
    heading: 'Surse și informații medicale',
    disclaimer:
      'Această pagină oferă informații educaționale generale. Nu înlocuiește sfatul, diagnosticul sau tratamentul oferit de un profesionist medical calificat. Leucemia este un termen larg pentru cancerele celulelor sanguine; simptomele, tratamentul și prognosticul diferă considerabil în funcție de tip și vârstă. Adresează-te unui medic pentru simptome persistente sau îngrijorătoare, precum oboseală fără explicație, febră, infecții frecvente, apariția ușoară a vânătăilor sau sângerărilor, ganglioni limfatici măriți, dureri osoase ori transpirații nocturne. NCI SEER raportează o supraviețuire relativă la 5 ani de 68,6% pentru leucemie în Statele Unite, în perioada 2016–2022. Această medie populațională reunește tipuri diferite de leucemie și nu poate prezice rezultatul unei persoane.',
    sourcesHeading: 'Surse oficiale',
    checkedLabel: 'Surse verificate la data de',
    checkedDate: '28 iulie 2026',
    stats: [
      {
        value: '495 mii',
        label: 'Cazuri noi de leucemie la nivel global în 2024 (estimare IARC)',
      },
      {
        value: '68,6%',
        label: 'Supraviețuire relativă la 5 ani în SUA, toate tipurile de leucemie combinate, 2016–2022 (NCI SEER)',
      },
    ],
    sources: [
      {
        label: 'Agenția Internațională pentru Cercetare în Domeniul Cancerului — Fișă despre leucemie',
        href: 'https://gco.iarc.who.int/media/globocan/factsheets/cancers/36-leukaemia-fact-sheet.pdf',
      },
      {
        label: 'Institutul Național al Cancerului — Leucemie: versiunea pentru pacienți',
        href: 'https://www.cancer.gov/types/leukemia',
      },
      {
        label: 'Institutul Național al Cancerului — Tratamentul leucemiei limfoblastice acute',
        href: 'https://www.cancer.gov/types/leukemia/patient/adult-all-treatment-pdq',
      },
      {
        label: 'Institutul Național al Cancerului — Tratamentul leucemiei mieloide acute',
        href: 'https://www.cancer.gov/types/leukemia/patient/adult-aml-treatment-pdq',
      },
      {
        label: 'Institutul Național al Cancerului SEER — Date statistice despre leucemie',
        href: 'https://seer.cancer.gov/statfacts/html/leuks.html',
      },
    ],
  },
  es: {
    heading: 'Fuentes e información médica',
    disclaimer:
      'Esta página ofrece información educativa general. No sustituye el consejo, diagnóstico ni tratamiento de un profesional sanitario cualificado. Leucemia es un término amplio para los cánceres de las células sanguíneas; los síntomas, el tratamiento y el pronóstico varían considerablemente según el tipo y la edad. Consulta a un profesional sanitario ante síntomas persistentes o preocupantes, como cansancio sin explicación, fiebre, infecciones frecuentes, aparición fácil de moretones o sangrado, ganglios linfáticos inflamados, dolor de huesos o sudores nocturnos. NCI SEER informa una supervivencia relativa a 5 años del 68,6% para la leucemia en Estados Unidos durante 2016–2022. Este promedio poblacional combina distintos tipos de leucemia y no puede predecir el resultado de una persona.',
    sourcesHeading: 'Fuentes oficiales',
    checkedLabel: 'Fuentes verificadas el',
    checkedDate: '28 de julio de 2026',
    stats: [
      {
        value: '495 mil',
        label: 'Casos nuevos de leucemia en todo el mundo en 2024 (estimación del IARC)',
      },
      {
        value: '68,6%',
        label: 'Supervivencia relativa a 5 años en EE. UU., todos los tipos de leucemia combinados, 2016–2022 (NCI SEER)',
      },
    ],
    sources: [
      {
        label: 'Agencia Internacional para la Investigación del Cáncer — Ficha sobre la leucemia',
        href: 'https://gco.iarc.who.int/media/globocan/factsheets/cancers/36-leukaemia-fact-sheet.pdf',
      },
      {
        label: 'Instituto Nacional del Cáncer — Leucemia: versión para pacientes',
        href: 'https://www.cancer.gov/espanol/tipos/leucemia',
      },
      {
        label: 'Instituto Nacional del Cáncer — Tratamiento de la leucemia linfoblástica aguda',
        href: 'https://www.cancer.gov/espanol/tipos/leucemia/paciente/tratamiento-lla-adultos-pdq',
      },
      {
        label: 'Instituto Nacional del Cáncer — Tratamiento de la leucemia mieloide aguda',
        href: 'https://www.cancer.gov/espanol/tipos/leucemia/paciente/tratamiento-lma-adultos-pdq',
      },
      {
        label: 'Instituto Nacional del Cáncer SEER — Datos estadísticos sobre la leucemia',
        href: 'https://seer.cancer.gov/statfacts/html/leuks.html',
      },
    ],
  },
};

const LIVER_CANCER_TRUST: Record<SiteLocale, CancerGuideTrustContent> = {
  en: {
    heading: 'Sources and medical information',
    disclaimer:
      'This page provides general educational information. It does not replace medical advice, diagnosis or treatment from a qualified healthcare professional. Signs and symptoms associated with primary liver cancer can also have other causes. Contact a healthcare professional about a hard lump or persistent discomfort in the upper-right abdomen, abdominal swelling, jaundice, pale stools and dark urine, unexplained weight loss, loss of appetite, unusual tiredness or other concerning symptoms. Chronic hepatitis B or C infection and cirrhosis increase risk; people living with chronic liver disease should discuss appropriate monitoring with their clinician. NCI SEER reports 21.9% five-year relative survival in the United States for liver and intrahepatic bile duct cancer, all stages combined, for 2016–2022. This population statistic groups different cancers and stages and cannot predict an individual outcome.',
    sourcesHeading: 'Official sources',
    checkedLabel: 'Sources checked',
    checkedDate: '28 July 2026',
    stats: [
      {
        value: '843K',
        label: 'New liver and intrahepatic bile duct cancer cases globally in 2024 (IARC estimate)',
      },
      {
        value: '21.9%',
        label: 'Five-year relative survival in the US, liver and intrahepatic bile duct cancer, all stages combined, 2016–2022 (NCI SEER)',
      },
    ],
    sources: [
      {
        label: 'International Agency for Research on Cancer — Liver fact sheet',
        href: 'https://gco.iarc.who.int/media/globocan/factsheets/cancers/11-liver-and-intrahepatic-bile-ducts-fact-sheet.pdf',
      },
      {
        label: 'National Cancer Institute — What Is Liver Cancer?',
        href: 'https://www.cancer.gov/types/liver/what-is-liver-cancer',
      },
      {
        label: 'National Cancer Institute — Liver Cancer Causes, Risk Factors, and Prevention',
        href: 'https://www.cancer.gov/types/liver/what-is-liver-cancer/causes-risk-factors',
      },
      {
        label: 'National Cancer Institute — Liver Cancer Treatment',
        href: 'https://www.cancer.gov/types/liver/what-is-liver-cancer/treatment',
      },
      {
        label: 'National Cancer Institute SEER — Liver and Intrahepatic Bile Duct Cancer Stat Facts',
        href: 'https://seer.cancer.gov/statfacts/html/livibd.html',
      },
    ],
  },
  ro: {
    heading: 'Surse și informații medicale',
    disclaimer:
      'Această pagină oferă informații educaționale generale. Nu înlocuiește sfatul, diagnosticul sau tratamentul oferit de un profesionist medical calificat. Semnele și simptomele asociate cancerului hepatic primar pot avea și alte cauze. Adresează-te unui medic dacă observi un nodul tare sau disconfort persistent în partea dreaptă superioară a abdomenului, umflarea abdomenului, icter, scaune deschise la culoare și urină închisă, scădere inexplicabilă în greutate, pierderea poftei de mâncare, oboseală neobișnuită ori alte simptome îngrijorătoare. Infecțiile cronice cu virusurile hepatitice B sau C și ciroza cresc riscul; persoanele cu boală hepatică cronică ar trebui să discute cu medicul despre monitorizarea potrivită situației lor. NCI SEER raportează o supraviețuire relativă la 5 ani de 21,9% în Statele Unite pentru cancerul hepatic și al căilor biliare intrahepatice, toate stadiile combinate, în perioada 2016–2022. Această statistică populațională grupează tipuri diferite de cancer și stadii și nu poate prezice rezultatul unei persoane.',
    sourcesHeading: 'Surse oficiale',
    checkedLabel: 'Surse verificate la data de',
    checkedDate: '28 iulie 2026',
    stats: [
      {
        value: '843 mii',
        label: 'Cazuri noi de cancer hepatic și al căilor biliare intrahepatice la nivel global în 2024 (estimare IARC)',
      },
      {
        value: '21,9%',
        label: 'Supraviețuire relativă la 5 ani în SUA pentru cancerul hepatic și al căilor biliare intrahepatice, toate stadiile combinate, 2016–2022 (NCI SEER)',
      },
    ],
    sources: [
      {
        label: 'Agenția Internațională pentru Cercetare în Domeniul Cancerului — Fișă despre cancerul hepatic',
        href: 'https://gco.iarc.who.int/media/globocan/factsheets/cancers/11-liver-and-intrahepatic-bile-ducts-fact-sheet.pdf',
      },
      {
        label: 'Institutul Național al Cancerului — Ce este cancerul hepatic?',
        href: 'https://www.cancer.gov/types/liver/what-is-liver-cancer',
      },
      {
        label: 'Institutul Național al Cancerului — Cauze, factori de risc și prevenție',
        href: 'https://www.cancer.gov/types/liver/what-is-liver-cancer/causes-risk-factors',
      },
      {
        label: 'Institutul Național al Cancerului — Tratamentul cancerului hepatic',
        href: 'https://www.cancer.gov/types/liver/what-is-liver-cancer/treatment',
      },
      {
        label: 'Institutul Național al Cancerului SEER — Date statistice despre cancerul hepatic și al căilor biliare intrahepatice',
        href: 'https://seer.cancer.gov/statfacts/html/livibd.html',
      },
    ],
  },
  es: {
    heading: 'Fuentes e información médica',
    disclaimer:
      'Esta página ofrece información educativa general. No sustituye el consejo, diagnóstico ni tratamiento de un profesional sanitario cualificado. Los signos y síntomas asociados con el cáncer primario de hígado también pueden tener otras causas. Consulta a un profesional sanitario si observas un bulto duro o molestias persistentes en la parte superior derecha del abdomen, hinchazón abdominal, ictericia, heces pálidas y orina oscura, pérdida de peso sin explicación, pérdida del apetito, cansancio inusual u otros síntomas preocupantes. Las infecciones crónicas por los virus de la hepatitis B o C y la cirrosis aumentan el riesgo; las personas con enfermedad hepática crónica deberían consultar con su médico sobre el seguimiento adecuado para su situación. NCI SEER informa una supervivencia relativa a 5 años del 21,9% en Estados Unidos para el cáncer de hígado y de conductos biliares intrahepáticos, todas las etapas combinadas, durante 2016–2022. Esta estadística poblacional agrupa distintos cánceres y etapas y no puede predecir el resultado de una persona.',
    sourcesHeading: 'Fuentes oficiales',
    checkedLabel: 'Fuentes verificadas el',
    checkedDate: '28 de julio de 2026',
    stats: [
      {
        value: '843 mil',
        label: 'Casos nuevos de cáncer de hígado y de conductos biliares intrahepáticos en todo el mundo en 2024 (estimación del IARC)',
      },
      {
        value: '21,9%',
        label: 'Supervivencia relativa a 5 años en EE. UU. para el cáncer de hígado y de conductos biliares intrahepáticos, todas las etapas combinadas, 2016–2022 (NCI SEER)',
      },
    ],
    sources: [
      {
        label: 'Agencia Internacional para la Investigación del Cáncer — Ficha sobre el cáncer de hígado',
        href: 'https://gco.iarc.who.int/media/globocan/factsheets/cancers/11-liver-and-intrahepatic-bile-ducts-fact-sheet.pdf',
      },
      {
        label: 'Instituto Nacional del Cáncer — ¿Qué es el cáncer de hígado?',
        href: 'https://www.cancer.gov/espanol/tipos/higado/que-es-cancer-de-higado',
      },
      {
        label: 'Instituto Nacional del Cáncer — Causas, factores de riesgo y prevención',
        href: 'https://www.cancer.gov/espanol/tipos/higado/que-es-cancer-de-higado/causas-factores-de-riesgo',
      },
      {
        label: 'Instituto Nacional del Cáncer — Tratamiento del cáncer de hígado',
        href: 'https://www.cancer.gov/espanol/tipos/higado/que-es-cancer-de-higado/tratamiento',
      },
      {
        label: 'Instituto Nacional del Cáncer SEER — Datos estadísticos sobre el cáncer de hígado y de conductos biliares intrahepáticos',
        href: 'https://seer.cancer.gov/statfacts/html/livibd.html',
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
  kidney: KIDNEY_CANCER_TRUST,
  leukemia: LEUKEMIA_CANCER_TRUST,
  liver: LIVER_CANCER_TRUST,
};

export function getCancerGuideTrustContent(
  cancerId: CancerId,
  localeInput: string,
): CancerGuideTrustContent | undefined {
  const locale = normalizeLocale(localeInput);
  return CANCER_GUIDE_TRUST[cancerId]?.[locale];
}
