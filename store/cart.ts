import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { calculateCartTotal } from '@/lib/utils/price-calculator';
import { Cart, CartProduct } from '@/types/cart';

interface CartStore {
  cart: Cart;
  addCartProduct: (product: CartProduct) => void;
  removeCartProduct: (productId: string) => void;
  updateCartProduct: (productId: string, updatedProduct: CartProduct) => void;
  addSelectedItem: (productId: string, selectedItem: CartProduct) => void;
  removeSelectedItem: (productId: string, selectedItemId: string) => void;
  updateSelectedItem: (productId: string, selectedItem: CartProduct) => void;
  clearCart: () => void;
  updateCart: (updatedCart: Partial<Cart>) => void;
}

export const useCartStore = create<CartStore>()(
  subscribeWithSelector((set) => ({
    cart: {
      AmountDue: 0,
      SubTotal: 0,
      DiscountOrderAmount: 0,
      DiscountLineAmount: 0,
      Notes: '',
      CallNumber: '',
      OrderType: null,
      PaymentType: 'CREDIT_CARD',
      Items: [],
      PaymentMethod: {
        Key: '',
        PaymentMethodID: 0,
        PaymentName: '',
        Name: '',
        Type: ''
      }
    },

    addCartProduct: (product) => {
      set((state) => {
        const existingProductIndex = (state.cart.Items || []).findIndex(
          (item) => item.MenuItemKey === product.MenuItemKey
        ) ?? -1;

        let newItems;
        if (product.IsMainCombo || existingProductIndex === -1) {
          newItems = [...(state.cart.Items || []), product];
        } else {
          newItems = (state.cart.Items || []).map((item, index) =>
            index === existingProductIndex
              ? { ...item, Quantity: (item.Quantity ?? 0) + 1 }
              : item
          );
        }

        return {
          cart: {
            ...state.cart,
            Items: newItems,
            AmountDue: calculateCartTotal(newItems),
            SubTotal: calculateCartTotal(newItems),
            DiscountOrderAmount: 0,
            DiscountLineAmount: 0
          }
        };
      });
    },

    updateCartProduct: (productId, updatedProduct) => {
      set((state) => {
        const newItems = (state.cart.Items || []).map((product) =>
          product.MenuItemKey === productId ? updatedProduct : product
        );

        return {
          cart: {
            ...state.cart,
            Items: newItems,
            AmountDue: calculateCartTotal(newItems),
            SubTotal: calculateCartTotal(newItems),
            DiscountOrderAmount: 0,
            DiscountLineAmount: 0
          }
        };
      });
    },

    addSelectedItem: (productId, selectedItem) => {
      set((state) => {
        const newItems = (state.cart.Items || []).map((product) => {
          if (product.MenuItemKey === productId) {
            const existingItemIndex = (product.Items || []).findIndex(
              (item) => item.MenuItemKey === selectedItem.MenuItemKey
            ) ?? -1;

            if (existingItemIndex === -1) {
              return {
                ...product,
                Items: [...(product.Items || []), selectedItem],
              };
            }

            return {
              ...product,
              Items: (product.Items || []).map((item, index) =>
                index === existingItemIndex
                  ? { ...item, Quantity: (item.Quantity ?? 0) + 1 }
                  : item
              ),
            };
          }
          return product;
        });

        return {
          cart: {
            ...state.cart,
            Items: newItems,
            AmountDue: calculateCartTotal(newItems),
            SubTotal: calculateCartTotal(newItems),
            DiscountOrderAmount: 0,
            DiscountLineAmount: 0
          }
        };
      });
    },

    removeSelectedItem: (productId, selectedItemId) => {
      set((state) => {
        const newItems = (state.cart.Items || []).map((product) => {
          if (product.MenuItemKey === productId) {
            return {
              ...product,
              Items: (product.Items || []).filter(
                (item) => item.MenuItemKey !== selectedItemId
              ),
            };
          }
          return product;
        });

        return {
          cart: {
            ...state.cart,
            Items: newItems,
            AmountDue: calculateCartTotal(newItems),
            SubTotal: calculateCartTotal(newItems),
            DiscountOrderAmount: 0,
            DiscountLineAmount: 0
          }
        };
      });
    },

    updateSelectedItem: (productId, selectedItem) => {
      set((state) => {
        const newItems = (state.cart.Items || []).map((product) => {
          if (product.MenuItemKey === productId) {
            const newSelectedItems = (product.Items || []).map((item) =>
              item.MenuItemKey === selectedItem.MenuItemKey
                ? selectedItem
                : item
            );

            return {
              ...product,
              Items: newSelectedItems,
            };
          }
          return product;
        });

        return {
          cart: {
            ...state.cart,
            Items: newItems,
            AmountDue: calculateCartTotal(newItems),
            SubTotal: calculateCartTotal(newItems),
            DiscountOrderAmount: 0,
            DiscountLineAmount: 0
          }
        };
      });
    },

    removeCartProduct: (productId) => {
      set((state) => {
        const newItems = (state.cart.Items || []).filter(
          (item) => item.MenuItemKey !== productId
        );

        return {
          cart: {
            ...state.cart,
            Items: newItems,
            AmountDue: calculateCartTotal(newItems),
            SubTotal: calculateCartTotal(newItems),
            DiscountOrderAmount: 0,
            DiscountLineAmount: 0
          }
        };
      });
    },
    
    clearCart: () => {
      set(() => ({
        cart: {
          AmountDue: 0,
          SubTotal: 0,
          DiscountOrderAmount: 0,
          DiscountLineAmount: 0,
          Notes: '',
          CallNumber: '',
          OrderType: null,
          PaymentType: 'CREDIT_CARD',
          Items: [],
          PaymentMethod: {
            Key: '',
            PaymentMethodID: 0,
            PaymentName: '',
            Name: '',
            Type: ''
          }
        }
      }));
    },
    
    updateCart: (updatedCart) => {
      set((state) => {
        return {
          cart: {
            ...state.cart,
            ...updatedCart
          }
        };
      });
    }
  }))
);
