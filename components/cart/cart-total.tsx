"use client";

import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import useBranchStore from "@/store/branch";
import { useCartStore } from "@/store/cart";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export function CartTotal() {
  const { cart } = useCartStore();
  const { t } = useBranchStore();
  const params = useParams();
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-6 border-t space-y-4"
    >
      <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <ShoppingBag className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t.common.total}</p>
            <Price amount={cart.AmountDue} className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent" />
          </div>
        </div>
      </div>
      <Button 
        size="lg" 
        className="w-full h-12 text-lg gap-2 group"
        onClick={() => router.push(`/${params?.branchId}/payment`)}
      >
        {t.common.placeOrder}
        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </Button>
    </motion.div>
  );
}
