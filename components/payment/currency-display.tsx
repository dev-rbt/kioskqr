"use client";

import { motion } from 'framer-motion';

const exchangeRates = {
  USD: 0.0316,
  EUR: 0.0291,
  GBP: 0.0249
};

interface CurrencyDisplayProps {
  amount: number;
}

export function CurrencyDisplay({ amount }: CurrencyDisplayProps) {
  return (
    <div className="grid grid-cols-3 gap-4 mt-6">
      {Object.entries(exchangeRates).map(([currency, rate]) => (
        <motion.div
          key={currency}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 rounded-xl p-4"
        >
          <div className="text-2xl font-bold">
            {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£'}
            {(amount * rate).toFixed(2)}
          </div>
          <div className="text-sm text-white/80">{currency}</div>
        </motion.div>
      ))}
    </div>
  );
}
