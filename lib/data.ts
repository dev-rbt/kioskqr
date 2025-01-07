import { Product, Category } from '@/types';

export const categories: Category[] = [
  {
    id: '1',
    name: 'Ana Yemekler',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070',
  },
  {
    id: '2',
    name: 'Başlangıçlar',
    image: 'https://images.unsplash.com/photo-1541014741259-de529411b96a?q=80&w=2074',
  },
  {
    id: '3',
    name: 'İçecekler',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=2157',
  },
  {
    id: '4',
    name: 'Tatlılar',
    image: 'https://images.unsplash.com/photo-1551024506-0341cb19b9f3?q=80&w=2157',
  },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Izgara Köfte',
    description: 'El yapımı köfte, yanında pilav ve ızgara sebzeler ile',
    price: 120,
    image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?q=80&w=2066',
    category: '1',
    ingredients: ['Dana kıyma', 'Baharatlar', 'Soğan', 'Sarımsak'],
    calories: 450,
    prepTime: 20,
    allergens: ['Gluten', 'Süt'],
    isSpicy: false,
    isVegetarian: false,
    rating: 4.8
  },
  {
    id: '2',
    name: 'Mercimek Çorbası',
    description: 'Geleneksel tarif ile hazırlanan mercimek çorbası',
    price: 45,
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2071',
    category: '2',
    calories: 180,
    prepTime: 5,
    isVegetarian: true,
    rating: 4.5
  },
  {
    id: '3',
    name: 'Taze Limonata',
    description: 'Taze sıkılmış limon ve nane yaprakları ile',
    price: 35,
    image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?q=80&w=2070',
    category: '3',
    calories: 120,
    prepTime: 5,
    isVegetarian: true,
    rating: 4.7
  },
  {
    id: '4',
    name: 'Adana Kebap',
    description: 'Özel baharatlarla hazırlanmış el yapımı kebap, yanında pilav ve közlenmiş domates ile',
    price: 150,
    image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?q=80&w=2075',
    category: '1',
    ingredients: ['Kuzu kıyma', 'Özel baharatlar', 'Kırmızı biber'],
    calories: 580,
    prepTime: 25,
    isSpicy: true,
    isVegetarian: false,
    rating: 4.9
  }
];
