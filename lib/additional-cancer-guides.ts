import {normalizeLocale, type CancerId, type SiteLocale} from '@/lib/routes';

export type AdditionalCancerGuideId =
  | 'mesothelioma'
  | 'neuroendocrine'
  | 'gist'
  | 'appendix';

type TreatmentCopy = {
  title: string;
  desc: string;
};

export type AdditionalCancerGuideContent = {
  title: string;
  shortDescription: string;
  overviewTitle: string;
  overviewText: string;
  symptomsTitle: string;
  symptoms: [string, string, string, string, string, string];
  treatmentsTitle: string;
  treatmentsIntro: string;
  treatment1: TreatmentCopy;
  treatment2: TreatmentCopy;
};

const GUIDE_CONTENT: Record<AdditionalCancerGuideId, Record<SiteLocale, AdditionalCancerGuideContent>> = {
  mesothelioma: {
    en: {
      title: 'Malignant Mesothelioma',
      shortDescription: 'A rare cancer of the tissue lining the chest, lungs or abdomen, most often linked to asbestos exposure.',
      overviewTitle: 'Understanding mesothelioma',
      overviewText:
        'Mesothelioma begins in the mesothelium, the thin tissue that lines certain organs and body cavities. It most often develops in the lining around the lungs and chest wall (pleural mesothelioma) or in the abdominal lining (peritoneal mesothelioma). Less common forms can begin around the heart or in the tissue surrounding a testicle. Asbestos exposure is the major established risk factor, and the disease may appear many years after exposure.',
      symptomsTitle: 'Possible signs and symptoms',
      symptoms: [
        'Shortness of breath or trouble breathing',
        'A persistent cough',
        'Pain under the ribs or in the chest',
        'Abdominal pain, swelling or a new lump',
        'Unexplained weight loss',
        'Persistent fatigue or reduced energy',
      ],
      treatmentsTitle: 'Treatment and care',
      treatmentsIntro:
        'Treatment depends on where the cancer began, its type and stage, whether it can be removed, overall health and personal preferences. Care is usually planned by a specialist multidisciplinary team.',
      treatment1: {
        title: 'Surgery and local treatment',
        desc: 'Selected people with disease that can be removed may be offered surgery. Radiation therapy or procedures to manage fluid around the lungs or abdomen may also be used in suitable situations.',
      },
      treatment2: {
        title: 'Systemic and supportive treatment',
        desc: 'Chemotherapy, immunotherapy or other medicines may be recommended depending on the diagnosis. Symptom control, breathing support, pain relief and palliative care can be important at every stage.',
      },
    },
    ro: {
      title: 'Mezoteliom malign',
      shortDescription: 'Un cancer rar al țesutului care căptușește toracele, plămânii sau abdomenul, asociat cel mai frecvent cu expunerea la azbest.',
      overviewTitle: 'Înțelegerea mezoteliomului',
      overviewText:
        'Mezoteliomul începe în mezoteliu, țesutul subțire care căptușește anumite organe și cavități ale corpului. Cel mai des apare în învelișul plămânilor și al peretelui toracic (mezoteliom pleural) sau în căptușeala abdomenului (mezoteliom peritoneal). Forme mai rare pot începe în jurul inimii ori în țesutul din jurul unui testicul. Expunerea la azbest este principalul factor de risc cunoscut, iar boala poate apărea la mulți ani după expunere.',
      symptomsTitle: 'Semne și simptome posibile',
      symptoms: [
        'Lipsă de aer sau dificultăți de respirație',
        'Tuse persistentă',
        'Durere sub coaste sau în piept',
        'Durere, umflare ori un nodul nou în abdomen',
        'Scădere inexplicabilă în greutate',
        'Oboseală persistentă sau energie redusă',
      ],
      treatmentsTitle: 'Tratament și îngrijire',
      treatmentsIntro:
        'Tratamentul depinde de locul în care a început cancerul, tipul și stadiul său, posibilitatea de îndepărtare, starea generală de sănătate și preferințele persoanei. Îngrijirea este de obicei planificată de o echipă multidisciplinară specializată.',
      treatment1: {
        title: 'Chirurgie și tratament local',
        desc: 'Pentru unele persoane cu boală operabilă poate fi recomandată chirurgia. Radioterapia sau procedurile pentru controlul lichidului din jurul plămânilor ori din abdomen pot fi folosite în situații potrivite.',
      },
      treatment2: {
        title: 'Tratament sistemic și de susținere',
        desc: 'În funcție de diagnostic, pot fi recomandate chimioterapia, imunoterapia sau alte medicamente. Controlul simptomelor, sprijinul respirator, calmarea durerii și îngrijirea paliativă pot fi importante în orice etapă.',
      },
    },
    es: {
      title: 'Mesotelioma maligno',
      shortDescription: 'Un cáncer raro del tejido que recubre el tórax, los pulmones o el abdomen, relacionado con mayor frecuencia con la exposición al asbesto.',
      overviewTitle: 'Comprender el mesotelioma',
      overviewText:
        'El mesotelioma comienza en el mesotelio, el tejido fino que recubre ciertos órganos y cavidades del cuerpo. Se desarrolla con mayor frecuencia en el revestimiento de los pulmones y la pared torácica (mesotelioma pleural) o en el revestimiento abdominal (mesotelioma peritoneal). Formas menos frecuentes pueden comenzar alrededor del corazón o en el tejido que rodea un testículo. La exposición al asbesto es el principal factor de riesgo establecido, y la enfermedad puede aparecer muchos años después de la exposición.',
      symptomsTitle: 'Posibles signos y síntomas',
      symptoms: [
        'Falta de aire o dificultad para respirar',
        'Tos persistente',
        'Dolor debajo de las costillas o en el pecho',
        'Dolor, hinchazón o un bulto nuevo en el abdomen',
        'Pérdida de peso sin explicación',
        'Cansancio persistente o menor energía',
      ],
      treatmentsTitle: 'Tratamiento y atención',
      treatmentsIntro:
        'El tratamiento depende del lugar donde comenzó el cáncer, su tipo y etapa, si puede extirparse, el estado general de salud y las preferencias personales. La atención suele ser planificada por un equipo multidisciplinario especializado.',
      treatment1: {
        title: 'Cirugía y tratamiento local',
        desc: 'Algunas personas con enfermedad extirpable pueden recibir cirugía. La radioterapia o los procedimientos para controlar el líquido alrededor de los pulmones o en el abdomen también pueden utilizarse cuando sean apropiados.',
      },
      treatment2: {
        title: 'Tratamiento sistémico y de apoyo',
        desc: 'Según el diagnóstico, pueden recomendarse quimioterapia, inmunoterapia u otros medicamentos. El control de síntomas, el apoyo respiratorio, el alivio del dolor y los cuidados paliativos pueden ser importantes en todas las etapas.',
      },
    },
  },
  neuroendocrine: {
    en: {
      title: 'Neuroendocrine Tumours (NETs)',
      shortDescription: 'Tumours arising from hormone-producing neuroendocrine cells, with behaviour that varies widely by site and grade.',
      overviewTitle: 'Understanding neuroendocrine tumours',
      overviewText:
        'Neuroendocrine tumours can begin in several organs. This guide focuses mainly on gastrointestinal and pancreatic NETs, including tumours of the small intestine, rectum and appendix. Some NETs make and release hormones, while others do not. Many are slow-growing, but higher-grade neuroendocrine cancers can behave aggressively, so the exact site, grade and tumour biology matter.',
      symptomsTitle: 'Possible signs and symptoms',
      symptoms: [
        'Persistent abdominal pain or discomfort',
        'Diarrhoea or a lasting change in bowel habits',
        'Skin flushing or sudden warmth',
        'Wheezing or unexplained breathing symptoms',
        'Nausea, vomiting or abdominal bloating',
        'Unexplained weight loss or persistent fatigue',
      ],
      treatmentsTitle: 'Treatment and care',
      treatmentsIntro:
        'Treatment is individualised according to the organ of origin, tumour grade, hormone production, receptor findings, spread and overall health. Specialist pathological review is important.',
      treatment1: {
        title: 'Surgery or local removal',
        desc: 'Small or localised tumours may be removed through an endoscopic procedure or surgery. Surgery may also include nearby lymph nodes or treatment of selected liver deposits.',
      },
      treatment2: {
        title: 'Medicines and specialised therapies',
        desc: 'Options may include somatostatin analogues, targeted medicines, peptide receptor radionuclide therapy, chemotherapy or treatments directed at liver metastases. Treatment also addresses hormone-related symptoms when present.',
      },
    },
    ro: {
      title: 'Tumori neuroendocrine (NET)',
      shortDescription: 'Tumori care apar din celule neuroendocrine producătoare de hormoni, cu evoluție foarte diferită în funcție de localizare și grad.',
      overviewTitle: 'Înțelegerea tumorilor neuroendocrine',
      overviewText:
        'Tumorile neuroendocrine pot începe în mai multe organe. Acest ghid se concentrează în principal pe NET-urile gastrointestinale și pancreatice, inclusiv tumorile intestinului subțire, rectului și apendicelui. Unele NET-uri produc și eliberează hormoni, iar altele nu. Multe cresc lent, însă cancerele neuroendocrine cu grad înalt pot evolua agresiv, astfel că localizarea exactă, gradul și biologia tumorii sunt importante.',
      symptomsTitle: 'Semne și simptome posibile',
      symptoms: [
        'Durere sau disconfort abdominal persistent',
        'Diaree sau o schimbare persistentă a tranzitului',
        'Înroșirea bruscă a pielii sau senzație de căldură',
        'Respirație șuierătoare ori simptome respiratorii inexplicabile',
        'Greață, vărsături sau balonare abdominală',
        'Scădere inexplicabilă în greutate ori oboseală persistentă',
      ],
      treatmentsTitle: 'Tratament și îngrijire',
      treatmentsIntro:
        'Tratamentul este individualizat în funcție de organul de origine, gradul tumorii, producția de hormoni, receptorii identificați, răspândire și starea generală de sănătate. Revizuirea anatomopatologică de către specialiști este importantă.',
      treatment1: {
        title: 'Chirurgie sau îndepărtare locală',
        desc: 'Tumorile mici sau localizate pot fi îndepărtate printr-o procedură endoscopică ori prin chirurgie. Operația poate include ganglionii din apropiere sau tratamentul unor metastaze hepatice selectate.',
      },
      treatment2: {
        title: 'Medicamente și terapii specializate',
        desc: 'Opțiunile pot include analogi de somatostatină, medicamente țintite, terapie radionuclidică cu receptori peptidici, chimioterapie sau tratamente pentru metastazele hepatice. Sunt tratate și simptomele hormonale, dacă apar.',
      },
    },
    es: {
      title: 'Tumores neuroendocrinos (TNE)',
      shortDescription: 'Tumores que se originan en células neuroendocrinas productoras de hormonas, con un comportamiento muy variable según su localización y grado.',
      overviewTitle: 'Comprender los tumores neuroendocrinos',
      overviewText:
        'Los tumores neuroendocrinos pueden comenzar en varios órganos. Esta guía se centra principalmente en los TNE gastrointestinales y pancreáticos, incluidos los del intestino delgado, recto y apéndice. Algunos producen y liberan hormonas y otros no. Muchos crecen lentamente, pero los cánceres neuroendocrinos de alto grado pueden comportarse de forma agresiva, por lo que importan la localización exacta, el grado y la biología tumoral.',
      symptomsTitle: 'Posibles signos y síntomas',
      symptoms: [
        'Dolor o molestias abdominales persistentes',
        'Diarrea o un cambio duradero en el hábito intestinal',
        'Enrojecimiento de la piel o sensación repentina de calor',
        'Sibilancias o síntomas respiratorios sin explicación',
        'Náuseas, vómitos o hinchazón abdominal',
        'Pérdida de peso sin explicación o cansancio persistente',
      ],
      treatmentsTitle: 'Tratamiento y atención',
      treatmentsIntro:
        'El tratamiento se individualiza según el órgano de origen, el grado, la producción hormonal, los receptores, la extensión y el estado general de salud. Es importante una revisión anatomopatológica especializada.',
      treatment1: {
        title: 'Cirugía o extirpación local',
        desc: 'Los tumores pequeños o localizados pueden extirparse mediante un procedimiento endoscópico o cirugía. La operación también puede incluir ganglios cercanos o el tratamiento de metástasis hepáticas seleccionadas.',
      },
      treatment2: {
        title: 'Medicamentos y terapias especializadas',
        desc: 'Las opciones pueden incluir análogos de somatostatina, medicamentos dirigidos, terapia con radionúclidos de receptores peptídicos, quimioterapia o tratamientos para metástasis hepáticas. También se tratan los síntomas hormonales cuando existen.',
      },
    },
  },
  gist: {
    en: {
      title: 'Gastrointestinal Stromal Tumour (GIST)',
      shortDescription: 'A type of soft-tissue sarcoma that begins in the wall of the gastrointestinal tract, most often the stomach or small intestine.',
      overviewTitle: 'Understanding GIST',
      overviewText:
        'A gastrointestinal stromal tumour is a biologically distinct sarcoma that forms in the tissues of the digestive tract. GISTs most often begin in the stomach or small intestine. Their behaviour ranges from very small, slow-growing tumours to aggressive disease. Tumour size, location, cell-division rate and molecular findings help determine risk and treatment.',
      symptomsTitle: 'Possible signs and symptoms',
      symptoms: [
        'Blood in the stool or black, tar-like stools',
        'Vomiting blood or material resembling coffee grounds',
        'Persistent abdominal pain or discomfort',
        'Feeling full after eating a small amount',
        'A new abdominal lump or swelling',
        'Fatigue, weakness or anaemia',
      ],
      treatmentsTitle: 'Treatment and care',
      treatmentsIntro:
        'Treatment depends on whether the tumour can be removed, its risk features, molecular alterations, spread and previous treatment. GIST should be managed by a team familiar with sarcoma and targeted therapy.',
      treatment1: {
        title: 'Surgery and monitoring',
        desc: 'Surgery is often used for a localised tumour that can be safely removed. Very small, low-risk tumours may sometimes be monitored, while follow-up imaging is important after treatment.',
      },
      treatment2: {
        title: 'Targeted therapy',
        desc: 'Tyrosine kinase inhibitors such as imatinib and other targeted medicines may be used before or after surgery, or for unresectable, metastatic or recurrent GIST. Molecular testing helps guide the choice.',
      },
    },
    ro: {
      title: 'Tumoră stromală gastrointestinală (GIST)',
      shortDescription: 'Un tip de sarcom de țesuturi moi care începe în peretele tractului gastrointestinal, cel mai des în stomac sau intestinul subțire.',
      overviewTitle: 'Înțelegerea GIST',
      overviewText:
        'Tumora stromală gastrointestinală este un sarcom distinct biologic, care se formează în țesuturile tubului digestiv. GIST-urile încep cel mai des în stomac sau intestinul subțire. Evoluția lor variază de la tumori foarte mici și lente la boală agresivă. Dimensiunea, localizarea, rata de diviziune celulară și caracteristicile moleculare ajută la stabilirea riscului și tratamentului.',
      symptomsTitle: 'Semne și simptome posibile',
      symptoms: [
        'Sânge în scaun sau scaune negre, lucioase',
        'Vărsături cu sânge ori cu aspect de zaț de cafea',
        'Durere sau disconfort abdominal persistent',
        'Senzație de sațietate după o cantitate mică de mâncare',
        'Un nodul nou sau umflare în abdomen',
        'Oboseală, slăbiciune ori anemie',
      ],
      treatmentsTitle: 'Tratament și îngrijire',
      treatmentsIntro:
        'Tratamentul depinde de posibilitatea de îndepărtare, factorii de risc ai tumorii, modificările moleculare, răspândire și tratamentele anterioare. GIST trebuie gestionat de o echipă cu experiență în sarcoame și terapii țintite.',
      treatment1: {
        title: 'Chirurgie și monitorizare',
        desc: 'Chirurgia este folosită frecvent pentru o tumoră localizată care poate fi îndepărtată în siguranță. Tumorile foarte mici și cu risc redus pot fi uneori monitorizate, iar imagistica de urmărire este importantă după tratament.',
      },
      treatment2: {
        title: 'Terapie țintită',
        desc: 'Inhibitorii de tirozin-kinază, precum imatinib, și alte medicamente țintite pot fi folosite înainte sau după operație ori pentru GIST inoperabil, metastatic sau recidivat. Testarea moleculară ajută la alegerea tratamentului.',
      },
    },
    es: {
      title: 'Tumor del estroma gastrointestinal (GIST)',
      shortDescription: 'Un tipo de sarcoma de tejidos blandos que comienza en la pared del tubo digestivo, con mayor frecuencia en el estómago o intestino delgado.',
      overviewTitle: 'Comprender el GIST',
      overviewText:
        'El tumor del estroma gastrointestinal es un sarcoma biológicamente distinto que se forma en los tejidos del aparato digestivo. Los GIST comienzan con mayor frecuencia en el estómago o intestino delgado. Su comportamiento varía desde tumores muy pequeños y lentos hasta enfermedad agresiva. El tamaño, la localización, la tasa de división celular y los hallazgos moleculares ayudan a determinar el riesgo y el tratamiento.',
      symptomsTitle: 'Posibles signos y síntomas',
      symptoms: [
        'Sangre en las heces o heces negras y alquitranadas',
        'Vómitos con sangre o con aspecto de posos de café',
        'Dolor o molestias abdominales persistentes',
        'Sensación de llenura después de comer poco',
        'Un bulto nuevo o hinchazón abdominal',
        'Cansancio, debilidad o anemia',
      ],
      treatmentsTitle: 'Tratamiento y atención',
      treatmentsIntro:
        'El tratamiento depende de si el tumor puede extirparse, sus factores de riesgo, alteraciones moleculares, extensión y tratamientos previos. El GIST debe ser atendido por un equipo con experiencia en sarcomas y terapias dirigidas.',
      treatment1: {
        title: 'Cirugía y vigilancia',
        desc: 'La cirugía se utiliza a menudo para un tumor localizado que puede extirparse de forma segura. Los tumores muy pequeños y de bajo riesgo a veces pueden vigilarse, y las pruebas de imagen de seguimiento son importantes después del tratamiento.',
      },
      treatment2: {
        title: 'Terapia dirigida',
        desc: 'Los inhibidores de tirosina cinasa, como imatinib, y otros medicamentos dirigidos pueden utilizarse antes o después de la cirugía, o para GIST no resecable, metastásico o recurrente. Las pruebas moleculares orientan la elección.',
      },
    },
  },
  appendix: {
    en: {
      title: 'Appendix Cancer',
      shortDescription: 'A rare group of cancers arising in the appendix, including epithelial and neuroendocrine tumours.',
      overviewTitle: 'Understanding appendix cancer',
      overviewText:
        'Appendix cancer begins in cells of the appendix and is not one single disease. The two broad groups are epithelial appendiceal cancers and neuroendocrine tumours. Some epithelial tumours produce mucin and can spread within the abdomen, sometimes causing pseudomyxoma peritonei. Appendix cancer may be discovered during surgery for suspected appendicitis or during another abdominal procedure.',
      symptomsTitle: 'Possible signs and symptoms',
      symptoms: [
        'Pain in the lower-right abdomen or appendicitis-like symptoms',
        'Increasing abdominal size, pressure or bloating',
        'A persistent change in bowel habits',
        'Nausea or vomiting',
        'Loss of appetite or unexplained weight loss',
        'A new abdominal or pelvic lump, or a new hernia',
      ],
      treatmentsTitle: 'Treatment and care',
      treatmentsIntro:
        'Treatment depends on the exact pathological type, tumour grade, whether it has ruptured or spread, and whether mucin or tumour deposits are present in the abdomen. Specialist review is especially important because appendix cancers differ from colorectal cancer.',
      treatment1: {
        title: 'Surgery',
        desc: 'Treatment may range from removal of the appendix to a larger bowel operation. Selected people with disease spread across the abdominal lining may be considered for cytoreductive surgery and heated intraperitoneal chemotherapy in a specialist centre.',
      },
      treatment2: {
        title: 'Additional and systemic treatment',
        desc: 'Chemotherapy, targeted approaches, observation or treatment used for neuroendocrine tumours may be considered according to the exact subtype, grade and spread. Follow-up plans are tailored to recurrence risk.',
      },
    },
    ro: {
      title: 'Cancer de apendice',
      shortDescription: 'Un grup rar de cancere care apar în apendice, inclusiv tumori epiteliale și neuroendocrine.',
      overviewTitle: 'Înțelegerea cancerului de apendice',
      overviewText:
        'Cancerul de apendice începe în celulele apendicelui și nu este o singură boală. Cele două grupe largi sunt cancerele epiteliale apendiculare și tumorile neuroendocrine. Unele tumori epiteliale produc mucină și se pot răspândi în abdomen, provocând uneori pseudomixom peritoneal. Cancerul poate fi descoperit în timpul unei operații pentru suspiciune de apendicită sau al unei alte proceduri abdominale.',
      symptomsTitle: 'Semne și simptome posibile',
      symptoms: [
        'Durere în partea dreaptă inferioară a abdomenului sau simptome asemănătoare apendicitei',
        'Creșterea dimensiunii abdomenului, presiune sau balonare',
        'O schimbare persistentă a tranzitului intestinal',
        'Greață sau vărsături',
        'Pierderea poftei de mâncare ori scădere inexplicabilă în greutate',
        'Un nodul nou abdominal sau pelvin ori o hernie nouă',
      ],
      treatmentsTitle: 'Tratament și îngrijire',
      treatmentsIntro:
        'Tratamentul depinde de tipul anatomopatologic exact, gradul tumorii, rupere sau răspândire și prezența mucinei ori a depozitelor tumorale în abdomen. Evaluarea specializată este foarte importantă deoarece aceste cancere diferă de cancerul colorectal.',
      treatment1: {
        title: 'Chirurgie',
        desc: 'Tratamentul poate varia de la îndepărtarea apendicelui la o operație intestinală mai extinsă. Unele persoane cu boală răspândită pe căptușeala abdomenului pot fi evaluate pentru chirurgie citoreductivă și chimioterapie intraperitoneală hipertermică într-un centru specializat.',
      },
      treatment2: {
        title: 'Tratament suplimentar și sistemic',
        desc: 'În funcție de subtipul exact, grad și răspândire, pot fi luate în considerare chimioterapia, terapii țintite, monitorizarea sau tratamente folosite pentru tumorile neuroendocrine. Urmărirea este adaptată riscului de recidivă.',
      },
    },
    es: {
      title: 'Cáncer de apéndice',
      shortDescription: 'Un grupo raro de cánceres que se originan en el apéndice, incluidos tumores epiteliales y neuroendocrinos.',
      overviewTitle: 'Comprender el cáncer de apéndice',
      overviewText:
        'El cáncer de apéndice comienza en las células del apéndice y no es una sola enfermedad. Los dos grandes grupos son los cánceres epiteliales apendiculares y los tumores neuroendocrinos. Algunos tumores epiteliales producen mucina y pueden diseminarse dentro del abdomen, causando a veces pseudomixoma peritoneal. Puede descubrirse durante una operación por sospecha de apendicitis o durante otro procedimiento abdominal.',
      symptomsTitle: 'Posibles signos y síntomas',
      symptoms: [
        'Dolor en la parte inferior derecha del abdomen o síntomas similares a apendicitis',
        'Aumento del tamaño abdominal, presión o hinchazón',
        'Un cambio persistente en el hábito intestinal',
        'Náuseas o vómitos',
        'Pérdida de apetito o de peso sin explicación',
        'Un bulto nuevo abdominal o pélvico, o una hernia nueva',
      ],
      treatmentsTitle: 'Tratamiento y atención',
      treatmentsIntro:
        'El tratamiento depende del tipo anatomopatológico exacto, el grado, si se ha roto o diseminado y si hay mucina o depósitos tumorales en el abdomen. La revisión especializada es especialmente importante porque estos cánceres son distintos del cáncer colorrectal.',
      treatment1: {
        title: 'Cirugía',
        desc: 'El tratamiento puede variar desde la extirpación del apéndice hasta una operación intestinal más extensa. Algunas personas con enfermedad diseminada por el revestimiento abdominal pueden ser evaluadas para cirugía citorreductora y quimioterapia intraperitoneal hipertérmica en un centro especializado.',
      },
      treatment2: {
        title: 'Tratamiento adicional y sistémico',
        desc: 'Según el subtipo exacto, el grado y la extensión, pueden considerarse quimioterapia, enfoques dirigidos, observación o tratamientos utilizados para tumores neuroendocrinos. El seguimiento se adapta al riesgo de recurrencia.',
      },
    },
  },
};

export function isAdditionalCancerGuideId(cancerId: string): cancerId is AdditionalCancerGuideId {
  return cancerId in GUIDE_CONTENT;
}

export function getAdditionalCancerGuideContent(
  cancerId: CancerId | string,
  localeInput: string,
): AdditionalCancerGuideContent | undefined {
  if (!isAdditionalCancerGuideId(cancerId)) return undefined;
  const locale = normalizeLocale(localeInput);
  return GUIDE_CONTENT[cancerId][locale];
}

export function getCancerGuideCountLabel(localeInput: string, count: number): string {
  const locale = normalizeLocale(localeInput);
  if (locale === 'ro') return `${count} de ghiduri informative despre cancer`;
  if (locale === 'es') return `${count} guías informativas sobre el cáncer`;
  return `${count} cancer information guides`;
}
