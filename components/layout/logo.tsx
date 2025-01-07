"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

export function Logo() {
  return (
    <Link href="/" className="group">
      <motion.div 
        className="flex flex-col items-start"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Brand Name */}
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
          Lezzet Restoran
        </h1>
        <div className="text-[11px] text-white/70 font-medium tracking-wider">
          DİJİTAL MENÜ
        </div>
      </motion.div>
    </Link>
  );
}
