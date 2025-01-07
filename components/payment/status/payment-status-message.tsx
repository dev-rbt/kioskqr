"use client";

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function PaymentStatusMessage() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-3 text-center">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent"
      >
        Ödeme Bekleniyor{dots}
      </motion.h2>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col items-center gap-2"
      >
        <div className="px-4 py-2 bg-gradient-to-r from-orange-100 to-orange-50 text-orange-600 rounded-full text-sm font-medium">
          CREDIT CARD
        </div>
        <p className="text-sm text-muted-foreground max-w-[250px]">
          Lütfen kartınızı pos cihazından çekmeyiniz
        </p>
      </motion.div>
    </div>
  );
}
