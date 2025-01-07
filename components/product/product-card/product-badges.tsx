"use client";

import { ProductBadge, BadgeIcon } from '@/components/ui/product-badge';
import { motion } from 'framer-motion';
import type { Product } from '@/types';

interface ProductBadgesProps {
  product: Product;
}

export function ProductBadges({ product }: ProductBadgesProps) {
  const badges = [
    product.isSpicy ? {
      icon: "spicy" as BadgeIcon,
      value: "Acılı",
      className: "bg-red-500/10 text-red-600 backdrop-blur-md border border-red-200/30 hover:bg-red-500/20 transition-colors"
    } : null,
    product.isVegetarian ? {
      icon: "vegetarian" as BadgeIcon,
      value: "Vejetaryen",
      className: "bg-green-500/10 text-green-600 backdrop-blur-md border border-green-200/30 hover:bg-green-500/20 transition-colors"
    } : null
  ].filter((badge): badge is { icon: BadgeIcon; value: string; className: string } => badge !== null);

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge, index) => (
        <motion.div
          key={badge.value}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="group/badge"
        >
          <ProductBadge
            {...badge}
            className={`${badge.className} hover:scale-105 active:scale-95 transition-transform cursor-default`}
          />
        </motion.div>
      ))}
    </div>
  );
}
