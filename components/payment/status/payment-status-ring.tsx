"use client";

import { motion } from 'framer-motion';

export function PaymentStatusRing() {
  return (
    <div className="relative w-48 h-48 mx-auto">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="absolute inset-0 rounded-full border-4 border-orange-500/30"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{
            duration: 2,
            delay: index * 0.4,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'conic-gradient(from 0deg, #f97316 0%, transparent 60%)'
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
}
