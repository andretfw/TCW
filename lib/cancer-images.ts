import type { CancerId } from '@/lib/routes';

export type CancerImagePresentation = 'illustration' | 'photo';

export type CancerGuideImage = {
  src: string;
  presentation: CancerImagePresentation;
};

export type CancerGuideImageSet = {
  card: CancerGuideImage;
  hero: CancerGuideImage;
  overview: CancerGuideImage;
};

const illustration = (src: string): CancerGuideImage => ({
  src,
  presentation: 'illustration',
});

const sameIllustration = (src: string): CancerGuideImageSet => {
  const image = illustration(src);
  return { card: image, hero: image, overview: image };
};

export const CANCER_GUIDE_IDS = [
  'breast',
  'lung',
  'colorectal',
  'prostate',
  'skin',
  'kidney',
  'leukemia',
  'liver',
  'pancreatic',
  'ovarian',
  'childhood',
  'brain',
  'bladder',
  'cervical',
  'stomach',
  'testicular',
  'thyroid',
  'uterine',
  'lymphoma',
  'myeloma',
  'esophageal',
  'head-neck',
  'bone',
  'sarcoma',
  'gallbladder',
  'bile-duct',
  'anal',
  'penile',
  'vaginal',
  'vulvar',
  'eye',
  'oral',
  'throat',
  'small-intestine',
  'thymus',
  'mesothelioma',
  'neuroendocrine',
  'gist',
  'appendix',
  'adrenal',
  'primary-peritoneal',
  'fallopian-tube',
  'unknown-primary',
  'gestational-trophoblastic',
  'mds',
  'mpn',
  'neuroblastoma',
  'urethral',
  'renal-pelvis-ureter',
  'salivary-gland',
  'nasal-sinus',
  'laryngeal',
  'parathyroid',
] as const satisfies readonly CancerId[];

export const CANCER_GUIDE_IMAGES: Record<CancerId, CancerGuideImageSet> = {
  breast: sameIllustration('/images/cancer-guides/breast-anatomy.jpg'),
  lung: sameIllustration('/images/cancer-guides/lung-anatomy.jpg'),
  colorectal: sameIllustration('/images/cancer-guides/lower-digestive-anatomy.jpg'),
  prostate: sameIllustration('/images/cancer-guides/prostate-anatomy.jpg'),
  skin: sameIllustration('/images/cancer-guides/melanoma-skin-anatomy.jpg'),
  kidney: sameIllustration('/images/cancer-guides/kidney-anatomy.jpg'),
  leukemia: sameIllustration('/images/cancer-guides/blood-cell-development.jpg'),
  liver: sameIllustration('/images/cancer-guides/liver-biliary-anatomy.jpg'),
  pancreatic: sameIllustration('/images/cancer-guides/pancreas-anatomy.jpg'),
  ovarian: sameIllustration('/images/cancer-guides/female-reproductive-anatomy.jpg'),
  childhood: sameIllustration('/images/cancer-guides/childhood-cancer-gold-ribbon.svg'),
  brain: sameIllustration('/images/cancer-guides/brain-anatomy.jpg'),
  bladder: sameIllustration('/images/cancer-guides/urinary-system-anatomy.jpg'),
  cervical: sameIllustration('/images/cancer-guides/female-reproductive-anatomy.jpg'),
  stomach: sameIllustration('/images/cancer-guides/digestive-system-anatomy.jpg'),
  testicular: sameIllustration('/images/cancer-guides/male-reproductive-anatomy.jpg'),
  thyroid: sameIllustration('/images/cancer-guides/thyroid-anatomy.jpg'),
  uterine: sameIllustration('/images/cancer-guides/female-reproductive-anatomy.jpg'),
  lymphoma: sameIllustration('/images/cancer-guides/lymph-system-anatomy.jpg'),
  myeloma: sameIllustration('/images/cancer-guides/myeloma-cell.jpg'),
  esophageal: sameIllustration('/images/cancer-guides/digestive-system-anatomy.jpg'),
  'head-neck': {
    card: illustration('/images/cancer-guides/oral-cavity-anatomy.jpg'),
    hero: illustration('/images/cancer-guides/larynx-anatomy.jpg'),
    overview: illustration('/images/cancer-guides/oral-cavity-anatomy.jpg'),
  },
  bone: sameIllustration('/images/cancer-guides/bone-anatomy.jpg'),
  sarcoma: sameIllustration('/images/cancer-guides/soft-tissue-anatomy.jpg'),
  gallbladder: sameIllustration('/images/cancer-guides/liver-biliary-anatomy.jpg'),
  'bile-duct': sameIllustration('/images/cancer-guides/liver-biliary-anatomy.jpg'),
  anal: sameIllustration('/images/cancer-guides/lower-digestive-anatomy.jpg'),
  penile: sameIllustration('/images/cancer-guides/male-reproductive-anatomy.jpg'),
  vaginal: sameIllustration('/images/cancer-guides/female-reproductive-anatomy.jpg'),
  vulvar: sameIllustration('/images/cancer-guides/vulvar-anatomy.jpg'),
  eye: sameIllustration('/images/cancer-guides/eye-anatomy.jpg'),
  oral: sameIllustration('/images/cancer-guides/oral-cavity-anatomy.jpg'),
  throat: sameIllustration('/images/cancer-guides/larynx-anatomy.jpg'),
  'small-intestine': sameIllustration('/images/cancer-guides/lower-digestive-anatomy.jpg'),
  thymus: sameIllustration('/images/cancer-guides/lymph-system-anatomy.jpg'),
  mesothelioma: sameIllustration('/images/cancer-guides/lung-anatomy.jpg'),
  neuroendocrine: sameIllustration('/images/cancer-guides/digestive-system-anatomy.jpg'),
  gist: sameIllustration('/images/cancer-guides/digestive-system-anatomy.jpg'),
  appendix: sameIllustration('/images/cancer-guides/lower-digestive-anatomy.jpg'),
  adrenal: sameIllustration('/images/cancer-guides/kidney-anatomy.jpg'),
  'primary-peritoneal': sameIllustration('/images/cancer-guides/female-reproductive-anatomy.jpg'),
  'fallopian-tube': sameIllustration('/images/cancer-guides/female-reproductive-anatomy.jpg'),
  'unknown-primary': sameIllustration('/images/cancer-guides/lymph-system-anatomy.jpg'),
  'gestational-trophoblastic': sameIllustration('/images/cancer-guides/female-reproductive-anatomy.jpg'),
  mds: sameIllustration('/images/cancer-guides/blood-cell-development.jpg'),
  mpn: sameIllustration('/images/cancer-guides/blood-cell-development.jpg'),
  neuroblastoma: sameIllustration('/images/cancer-guides/kidney-anatomy.jpg'),
  urethral: sameIllustration('/images/cancer-guides/urinary-system-anatomy.jpg'),
  'renal-pelvis-ureter': sameIllustration('/images/cancer-guides/urinary-system-anatomy.jpg'),
  'salivary-gland': sameIllustration('/images/cancer-guides/oral-cavity-anatomy.jpg'),
  'nasal-sinus': sameIllustration('/images/cancer-guides/oral-cavity-anatomy.jpg'),
  laryngeal: sameIllustration('/images/cancer-guides/larynx-anatomy.jpg'),
  parathyroid: sameIllustration('/images/cancer-guides/thyroid-anatomy.jpg'),
};
