"use client";

import useBranchStore from "@/store/branch";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

export function CartEmpty() {
  const { t } = useBranchStore();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-full text-center p-8"
    >
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-24 h-24 mb-6 rounded-full bg-primary/10 flex items-center justify-center"
      >
        <ShoppingCart className="h-12 w-12 text-primary" />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          {t.common.emptyCart}
        </h3>
        <p className="text-muted-foreground text-lg max-w-sm mx-auto">
          {t.common.emptyCartMessage}
        </p>
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      </div>
    </motion.div>
  );
}