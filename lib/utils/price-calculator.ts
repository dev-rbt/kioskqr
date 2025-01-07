import type { CartItem } from '@/types/cart';
import type { ComboSelections } from '@/types/combo';

// Tek bir ürünün fiyatını hesapla
export function calculateItemPrice(item: CartItem): number {
  let price = item.product.price;
  
  // Combo seçimleri varsa ekstra ücretleri ekle
  if (item.product.comboSelections) {
    price += calculateComboSelectionsPrice(item.product.comboSelections);
  }
  
  return price * item.quantity;
}

// Combo seçimlerinin ekstra ücretlerini hesapla
export function calculateComboSelectionsPrice(selections: ComboSelections): number {
  return Object.values(selections)
    .flat()
    .reduce((total, selection) => 
      total + (selection.item.ExtraPriceTakeOut_TL * selection.quantity), 0);
}

// Toplam sepet tutarını hesapla
export function calculateCartTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + calculateItemPrice(item), 0);
}
