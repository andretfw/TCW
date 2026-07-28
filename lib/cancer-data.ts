// lib/cancer-data.ts

export const cancerTypes = [
  // --- LOS 16 CLÁSICOS ---
  { 
    id: 'breast', 
    icon: 'ribbon', 
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800', 
    contentImage: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800' 
  },
  { 
    id: 'lung', 
    icon: 'lungs', 
    image: 'https://images.unsplash.com/photo-1581595219145-01060b2eb27d?w=800',
    contentImage: 'https://images.unsplash.com/photo-1581595219145-01060b2eb27d?w=800'
  },
  { 
    id: 'colorectal', 
    icon: 'activity', 
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
    contentImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800' 
  },
  { 
    id: 'prostate', 
    icon: 'user', 
    image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800',
    contentImage: '/images/prostate-anatomy.jpg' 
  },
  { id: 'skin', icon: 'sun', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800', contentImage: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=800' },
  { id: 'kidney', icon: 'activity', image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800', contentImage: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800' },
  { id: 'leukemia', icon: 'droplet', image: '/images/leukemia-blood-cell-development.jpg', contentImage: '/images/leukemia-blood-cell-development.jpg' },
  { id: 'liver', icon: 'activity', image: 'https://images.unsplash.com/photo-1579165466741-7f35e4755660?w=800', contentImage: '/images/liver-anatomy.jpg' },
  { id: 'pancreatic', icon: 'zap', image: '/images/pancreatic-cancer-anatomy.jpg', contentImage: '/images/pancreatic-cancer-anatomy.jpg' },
  { id: 'ovarian', icon: 'circle', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800', contentImage: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800' },
  
  // ⚠️ IMPORTANTE: 'childhood' faltaba en tu lista y es vital
  { id: 'childhood', icon: 'heart', image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800', contentImage: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=800' },
  
  { id: 'brain', icon: 'cpu', image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800', contentImage: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800' },
  { id: 'bladder', icon: 'droplet', image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800', contentImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800' },
  { id: 'cervical', icon: 'heart', image: 'https://images.unsplash.com/photo-1579165466991-467135ad3110?w=800', contentImage: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=800' },
  { id: 'stomach', icon: 'coffee', image: 'https://images.unsplash.com/photo-1579165466991-467135ad3110?w=800', contentImage: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800' },
  { id: 'testicular', icon: 'anchor', image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800', contentImage: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=800' },

  // --- LOS NUEVOS (Completando hasta 35 para que coincida con el JSON) ---
  { id: 'thyroid', icon: 'feather', image: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=800', contentImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800' },
  { id: 'uterine', icon: 'user-check', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800', contentImage: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=800' },
  { id: 'lymphoma', icon: 'shield', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800', contentImage: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800' },
  // CAMBIO: usamos 'myeloma' en lugar de 'multiple-myeloma' para coincidir con el JSON
  { id: 'myeloma', icon: 'layers', image: 'https://images.unsplash.com/photo-1579154341406-c3c90516ee88?w=800', contentImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800' },
  { id: 'esophageal', icon: 'git-commit', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800', contentImage: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=800' },
  { id: 'head-neck', icon: 'mic', image: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=800', contentImage: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800' },
  { id: 'bone', icon: 'hammer', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800', contentImage: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800' },
  // CAMBIO: usamos 'sarcoma' genérico (que incluye ewing) para el JSON
  { id: 'sarcoma', icon: 'bone', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800', contentImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800' },
  { id: 'gallbladder', icon: 'database', image: 'https://images.unsplash.com/photo-1579165466741-7f35e4755660?w=800', contentImage: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800' },
  // ⚠️ FALTABA: bile-duct
  { id: 'bile-duct', icon: 'activity', image: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800', contentImage: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800' },
  { id: 'anal', icon: 'stop-circle', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800', contentImage: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800' },
  { id: 'penile', icon: 'arrow-up', image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800', contentImage: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=800' },
  { id: 'vaginal', icon: 'flower', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800', contentImage: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800' },
  { id: 'vulvar', icon: 'flower-2', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800', contentImage: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800' },
  // CAMBIO: eye en lugar de retinoblastoma para coincidir con JSON
  { id: 'eye', icon: 'eye', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800', contentImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800' },
  // ⚠️ FALTABA: oral
  { id: 'oral', icon: 'mic', image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800', contentImage: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800' },
  // CAMBIO: throat en lugar de larynx
  { id: 'throat', icon: 'mic-2', image: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=800', contentImage: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=800' },
  { id: 'small-intestine', icon: 'align-center', image: 'https://images.unsplash.com/photo-1579165466741-7f35e4755660?w=800', contentImage: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800' },
  // ⚠️ FALTABA: thymus
  { id: 'thymus', icon: 'shield', image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800', contentImage: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=800' },
];

export function getCancerData(id: string) {
    return cancerTypes.find(c => c.id === id);
}
