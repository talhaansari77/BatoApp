
export type MedicalBeautyProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
};

export const medicalBeautyProducts: MedicalBeautyProduct[] = [
  {
    id: '1',
    name: 'Hydrating Facial Serum',
    category: 'Skincare',
    price: 12.5,
    description: 'A lightweight serum for daily hydration.',
    image:
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600',
  },
  {
    id: '2',
    name: 'Vitamin C Brightening Serum',
    category: 'Brightening',
    price: 18.0,
    description: 'A brightening serum for a radiant complexion.',
    image:
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600',
  },
  {
    id: '3',
    name: 'Daily Facial Moisturizer',
    category: 'Moisturizers',
    price: 15.0,
    description: 'Daily moisture for soft, comfortable skin.',
    image:
      'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=600',
  },
  {
    id: '4',
    name: 'Gentle Facial Cleanser',
    category: 'Cleansers',
    price: 9.5,
    description: 'A gentle cleanser for everyday skincare.',
    image:
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600',
  },
  {
    id: '5',
    name: 'Daily Sunscreen SPF 50',
    category: 'Sun Protection',
    price: 14.0,
    description: 'Daily broad-spectrum sun protection.',
    image:
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600',
  },
  {
    id: '6',
    name: 'Nourishing Face Cream',
    category: 'Skincare',
    price: 21.0,
    description: 'A rich cream for a smooth skin feel.',
    image:
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600',
  },
  {
    id: '7',
    name: 'Under-Eye Repair Cream',
    category: 'Eye Care',
    price: 16.5,
    description: 'A targeted moisturizer for the eye area.',
    image:
      'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=600',
  },
  {
    id: '8',
    name: 'Exfoliating Facial Toner',
    category: 'Exfoliation',
    price: 13.0,
    description: 'A facial toner for a refreshed skin feel.',
    image:
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600',
  },
  {
    id: '9',
    name: 'Overnight Recovery Mask',
    category: 'Face Masks',
    price: 19.0,
    description: 'An overnight mask for a hydrated look.',
    image:
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600',
  },
  {
    id: '10',
    name: 'Collagen Facial Treatment',
    category: 'Face Treatment',
    price: 24.0,
    description: 'A nourishing facial treatment for your routine.',
    image:
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600',
  },
];
