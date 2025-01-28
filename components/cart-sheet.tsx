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
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div className={className}>
          {children || (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              {/* Animated background blob */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Button content */}
              <div className="relative bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-300 px-4 py-3 rounded-xl flex items-center gap-3">
                {/* Icon container with glow effect */}
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur group-hover:blur-md transition-all" />
                  <div className="relative w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ShoppingBag className="h-5 w-5 text-primary group-hover:rotate-12 transition-transform" />
                  </div>
                </div>

                {/* Product count badge */}
                <AnimatePresence>
                  {productCount > 0 && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 text-sm font-semibold flex items-center justify-center shadow-lg ring-2 ring-background"
                    >
                      {productCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>
          )}
        </div>
      </SheetTrigger>

      <SheetContent
        className="flex flex-col h-full w-full sm:max-w-lg z-[60] bg-gradient-to-br from-background via-background/98 to-background/95 border-l-0 shadow-2xl"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader className="space-y-4 pb-6 border-b relative overflow-hidden">
          {/* Decorative background patterns */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('/patterns/topography.svg')] bg-repeat opacity-5" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
          </div>

          {/* Header content */}
          <div className="relative space-y-1">
            <SheetTitle className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {t.common.cart}
              </span>
            </SheetTitle>
            <div className="flex items-center gap-2">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center justify-center bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide"
              >
                {productCount}
              </motion.span>
              <span className="text-sm text-muted-foreground/90">
                {t.common.products.toLowerCase()}
              </span>
            </div>
          </div>
        </SheetHeader>

        {/* Cart content with custom scrollbar */}
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

        {/* Cart total with slide-up animation */}
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