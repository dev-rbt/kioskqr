"use client";

import { PriceTag } from '@/components/ui/price-tag';
import { motion } from 'framer-motion';

interface ProductPriceProps {
  price: number;
}

export function ProductPrice({ price }: ProductPriceProps) {
  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="absolute bottom-4 right-4 z-20"
    >
      <PriceTag amount={price} />
    </motion.div>
  );
}
