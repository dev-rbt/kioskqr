"use client";

import { motion } from 'framer-motion';
import { UtensilsCrossed } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import useBranchStore from '@/store/branch';

export function SidebarLogo() {
  const { branchData,t  } = useBranchStore();

  return (
    <Link href="#">
      <motion.div 
        className="p-6 border-b flex items-center gap-4 group"
        whileHover={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}
      >
        {branchData?.LogoUrl ? (
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform relative overflow-hidden">
            <Image
              src={branchData.LogoUrl}
              alt={branchData.BranchName}
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <UtensilsCrossed className="w-6 h-6 text-primary" />
          </div>
        )}
        <div>
          <h1 className="text-xl font-bold">{branchData?.BranchName || 'Restoran'}</h1>
          <p className="text-xs text-muted-foreground">{t.common.digitalMenu}</p>
        </div>
      </motion.div>
    </Link>
  );
}
