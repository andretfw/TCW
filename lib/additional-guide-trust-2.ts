import {normalizeLocale, type CancerId, type SiteLocale} from '@/lib/routes';
import type {AdditionalGuideTrustContent} from '@/lib/additional-guide-trust';
import type {Batch2CancerGuideId} from '@/lib/additional-cancer-guides-2';

type Copy = {
  disclaimer: string;
  stats: [{value: string; label: string}, {value: string; label: string}];
  labels: string[];
};

type Definition = {urls: string[]; copy: Record<SiteLocale, Copy>};

const UI = {
  en: {heading: 'Sources and medical information', sourcesHeading: 'Official sources', checkedLabel: 'Sources checked', checkedDate: '29 July 2026', statsTitle: 'Key Facts'},
  ro: {heading: 'Surse și informații medicale', sourcesHeading: 'Surse oficiale', checkedLabel: 'Surse verificate la data de', checkedDate: '29 iulie 2026', statsTitle: 'Date-cheie'},
  es: {heading: 'Fuentes e información médica', sourcesHeading: 'Fuentes oficiales', checkedLabel: 'Fuentes verificadas el', checkedDate: '29 de julio de 2026', statsTitle: 'Datos clave'},
} as const;

const DEFINITIONS: Record<Batch2CancerGuideId, Definition> = {
  adrenal: {
    urls: ['https://www.cancer.gov/types/adrenocortical', 'https://www.cancer.gov/types/adrenocortical/symptoms', 'https://www.cancer.gov/types/adrenocortical/treatment'],
    copy: {
      en: {disclaimer: 'This page covers adrenocortical carcinoma, not every adrenal tumour. Hormone-related symptoms have many possible causes, but rapid or unexplained changes should be medically assessed. Severe high blood pressure, chest pain, fainting or sudden weakness need urgent care.', stats: [{value: 'Adrenal cortex', label: 'The cancer begins in the hormone-producing outer layer of an adrenal gland'}, {value: 'Rare', label: 'Adrenocortical carcinoma is an uncommon cancer in adults and children'}], labels: ['National Cancer Institute — Adrenocortical carcinoma', 'National Cancer Institute — Symptoms', 'National Cancer Institute — Treatment']},
      ro: {disclaimer: 'Pagina descrie carcinomul corticosuprarenal, nu toate tumorile suprarenale. Simptomele hormonale pot avea multe cauze, dar schimbările rapide sau inexplicabile trebuie evaluate medical. Tensiunea sever crescută, durerea toracică, leșinul ori slăbiciunea bruscă necesită îngrijire urgentă.', stats: [{value: 'Cortex suprarenal', label: 'Cancerul începe în stratul extern al glandei care produce hormoni'}, {value: 'Rar', label: 'Carcinomul corticosuprarenal este neobișnuit la adulți și copii'}], labels: ['Institutul Național al Cancerului — Carcinom corticosuprarenal', 'Institutul Național al Cancerului — Simptome', 'Institutul Național al Cancerului — Tratament']},
      es: {disclaimer: 'La página trata el carcinoma corticosuprarrenal, no todos los tumores suprarrenales. Los síntomas hormonales tienen muchas causas, pero los cambios rápidos o inexplicables deben evaluarse. La hipertensión grave, dolor torácico, desmayo o debilidad repentina requieren atención urgente.', stats: [{value: 'Corteza suprarrenal', label: 'El cáncer comienza en la capa externa productora de hormonas'}, {value: 'Raro', label: 'El carcinoma corticosuprarrenal es poco frecuente en adultos y niños'}], labels: ['Instituto Nacional del Cáncer — Carcinoma corticosuprarrenal', 'Instituto Nacional del Cáncer — Síntomas', 'Instituto Nacional del Cáncer — Tratamiento']},
    },
  },
  'primary-peritoneal': {
    urls: ['https://www.cancer.gov/types/ovarian', 'https://www.cancer.gov/types/ovarian/patient/ovarian-epithelial-treatment-pdq'],
    copy: {
      en: {disclaimer: 'Bloating, pelvic pain and bowel or urinary changes are common and usually are not cancer. Seek medical advice when they are new, persistent, frequent or worsening. Sudden severe abdominal pain, vomiting or breathing difficulty needs urgent assessment.', stats: [{value: 'Peritoneum', label: 'This cancer begins in the lining of the abdominal cavity'}, {value: 'Shared care', label: 'It is treated similarly to epithelial ovarian and fallopian tube cancer'}], labels: ['National Cancer Institute — Ovarian, fallopian tube and primary peritoneal cancer', 'National Cancer Institute — Patient treatment information']},
      ro: {disclaimer: 'Balonarea, durerea pelvină și schimbările digestive ori urinare sunt frecvente și de obicei nu sunt cancer. Cere sfatul medicului dacă sunt noi, persistente, frecvente sau se agravează. Durerea abdominală severă bruscă, vărsăturile ori dificultatea de respirație necesită evaluare urgentă.', stats: [{value: 'Peritoneu', label: 'Cancerul începe în căptușeala cavității abdominale'}, {value: 'Îngrijire comună', label: 'Este tratat asemănător cancerului ovarian epitelial și al trompei uterine'}], labels: ['Institutul Național al Cancerului — Cancer ovarian, al trompei și peritoneal primar', 'Institutul Național al Cancerului — Informații despre tratament pentru pacienți']},
      es: {disclaimer: 'La hinchazón, dolor pélvico y cambios intestinales o urinarios son frecuentes y normalmente no son cáncer. Consulta si son nuevos, persistentes, frecuentes o empeoran. El dolor abdominal intenso repentino, vómitos o dificultad respiratoria requieren evaluación urgente.', stats: [{value: 'Peritoneo', label: 'El cáncer comienza en el revestimiento de la cavidad abdominal'}, {value: 'Atención compartida', label: 'Se trata de forma similar al cáncer epitelial de ovario y trompa'}], labels: ['Instituto Nacional del Cáncer — Cáncer de ovario, trompa y peritoneo primario', 'Instituto Nacional del Cáncer — Tratamiento para pacientes']},
    },
  },
  'fallopian-tube': {
    urls: ['https://www.cancer.gov/types/ovarian', 'https://www.cancer.gov/types/ovarian/patient/ovarian-epithelial-treatment-pdq'],
    copy: {
      en: {disclaimer: 'The symptoms listed are nonspecific and often have non-cancer causes. Persistent bloating, pelvic pain, unusual bleeding or watery discharge should be assessed. Heavy bleeding, fainting or severe pain needs urgent care.', stats: [{value: 'Fallopian tube', label: 'The cancer begins in tissue lining one of the tubes'}, {value: 'Same pathway', label: 'Staging and treatment broadly follow epithelial ovarian cancer'}], labels: ['National Cancer Institute — Ovarian, fallopian tube and primary peritoneal cancer', 'National Cancer Institute — Patient treatment information']},
      ro: {disclaimer: 'Simptomele sunt nespecifice și au adesea cauze necanceroase. Balonarea persistentă, durerea pelvină, sângerarea neobișnuită ori secreția apoasă trebuie evaluate. Sângerarea abundentă, leșinul sau durerea severă necesită îngrijire urgentă.', stats: [{value: 'Trompă uterină', label: 'Cancerul începe în țesutul care căptușește una dintre trompe'}, {value: 'Aceeași abordare', label: 'Stadializarea și tratamentul urmează în mare cancerul ovarian epitelial'}], labels: ['Institutul Național al Cancerului — Cancer ovarian, al trompei și peritoneal primar', 'Institutul Național al Cancerului — Informații despre tratament pentru pacienți']},
      es: {disclaimer: 'Los síntomas son inespecíficos y suelen tener causas no cancerosas. La hinchazón persistente, dolor pélvico, sangrado inusual o secreción acuosa deben evaluarse. El sangrado abundante, desmayo o dolor intenso requieren atención urgente.', stats: [{value: 'Trompa de Falopio', label: 'El cáncer comienza en el tejido que recubre una de las trompas'}, {value: 'Misma vía', label: 'La estadificación y tratamiento siguen en general el cáncer epitelial de ovario'}], labels: ['Instituto Nacional del Cáncer — Cáncer de ovario, trompa y peritoneo primario', 'Instituto Nacional del Cáncer — Tratamiento para pacientes']},
    },
  },
  'unknown-primary': {
    urls: ['https://www.cancer.gov/types/unknown-primary', 'https://www.cancer.gov/types/unknown-primary/patient/unknown-primary-treatment-pdq'],
    copy: {
      en: {disclaimer: 'CUP is a diagnosis made after biopsy and appropriate investigation; it cannot be identified from symptoms alone. Symptoms depend on where metastatic cancer is present. New neurological symptoms, breathing difficulty, severe pain or rapid deterioration need urgent medical care.', stats: [{value: 'Metastatic', label: 'Cancer is found away from its origin when CUP is diagnosed'}, {value: 'Primary unknown', label: 'The original site remains unconfirmed after pathology and imaging evaluation'}], labels: ['National Cancer Institute — Carcinoma of unknown primary', 'National Cancer Institute — CUP treatment for patients']},
      ro: {disclaimer: 'CUP este un diagnostic stabilit după biopsie și investigații adecvate; nu poate fi identificat doar din simptome. Manifestările depind de locul metastazelor. Simptomele neurologice noi, lipsa de aer, durerea severă ori deteriorarea rapidă necesită îngrijire urgentă.', stats: [{value: 'Metastatic', label: 'Cancerul este găsit la distanță de origine când se diagnostichează CUP'}, {value: 'Origine necunoscută', label: 'Locul inițial rămâne neconfirmat după anatomopatologie și imagistică'}], labels: ['Institutul Național al Cancerului — Cancer cu origine necunoscută', 'Institutul Național al Cancerului — Tratamentul CUP pentru pacienți']},
      es: {disclaimer: 'El CUP se diagnostica después de biopsia e investigación adecuada; no puede identificarse solo por síntomas. Las manifestaciones dependen de dónde haya metástasis. Síntomas neurológicos nuevos, falta de aire, dolor intenso o deterioro rápido requieren atención urgente.', stats: [{value: 'Metastásico', label: 'El cáncer se encuentra lejos de su origen al diagnosticarse CUP'}, {value: 'Origen desconocido', label: 'El sitio inicial sigue sin confirmarse tras patología e imágenes'}], labels: ['Instituto Nacional del Cáncer — Carcinoma de origen desconocido', 'Instituto Nacional del Cáncer — Tratamiento del CUP para pacientes']},
    },
  },
  'gestational-trophoblastic': {
    urls: ['https://www.cancer.gov/types/gestational-trophoblastic', 'https://www.cancer.gov/types/gestational-trophoblastic/patient/gtd-treatment-pdq'],
    copy: {
      en: {disclaimer: 'Abnormal bleeding, severe vomiting or early high blood pressure during or after pregnancy can have several causes and require prompt obstetric assessment. Heavy bleeding, fainting, chest pain or breathing difficulty is an emergency. Follow the hCG testing schedule given by the specialist team.', stats: [{value: 'After conception', label: 'GTD develops from pregnancy-related trophoblast cells'}, {value: 'hCG', label: 'Blood hormone monitoring is central to diagnosis, treatment response and follow-up'}], labels: ['National Cancer Institute — Gestational trophoblastic disease', 'National Cancer Institute — GTD treatment for patients']},
      ro: {disclaimer: 'Sângerarea anormală, vărsăturile severe sau tensiunea crescută devreme în timpul ori după sarcină pot avea mai multe cauze și necesită evaluare obstetricală promptă. Sângerarea abundentă, leșinul, durerea toracică sau lipsa de aer reprezintă urgențe. Respectă programul de testare hCG recomandat.', stats: [{value: 'După concepție', label: 'BTG se dezvoltă din celule trofoblastice legate de sarcină'}, {value: 'hCG', label: 'Monitorizarea hormonului în sânge este centrală pentru diagnostic și urmărire'}], labels: ['Institutul Național al Cancerului — Boală trofoblastică gestațională', 'Institutul Național al Cancerului — Tratamentul BTG pentru pacienți']},
      es: {disclaimer: 'El sangrado anormal, vómitos intensos o hipertensión temprana durante o después del embarazo pueden tener varias causas y requieren evaluación obstétrica rápida. El sangrado abundante, desmayo, dolor torácico o falta de aire son emergencias. Sigue el calendario de hCG indicado.', stats: [{value: 'Tras la concepción', label: 'La ETG se desarrolla de células trofoblásticas relacionadas con el embarazo'}, {value: 'hCG', label: 'La vigilancia hormonal en sangre es central para diagnóstico y seguimiento'}], labels: ['Instituto Nacional del Cáncer — Enfermedad trofoblástica gestacional', 'Instituto Nacional del Cáncer — Tratamiento de ETG para pacientes']},
    },
  },
  mds: {
    urls: ['https://www.cancer.gov/types/myeloproliferative', 'https://www.cancer.gov/types/myeloproliferative/patient/myelodysplastic-treatment-pdq'],
    copy: {
      en: {disclaimer: 'Low blood counts have many possible causes and MDS requires blood and bone-marrow testing. Fever during severe neutropenia, uncontrolled bleeding, chest pain, fainting or severe breathlessness needs urgent medical care.', stats: [{value: 'Bone marrow', label: 'Abnormal immature cells fail to make enough healthy blood cells'}, {value: 'Several subtypes', label: 'Risk ranges from slow disease to progression toward acute myeloid leukaemia'}], labels: ['National Cancer Institute — Myeloproliferative and myelodysplastic diseases', 'National Cancer Institute — MDS treatment for patients']},
      ro: {disclaimer: 'Scăderea celulelor sanguine are multe cauze, iar SMD necesită teste de sânge și măduvă. Febra în neutropenie severă, sângerarea necontrolată, durerea toracică, leșinul sau lipsa severă de aer necesită îngrijire urgentă.', stats: [{value: 'Măduvă osoasă', label: 'Celulele imature anormale nu produc suficiente celule sanguine sănătoase'}, {value: 'Mai multe subtipuri', label: 'Riscul variază de la boală lentă la progresie spre leucemie mieloidă acută'}], labels: ['Institutul Național al Cancerului — Boli mieloproliferative și mielodisplazice', 'Institutul Național al Cancerului — Tratamentul SMD pentru pacienți']},
      es: {disclaimer: 'Los recuentos bajos tienen muchas causas y los SMD requieren análisis de sangre y médula. Fiebre con neutropenia grave, sangrado incontrolado, dolor torácico, desmayo o falta de aire intensa requieren atención urgente.', stats: [{value: 'Médula ósea', label: 'Células inmaduras anormales no producen suficientes células sanas'}, {value: 'Varios subtipos', label: 'El riesgo va de enfermedad lenta a progresión hacia leucemia mieloide aguda'}], labels: ['Instituto Nacional del Cáncer — Enfermedades mieloproliferativas y mielodisplásicas', 'Instituto Nacional del Cáncer — Tratamiento de SMD para pacientes']},
    },
  },
  mpn: {
    urls: ['https://www.cancer.gov/types/myeloproliferative', 'https://www.cancer.gov/types/myeloproliferative/patient/chronic-treatment-pdq'],
    copy: {
      en: {disclaimer: 'MPNs are diagnosed with blood, bone-marrow and molecular tests, not symptoms alone. Sudden one-sided weakness, chest pain, breathing difficulty, a painful swollen leg, major bleeding or a severe new headache may signal a clot or bleeding emergency.', stats: [{value: 'Too many cells', label: 'The marrow overproduces red cells, white cells or platelets'}, {value: 'Clot and bleeding risk', label: 'Risk differs by MPN subtype, age, history and molecular findings'}], labels: ['National Cancer Institute — Myeloproliferative neoplasms', 'National Cancer Institute — MPN treatment for patients']},
      ro: {disclaimer: 'NMP sunt diagnosticate prin teste de sânge, măduvă și teste moleculare, nu doar prin simptome. Slăbiciunea bruscă pe o parte, durerea toracică, lipsa de aer, piciorul dureros și umflat, sângerarea majoră ori o durere de cap severă nouă pot indica o urgență.', stats: [{value: 'Prea multe celule', label: 'Măduva produce excesiv globule roșii, albe sau trombocite'}, {value: 'Risc de cheag și sângerare', label: 'Riscul diferă după subtip, vârstă, istoric și rezultate moleculare'}], labels: ['Institutul Național al Cancerului — Neoplasme mieloproliferative', 'Institutul Național al Cancerului — Tratamentul NMP pentru pacienți']},
      es: {disclaimer: 'Las NMP se diagnostican con sangre, médula y pruebas moleculares, no solo síntomas. Debilidad súbita de un lado, dolor torácico, falta de aire, pierna dolorosa e hinchada, sangrado importante o cefalea intensa nueva pueden indicar una emergencia.', stats: [{value: 'Demasiadas células', label: 'La médula produce en exceso glóbulos rojos, blancos o plaquetas'}, {value: 'Riesgo de coágulo y sangrado', label: 'El riesgo varía según subtipo, edad, antecedentes y genética'}], labels: ['Instituto Nacional del Cáncer — Neoplasias mieloproliferativas', 'Instituto Nacional del Cáncer — Tratamiento de NMP para pacientes']},
    },
  },
};

export function getAdditionalGuideBatch2TrustContent(cancerId: CancerId | string, localeInput: string): AdditionalGuideTrustContent | undefined {
  if (!(cancerId in DEFINITIONS)) return undefined;
  const locale = normalizeLocale(localeInput);
  const definition = DEFINITIONS[cancerId as Batch2CancerGuideId];
  const copy = definition.copy[locale];
  return {...UI[locale], disclaimer: copy.disclaimer, stats: copy.stats, sources: definition.urls.map((href, index) => ({href, label: copy.labels[index]}))};
}
