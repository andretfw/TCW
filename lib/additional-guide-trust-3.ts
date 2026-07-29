import {normalizeLocale, type CancerId, type SiteLocale} from '@/lib/routes';
import type {AdditionalGuideTrustContent} from '@/lib/additional-guide-trust';
import type {Batch3CancerGuideId} from '@/lib/additional-cancer-guides-3';

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

const DEFINITIONS: Record<Batch3CancerGuideId, Definition> = {
  neuroblastoma: {
    urls: ['https://www.cancer.gov/types/neuroblastoma', 'https://www.cancer.gov/types/neuroblastoma/patient/neuroblastoma-treatment-pdq'],
    copy: {
      en: {disclaimer: 'Neuroblastoma symptoms overlap with many common childhood conditions and diagnosis requires specialist testing. A child with weakness, paralysis, breathing difficulty, severe pain, marked abdominal swelling or rapid deterioration needs urgent medical assessment.', stats: [{value: 'Young children', label: 'Neuroblastoma occurs most often in babies and young children'}, {value: 'Adrenal or nerve tissue', label: 'It often begins in an adrenal gland or along the sympathetic nervous system'}], labels: ['National Cancer Institute — Neuroblastoma overview', 'National Cancer Institute — Neuroblastoma treatment for patients']},
      ro: {disclaimer: 'Simptomele neuroblastomului se suprapun cu multe afecțiuni obișnuite ale copilăriei, iar diagnosticul necesită teste specializate. Un copil cu slăbiciune, paralizie, dificultăți de respirație, durere severă, abdomen foarte umflat sau deteriorare rapidă necesită evaluare urgentă.', stats: [{value: 'Copii mici', label: 'Neuroblastomul apare cel mai frecvent la bebeluși și copii mici'}, {value: 'Suprarenală sau nervi', label: 'Începe frecvent într-o glandă suprarenală ori în sistemul nervos simpatic'}], labels: ['Institutul Național al Cancerului — Neuroblastom', 'Institutul Național al Cancerului — Tratamentul neuroblastomului pentru pacienți']},
      es: {disclaimer: 'Los síntomas del neuroblastoma coinciden con muchas enfermedades infantiles comunes y el diagnóstico requiere pruebas especializadas. Un niño con debilidad, parálisis, dificultad respiratoria, dolor intenso, abdomen muy hinchado o deterioro rápido necesita evaluación urgente.', stats: [{value: 'Niños pequeños', label: 'El neuroblastoma aparece sobre todo en bebés y niños pequeños'}, {value: 'Suprarrenal o nervios', label: 'Suele comenzar en una glándula suprarrenal o el sistema nervioso simpático'}], labels: ['Instituto Nacional del Cáncer — Neuroblastoma', 'Instituto Nacional del Cáncer — Tratamiento del neuroblastoma para pacientes']},
    },
  },
  urethral: {
    urls: ['https://www.cancer.gov/types/urethral/patient/urethral-treatment-pdq'],
    copy: {
      en: {disclaimer: 'Urinary symptoms and bleeding have many possible causes, including infection, stones and benign obstruction. Visible blood, persistent discharge or worsening difficulty passing urine should be assessed promptly. Inability to urinate, heavy bleeding, fever with urinary blockage or severe pain needs urgent care.', stats: [{value: 'Urethra', label: 'The cancer begins in the tube carrying urine out of the body'}, {value: 'Rare', label: 'Urethral cancer is uncommon and may involve different cell types'}], labels: ['National Cancer Institute — Urethral cancer treatment for patients']},
      ro: {disclaimer: 'Simptomele urinare și sângerarea pot avea multe cauze, inclusiv infecții, pietre și obstrucții benigne. Sângele vizibil, secreția persistentă ori dificultatea în agravare la urinare trebuie evaluate prompt. Imposibilitatea de a urina, sângerarea abundentă, febra cu blocaj urinar sau durerea severă necesită îngrijire urgentă.', stats: [{value: 'Uretră', label: 'Cancerul începe în tubul prin care urina este eliminată'}, {value: 'Rar', label: 'Cancerul uretral este neobișnuit și poate implica tipuri celulare diferite'}], labels: ['Institutul Național al Cancerului — Tratamentul cancerului uretral pentru pacienți']},
      es: {disclaimer: 'Los síntomas urinarios y el sangrado tienen muchas causas, como infección, cálculos u obstrucción benigna. La sangre visible, secreción persistente o dificultad creciente para orinar deben evaluarse pronto. No poder orinar, sangrado abundante, fiebre con obstrucción o dolor intenso requieren atención urgente.', stats: [{value: 'Uretra', label: 'El cáncer comienza en el conducto que lleva la orina al exterior'}, {value: 'Raro', label: 'El cáncer uretral es poco frecuente y puede incluir distintos tipos celulares'}], labels: ['Instituto Nacional del Cáncer — Tratamiento del cáncer uretral para pacientes']},
    },
  },
  'renal-pelvis-ureter': {
    urls: ['https://www.cancer.gov/types/kidney/patient/transitional-cell-treatment-pdq'],
    copy: {
      en: {disclaimer: 'Blood in urine and flank pain can have non-cancer causes but need medical assessment, especially when persistent or recurrent. Heavy bleeding, inability to urinate, fever with obstruction, severe pain or sudden worsening needs urgent care.', stats: [{value: 'Upper urinary tract', label: 'The tumour begins in urothelial cells of the renal pelvis or ureter'}, {value: 'Related to bladder cancer', label: 'The same urothelial cell type also lines the bladder'}], labels: ['National Cancer Institute — Renal pelvis and ureter transitional-cell cancer treatment']},
      ro: {disclaimer: 'Sângele în urină și durerea de flanc pot avea cauze necanceroase, dar necesită evaluare, mai ales dacă persistă ori reapar. Sângerarea abundentă, imposibilitatea de a urina, febra cu obstrucție, durerea severă sau agravarea bruscă necesită îngrijire urgentă.', stats: [{value: 'Tract urinar superior', label: 'Tumora începe în celulele uroteliale ale pelvisului renal ori ureterului'}, {value: 'Înrudit cu vezica', label: 'Același tip de celulă urotelială căptușește și vezica'}], labels: ['Institutul Național al Cancerului — Tratamentul cancerului pelvisului renal și ureterului']},
      es: {disclaimer: 'La sangre en orina y el dolor de costado pueden tener causas no cancerosas, pero requieren evaluación, especialmente si persisten o reaparecen. Sangrado abundante, imposibilidad de orinar, fiebre con obstrucción, dolor intenso o empeoramiento súbito requieren atención urgente.', stats: [{value: 'Tracto urinario superior', label: 'El tumor comienza en células uroteliales de pelvis renal o uréter'}, {value: 'Relacionado con vejiga', label: 'El mismo tipo de célula urotelial también recubre la vejiga'}], labels: ['Instituto Nacional del Cáncer — Tratamiento del cáncer de pelvis renal y uréter']},
    },
  },
  'salivary-gland': {
    urls: ['https://www.cancer.gov/types/head-and-neck/patient/adult/salivary-gland-treatment-pdq'],
    copy: {
      en: {disclaimer: 'Most salivary gland lumps are benign, but a persistent lump, facial weakness, numbness, pain or swallowing difficulty needs assessment. Sudden facial weakness can also be a neurological emergency and should not be assumed to be cancer.', stats: [{value: 'Many subtypes', label: 'Salivary gland cancers include numerous cell types and grades'}, {value: 'Head and neck team', label: 'Specialist pathology and multidisciplinary treatment planning are important'}], labels: ['National Cancer Institute — Salivary gland cancer treatment for patients']},
      ro: {disclaimer: 'Majoritatea nodulilor glandelor salivare sunt benigni, dar un nodul persistent, slăbiciunea facială, amorțeala, durerea ori dificultatea la înghițire necesită evaluare. Slăbiciunea facială bruscă poate fi și o urgență neurologică și nu trebuie presupus că este cancer.', stats: [{value: 'Multe subtipuri', label: 'Cancerele glandelor salivare includ numeroase tipuri celulare și grade'}, {value: 'Echipă cap și gât', label: 'Anatomopatologia specializată și planificarea multidisciplinară sunt importante'}], labels: ['Institutul Național al Cancerului — Tratamentul cancerului glandelor salivare']},
      es: {disclaimer: 'La mayoría de bultos salivales son benignos, pero un bulto persistente, debilidad facial, entumecimiento, dolor o dificultad para tragar requieren evaluación. La debilidad facial súbita también puede ser una urgencia neurológica y no debe atribuirse al cáncer.', stats: [{value: 'Muchos subtipos', label: 'Los cánceres salivales incluyen numerosos tipos celulares y grados'}, {value: 'Equipo de cabeza y cuello', label: 'La patología especializada y planificación multidisciplinaria son importantes'}], labels: ['Instituto Nacional del Cáncer — Tratamiento del cáncer de glándulas salivales']},
    },
  },
  'nasal-sinus': {
    urls: ['https://www.cancer.gov/types/head-and-neck/patient/adult/paranasal-sinus-treatment-pdq'],
    copy: {
      en: {disclaimer: 'Sinus blockage, nasal discharge and nosebleeds are usually caused by non-cancer conditions. Symptoms that are one-sided, persistent, recurrent or associated with facial numbness, swelling, dental or eye changes should be assessed. Sudden vision loss, severe bleeding or breathing difficulty needs urgent care.', stats: [{value: 'Several sites', label: 'Cancer may begin in the nasal cavity or different paranasal sinuses'}, {value: 'Several cell types', label: 'Squamous cell carcinoma is most common, but other cancers can occur'}], labels: ['National Cancer Institute — Nasal cavity and paranasal sinus cancer treatment']},
      ro: {disclaimer: 'Blocajul sinusal, secreția nazală și sângerările nazale sunt de obicei cauzate de afecțiuni necanceroase. Simptomele unilaterale, persistente, recurente ori asociate cu amorțeală facială, umflare, schimbări dentare sau oculare trebuie evaluate. Pierderea bruscă a vederii, sângerarea severă ori lipsa de aer necesită îngrijire urgentă.', stats: [{value: 'Mai multe zone', label: 'Cancerul poate începe în cavitatea nazală sau în sinusuri diferite'}, {value: 'Mai multe tipuri', label: 'Carcinomul scuamos este cel mai frecvent, dar pot apărea și alte cancere'}], labels: ['Institutul Național al Cancerului — Tratamentul cancerului nazal și al sinusurilor paranazale']},
      es: {disclaimer: 'La obstrucción sinusal, secreción y hemorragias nasales suelen tener causas no cancerosas. Los síntomas unilaterales, persistentes, recurrentes o asociados con entumecimiento facial, hinchazón, cambios dentales u oculares deben evaluarse. Pérdida súbita de visión, sangrado intenso o dificultad respiratoria requieren atención urgente.', stats: [{value: 'Varios lugares', label: 'El cáncer puede comenzar en la cavidad nasal o distintos senos'}, {value: 'Varios tipos celulares', label: 'El carcinoma escamoso es el más frecuente, pero pueden aparecer otros'}], labels: ['Instituto Nacional del Cáncer — Tratamiento del cáncer nasal y de senos paranasales']},
    },
  },
  laryngeal: {
    urls: ['https://www.cancer.gov/types/head-and-neck/patient/adult/laryngeal-treatment-pdq'],
    copy: {
      en: {disclaimer: 'Hoarseness and sore throat are common and usually not cancer, but a lasting voice change, swallowing difficulty, neck lump or persistent ear pain needs assessment. Noisy breathing, severe breathlessness or coughing significant blood requires urgent care.', stats: [{value: 'Voice box', label: 'The larynx contains the vocal cords and connects the throat to the windpipe'}, {value: 'Three regions', label: 'Cancer may arise in the supraglottis, glottis or subglottis'}], labels: ['National Cancer Institute — Laryngeal cancer treatment for patients']},
      ro: {disclaimer: 'Răgușeala și durerea în gât sunt frecvente și de obicei nu sunt cancer, dar o schimbare persistentă a vocii, dificultatea la înghițire, un nodul cervical sau durerea de ureche persistentă necesită evaluare. Respirația zgomotoasă, lipsa severă de aer ori tusea cu sânge semnificativ necesită îngrijire urgentă.', stats: [{value: 'Organul vocii', label: 'Laringele conține corzile vocale și leagă gâtul de trahee'}, {value: 'Trei regiuni', label: 'Cancerul poate apărea în supraglotă, glotă sau subglotă'}], labels: ['Institutul Național al Cancerului — Tratamentul cancerului laringian']},
      es: {disclaimer: 'La ronquera y dolor de garganta son comunes y normalmente no son cáncer, pero un cambio de voz persistente, dificultad para tragar, bulto cervical o dolor de oído duradero requieren evaluación. Respiración ruidosa, falta de aire intensa o tos con cantidad importante de sangre requieren atención urgente.', stats: [{value: 'Caja de la voz', label: 'La laringe contiene las cuerdas vocales y conecta garganta con tráquea'}, {value: 'Tres regiones', label: 'El cáncer puede surgir en supraglotis, glotis o subglotis'}], labels: ['Instituto Nacional del Cáncer — Tratamiento del cáncer de laringe']},
    },
  },
  parathyroid: {
    urls: ['https://www.cancer.gov/types/parathyroid/patient/parathyroid-treatment-pdq'],
    copy: {
      en: {disclaimer: 'Parathyroid cancer is very rare and most overactive parathyroid glands are caused by benign disease. Severe hypercalcaemia can be dangerous. Confusion, profound weakness, dehydration, repeated vomiting, an abnormal heartbeat or reduced consciousness needs urgent medical care.', stats: [{value: 'Very rare', label: 'Most parathyroid tumours are benign rather than cancer'}, {value: 'High calcium', label: 'Many symptoms result from excessive parathyroid hormone and hypercalcaemia'}], labels: ['National Cancer Institute — Parathyroid cancer treatment for patients']},
      ro: {disclaimer: 'Cancerul paratiroidian este foarte rar, iar majoritatea glandelor paratiroide hiperactive au cauze benigne. Hipercalcemia severă poate fi periculoasă. Confuzia, slăbiciunea profundă, deshidratarea, vărsăturile repetate, ritmul cardiac anormal ori reducerea stării de conștiență necesită îngrijire urgentă.', stats: [{value: 'Foarte rar', label: 'Majoritatea tumorilor paratiroide sunt benigne, nu canceroase'}, {value: 'Calciu crescut', label: 'Multe simptome provin din excesul de hormon paratiroidian și hipercalcemie'}], labels: ['Institutul Național al Cancerului — Tratamentul cancerului paratiroidian']},
      es: {disclaimer: 'El cáncer de paratiroides es muy raro y la mayoría de glándulas hiperactivas se deben a enfermedad benigna. La hipercalcemia grave puede ser peligrosa. Confusión, debilidad profunda, deshidratación, vómitos repetidos, ritmo cardíaco anormal o menor conciencia requieren atención urgente.', stats: [{value: 'Muy raro', label: 'La mayoría de tumores paratiroideos son benignos, no cáncer'}, {value: 'Calcio alto', label: 'Muchos síntomas se deben al exceso de hormona paratiroidea e hipercalcemia'}], labels: ['Instituto Nacional del Cáncer — Tratamiento del cáncer de paratiroides']},
    },
  },
};

export function getAdditionalGuideBatch3TrustContent(cancerId: CancerId | string, localeInput: string): AdditionalGuideTrustContent | undefined {
  if (!(cancerId in DEFINITIONS)) return undefined;
  const locale = normalizeLocale(localeInput);
  const definition = DEFINITIONS[cancerId as Batch3CancerGuideId];
  const copy = definition.copy[locale];
  return {...UI[locale], disclaimer: copy.disclaimer, stats: copy.stats, sources: definition.urls.map((href, index) => ({href, label: copy.labels[index]}))};
}
