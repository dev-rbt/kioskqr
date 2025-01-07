"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { CreditCard, CheckCircle, Wifi } from 'lucide-react';
import { PaymentStatusRing } from './status/payment-status-ring';
import { PaymentStatusIcon } from './status/payment-status-icon';
import { PaymentStatusSteps } from './status/payment-status-steps';
import { PaymentStatusMessage } from './status/payment-status-message';

export function PaymentStatus() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsConnected(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative"
    >
      {/* Connection Animation */}
      <AnimatePresence>
        {!isConnected && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="relative"
            >
              <Wifi className="w-16 h-16 text-primary" />
              <motion.div
                className="absolute inset-0"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <Wifi className="w-16 h-16 text-primary" />
              </motion.div>
            </motion.div>
            <p className="text-lg font-medium text-muted-foreground">
              POS Cihazına Bağlanılıyor...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-12">
        {/* Status Icon */}
        <PaymentStatusIcon />

        {/* Status Ring */}
        <PaymentStatusRing />

        {/* Status Message */}
        <PaymentStatusMessage />

        {/* Status Steps */}
        <PaymentStatusSteps isConnected={isConnected} />
      </div>
    </motion.div>
  );
}
