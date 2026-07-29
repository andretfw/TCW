import {normalizeLocale, type CancerId, type SiteLocale} from '@/lib/routes';

type GuideSource={label:string;href:string};
type GuideStat={value:string;label:string};
type LocaleCopy={intro:string;warning:string;note:string;stats:[GuideStat,GuideStat]};
type GuideDefinition={nciHref:string;includeGlobalStats:boolean;copy:Record<SiteLocale,LocaleCopy>};
export type RemainingGuideTrustContent={heading:string;disclaimer:string;sourcesHeading:string;checkedLabel:string;checkedDate:string;statsTitle:string;stats:[GuideStat,GuideStat];sources:GuideSource[]};

const GLOBAL_REPORT_URL='https://gco.iarc.who.int/today/home/incidence';
const UI={
  "en": {
    "heading": "Sources and medical information",
    "sourcesHeading": "Official sources",
    "checkedLabel": "Sources checked",
    "checkedDate": "29 July 2026",
    "statsTitle": "Key Facts",
    "globalSourceLabel": "IARC — Global Cancer Observatory, Cancer Today (GLOBOCAN 2024)",
    "nciSourceLabel": "National Cancer Institute — Patient information",
    "opening": "This page provides general educational information and does not replace medical advice, diagnosis or treatment.",
    "globalNote": "The global figures are GLOBOCAN 2024 estimates published in July 2026 and cannot predict an individual outcome."
  },
  "ro": {
    "heading": "Surse și informații medicale",
    "sourcesHeading": "Surse oficiale",
    "checkedLabel": "Surse verificate la data de",
    "checkedDate": "29 iulie 2026",
    "statsTitle": "Date-cheie",
    "globalSourceLabel": "IARC — Observatorul Global al Cancerului, Cancer Today (GLOBOCAN 2024)",
    "nciSourceLabel": "Institutul Național al Cancerului — Informații pentru pacienți",
    "opening": "Această pagină oferă informații educaționale generale și nu înlocuiește sfatul, diagnosticul sau tratamentul medical.",
    "globalNote": "Cifrele globale sunt estimări GLOBOCAN 2024 publicate în iulie 2026 și nu pot prezice evoluția unei persoane."
  },
  "es": {
    "heading": "Fuentes e información médica",
    "sourcesHeading": "Fuentes oficiales",
    "checkedLabel": "Fuentes verificadas el",
    "checkedDate": "29 de julio de 2026",
    "statsTitle": "Datos clave",
    "globalSourceLabel": "IARC — Observatorio Mundial del Cáncer, Cancer Today (GLOBOCAN 2024)",
    "nciSourceLabel": "Instituto Nacional del Cáncer — Información para pacientes",
    "opening": "Esta página ofrece información educativa general y no sustituye el consejo, diagnóstico ni tratamiento médico.",
    "globalNote": "Las cifras mundiales son estimaciones de GLOBOCAN 2024 publicadas en julio de 2026 y no predicen el resultado de una persona."
  }
} as const;
const GUIDE_DEFINITIONS={
  "testicular": {
    "nciHref": "https://www.cancer.gov/types/testicular",
    "includeGlobalStats": true,
    "copy": {
      "en": {
        "intro": "Testicular cancer usually begins in germ cells and most often affects younger and middle-aged men, although it can occur at other ages.",
        "warning": "Seek medical advice for a painless lump or swelling, a change in a testicle, scrotal heaviness, or persistent groin or testicular pain.",
        "note": "",
        "stats": [
          {
            "value": "71K",
            "label": "Latest estimated new cases worldwide — 2024 data published in 2026"
          },
          {
            "value": "9.2K",
            "label": "Latest estimated deaths worldwide — 2024 data published in 2026"
          }
        ]
      },
      "ro": {
        "intro": "Cancerul testicular începe de obicei în celulele germinale și apare mai ales la bărbați tineri și de vârstă mijlocie, deși poate apărea la orice vârstă.",
        "warning": "Cere sfatul unui medic pentru un nodul sau o umflătură nedureroasă, o schimbare a unui testicul, greutate în scrot ori durere inghinală sau testiculară persistentă.",
        "note": "",
        "stats": [
          {
            "value": "71 mii",
            "label": "Cele mai recente cazuri noi estimate la nivel mondial — date din 2024 publicate în 2026"
          },
          {
            "value": "9,2 mii",
            "label": "Cele mai recente decese estimate la nivel mondial — date din 2024 publicate în 2026"
          }
        ]
      },
      "es": {
        "intro": "El cáncer testicular suele comenzar en las células germinales y afecta sobre todo a hombres jóvenes y de mediana edad, aunque puede aparecer a cualquier edad.",
        "warning": "Consulta ante un bulto o hinchazón indoloros, un cambio en un testículo, pesadez escrotal o dolor persistente en la ingle o el testículo.",
        "note": "",
        "stats": [
          {
            "value": "71 mil",
            "label": "Últimos casos nuevos estimados en todo el mundo — datos de 2024 publicados en 2026"
          },
          {
            "value": "9,2 mil",
            "label": "Últimas muertes estimadas en todo el mundo — datos de 2024 publicados en 2026"
          }
        ]
      }
    }
  },
  "thyroid": {
    "nciHref": "https://www.cancer.gov/types/thyroid",
    "includeGlobalStats": true,
    "copy": {
      "en": {
        "intro": "Most thyroid nodules are not cancer, and thyroid cancers include several types with very different behaviour.",
        "warning": "Seek medical advice for a new or growing neck lump, persistent hoarseness, swallowing or breathing difficulty, neck pain, or swollen lymph nodes.",
        "note": "",
        "stats": [
          {
            "value": "959K",
            "label": "Latest estimated new cases worldwide — 2024 data published in 2026"
          },
          {
            "value": "48K",
            "label": "Latest estimated deaths worldwide — 2024 data published in 2026"
          }
        ]
      },
      "ro": {
        "intro": "Majoritatea nodulilor tiroidieni nu sunt canceroși, iar cancerele tiroidiene includ mai multe tipuri cu evoluție foarte diferită.",
        "warning": "Cere sfatul unui medic pentru un nodul nou sau în creștere la gât, răgușeală persistentă, dificultăți la înghițire ori respirație, durere cervicală sau ganglioni măriți.",
        "note": "",
        "stats": [
          {
            "value": "959 mii",
            "label": "Cele mai recente cazuri noi estimate la nivel mondial — date din 2024 publicate în 2026"
          },
          {
            "value": "48 mii",
            "label": "Cele mai recente decese estimate la nivel mondial — date din 2024 publicate în 2026"
          }
        ]
      },
      "es": {
        "intro": "La mayoría de los nódulos tiroideos no son cancerosos, y los cánceres de tiroides incluyen varios tipos con comportamientos muy diferentes.",
        "warning": "Consulta ante un bulto nuevo o creciente en el cuello, ronquera persistente, dificultad para tragar o respirar, dolor cervical o ganglios inflamados.",
        "note": "",
        "stats": [
          {
            "value": "959 mil",
            "label": "Últimos casos nuevos estimados en todo el mundo — datos de 2024 publicados en 2026"
          },
          {
            "value": "48 mil",
            "label": "Últimas muertes estimadas en todo el mundo — datos de 2024 publicados en 2026"
          }
        ]
      }
    }
  },
  "uterine": {
    "nciHref": "https://www.cancer.gov/types/uterine",
    "includeGlobalStats": true,
    "copy": {
      "en": {
        "intro": "This guide mainly refers to cancers of the uterine body, especially endometrial cancer, and is separate from cervical cancer.",
        "warning": "Seek medical advice for bleeding between periods, unusually heavy bleeding, bleeding after menopause, unusual discharge, or persistent pelvic pain.",
        "note": "Abnormal bleeding, particularly after menopause, is the most common warning sign.",
        "stats": [
          {
            "value": "435K",
            "label": "Latest estimated new cases worldwide — 2024 data published in 2026"
          },
          {
            "value": "101K",
            "label": "Latest estimated deaths worldwide — 2024 data published in 2026"
          }
        ]
      },
      "ro": {
        "intro": "Acest ghid se referă în principal la cancerele corpului uterin, mai ales cancerul endometrial, și este separat de cancerul de col uterin.",
        "warning": "Cere sfatul unui medic pentru sângerări între menstruații, sângerări neobișnuit de abundente, sângerare după menopauză, secreții neobișnuite sau durere pelvină persistentă.",
        "note": "Sângerarea anormală, mai ales după menopauză, este cel mai frecvent semn de avertizare.",
        "stats": [
          {
            "value": "435 mii",
            "label": "Cele mai recente cazuri noi estimate la nivel mondial — date din 2024 publicate în 2026"
          },
          {
            "value": "101 mii",
            "label": "Cele mai recente decese estimate la nivel mondial — date din 2024 publicate în 2026"
          }
        ]
      },
      "es": {
        "intro": "Esta guía se refiere principalmente a los cánceres del cuerpo del útero, sobre todo al cáncer de endometrio, y es distinta del cáncer de cuello uterino.",
        "warning": "Consulta ante sangrado entre periodos, sangrado muy abundante, sangrado posmenopáusico, flujo inusual o dolor pélvico persistente.",
        "note": "El sangrado anormal, especialmente después de la menopausia, es la señal de alerta más frecuente.",
        "stats": [
          {
            "value": "435 mil",
            "label": "Últimos casos nuevos estimados en todo el mundo — datos de 2024 publicados en 2026"
          },
          {
            "value": "101 mil",
            "label": "Últimas muertes estimadas en todo el mundo — datos de 2024 publicados en 2026"
          }
        ]
      }
    }
  },
  "lymphoma": {
    "nciHref": "https://www.cancer.gov/types/lymphoma",
    "includeGlobalStats": true,
    "copy": {
      "en": {
        "intro": "Lymphoma is an umbrella term covering many cancers of the lymphatic system, including Hodgkin and non-Hodgkin lymphoma.",
        "warning": "Seek medical advice for persistently enlarged painless lymph nodes, unexplained fever, drenching night sweats, unexplained weight loss, itching or fatigue.",
        "note": "The displayed figures combine Hodgkin and non-Hodgkin lymphoma.",
        "stats": [
          {
            "value": "647K",
            "label": "Combined latest estimated Hodgkin and non-Hodgkin lymphoma cases worldwide — 2024 data published in 2026"
          },
          {
            "value": "254K",
            "label": "Combined latest estimated deaths worldwide — 2024 data published in 2026"
          }
        ]
      },
      "ro": {
        "intro": "Limfomul este un termen-umbrelă pentru numeroase cancere ale sistemului limfatic, inclusiv limfomul Hodgkin și non-Hodgkin.",
        "warning": "Cere sfatul unui medic pentru ganglioni măriți, nedureroși și persistenți, febră inexplicabilă, transpirații nocturne abundente, scădere în greutate, mâncărime sau oboseală.",
        "note": "Cifrele afișate combină limfomul Hodgkin și non-Hodgkin.",
        "stats": [
          {
            "value": "647 mii",
            "label": "Cazuri estimate combinate de limfom Hodgkin și non-Hodgkin la nivel mondial — date din 2024 publicate în 2026"
          },
          {
            "value": "254 mii",
            "label": "Decese estimate combinate la nivel mondial — date din 2024 publicate în 2026"
          }
        ]
      },
      "es": {
        "intro": "Linfoma es un término general para muchos cánceres del sistema linfático, incluidos los linfomas de Hodgkin y no Hodgkin.",
        "warning": "Consulta ante ganglios aumentados de tamaño, indoloros y persistentes, fiebre inexplicada, sudores nocturnos intensos, pérdida de peso, picor o cansancio.",
        "note": "Las cifras mostradas combinan los linfomas de Hodgkin y no Hodgkin.",
        "stats": [
          {
            "value": "647 mil",
            "label": "Casos estimados combinados de linfoma de Hodgkin y no Hodgkin en todo el mundo — datos de 2024 publicados en 2026"
          },
          {
            "value": "254 mil",
            "label": "Muertes estimadas combinadas en todo el mundo — datos de 2024 publicados en 2026"
          }
        ]
      }
    }
  },
  "myeloma": {
    "nciHref": "https://www.cancer.gov/types/myeloma",
    "includeGlobalStats": true,
    "copy": {
      "en": {
        "intro": "Multiple myeloma is a cancer of plasma cells in the bone marrow.",
        "warning": "Seek medical advice for persistent bone pain, fractures, fatigue or anaemia, repeated infections, kidney problems, or symptoms related to high calcium.",
        "note": "Diagnosis depends on blood, urine, imaging and bone-marrow findings.",
        "stats": [
          {
            "value": "196K",
            "label": "Latest estimated new cases worldwide — 2024 data published in 2026"
          },
          {
            "value": "119K",
            "label": "Latest estimated deaths worldwide — 2024 data published in 2026"
          }
        ]
      },
      "ro": {
        "intro": "Mielomul multiplu este un cancer al plasmocitelor din măduva osoasă.",
        "warning": "Cere sfatul unui medic pentru durere osoasă persistentă, fracturi, oboseală sau anemie, infecții repetate, probleme renale ori simptome legate de calciu crescut.",
        "note": "Diagnosticul depinde de analize de sânge și urină, imagistică și examinarea măduvei.",
        "stats": [
          {
            "value": "196 mii",
            "label": "Cele mai recente cazuri noi estimate la nivel mondial — date din 2024 publicate în 2026"
          },
          {
            "value": "119 mii",
            "label": "Cele mai recente decese estimate la nivel mondial — date din 2024 publicate în 2026"
          }
        ]
      },
      "es": {
        "intro": "El mieloma múltiple es un cáncer de las células plasmáticas de la médula ósea.",
        "warning": "Consulta ante dolor óseo persistente, fracturas, cansancio o anemia, infecciones repetidas, problemas renales o síntomas relacionados con calcio elevado.",
        "note": "El diagnóstico depende de análisis de sangre y orina, pruebas de imagen y estudio de médula ósea.",
        "stats": [
          {
            "value": "196 mil",
            "label": "Últimos casos nuevos estimados en todo el mundo — datos de 2024 publicados en 2026"
          },
          {
            "value": "119 mil",
            "label": "Últimas muertes estimadas en todo el mundo — datos de 2024 publicados en 2026"
          }
        ]
      }
    }
  }
} as const satisfies Partial<Record<CancerId,GuideDefinition>>;

export function getRemainingGuideTrustContentA(cancerId:CancerId,localeInput:string):RemainingGuideTrustContent|undefined{
 const definition=GUIDE_DEFINITIONS[cancerId as keyof typeof GUIDE_DEFINITIONS] as GuideDefinition|undefined;
 if(!definition)return undefined;
 const locale=normalizeLocale(localeInput);const ui=UI[locale];const copy=definition.copy[locale];
 const disclaimer=[ui.opening,copy.intro,copy.warning,copy.note,definition.includeGlobalStats?ui.globalNote:''].filter(Boolean).join(' ');
 const sources:GuideSource[]=[];if(definition.includeGlobalStats)sources.push({label:ui.globalSourceLabel,href:GLOBAL_REPORT_URL});sources.push({label:ui.nciSourceLabel,href:definition.nciHref});
 return{heading:ui.heading,disclaimer,sourcesHeading:ui.sourcesHeading,checkedLabel:ui.checkedLabel,checkedDate:ui.checkedDate,statsTitle:ui.statsTitle,stats:copy.stats,sources};
}
