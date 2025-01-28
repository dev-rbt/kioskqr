"use client";

import { motion } from 'framer-motion';
import { DollarSign, Euro, PoundSterling } from 'lucide-react';

const exchangeRates = {
  USD: 0.0316, // 1 TRY = 0.0316 USD
  EUR: 0.0291, // 1 TRY = 0.0291 EUR
  GBP: 0.0249  // 1 TRY = 0.0249 GBP
};

interface CurrencyDisplayProps {
  amount: number;
}

export function CurrencyDisplay({ amount }: CurrencyDisplayProps) {
  const currencies = [
    { code: 'USD', symbol: '$', icon: DollarSign, rate: exchangeRates.USD },
    { code: 'EUR', symbol: '€', icon: Euro, rate: exchangeRates.EUR },
    { code: 'GBP', symbol: '£', icon: PoundSterling, rate: exchangeRates.GBP }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-3 gap-4 max-w-xl mx-auto"
    >
      {currencies.map(({ code, symbol, icon: Icon, rate }, index) => (
        <motion.div
          key={code}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative group"
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500" />
          
          {/* Card content */}
          <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4 text-primary/70" />
              <span className="text-sm font-medium text-gray-400">{code}</span>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {symbol}{(amount * rate).toFixed(2)}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}