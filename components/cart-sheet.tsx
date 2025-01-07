"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCartStore } from "@/store/cart";
import { useLanguageStore } from "@/store/language";
import { ShoppingBag } from 'lucide-react';
import { CartItems } from './cart/cart-items';
import { CartTotal } from './cart/cart-total';
import { CartEmpty } from './cart/cart-empty';
import { motion } from 'framer-motion';

interface CartSheetProps {
  children?: React.ReactNode;
  className?: string;
}

export function CartSheet({ children, className }: CartSheetProps) {
  const { items } = useCartStore();
  const { t } = useLanguageStore();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className={className}>
          {children || (
            <button className="relative bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300 p-2 rounded-lg group">
              <ShoppingBag className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
              {items.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs font-medium flex items-center justify-center shadow-lg"
                >
                  {items.length}
                </motion.span>
              )}
            </button>
          )}
        </div>
      </SheetTrigger>
      <SheetContent className="flex flex-col h-full w-full sm:max-w-lg z-[60] bg-gradient-to-b from-background to-background/95">
        <SheetHeader className="space-y-3 pb-6 border-b relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />
          <div className="relative">
            <SheetTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {t.common.cart}
            </SheetTitle>
            <p className="text-sm text-muted-foreground/90 flex items-center gap-2">
              <span className="inline-flex items-center justify-center bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium">
                {items.length}
              </span>
              {t.common.products.toLowerCase()}
            </p>
          </div>
        </SheetHeader>
        <div className="flex-1 overflow-auto py-6 px-1">
          {items.length === 0 ? (
            <CartEmpty />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <CartItems />
            </motion.div>
          )}
        </div>
        {items.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <CartTotal />
          </motion.div>
        )}
      </SheetContent>
    </Sheet>
  );
}
