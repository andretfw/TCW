import type {MonthDefinition} from '@/lib/cancer-awareness-calendar-types';

export const CANCER_AWARENESS_MONTHS_4 = [
  {
    "name": {"en": "October", "ro": "Octombrie", "es": "Octubre"},
    "awareness": [
      {"title": {"en": "Breast Cancer Awareness Month", "ro": "Luna de conștientizare a cancerului de sân", "es": "Mes de concienciación sobre el cáncer de mama"}, "scope": {"en": "Global", "ro": "Global", "es": "Global"}, "href": "https://www.conquer.org/cancer-awareness-months", "source": "Conquer Cancer / ASCO Foundation", "color": "text-pink-700 bg-pink-50"},
      {"title": {"en": "Liver Cancer Awareness Month", "ro": "Luna de conștientizare a cancerului hepatic", "es": "Mes de concienciación sobre el cáncer de hígado"}, "scope": {"en": "Observed internationally", "ro": "Marcată la nivel internațional", "es": "Observado internacionalmente"}, "href": "https://www.cancerresearchuk.org/get-involved/cancer-awareness-calendar", "source": "Cancer Research UK", "color": "text-emerald-700 bg-emerald-50"}
    ],
    "events": [
      {"date": "13", "name": {"en": "Metastatic Breast Cancer Awareness Day", "ro": "Ziua de conștientizare a cancerului de sân metastatic", "es": "Día de concienciación sobre el cáncer de mama metastásico"}, "scope": {"en": "United States origin; marked internationally", "ro": "Inițiată în Statele Unite; marcată internațional", "es": "De origen estadounidense; observada internacionalmente"}, "href": "https://www.mbcalliance.org/metastatic-breast-cancer-awareness-day/", "source": "Metastatic Breast Cancer Alliance"},
      {"date": "25", "name": {"en": "MDS World Awareness Day", "ro": "Ziua Mondială de Conștientizare a Sindroamelor Mielodisplazice", "es": "Día Mundial de Concienciación sobre los Síndromes Mielodisplásicos"}, "scope": {"en": "Global patient-advocacy campaign", "ro": "Campanie globală de advocacy pentru pacienți", "es": "Campaña global de defensa del paciente"}, "href": "https://www.mds-alliance.org/mds-world-awareness-day-2024/", "source": "MDS Alliance"}
    ]
  },
  {
    "name": {"en": "November", "ro": "Noiembrie", "es": "Noviembre"},
    "awareness": [
      {"title": {"en": "Lung Cancer Awareness Month", "ro": "Luna de conștientizare a cancerului pulmonar", "es": "Mes de concienciación sobre el cáncer de pulmón"}, "scope": {"en": "International", "ro": "Internațional", "es": "Internacional"}, "href": "https://www.conquer.org/cancer-awareness-months", "source": "Conquer Cancer / ASCO Foundation", "color": "text-slate-700 bg-slate-100"},
      {"title": {"en": "Pancreatic Cancer Awareness Month", "ro": "Luna de conștientizare a cancerului pancreatic", "es": "Mes de concienciación sobre el cáncer de páncreas"}, "scope": {"en": "Global campaign", "ro": "Campanie globală", "es": "Campaña global"}, "href": "https://www.worldpancreaticcancercoalition.org/", "source": "World Pancreatic Cancer Coalition", "color": "text-purple-800 bg-purple-100"},
      {"title": {"en": "Stomach Cancer Awareness Month", "ro": "Luna de conștientizare a cancerului gastric", "es": "Mes de concienciación sobre el cáncer de estómago"}, "scope": {"en": "Observed by multiple organisations", "ro": "Marcată de mai multe organizații", "es": "Observado por múltiples organizaciones"}, "href": "https://www.cancerresearchuk.org/get-involved/cancer-awareness-calendar", "source": "Cancer Research UK", "color": "text-blue-800 bg-blue-50"},
      {"title": {"en": "Mouth Cancer Action Month", "ro": "Luna de acțiune pentru cancerul oral", "es": "Mes de acción contra el cáncer de boca"}, "scope": {"en": "United Kingdom campaign", "ro": "Campanie din Regatul Unit", "es": "Campaña del Reino Unido"}, "href": "https://www.cancerresearchuk.org/get-involved/cancer-awareness-calendar", "source": "Cancer Research UK", "color": "text-rose-700 bg-rose-50"},
      {"title": {"en": "Movember: Prostate and Testicular Cancer", "ro": "Movember: cancer de prostată și testicular", "es": "Movember: cáncer de próstata y testicular"}, "scope": {"en": "International men's health campaign", "ro": "Campanie internațională pentru sănătatea bărbaților", "es": "Campaña internacional de salud masculina"}, "href": "https://movember.com/", "source": "Movember Foundation", "color": "text-neutral-800 bg-neutral-100"}
    ],
    "events": [
      {"date": "10", "name": {"en": "World NET Cancer Day", "ro": "Ziua Mondială a Tumorilor Neuroendocrine", "es": "Día Mundial de los Tumores Neuroendocrinos"}, "scope": {"en": "Global", "ro": "Global", "es": "Global"}, "href": "https://incalliance.org/world-net-cancer-day/", "source": "International Neuroendocrine Cancer Alliance"},
      {"date": "19", "name": {"en": "World Pancreatic Cancer Day", "ro": "Ziua Mondială a Cancerului Pancreatic", "es": "Día Mundial del Cáncer de Páncreas"}, "scope": {"en": "2026: third Thursday in November", "ro": "În 2026: a treia zi de joi din noiembrie", "es": "En 2026: tercer jueves de noviembre"}, "href": "https://www.worldpancreaticcancerday.org/", "source": "World Pancreatic Cancer Coalition"}
    ]
  },
  {
    "name": {"en": "December", "ro": "Decembrie", "es": "Diciembre"},
    "awareness": [],
    "events": []
  }
] satisfies MonthDefinition[];
