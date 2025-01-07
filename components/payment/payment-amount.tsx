"use client";

import { motion } from 'framer-motion';

export function PaymentAmount({ amount }: { amount: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-orange-50 rounded-xl p-6 text-center"
    >
      <div className="text-sm text-muted-foreground mb-2">
        Ödenecek Tutar
      </div>
      <div className="text-4xl font-bold text-orange-500">
        {amount.toFixed(2)} TL
      </div>
    </motion.div>
  );
}
