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
  "esophageal": {
    "nciHref": "https://www.cancer.gov/types/esophageal",
    "includeGlobalStats": true,
    "copy": {
      "en": {
        "intro": "The two main oesophageal cancer types are squamous cell carcinoma and adenocarcinoma.",
        "warning": "Seek medical advice for progressive difficulty swallowing, pain when swallowing, unexplained weight loss, persistent chest discomfort, hoarseness, cough or vomiting blood.",
        "note": "Sudden inability to swallow or significant bleeding needs urgent care.",
        "stats": [
          {
            "value": "494K",
            "label": "Latest estimated new cases worldwide — 2024 data published in 2026"
          },
          {
            "value": "442K",
            "label": "Latest estimated deaths worldwide — 2024 data published in 2026"
          }
        ]
      },
      "ro": {
        "intro": "Cele două tipuri principale de cancer esofagian sunt carcinomul scuamos și adenocarcinomul.",
        "warning": "Cere sfatul unui medic pentru dificultate progresivă la înghițire, durere la înghițire, scădere în greutate, disconfort toracic persistent, răgușeală, tuse sau vărsături cu sânge.",
        "note": "Imposibilitatea bruscă de a înghiți ori sângerarea importantă necesită îngrijire urgentă.",
        "stats": [
          {
            "value": "494 mii",
            "label": "Cele mai recente cazuri noi estimate la nivel mondial — date din 2024 publicate în 2026"
          },
          {
            "value": "442 mii",
            "label": "Cele mai recente decese estimate la nivel mondial — date din 2024 publicate în 2026"
          }
        ]
      },
      "es": {
        "intro": "Los dos tipos principales de cáncer de esófago son el carcinoma escamoso y el adenocarcinoma.",
        "warning": "Consulta ante dificultad progresiva para tragar, dolor al tragar, pérdida de peso, molestias persistentes en el pecho, ronquera, tos o vómitos con sangre.",
        "note": "La incapacidad repentina para tragar o un sangrado importante requieren atención urgente.",
        "stats": [
          {
            "value": "494 mil",
            "label": "Últimos casos nuevos estimados en todo el mundo — datos de 2024 publicados en 2026"
          },
          {
            "value": "442 mil",
            "label": "Últimas muertes estimadas en todo el mundo — datos de 2024 publicados en 2026"
          }
        ]
      }
    }
  },
  "head-neck": {
    "nciHref": "https://www.cancer.gov/types/head-and-neck",
    "includeGlobalStats": true,
    "copy": {
      "en": {
        "intro": "Head-and-neck cancer is an umbrella term for cancers arising in different sites, each with different risk factors, staging and treatment.",
        "warning": "Seek medical advice for a mouth or throat sore that does not heal, a persistent neck lump, hoarseness, swallowing difficulty, one-sided ear pain, or persistent nasal blockage or bleeding.",
        "note": "The figures sum six major sites and overlap with the separate oral and throat guides.",
        "stats": [
          {
            "value": "1.02M",
            "label": "Combined new cases across six major head-and-neck sites worldwide in 2024"
          },
          {
            "value": "475K",
            "label": "Combined deaths across those sites worldwide in 2024"
          }
        ]
      },
      "ro": {
        "intro": "Cancerul din sfera cap-gât este un termen-umbrelă pentru cancere cu localizări diferite, fiecare cu factori de risc, stadializare și tratament proprii.",
        "warning": "Cere sfatul unui medic pentru o leziune în gură sau gât care nu se vindecă, un nodul persistent la gât, răgușeală, dificultăți la înghițire, durere unilaterală de ureche ori obstrucție sau sângerare nazală persistentă.",
        "note": "Cifrele însumează șase localizări majore și se suprapun cu ghidurile oral și al gâtului.",
        "stats": [
          {
            "value": "1,02 mil.",
            "label": "Cazuri noi combinate pentru șase localizări majore din sfera cap-gât la nivel mondial în 2024"
          },
          {
            "value": "475 mii",
            "label": "Decese combinate pentru aceste localizări la nivel mondial în 2024"
          }
        ]
      },
      "es": {
        "intro": "Cáncer de cabeza y cuello es un término general para cánceres de distintas localizaciones, cada una con factores de riesgo, estadificación y tratamiento propios.",
        "warning": "Consulta ante una llaga en la boca o garganta que no cura, un bulto persistente en el cuello, ronquera, dificultad para tragar, dolor de oído unilateral u obstrucción o sangrado nasal persistentes.",
        "note": "Las cifras suman seis localizaciones principales y se solapan con las guías oral y de garganta.",
        "stats": [
          {
            "value": "1,02 M",
            "label": "Casos nuevos combinados en seis localizaciones principales de cabeza y cuello en todo el mundo en 2024"
          },
          {
            "value": "475 mil",
            "label": "Muertes combinadas en esas localizaciones en todo el mundo en 2024"
          }
        ]
      }
    }
  },
  "bone": {
    "nciHref": "https://www.cancer.gov/types/bone",
    "includeGlobalStats": false,
    "copy": {
      "en": {
        "intro": "Primary bone cancer begins in bone and is different from cancer that has spread to bone from another organ.",
        "warning": "Seek medical advice for persistent or worsening bone pain, swelling, a growing lump, reduced movement, or a fracture after minor injury.",
        "note": "Different bone-cancer types affect different age groups and need specialist diagnosis.",
        "stats": [
          {
            "value": "Rare",
            "label": "Primary bone cancers are uncommon and differ from cancer that has spread to bone"
          },
          {
            "value": "3+",
            "label": "Major types include osteosarcoma, chondrosarcoma and Ewing sarcoma"
          }
        ]
      },
      "ro": {
        "intro": "Cancerul osos primar începe în os și este diferit de cancerul care s-a răspândit la os dintr-un alt organ.",
        "warning": "Cere sfatul unui medic pentru durere osoasă persistentă sau în agravare, umflare, un nodul în creștere, mobilitate redusă ori o fractură după un traumatism minor.",
        "note": "Tipurile diferite afectează grupe de vârstă diferite și necesită diagnostic specializat.",
        "stats": [
          {
            "value": "Rar",
            "label": "Cancerele osoase primare sunt neobișnuite și diferă de cancerul care s-a răspândit la os"
          },
          {
            "value": "3+",
            "label": "Tipurile principale includ osteosarcomul, condrosarcomul și sarcomul Ewing"
          }
        ]
      },
      "es": {
        "intro": "El cáncer óseo primario comienza en el hueso y es distinto del cáncer que se ha propagado al hueso desde otro órgano.",
        "warning": "Consulta ante dolor óseo persistente o que empeora, hinchazón, un bulto creciente, reducción del movimiento o una fractura tras una lesión menor.",
        "note": "Los distintos tipos afectan a grupos de edad diferentes y requieren diagnóstico especializado.",
        "stats": [
          {
            "value": "Raro",
            "label": "Los cánceres óseos primarios son poco frecuentes y distintos del cáncer que se ha propagado al hueso"
          },
          {
            "value": "3+",
            "label": "Los tipos principales incluyen osteosarcoma, condrosarcoma y sarcoma de Ewing"
          }
        ]
      }
    }
  },
  "sarcoma": {
    "nciHref": "https://www.cancer.gov/types/soft-tissue-sarcoma",
    "includeGlobalStats": false,
    "copy": {
      "en": {
        "intro": "Sarcoma is a broad family of cancers arising in bone or soft tissues such as muscle, fat, nerves, blood vessels and fibrous tissue.",
        "warning": "Seek medical advice for a growing lump, persistent deep pain, pressure symptoms or unexplained swelling.",
        "note": "Diagnosis usually needs imaging and a carefully planned specialist biopsy.",
        "stats": [
          {
            "value": "50+",
            "label": "NCI describes more than 50 types of soft-tissue sarcoma"
          },
          {
            "value": "Anywhere",
            "label": "Sarcoma can begin in connective tissues almost anywhere in the body"
          }
        ]
      },
      "ro": {
        "intro": "Sarcomul este o familie largă de cancere care apar în os sau țesuturi moi, precum mușchi, grăsime, nervi, vase și țesut fibros.",
        "warning": "Cere sfatul unui medic pentru un nodul în creștere, durere profundă persistentă, simptome de presiune sau umflare inexplicabilă.",
        "note": "Diagnosticul necesită de obicei imagistică și o biopsie planificată de o echipă specializată.",
        "stats": [
          {
            "value": "50+",
            "label": "NCI descrie peste 50 de tipuri de sarcom de țesuturi moi"
          },
          {
            "value": "Oriunde",
            "label": "Sarcomul poate începe în țesuturile conjunctive aproape oriunde în corp"
          }
        ]
      },
      "es": {
        "intro": "El sarcoma es una amplia familia de cánceres que se originan en hueso o tejidos blandos como músculo, grasa, nervios, vasos y tejido fibroso.",
        "warning": "Consulta ante un bulto creciente, dolor profundo persistente, síntomas de presión o hinchazón inexplicada.",
        "note": "El diagnóstico suele requerir pruebas de imagen y una biopsia planificada por especialistas.",
        "stats": [
          {
            "value": "50+",
            "label": "El NCI describe más de 50 tipos de sarcoma de tejidos blandos"
          },
          {
            "value": "Cualquier lugar",
            "label": "El sarcoma puede comenzar en tejidos conectivos de casi cualquier parte del cuerpo"
          }
        ]
      }
    }
  },
  "gallbladder": {
    "nciHref": "https://www.cancer.gov/types/gallbladder",
    "includeGlobalStats": true,
    "copy": {
      "en": {
        "intro": "Gallbladder cancer may cause no early symptoms and is sometimes found after surgery for gallstones.",
        "warning": "Seek medical advice for persistent upper-right abdominal pain, jaundice, nausea or vomiting, an abdominal lump, unexplained weight loss or persistent fever.",
        "note": "Gallstones are common and most people with them do not develop cancer.",
        "stats": [
          {
            "value": "126K",
            "label": "Latest estimated new cases worldwide — 2024 data published in 2026"
          },
          {
            "value": "92K",
            "label": "Latest estimated deaths worldwide — 2024 data published in 2026"
          }
        ]
      },
      "ro": {
        "intro": "Cancerul vezicii biliare poate să nu provoace simptome timpurii și este uneori descoperit după o operație pentru calculi biliari.",
        "warning": "Cere sfatul unui medic pentru durere persistentă în partea dreaptă superioară a abdomenului, icter, greață sau vărsături, o masă abdominală, scădere în greutate ori febră persistentă.",
        "note": "Calculii biliari sunt frecvenți, iar majoritatea persoanelor cu calculi nu dezvoltă cancer.",
        "stats": [
          {
            "value": "126 mii",
            "label": "Cele mai recente cazuri noi estimate la nivel mondial — date din 2024 publicate în 2026"
          },
          {
            "value": "92 mii",
            "label": "Cele mai recente decese estimate la nivel mondial — date din 2024 publicate în 2026"
          }
        ]
      },
      "es": {
        "intro": "El cáncer de vesícula biliar puede no causar síntomas tempranos y a veces se descubre después de una cirugía por cálculos biliares.",
        "warning": "Consulta ante dolor persistente en la parte superior derecha del abdomen, ictericia, náuseas o vómitos, una masa abdominal, pérdida de peso o fiebre persistente.",
        "note": "Los cálculos biliares son frecuentes y la mayoría de las personas con ellos no desarrollan cáncer.",
        "stats": [
          {
            "value": "126 mil",
            "label": "Últimos casos nuevos estimados en todo el mundo — datos de 2024 publicados en 2026"
          },
          {
            "value": "92 mil",
            "label": "Últimas muertes estimadas en todo el mundo — datos de 2024 publicados en 2026"
          }
        ]
      }
    }
  }
} as const satisfies Partial<Record<CancerId,GuideDefinition>>;

export function getRemainingGuideTrustContentB(cancerId:CancerId,localeInput:string):RemainingGuideTrustContent|undefined{
 const definition=GUIDE_DEFINITIONS[cancerId as keyof typeof GUIDE_DEFINITIONS] as GuideDefinition|undefined;
 if(!definition)return undefined;
 const locale=normalizeLocale(localeInput);const ui=UI[locale];const copy=definition.copy[locale];
 const disclaimer=[ui.opening,copy.intro,copy.warning,copy.note,definition.includeGlobalStats?ui.globalNote:''].filter(Boolean).join(' ');
 const sources:GuideSource[]=[];if(definition.includeGlobalStats)sources.push({label:ui.globalSourceLabel,href:GLOBAL_REPORT_URL});sources.push({label:ui.nciSourceLabel,href:definition.nciHref});
 return{heading:ui.heading,disclaimer,sourcesHeading:ui.sourcesHeading,checkedLabel:ui.checkedLabel,checkedDate:ui.checkedDate,statsTitle:ui.statsTitle,stats:copy.stats,sources};
}
