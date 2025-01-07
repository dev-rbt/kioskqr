"use client";

import { CartSheet } from '@/components/cart-sheet';
import { useCartStore } from '@/store/cart';
import { useLanguageStore } from '@/store/language';
import { motion } from 'framer-motion';
import { Price } from '../ui/price';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { useRouter, usePathname } from 'next/navigation';

export function CartFooter() {
  const { items, total } = useCartStore();
  const { t } = useLanguageStore();
  const router = useRouter();
  const pathname = usePathname();
  const hasItems = items.length > 0;
  const isProductDetail = pathname?.startsWith('/menu/product/');

  // Don't show footer if there are no items or if we're on product detail page
  if (!hasItems || isProductDetail) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[50] bg-background/95 backdrop-blur-lg border-t shadow-lg">
      <CartSheet>
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="h-20 flex items-center justify-between gap-4">
            {/* Cart Info */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center relative">
                <ShoppingBag className="h-6 w-6 text-primary" />
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {items.length}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t.common.total}</p>
                <Price amount={total} className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent" />
              </div>
            </div>

            {/* Order Button */}
            <Button 
              size="lg" 
              className="h-12 px-6 gap-2 text-base group"
              onClick={() => router.push('/payment')}
            >
              {t.common.placeOrder}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </CartSheet>
    </div>
  );
}
