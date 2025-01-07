"use client";

import { motion } from 'framer-motion';
import { UtensilsCrossed } from 'lucide-react';
import Link from 'next/link';

export function SidebarLogo() {
  return (
    <Link href="/menu">
      <motion.div 
        className="p-6 border-b flex items-center gap-4 group"
        whileHover={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}
      >
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
          <UtensilsCrossed className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Lezzet Restoran</h1>
          <p className="text-xs text-muted-foreground">Dijital Menü</p>
        </div>
      </motion.div>
    </Link>
  );
}
