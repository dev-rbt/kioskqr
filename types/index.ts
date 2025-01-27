import { ComboGroup } from './api';
import { ComboSelections } from './combo';

// Base interfaces
export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  ingredients?: string[];
  calories?: number;
  weight?: number;  // Added weight property
  prepTime?: number;
  allergens?: string[];
  isSpicy?: boolean;
  isVegetarian?: boolean;
  rating?: number;
  isCombo?: boolean;
  Combo?: ComboGroup[];
  comboSelections?: ComboSelections;
}

// Re-export other types
export type { ComboSelections } from './combo';