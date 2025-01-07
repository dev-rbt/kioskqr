"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { ProductImage } from './product-card/product-image';
import { ProductPrice } from './product-card/product-price';
import { ProductInfo } from './product-card/product-info';
import { ProductBadges } from './product-card/product-badges';
import { AddToCartButton } from './product-card/add-to-cart-button';
import { Badge } from '@/components/ui/badge';
import { UtensilsCrossed, Check, Clock } from 'lucide-react';
import Link from 'next/link';
import type { Product } from '@/types';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  index: number;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, index, onAddToCart }: ProductCardProps) {
  const [showAddedAnimation, setShowAddedAnimation] = useState(false);

  const handleAddToCart = () => {
    setShowAddedAnimation(true);
    onAddToCart(product);
    
    setTimeout(() => {
      setShowAddedAnimation(false);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="group h-[440px]" // Reduced card height
    >
      <div className="relative h-full">
        {/* Enhanced Glow Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-primary/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
        
        {/* Main Card */}
        <Card className="relative h-full flex flex-col overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-white/10 hover:border-primary/30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl">
          {/* Added to Cart Animation Overlay */}
          <AnimatePresence>
            {showAddedAnimation && (
              <motion.div
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.3 }}
                className="absolute inset-0 z-50 flex items-center justify-center bg-primary/90 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex flex-col items-center gap-2 text-primary-foreground"
                >
                  <div className="rounded-full bg-white/20 p-3">
                    <Check className="w-8 h-8" />
                  </div>
                  <p className="font-medium text-lg">Sepete Eklendi</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Image Section - Reduced height */}
          <div className="relative h-[180px]">
            <ProductImage product={product} />
            <ProductPrice price={product.price} />
            {product.isCombo && (
              <Badge 
                className="absolute top-4 left-4 bg-primary text-primary-foreground gap-1.5"
                variant="secondary"
              >
                <UtensilsCrossed className="h-3.5 w-3.5" />
                Menü
              </Badge>
            )}
          </div>

          {/* Content Section - Optimized spacing */}
          <div className="flex flex-col flex-1 p-3">
            {/* Title - 2 lines */}
            <h3 className="text-lg font-bold line-clamp-2 min-h-[48px] mb-2">
              {product.name}
            </h3>

            {/* Description - 3 lines */}
            <p className="text-sm text-muted-foreground line-clamp-3 min-h-[48px] mb-2">
              {product.description}
            </p>

            {/* Meta Info Row */}
            <div className="flex items-center justify-between mb-2">
              {/* Prep Time */}
              {product.prepTime && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{product.prepTime} dk</span>
                </div>
              )}

              {/* Badges */}
              <div className="flex gap-2">
                <ProductBadges product={product} />
              </div>
            </div>

            {/* Button Section */}
            <div className="mt-auto pt-2">
              {product.isCombo ? (
                <Link href={`/menu/product/${product.id}`} className="block">
                  <AddToCartButton onClick={() => {}} isCombo={true} />
                </Link>
              ) : (
                <AddToCartButton onClick={handleAddToCart} />
              )}
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
