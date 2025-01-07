"use client";

import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface PaymentStatusStepsProps {
  isConnected: boolean;
}

export function PaymentStatusSteps({ isConnected }: PaymentStatusStepsProps) {
  return (
    <motion.div 
      className="space-y-4 max-w-xs mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <motion.div 
        className="flex items-center gap-3 text-sm"
        animate={isConnected ? { opacity: 1 } : { opacity: 0.5 }}
      >
        <CheckCircle className="w-5 h-5 text-green-500" />
        <span className="text-muted-foreground">Bağlantı kuruldu</span>
      </motion.div>
      
      <div className="flex items-center gap-3 text-sm">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full"
        />
        <span className="text-muted-foreground">İşlem devam ediyor</span>
      </div>

      <motion.div
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 30 }}
        className="h-1 bg-orange-500/20 rounded-full overflow-hidden"
      >
        <motion.div
          className="h-full bg-orange-500"
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{ duration: 30, ease: "linear" }}
        />
      </motion.div>
    </motion.div>
  );
}
