"use client";

import { motion } from 'framer-motion';
import { CreditCard } from 'lucide-react';

const pulseVariants = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export function PaymentStatusIcon() {
  return (
    <div className="relative">
      <motion.div
        variants={pulseVariants}
        animate="animate"
        className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-full blur-xl"
      />
      <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, rgba(255,255,255,0.2) 0%, transparent 60%)'
          }}
        />
        <CreditCard className="w-16 h-16 text-white" />
      </div>
    </div>
  );
}
