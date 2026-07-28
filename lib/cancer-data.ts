import { CANCER_GUIDE_IMAGES } from '@/lib/cancer-images';
import type { CancerId } from '@/lib/routes';

const cancerTypeDefinitions = [
  { id: 'breast', icon: 'ribbon' },
  { id: 'lung', icon: 'lungs' },
  { id: 'colorectal', icon: 'activity' },
  { id: 'prostate', icon: 'user' },
  { id: 'skin', icon: 'sun' },
  { id: 'kidney', icon: 'activity' },
  { id: 'leukemia', icon: 'droplet' },
  { id: 'liver', icon: 'activity' },
  { id: 'pancreatic', icon: 'zap' },
  { id: 'ovarian', icon: 'circle' },
  { id: 'childhood', icon: 'heart' },
  { id: 'brain', icon: 'cpu' },
  { id: 'bladder', icon: 'droplet' },
  { id: 'cervical', icon: 'heart' },
  { id: 'stomach', icon: 'coffee' },
  { id: 'testicular', icon: 'anchor' },
  { id: 'thyroid', icon: 'feather' },
  { id: 'uterine', icon: 'user-check' },
  { id: 'lymphoma', icon: 'shield' },
  { id: 'myeloma', icon: 'layers' },
  { id: 'esophageal', icon: 'git-commit' },
  { id: 'head-neck', icon: 'mic' },
  { id: 'bone', icon: 'hammer' },
  { id: 'sarcoma', icon: 'bone' },
  { id: 'gallbladder', icon: 'database' },
  { id: 'bile-duct', icon: 'activity' },
  { id: 'anal', icon: 'stop-circle' },
  { id: 'penile', icon: 'arrow-up' },
  { id: 'vaginal', icon: 'flower' },
  { id: 'vulvar', icon: 'flower-2' },
  { id: 'eye', icon: 'eye' },
  { id: 'oral', icon: 'mic' },
  { id: 'throat', icon: 'mic-2' },
  { id: 'small-intestine', icon: 'align-center' },
  { id: 'thymus', icon: 'shield' },
] as const satisfies readonly { id: CancerId; icon: string }[];

export const cancerTypes = cancerTypeDefinitions.map(({ id, icon }) => ({
  id,
  icon,
  image: CANCER_GUIDE_IMAGES[id].hero.src,
  imagePresentation: CANCER_GUIDE_IMAGES[id].hero.presentation,
  contentImage: CANCER_GUIDE_IMAGES[id].overview.src,
  contentImagePresentation: CANCER_GUIDE_IMAGES[id].overview.presentation,
}));

export function getCancerData(id: string) {
  return cancerTypes.find((cancer) => cancer.id === id);
}
