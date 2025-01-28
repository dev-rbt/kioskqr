"use client";

import { CartSheet } from '@/components/cart-sheet';
import { useCartStore } from '@/store/cart';
import { motion } from 'framer-motion';
import { Price } from '../ui/price';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { usePathname } from 'next/navigation';
import useBranchStore from '@/store/branch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
      className="fixed bottom-0 left-0 right-0 z-50"
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-transparent -top-20 pointer-events-none" />
      
      {/* Main content */}
      <div className="relative bg-card border-t shadow-2xl p-4">
        <div className="container flex items-center justify-between gap-4">
          {/* Clear cart button with confirmation */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="lg"
                className="gap-2 hover:scale-105 transition-transform"
              >
                <Trash2 className="w-5 h-5" />
                <span className="hidden sm:inline">{t.common.clearCart}</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t.common.clearCart}</AlertDialogTitle>
                <AlertDialogDescription>
                  Bu işlem sepetinizdeki tüm ürünleri silecektir. Devam etmek istiyor musunuz?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>İptal</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={clearCart}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Sepeti Boşalt
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Cart info and show cart button */}
          <div className="flex items-center gap-4">
            <CartSheet>
              <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                <ShoppingBag className="w-5 h-5" />
                <span>
                  {t.common.showCart} ({cart.Items.length} {t.common.product})
                </span>
              </Button>
            </CartSheet>
            
            {/* Total amount */}
            <div className="text-right">
              <p className="text-sm text-muted-foreground">{t.common.total}</p>
              <Price 
                amount={cart.AmountDue} 
                className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent" 
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}