"use client";

import Link from 'next/link';
import type { Product } from '@/types';

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="mb-4">
      <Link href={`/product/${product.id}`}>
        <div className="relative group/name">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 blur-xl rounded-xl opacity-0 group-hover/name:opacity-100 transition-opacity" />
          <div className="relative bg-gradient-to-r from-background/95 to-background/90 backdrop-blur-md border border-primary/10 rounded-xl p-4 group-hover/name:border-primary/30 transition-all">
            <h2 className="text-xl font-bold bg-gradient-to-br from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent group-hover/name:from-primary group-hover/name:to-primary/80 transition-all duration-300 line-clamp-2">
              {product.name}
            </h2>
          </div>
        </div>
      </Link>
      <p className="mt-3 text-muted-foreground/90 text-sm leading-relaxed line-clamp-2">
        {product.description}
      </p>
    </div>
  );
}
