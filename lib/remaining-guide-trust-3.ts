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
  "bile-duct": {
    "nciHref": "https://www.cancer.gov/types/liver/bile-duct-cancer",
    "includeGlobalStats": false,
    "copy": {
      "en": {
        "intro": "Bile-duct cancer, or cholangiocarcinoma, is classified by whether it begins inside the liver, near the liver hilum or farther down the duct.",
        "warning": "Seek medical advice for jaundice, persistent itching, dark urine, pale stools, upper-abdominal pain, fever or unexplained weight loss.",
        "note": "Jaundice should be assessed promptly.",
        "stats": [
          {
            "value": "3",
            "label": "Main anatomical groups: intrahepatic, perihilar and distal bile-duct cancer"
          },
          {
            "value": "No routine",
            "label": "There is no routine population screening test for people at average risk"
          }
        ]
      },
      "ro": {
        "intro": "Cancerul căilor biliare, sau colangiocarcinomul, este clasificat după locul de origine: în ficat, lângă hilul hepatic sau mai jos pe cale.",
        "warning": "Cere sfatul unui medic pentru icter, mâncărime persistentă, urină închisă, scaune decolorate, durere în abdomenul superior, febră sau scădere în greutate.",
        "note": "Icterul trebuie evaluat rapid.",
        "stats": [
          {
            "value": "3",
            "label": "Grupe anatomice principale: intrahepatic, perihilar și distal"
          },
          {
            "value": "Fără rutină",
            "label": "Nu există un test de screening populațional de rutină pentru persoanele cu risc mediu"
          }
        ]
      },
      "es": {
        "intro": "El cáncer de vías biliares, o colangiocarcinoma, se clasifica según si comienza dentro del hígado, cerca del hilio hepático o más abajo en el conducto.",
        "warning": "Consulta ante ictericia, picor persistente, orina oscura, heces pálidas, dolor en la parte superior del abdomen, fiebre o pérdida de peso.",
        "note": "La ictericia debe evaluarse pronto.",
        "stats": [
          {
            "value": "3",
            "label": "Grupos anatómicos principales: intrahepático, perihiliar y distal"
          },
          {
            "value": "Sin rutina",
            "label": "No existe una prueba de cribado poblacional rutinaria para personas de riesgo medio"
          }
        ]
      }
    }
  },
  "anal": {
    "nciHref": "https://www.cancer.gov/types/anal",
    "includeGlobalStats": false,
    "copy": {
      "en": {
        "intro": "Anal cancer is different from colorectal cancer, and persistent high-risk HPV is an important risk factor.",
        "warning": "Seek medical advice for anal bleeding, pain, itching, a lump, discharge or a persistent change in bowel habits.",
        "note": "These symptoms often have non-cancer causes such as haemorrhoids or fissures.",
        "stats": [
          {
            "value": "Rare",
            "label": "Anal cancer is uncommon compared with colorectal cancer"
          },
          {
            "value": "HPV-linked",
            "label": "Persistent high-risk HPV is an important cause of most anal cancers"
          }
        ]
      },
      "ro": {
        "intro": "Cancerul anal este diferit de cancerul colorectal, iar infecția persistentă cu HPV cu risc înalt este un factor de risc important.",
        "warning": "Cere sfatul unui medic pentru sângerare anală, durere, mâncărime, un nodul, secreții sau o schimbare persistentă a tranzitului.",
        "note": "Aceste simptome au frecvent cauze necanceroase, precum hemoroizi sau fisuri.",
        "stats": [
          {
            "value": "Rar",
            "label": "Cancerul anal este neobișnuit comparativ cu cancerul colorectal"
          },
          {
            "value": "Legat de HPV",
            "label": "Infecția persistentă cu HPV cu risc înalt este o cauză importantă a majorității cancerelor anale"
          }
        ]
      },
      "es": {
        "intro": "El cáncer anal es distinto del cáncer colorrectal, y la infección persistente por VPH de alto riesgo es un factor de riesgo importante.",
        "warning": "Consulta ante sangrado anal, dolor, picor, un bulto, secreción o un cambio persistente en el hábito intestinal.",
        "note": "Estos síntomas suelen tener causas no cancerosas, como hemorroides o fisuras.",
        "stats": [
          {
            "value": "Raro",
            "label": "El cáncer anal es poco frecuente comparado con el cáncer colorrectal"
          },
          {
            "value": "Vinculado al VPH",
            "label": "La infección persistente por VPH de alto riesgo es una causa importante de la mayoría de los cánceres anales"
          }
        ]
      }
    }
  },
  "penile": {
    "nciHref": "https://www.cancer.gov/types/penile",
    "includeGlobalStats": true,
    "copy": {
      "en": {
        "intro": "Penile cancer may appear as a persistent skin change, lump, sore, thickening, bleeding, discharge or swelling.",
        "warning": "Seek medical advice for a penile lesion that does not heal or another persistent change.",
        "note": "Persistent high-risk HPV and tobacco use are important risk factors.",
        "stats": [
          {
            "value": "35K",
            "label": "Latest estimated new cases worldwide — 2024 data published in 2026"
          },
          {
            "value": "12K",
            "label": "Latest estimated deaths worldwide — 2024 data published in 2026"
          }
        ]
      },
      "ro": {
        "intro": "Cancerul penian se poate manifesta printr-o schimbare persistentă a pielii, un nodul, o rană, îngroșare, sângerare, secreții sau umflare.",
        "warning": "Cere sfatul unui medic pentru o leziune care nu se vindecă sau o altă modificare persistentă.",
        "note": "HPV cu risc înalt persistent și fumatul sunt factori de risc importanți.",
        "stats": [
          {
            "value": "35 mii",
            "label": "Cele mai recente cazuri noi estimate la nivel mondial — date din 2024 publicate în 2026"
          },
          {
            "value": "12 mii",
            "label": "Cele mai recente decese estimate la nivel mondial — date din 2024 publicate în 2026"
          }
        ]
      },
      "es": {
        "intro": "El cáncer de pene puede aparecer como un cambio persistente en la piel, un bulto, una llaga, engrosamiento, sangrado, secreción o hinchazón.",
        "warning": "Consulta ante una lesión que no cura u otro cambio persistente.",
        "note": "El VPH de alto riesgo persistente y el tabaco son factores de riesgo importantes.",
        "stats": [
          {
            "value": "35 mil",
            "label": "Últimos casos nuevos estimados en todo el mundo — datos de 2024 publicados en 2026"
          },
          {
            "value": "12 mil",
            "label": "Últimas muertes estimadas en todo el mundo — datos de 2024 publicados en 2026"
          }
        ]
      }
    }
  },
  "vaginal": {
    "nciHref": "https://www.cancer.gov/types/vaginal",
    "includeGlobalStats": true,
    "copy": {
      "en": {
        "intro": "Vaginal cancer is rare and differs from cervical, vulvar or uterine cancer that has spread to the vagina.",
        "warning": "Seek medical advice for unusual bleeding, bleeding after sex or menopause, unusual discharge, a vaginal lump, painful urination, constipation or persistent pelvic pain.",
        "note": "",
        "stats": [
          {
            "value": "18K",
            "label": "Latest estimated new cases worldwide — 2024 data published in 2026"
          },
          {
            "value": "7.5K",
            "label": "Latest estimated deaths worldwide — 2024 data published in 2026"
          }
        ]
      },
      "ro": {
        "intro": "Cancerul vaginal este rar și diferă de cancerul de col uterin, vulvar sau uterin care s-a extins la vagin.",
        "warning": "Cere sfatul unui medic pentru sângerare neobișnuită, sângerare după contact sexual ori menopauză, secreții neobișnuite, un nodul vaginal, urinare dureroasă, constipație sau durere pelvină persistentă.",
        "note": "",
        "stats": [
          {
            "value": "18 mii",
            "label": "Cele mai recente cazuri noi estimate la nivel mondial — date din 2024 publicate în 2026"
          },
          {
            "value": "7,5 mii",
            "label": "Cele mai recente decese estimate la nivel mondial — date din 2024 publicate în 2026"
          }
        ]
      },
      "es": {
        "intro": "El cáncer vaginal es raro y es distinto del cáncer de cuello uterino, vulva o útero que se ha extendido a la vagina.",
        "warning": "Consulta ante sangrado inusual, sangrado después de las relaciones sexuales o la menopausia, flujo inusual, un bulto vaginal, dolor al orinar, estreñimiento o dolor pélvico persistente.",
        "note": "",
        "stats": [
          {
            "value": "18 mil",
            "label": "Últimos casos nuevos estimados en todo el mundo — datos de 2024 publicados en 2026"
          },
          {
            "value": "7,5 mil",
            "label": "Últimas muertes estimadas en todo el mundo — datos de 2024 publicados en 2026"
          }
        ]
      }
    }
  },
  "vulvar": {
    "nciHref": "https://www.cancer.gov/types/vulvar",
    "includeGlobalStats": true,
    "copy": {
      "en": {
        "intro": "Many vulvar conditions are not cancer, but persistent changes need assessment.",
        "warning": "Seek medical advice for persistent itching, burning or pain, a lump, a sore that does not heal, bleeding unrelated to menstruation, or lasting skin-colour or texture changes.",
        "note": "",
        "stats": [
          {
            "value": "49K",
            "label": "Latest estimated new cases worldwide — 2024 data published in 2026"
          },
          {
            "value": "19K",
            "label": "Latest estimated deaths worldwide — 2024 data published in 2026"
          }
        ]
      },
      "ro": {
        "intro": "Multe afecțiuni vulvare nu sunt canceroase, însă modificările persistente trebuie evaluate.",
        "warning": "Cere sfatul unui medic pentru mâncărime, usturime sau durere persistentă, un nodul, o rană care nu se vindecă, sângerare fără legătură cu menstruația ori schimbări persistente ale pielii.",
        "note": "",
        "stats": [
          {
            "value": "49 mii",
            "label": "Cele mai recente cazuri noi estimate la nivel mondial — date din 2024 publicate în 2026"
          },
          {
            "value": "19 mii",
            "label": "Cele mai recente decese estimate la nivel mondial — date din 2024 publicate în 2026"
          }
        ]
      },
      "es": {
        "intro": "Muchas afecciones vulvares no son cancerosas, pero los cambios persistentes deben evaluarse.",
        "warning": "Consulta ante picor, ardor o dolor persistentes, un bulto, una llaga que no cura, sangrado no relacionado con la menstruación o cambios duraderos en la piel.",
        "note": "",
        "stats": [
          {
            "value": "49 mil",
            "label": "Últimos casos nuevos estimados en todo el mundo — datos de 2024 publicados en 2026"
          },
          {
            "value": "19 mil",
            "label": "Últimas muertes estimadas en todo el mundo — datos de 2024 publicados en 2026"
          }
        ]
      }
    }
  }
} as const satisfies Partial<Record<CancerId,GuideDefinition>>;

export function getRemainingGuideTrustContentC(cancerId:CancerId,localeInput:string):RemainingGuideTrustContent|undefined{
 const definition=GUIDE_DEFINITIONS[cancerId as keyof typeof GUIDE_DEFINITIONS] as GuideDefinition|undefined;
 if(!definition)return undefined;
 const locale=normalizeLocale(localeInput);const ui=UI[locale];const copy=definition.copy[locale];
 const disclaimer=[ui.opening,copy.intro,copy.warning,copy.note,definition.includeGlobalStats?ui.globalNote:''].filter(Boolean).join(' ');
 const sources:GuideSource[]=[];if(definition.includeGlobalStats)sources.push({label:ui.globalSourceLabel,href:GLOBAL_REPORT_URL});sources.push({label:ui.nciSourceLabel,href:definition.nciHref});
 return{heading:ui.heading,disclaimer,sourcesHeading:ui.sourcesHeading,checkedLabel:ui.checkedLabel,checkedDate:ui.checkedDate,statsTitle:ui.statsTitle,stats:copy.stats,sources};
}
