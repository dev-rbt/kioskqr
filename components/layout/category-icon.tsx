import { 
  UtensilsCrossed, Coffee, Soup, Sandwich,
  Pizza, Salad, IceCream, Cake,
  Beef, Fish, Apple, Wine,
  Home, Menu
} from 'lucide-react';

const categoryIcons: Record<string, any> = {
  // Main navigation
  'home': Home,
  'menu': Menu,

  // Food categories
  '1': UtensilsCrossed, // Ana Yemekler
  '2': Soup,            // Çorbalar
  '3': Sandwich,        // Sandviçler
  '4': Pizza,           // Pizzalar
  '5': Salad,          // Salatalar
  '6': IceCream,       // Tatlılar
  '7': Coffee,         // İçecekler
  '8': Cake,           // Pastalar
  '9': Beef,           // Etler
  '10': Fish,          // Deniz Ürünleri
  '11': Apple,         // Meyveler
  '12': Wine,          // İçkiler
};

interface CategoryIconProps {
  categoryId: string;
  className?: string;
}

export function CategoryIcon({ categoryId, className }: CategoryIconProps) {
  const Icon = categoryIcons[categoryId] || UtensilsCrossed;
  return <Icon className={className} />;
}
