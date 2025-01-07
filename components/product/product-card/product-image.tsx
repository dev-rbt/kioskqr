"use client";

import type { Product } from '@/types';

interface ProductImageProps {
  product: Product;
}

export function ProductImage({ product }: ProductImageProps) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
    </div>
  );
}
