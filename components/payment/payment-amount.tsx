"use client";

import { Translation } from '@/lib/i18n';
import { motion } from 'framer-motion';

export function PaymentAmount({ amount, t }: { amount: number,  t: Translation }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-orange-50 rounded-xl p-6 text-center"
    >
      <div className="text-sm text-muted-foreground mb-2">
        {t.common.amountDue}
      </div>
      <div className="text-4xl font-bold text-orange-500">
        {amount.toFixed(2)} TL
      </div>
    </motion.div>
  );
}
