import {normalizeLocale, type CancerId, type SiteLocale} from '@/lib/routes';

type GuideSource={label:string;href:string};
type GuideStat={value:string;label:string};
type LocaleCopy={intro:string;warning:string;note:string;stats:[GuideStat,GuideStat]};
type GuideDefinition={nciHref:string;includeGlobalStats:boolean;copy:Record<SiteLocale,LocaleCopy>};
export type RemainingGuideTrustContent={heading:string;disclaimer:string;sourcesHeading:string;checkedLabel:string;checkedDate:string;statsTitle:string;stats:[GuideStat,GuideStat];sources:GuideSource[]};

const GLOBAL_REPORT_URL='https://www.cancer.org/content/dam/cancer-org/research/cancer-facts-and-statistics/global-cancer-facts-and-figures/global-cancer-statistics-2024.pdf';
const UI={
  "en": {
    "heading": "Sources and medical information",
    "sourcesHeading": "Official sources",
    "checkedLabel": "Sources checked",
    "checkedDate": "28 July 2026",
    "statsTitle": "Key Facts",
    "globalSourceLabel": "IARC/ACS — Global Cancer Statistics 2024, published July 2026",
    "nciSourceLabel": "National Cancer Institute — Patient information",
    "opening": "This page provides general educational information and does not replace medical advice, diagnosis or treatment.",
    "globalNote": "The global figures are GLOBOCAN 2024 estimates published in July 2026 and cannot predict an individual outcome."
  },
  "ro": {
    "heading": "Surse și informații medicale",
    "sourcesHeading": "Surse oficiale",
    "checkedLabel": "Surse verificate la data de",
    "checkedDate": "28 iulie 2026",
    "statsTitle": "Date-cheie",
    "globalSourceLabel": "IARC/ACS — Statistici globale privind cancerul 2024, publicate în iulie 2026",
    "nciSourceLabel": "Institutul Național al Cancerului — Informații pentru pacienți",
    "opening": "Această pagină oferă informații educaționale generale și nu înlocuiește sfatul, diagnosticul sau tratamentul medical.",
    "globalNote": "Cifrele globale sunt estimări GLOBOCAN 2024 publicate în iulie 2026 și nu pot prezice evoluția unei persoane."
  },
  "es": {
    "heading": "Fuentes e información médica",
    "sourcesHeading": "Fuentes oficiales",
    "checkedLabel": "Fuentes verificadas el",
    "checkedDate": "28 de julio de 2026",
    "statsTitle": "Datos clave",
    "globalSourceLabel": "IARC/ACS — Estadísticas mundiales del cáncer 2024, publicadas en julio de 2026",
    "nciSourceLabel": "Instituto Nacional del Cáncer — Información para pacientes",
    "opening": "Esta página ofrece información educativa general y no sustituye el consejo, diagnóstico ni tratamiento médico.",
    "globalNote": "Las cifras mundiales son estimaciones de GLOBOCAN 2024 publicadas en julio de 2026 y no predicen el resultado de una persona."
  }
} as const;
const GUIDE_DEFINITIONS={
  "eye": {
    "nciHref": "https://www.cancer.gov/types/eye",
    "includeGlobalStats": false,
    "copy": {
      "en": {
        "intro": "Eye cancer includes distinct diseases such as uveal melanoma in adults and retinoblastoma in children.",
        "warning": "Seek specialist advice for persistent vision changes, flashes or new floaters, a growing dark spot, pupil-shape changes, eye bulging, unexplained pain or a white pupil reflex in a child.",
        "note": "Sudden vision loss needs urgent care.",
        "stats": [
          {
            "value": "Rare",
            "label": "Primary cancers that begin in the eye are uncommon"
          },
          {
            "value": "All ages",
            "label": "Retinoblastoma mainly affects children; uveal melanoma mainly affects adults"
          }
        ]
      },
      "ro": {
        "intro": "Cancerul ocular include boli distincte, precum melanomul uveal la adulți și retinoblastomul la copii.",
        "warning": "Cere sfatul unui specialist pentru schimbări persistente ale vederii, flash-uri sau corpi plutitori noi, o pată închisă care crește, schimbarea pupilei, protruzia ochiului, durere inexplicabilă sau reflex alb al pupilei la copil.",
        "note": "Pierderea bruscă a vederii necesită îngrijire urgentă.",
        "stats": [
          {
            "value": "Rar",
            "label": "Cancerele primare care încep în ochi sunt neobișnuite"
          },
          {
            "value": "Toate vârstele",
            "label": "Retinoblastomul afectează mai ales copiii; melanomul uveal, mai ales adulții"
          }
        ]
      },
      "es": {
        "intro": "El cáncer ocular incluye enfermedades distintas, como melanoma uveal en adultos y retinoblastoma en niños.",
        "warning": "Consulta a un especialista ante cambios persistentes en la visión, destellos o nuevas moscas volantes, una mancha oscura creciente, cambios en la pupila, protrusión ocular, dolor inexplicado o reflejo blanco en la pupila de un niño.",
        "note": "La pérdida repentina de visión requiere atención urgente.",
        "stats": [
          {
            "value": "Raro",
            "label": "Los cánceres primarios que comienzan en el ojo son poco frecuentes"
          },
          {
            "value": "Todas las edades",
            "label": "El retinoblastoma afecta sobre todo a niños; el melanoma uveal, a adultos"
          }
        ]
      }
    }
  },
  "oral": {
    "nciHref": "https://www.cancer.gov/types/head-and-neck",
    "includeGlobalStats": true,
    "copy": {
      "en": {
        "intro": "Oral cancer includes cancers of the lips and oral cavity.",
        "warning": "Seek dental or medical advice for a mouth sore, red or white patch, lump, unexplained bleeding or numbness, loose tooth, jaw change, or chewing or swallowing difficulty lasting more than two weeks.",
        "note": "Tobacco, alcohol and HPV at some sites are important risk factors.",
        "stats": [
          {
            "value": "452K",
            "label": "Latest estimated new cases worldwide — 2024 data published in 2026"
          },
          {
            "value": "194K",
            "label": "Latest estimated deaths worldwide — 2024 data published in 2026"
          }
        ]
      },
      "ro": {
        "intro": "Cancerul oral include cancerele buzelor și cavității orale.",
        "warning": "Cere sfatul unui medic sau dentist pentru o rană, pată roșie ori albă, nodul, sângerare sau amorțeală, dinte mobil, schimbare a maxilarului ori dificultăți la mestecat sau înghițit care durează peste două săptămâni.",
        "note": "Tutunul, alcoolul și HPV pentru anumite localizări sunt factori de risc importanți.",
        "stats": [
          {
            "value": "452 mii",
            "label": "Cele mai recente cazuri noi estimate la nivel mondial — date din 2024 publicate în 2026"
          },
          {
            "value": "194 mii",
            "label": "Cele mai recente decese estimate la nivel mondial — date din 2024 publicate în 2026"
          }
        ]
      },
      "es": {
        "intro": "El cáncer oral incluye los cánceres de labio y cavidad oral.",
        "warning": "Consulta a un profesional médico o dental ante una llaga, mancha roja o blanca, bulto, sangrado o entumecimiento, diente flojo, cambio mandibular o dificultad para masticar o tragar durante más de dos semanas.",
        "note": "El tabaco, el alcohol y el VPH en algunas localizaciones son factores de riesgo importantes.",
        "stats": [
          {
            "value": "452 mil",
            "label": "Últimos casos nuevos estimados en todo el mundo — datos de 2024 publicados en 2026"
          },
          {
            "value": "194 mil",
            "label": "Últimas muertes estimadas en todo el mundo — datos de 2024 publicados en 2026"
          }
        ]
      }
    }
  },
  "throat": {
    "nciHref": "https://www.cancer.gov/types/head-and-neck",
    "includeGlobalStats": true,
    "copy": {
      "en": {
        "intro": "“Throat cancer” is not one diagnosis; it may refer to cancers of the pharynx or larynx, which differ in causes and treatment.",
        "warning": "Seek medical advice for persistent hoarseness or sore throat, swallowing difficulty or pain, a neck lump, one-sided ear pain, coughing blood or unexplained weight loss.",
        "note": "The figures combine four sites and overlap with the broader head-and-neck guide.",
        "stats": [
          {
            "value": "513K",
            "label": "Combined new cases across oropharynx, nasopharynx, hypopharynx and larynx worldwide in 2024"
          },
          {
            "value": "260K",
            "label": "Combined deaths across those sites worldwide in 2024"
          }
        ]
      },
      "ro": {
        "intro": "„Cancerul gâtului” nu este un singur diagnostic; poate desemna cancere ale faringelui sau laringelui, cu factori și tratamente diferite.",
        "warning": "Cere sfatul unui medic pentru răgușeală sau durere în gât persistentă, dificultate ori durere la înghițire, nodul la gât, durere unilaterală de ureche, tuse cu sânge sau scădere în greutate.",
        "note": "Cifrele combină patru localizări și se suprapun cu ghidul cap-gât.",
        "stats": [
          {
            "value": "513 mii",
            "label": "Cazuri noi combinate pentru orofaringe, nazofaringe, hipofaringe și laringe la nivel mondial în 2024"
          },
          {
            "value": "260 mii",
            "label": "Decese combinate pentru aceste localizări la nivel mondial în 2024"
          }
        ]
      },
      "es": {
        "intro": "“Cáncer de garganta” no es un único diagnóstico; puede referirse a cánceres de faringe o laringe, con causas y tratamientos diferentes.",
        "warning": "Consulta ante ronquera o dolor de garganta persistentes, dificultad o dolor al tragar, un bulto en el cuello, dolor de oído unilateral, tos con sangre o pérdida de peso.",
        "note": "Las cifras combinan cuatro localizaciones y se solapan con la guía de cabeza y cuello.",
        "stats": [
          {
            "value": "513 mil",
            "label": "Casos nuevos combinados de orofaringe, nasofaringe, hipofaringe y laringe en todo el mundo en 2024"
          },
          {
            "value": "260 mil",
            "label": "Muertes combinadas en esas localizaciones en todo el mundo en 2024"
          }
        ]
      }
    }
  },
  "small-intestine": {
    "nciHref": "https://www.cancer.gov/types/small-intestine",
    "includeGlobalStats": false,
    "copy": {
      "en": {
        "intro": "Small-intestine cancers are rare and include several biologically different diseases.",
        "warning": "Seek medical advice for persistent abdominal pain, unexplained nausea or vomiting, gastrointestinal bleeding or black stools, anaemia, a new abdominal lump, obstruction symptoms or unexplained weight loss.",
        "note": "Sudden severe pain, repeated vomiting or significant bleeding needs urgent care.",
        "stats": [
          {
            "value": "Rare",
            "label": "Small-intestine cancer is much less common than colorectal cancer"
          },
          {
            "value": "5",
            "label": "Main groups include adenocarcinoma, neuroendocrine tumour, lymphoma, sarcoma and GIST"
          }
        ]
      },
      "ro": {
        "intro": "Cancerele intestinului subțire sunt rare și includ boli biologic diferite.",
        "warning": "Cere sfatul unui medic pentru durere abdominală persistentă, greață sau vărsături, sângerare digestivă ori scaune negre, anemie, o masă abdominală, simptome de ocluzie sau scădere în greutate.",
        "note": "Durerea severă bruscă, vărsăturile repetate ori sângerarea importantă necesită îngrijire urgentă.",
        "stats": [
          {
            "value": "Rar",
            "label": "Cancerul intestinului subțire este mult mai rar decât cancerul colorectal"
          },
          {
            "value": "5",
            "label": "Grupele principale includ adenocarcinom, tumoră neuroendocrină, limfom, sarcom și GIST"
          }
        ]
      },
      "es": {
        "intro": "Los cánceres de intestino delgado son raros e incluyen enfermedades biológicamente distintas.",
        "warning": "Consulta ante dolor abdominal persistente, náuseas o vómitos, sangrado digestivo o heces negras, anemia, una masa abdominal, síntomas de obstrucción o pérdida de peso.",
        "note": "El dolor intenso repentino, los vómitos repetidos o un sangrado importante requieren atención urgente.",
        "stats": [
          {
            "value": "Raro",
            "label": "El cáncer de intestino delgado es mucho menos frecuente que el colorrectal"
          },
          {
            "value": "5",
            "label": "Los grupos principales incluyen adenocarcinoma, tumor neuroendocrino, linfoma, sarcoma y GIST"
          }
        ]
      }
    }
  },
  "thymus": {
    "nciHref": "https://www.cancer.gov/types/thymoma",
    "includeGlobalStats": false,
    "copy": {
      "en": {
        "intro": "Thymoma and thymic carcinoma begin in the thymus but behave differently.",
        "warning": "Seek medical advice for persistent cough, chest pain, breathing difficulty or swelling of the face and upper body.",
        "note": "Thymoma can be associated with autoimmune conditions, especially myasthenia gravis.",
        "stats": [
          {
            "value": "Rare",
            "label": "Thymoma and thymic carcinoma are uncommon tumours of the thymus"
          },
          {
            "value": "2",
            "label": "The two main malignant groups are thymoma and thymic carcinoma"
          }
        ]
      },
      "ro": {
        "intro": "Timomul și carcinomul timic încep în timus, dar au comportament diferit.",
        "warning": "Cere sfatul unui medic pentru tuse persistentă, durere toracică, dificultăți de respirație sau umflarea feței și părții superioare a corpului.",
        "note": "Timomul poate fi asociat cu boli autoimune, în special miastenia gravis.",
        "stats": [
          {
            "value": "Rar",
            "label": "Timomul și carcinomul timic sunt tumori neobișnuite ale timusului"
          },
          {
            "value": "2",
            "label": "Cele două grupe maligne principale sunt timomul și carcinomul timic"
          }
        ]
      },
      "es": {
        "intro": "El timoma y el carcinoma tímico comienzan en el timo, pero se comportan de forma diferente.",
        "warning": "Consulta ante tos persistente, dolor en el pecho, dificultad para respirar o hinchazón de la cara y la parte superior del cuerpo.",
        "note": "El timoma puede asociarse a enfermedades autoinmunes, especialmente miastenia gravis.",
        "stats": [
          {
            "value": "Raro",
            "label": "El timoma y el carcinoma tímico son tumores poco frecuentes del timo"
          },
          {
            "value": "2",
            "label": "Los dos grupos malignos principales son timoma y carcinoma tímico"
          }
        ]
      }
    }
  }
} as const satisfies Partial<Record<CancerId,GuideDefinition>>;

export function getRemainingGuideTrustContentD(cancerId:CancerId,localeInput:string):RemainingGuideTrustContent|undefined{
 const definition=GUIDE_DEFINITIONS[cancerId as keyof typeof GUIDE_DEFINITIONS] as GuideDefinition|undefined;
 if(!definition)return undefined;
 const locale=normalizeLocale(localeInput);const ui=UI[locale];const copy=definition.copy[locale];
 const disclaimer=[ui.opening,copy.intro,copy.warning,copy.note,definition.includeGlobalStats?ui.globalNote:''].filter(Boolean).join(' ');
 const sources:GuideSource[]=[];if(definition.includeGlobalStats)sources.push({label:ui.globalSourceLabel,href:GLOBAL_REPORT_URL});sources.push({label:ui.nciSourceLabel,href:definition.nciHref});
 return{heading:ui.heading,disclaimer,sourcesHeading:ui.sourcesHeading,checkedLabel:ui.checkedLabel,checkedDate:ui.checkedDate,statsTitle:ui.statsTitle,stats:copy.stats,sources};
}
