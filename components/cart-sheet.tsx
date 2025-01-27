"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCartStore } from "@/store/cart";
import { ShoppingBag } from 'lucide-react';
import { CartItems } from './cart/cart-items';
import { CartTotal } from './cart/cart-total';
import { CartEmpty } from './cart/cart-empty';
import { motion, AnimatePresence } from 'framer-motion';
import useBranchStore from "@/store/branch";
import { useState } from 'react';

interface CartSheetProps {
  children?: React.ReactNode;
  className?: string;
}

export function CartSheet({ children, className }: CartSheetProps) {
  const { cart } = useCartStore();
  const { t } = useBranchStore();
  const productCount = cart.Items.length;
  const [isOpen, setIsOpen] = useState(true);


  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className={className}>
          {children || (
            <button className="relative bg-primary/10 hover:bg-primary/20 border-2 border-primary/20 hover:border-primary/30 transition-all duration-300 p-2.5 rounded-xl group">
              <ShoppingBag className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
              <AnimatePresence>
                {productCount > 0 && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs font-semibold flex items-center justify-center shadow-lg ring-2 ring-background"
                  >
                    {productCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          )}
        </div>
      </SheetTrigger>
      <SheetContent
        className="flex flex-col h-full w-full sm:max-w-lg z-[60] bg-gradient-to-br from-background via-background/98 to-background/95 border-l-0 shadow-2xl"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader className="space-y-4 pb-6 border-b relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-primary/5 to-transparent opacity-50" />
          <div className="relative space-y-1">
            <SheetTitle className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {t.common.cart}
              </span>
            </SheetTitle>
            <p className="text-sm text-muted-foreground/90 flex items-center gap-2">
              <span className="inline-flex items-center justify-center bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide">
                {productCount}
              </span>
              {t.common.products.toLowerCase()}
            </p>
          </div>
        </SheetHeader>

        <motion.div
          className="flex-1 overflow-auto py-6 px-1 custom-scrollbar"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {productCount === 0 ? (
              <CartEmpty />
            ) : (
              <motion.div
                key="cart-items"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CartItems />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {productCount > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t bg-gradient-to-t from-background to-transparent pt-4"
            >
              <CartTotal />
            </motion.div>
          )}
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  );
}
