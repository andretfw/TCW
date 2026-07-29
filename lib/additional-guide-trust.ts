import {normalizeLocale, type CancerId, type SiteLocale} from '@/lib/routes';
import {isAdditionalCancerGuideId, type AdditionalCancerGuideId} from '@/lib/additional-cancer-guides';

type GuideSource = {label: string; href: string};
type GuideStat = {value: string; label: string};

export type AdditionalGuideTrustContent = {
  heading: string;
  disclaimer: string;
  sourcesHeading: string;
  checkedLabel: string;
  checkedDate: string;
  statsTitle: string;
  stats: [GuideStat, GuideStat];
  sources: GuideSource[];
};

type LocalisedDefinition = {
  disclaimer: string;
  stats: [GuideStat, GuideStat];
  sourceLabels: string[];
};

type GuideDefinition = {
  sourceUrls: string[];
  copy: Record<SiteLocale, LocalisedDefinition>;
};

const UI: Record<SiteLocale, Omit<AdditionalGuideTrustContent, 'disclaimer' | 'stats' | 'sources'>> = {
  en: {
    heading: 'Sources and medical information',
    sourcesHeading: 'Official sources',
    checkedLabel: 'Sources checked',
    checkedDate: '29 July 2026',
    statsTitle: 'Key Facts',
  },
  ro: {
    heading: 'Surse și informații medicale',
    sourcesHeading: 'Surse oficiale',
    checkedLabel: 'Surse verificate la data de',
    checkedDate: '29 iulie 2026',
    statsTitle: 'Date-cheie',
  },
  es: {
    heading: 'Fuentes e información médica',
    sourcesHeading: 'Fuentes oficiales',
    checkedLabel: 'Fuentes verificadas el',
    checkedDate: '29 de julio de 2026',
    statsTitle: 'Datos clave',
  },
};

const GUIDE_DEFINITIONS: Record<AdditionalCancerGuideId, GuideDefinition> = {
  mesothelioma: {
    sourceUrls: [
      'https://www.cancer.gov/types/mesothelioma',
      'https://www.cancer.gov/types/mesothelioma/symptoms',
      'https://www.cancer.gov/types/mesothelioma/treatment',
    ],
    copy: {
      en: {
        disclaimer:
          'This page provides general education and does not replace medical advice, diagnosis or treatment. Breathing difficulty, chest pain or abdominal swelling can have many causes, but persistent or worsening symptoms should be medically assessed. Tell your clinician about any known or possible asbestos exposure.',
        stats: [
          {value: 'Pleura', label: 'The lining around the lungs and chest is the most common site'},
          {value: 'Asbestos', label: 'The major established risk factor for mesothelioma'},
        ],
        sourceLabels: [
          'National Cancer Institute — Mesothelioma overview',
          'National Cancer Institute — Mesothelioma symptoms',
          'National Cancer Institute — Mesothelioma treatment',
        ],
      },
      ro: {
        disclaimer:
          'Această pagină oferă informații educaționale generale și nu înlocuiește sfatul, diagnosticul sau tratamentul medical. Dificultățile de respirație, durerea toracică ori umflarea abdomenului pot avea multe cauze, dar simptomele persistente sau în agravare trebuie evaluate medical. Spune medicului despre orice expunere cunoscută sau posibilă la azbest.',
        stats: [
          {value: 'Pleura', label: 'Învelișul plămânilor și al toracelui este localizarea cea mai frecventă'},
          {value: 'Azbest', label: 'Principalul factor de risc cunoscut pentru mezoteliom'},
        ],
        sourceLabels: [
          'Institutul Național al Cancerului — Prezentare generală a mezoteliomului',
          'Institutul Național al Cancerului — Simptomele mezoteliomului',
          'Institutul Național al Cancerului — Tratamentul mezoteliomului',
        ],
      },
      es: {
        disclaimer:
          'Esta página ofrece información educativa general y no sustituye el consejo, diagnóstico ni tratamiento médico. La dificultad respiratoria, el dolor torácico o la hinchazón abdominal pueden tener muchas causas, pero los síntomas persistentes o que empeoran deben evaluarse. Informa a tu profesional sanitario sobre cualquier exposición conocida o posible al asbesto.',
        stats: [
          {value: 'Pleura', label: 'El revestimiento de los pulmones y el tórax es la localización más frecuente'},
          {value: 'Asbesto', label: 'El principal factor de riesgo establecido para el mesotelioma'},
        ],
        sourceLabels: [
          'Instituto Nacional del Cáncer — Información general sobre mesotelioma',
          'Instituto Nacional del Cáncer — Síntomas del mesotelioma',
          'Instituto Nacional del Cáncer — Tratamiento del mesotelioma',
        ],
      },
    },
  },
  neuroendocrine: {
    sourceUrls: [
      'https://www.cancer.gov/types/gi-neuroendocrine-tumors',
      'https://www.cancer.gov/types/gi-neuroendocrine-tumors/patient/gi-neuroendocrine-treatment-pdq',
    ],
    copy: {
      en: {
        disclaimer:
          'This guide focuses mainly on gastrointestinal neuroendocrine tumours and does not describe every NET site or subtype. Symptoms vary according to the organ involved and whether the tumour releases hormones. Persistent symptoms need medical assessment, but they are more often caused by conditions other than cancer.',
        stats: [
          {value: 'Many sites', label: 'NETs can begin in several organs; this guide focuses on the digestive system'},
          {value: 'Hormones', label: 'Some NETs release hormones and cause a distinct symptom pattern; others do not'},
        ],
        sourceLabels: [
          'National Cancer Institute — Gastrointestinal neuroendocrine tumours',
          'National Cancer Institute — GI neuroendocrine tumour treatment (patient version)',
        ],
      },
      ro: {
        disclaimer:
          'Acest ghid se concentrează în principal pe tumorile neuroendocrine gastrointestinale și nu descrie fiecare localizare sau subtip NET. Simptomele variază în funcție de organul implicat și de eliberarea hormonilor. Simptomele persistente necesită evaluare medicală, dar sunt mai des cauzate de alte afecțiuni decât de cancer.',
        stats: [
          {value: 'Localizări multiple', label: 'NET-urile pot începe în mai multe organe; ghidul se concentrează pe sistemul digestiv'},
          {value: 'Hormoni', label: 'Unele NET-uri eliberează hormoni și provoacă simptome distincte; altele nu'},
        ],
        sourceLabels: [
          'Institutul Național al Cancerului — Tumori neuroendocrine gastrointestinale',
          'Institutul Național al Cancerului — Tratamentul NET gastrointestinale pentru pacienți',
        ],
      },
      es: {
        disclaimer:
          'Esta guía se centra principalmente en los tumores neuroendocrinos gastrointestinales y no describe todas las localizaciones o subtipos de TNE. Los síntomas varían según el órgano afectado y si el tumor libera hormonas. Los síntomas persistentes requieren evaluación médica, aunque con mayor frecuencia se deben a otras enfermedades.',
        stats: [
          {value: 'Varios órganos', label: 'Los TNE pueden comenzar en distintos órganos; esta guía se centra en el aparato digestivo'},
          {value: 'Hormonas', label: 'Algunos TNE liberan hormonas y causan síntomas específicos; otros no'},
        ],
        sourceLabels: [
          'Instituto Nacional del Cáncer — Tumores neuroendocrinos gastrointestinales',
          'Instituto Nacional del Cáncer — Tratamiento de TNE gastrointestinales para pacientes',
        ],
      },
    },
  },
  gist: {
    sourceUrls: [
      'https://www.cancer.gov/types/soft-tissue-sarcoma/patient/gist-treatment-pdq',
      'https://www.cancer.gov/types/soft-tissue-sarcoma',
    ],
    copy: {
      en: {
        disclaimer:
          'This page provides general educational information and does not replace specialist advice. Blood in vomit, black stools, severe abdominal pain, fainting or rapidly worsening weakness can require urgent medical care. GIST is different from the more common cancers that begin in the lining of the stomach or bowel.',
        stats: [
          {value: 'Stomach', label: 'One of the most common places where GIST begins'},
          {value: 'Targeted', label: 'Tyrosine kinase inhibitors are central treatments for many GISTs'},
        ],
        sourceLabels: [
          'National Cancer Institute — GIST treatment and patient information',
          'National Cancer Institute — Soft-tissue sarcoma overview',
        ],
      },
      ro: {
        disclaimer:
          'Această pagină oferă informații educaționale generale și nu înlocuiește sfatul specialistului. Sângele în vărsături, scaunele negre, durerea abdominală severă, leșinul sau slăbiciunea care se agravează rapid pot necesita îngrijire medicală urgentă. GIST diferă de cancerele mai frecvente care încep în mucoasa stomacului sau intestinului.',
        stats: [
          {value: 'Stomac', label: 'Una dintre cele mai frecvente localizări în care începe GIST'},
          {value: 'Țintit', label: 'Inhibitorii de tirozin-kinază sunt tratamente centrale pentru multe GIST-uri'},
        ],
        sourceLabels: [
          'Institutul Național al Cancerului — Tratamentul GIST și informații pentru pacienți',
          'Institutul Național al Cancerului — Prezentare generală a sarcoamelor de țesuturi moi',
        ],
      },
      es: {
        disclaimer:
          'Esta página ofrece información educativa general y no sustituye el consejo especializado. La sangre en el vómito, las heces negras, el dolor abdominal intenso, el desmayo o la debilidad que empeora rápidamente pueden requerir atención urgente. El GIST es distinto de los cánceres más frecuentes que comienzan en el revestimiento del estómago o intestino.',
        stats: [
          {value: 'Estómago', label: 'Una de las localizaciones más frecuentes donde comienza el GIST'},
          {value: 'Dirigido', label: 'Los inhibidores de tirosina cinasa son tratamientos centrales para muchos GIST'},
        ],
        sourceLabels: [
          'Instituto Nacional del Cáncer — Tratamiento del GIST e información para pacientes',
          'Instituto Nacional del Cáncer — Información general sobre sarcomas de tejidos blandos',
        ],
      },
    },
  },
  appendix: {
    sourceUrls: [
      'https://www.cancer.gov/pediatric-adult-rare-tumor/rare-tumors/rare-digestive-system-tumors/appendiceal-cancer',
      'https://www.cancer.gov/types/gi-neuroendocrine-tumors/patient/gi-neuroendocrine-treatment-pdq',
    ],
    copy: {
      en: {
        disclaimer:
          'Appendix cancer is rare and includes several biologically different diseases. The correct pathology diagnosis is essential because treatment for an epithelial, mucinous or neuroendocrine tumour may differ. New or severe right-sided abdominal pain can also be appendicitis and needs prompt medical assessment.',
        stats: [
          {value: 'Rare', label: 'Appendix cancer affects only a small number of people'},
          {value: 'Several types', label: 'The two broad groups are epithelial and neuroendocrine tumours'},
        ],
        sourceLabels: [
          'National Cancer Institute — Appendiceal cancer',
          'National Cancer Institute — Treatment of neuroendocrine tumours of the appendix',
        ],
      },
      ro: {
        disclaimer:
          'Cancerul de apendice este rar și include mai multe boli biologic diferite. Diagnosticul anatomopatologic corect este esențial deoarece tratamentul unei tumori epiteliale, mucinoase sau neuroendocrine poate fi diferit. Durerea abdominală nouă sau severă în partea dreaptă poate fi și apendicită și necesită evaluare medicală promptă.',
        stats: [
          {value: 'Rar', label: 'Cancerul de apendice afectează un număr mic de persoane'},
          {value: 'Mai multe tipuri', label: 'Cele două grupe largi sunt tumorile epiteliale și neuroendocrine'},
        ],
        sourceLabels: [
          'Institutul Național al Cancerului — Cancerul de apendice',
          'Institutul Național al Cancerului — Tratamentul tumorilor neuroendocrine ale apendicelui',
        ],
      },
      es: {
        disclaimer:
          'El cáncer de apéndice es raro e incluye varias enfermedades biológicamente diferentes. El diagnóstico anatomopatológico correcto es esencial porque el tratamiento de un tumor epitelial, mucinoso o neuroendocrino puede variar. El dolor abdominal nuevo o intenso en el lado derecho también puede ser apendicitis y requiere evaluación médica rápida.',
        stats: [
          {value: 'Raro', label: 'El cáncer de apéndice afecta a un número reducido de personas'},
          {value: 'Varios tipos', label: 'Los dos grandes grupos son los tumores epiteliales y neuroendocrinos'},
        ],
        sourceLabels: [
          'Instituto Nacional del Cáncer — Cáncer de apéndice',
          'Instituto Nacional del Cáncer — Tratamiento de tumores neuroendocrinos del apéndice',
        ],
      },
    },
  },
};

export function getAdditionalGuideTrustContent(
  cancerId: CancerId | string,
  localeInput: string,
): AdditionalGuideTrustContent | undefined {
  if (!isAdditionalCancerGuideId(cancerId)) return undefined;

  const locale = normalizeLocale(localeInput);
  const definition = GUIDE_DEFINITIONS[cancerId];
  const copy = definition.copy[locale];

  return {
    ...UI[locale],
    disclaimer: copy.disclaimer,
    stats: copy.stats,
    sources: definition.sourceUrls.map((href, index) => ({
      href,
      label: copy.sourceLabels[index],
    })),
  };
}
