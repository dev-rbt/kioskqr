import { CartProduct } from '@/types/cart';

// Tek bir ürünün fiyatını hesapla
export function calculateItemPrice(item: CartProduct): number {
  let price = item.Price * item?.Quantity;
  
  // Seçili ürünler varsa fiyatlarını ekle
  if (item?.IsMainCombo && item?.Items.length > 0) {
    price += calculateSelectedItemsPrice(item);
  }
  
  return price;
}

// Seçili ürünlerin toplam fiyatını hesapla
export function calculateSelectedItemsPrice(item: CartProduct): number {
  return item.Items.reduce((total, item) => 
    total + (item.Price * item.Quantity), 0);
}

// Toplam sepet tutarını hesapla
export function calculateCartTotal(items: CartProduct[]): number {
  return items.reduce((total, item) => total + calculateItemPrice(item), 0);
}
