import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { CartItem } from '@/types/cart';
import { Product } from '@/types';
import { calculateCartTotal } from '@/lib/utils/price-calculator';

interface CartStore {
  items: CartItem[];
  total: number;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  updateTotal: () => void;
}

export const useCartStore = create<CartStore>()(
  subscribeWithSelector((set, get) => ({
    items: [],
    total: 0,

    updateTotal: () => {
      set({ total: calculateCartTotal(get().items) });
    },
    
    addItem: (product) => {
      set((state) => {
        const newState = {
          items: product.comboSelections
            ? [...state.items, { product, quantity: 1 }]
            : (() => {
                const existingItem = state.items.find(
                  (item) => item.product.id === product.id && !item.product.comboSelections
                );
                
                if (existingItem) {
                  return state.items.map((item) =>
                    item.product.id === product.id && !item.product.comboSelections
                      ? { ...item, quantity: item.quantity + 1 }
                      : item
                  );
                }
                
                return [...state.items, { product, quantity: 1 }];
              })()
        };
        
        return {
          ...newState,
          total: calculateCartTotal(newState.items)
        };
      });
    },
    
    removeItem: (productId) => {
      set((state) => {
        const newState = {
          items: state.items.filter((item) => item.product.id !== productId)
        };
        
        return {
          ...newState,
          total: calculateCartTotal(newState.items)
        };
      });
    },
    
    updateQuantity: (productId, quantity) => {
      set((state) => {
        const newState = {
          items: quantity === 0
            ? state.items.filter((item) => item.product.id !== productId)
            : state.items.map((item) =>
                item.product.id === productId ? { ...item, quantity } : item
              )
        };
        
        return {
          ...newState,
          total: calculateCartTotal(newState.items)
        };
      });
    },
    
    clearCart: () => {
      set({ items: [], total: 0 });
    },
  }))
);
