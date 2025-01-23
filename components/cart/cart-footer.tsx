"use client";

import { CartSheet } from '@/components/cart-sheet';
import { useCartStore } from '@/store/cart';
import { motion } from 'framer-motion';
import { Price } from '../ui/price';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import {  usePathname } from 'next/navigation';
import useBranchStore from '@/store/branch';

export function CartFooter() {
  const { cart, clearCart } = useCartStore();
  const { branchData, selectedLanguage, t } = useBranchStore();
  const pathname = usePathname();
  
  const hasItems = cart.Items.length > 0;
  const isProductDetail = pathname?.startsWith('/product/');

  // Don't show footer if there are no items or if we're on product detail page
  if (!hasItems || isProductDetail || !branchData || !selectedLanguage) return null;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t p-4"
    >
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="destructive"
            size="lg"
            onClick={clearCart}
            className="gap-2"
          >
            <Trash2 className="w-5 h-5" />
            <span>{t.common.clearCart}</span>
          </Button>
          <CartSheet>
            <Button size="lg" className="gap-2">
              <ShoppingBag className="w-5 h-5" />
              <span>{t.common.showCart} ({cart.Items.length} {t.common.product})</span>
            </Button>
          </CartSheet>
          <div>
            <p className="text-sm text-muted-foreground">{t.common.total}</p>
            <Price amount={cart.AmountDue} className="text-xl font-bold" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
