"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { ProductImage } from './product-card/product-image';
import { ProductPrice } from './product-card/product-price';
import { AddToCartButton } from './product-card/add-to-cart-button';
import { Badge } from '@/components/ui/badge';
import { UtensilsCrossed, Check, Clock } from 'lucide-react';
import Link from 'next/link';
import { OrderType, Product } from '@/types/branch';
import { useState } from 'react';
import useBranchStore from '@/store/branch';
import { useCartStore } from '@/store/cart';
import { v4 as uuidv4 } from 'uuid';

interface ProductCardProps {
  product: Product;
  categoryId: string;
  index: number;
}

export function ProductCard({ product, categoryId, index}: ProductCardProps) {
  const [showAddedAnimation, setShowAddedAnimation] = useState(false);
  const {branchData, selectedLanguage, t, selectedOrderType} = useBranchStore();
  const {addCartProduct} = useCartStore();
  let productTranslation = product.Translations?.[selectedLanguage?.Key || 'en-US'];
  
  // Get Turkish translation as fallback
  const turkishTranslation = product.Translations?.[branchData?.Languages.find(language => language.Code.toLowerCase() === 'tr')?.Key || 'en-US'];
  const handleAddToCart = () => {
    setShowAddedAnimation(true);
    addCartProduct({
      TransactionKey: uuidv4(),
      MenuItemKey: product.ProductID,
      MenuItemText: productTranslation?.Name || product.OriginalName,
      Price: selectedOrderType == OrderType.DELIVERY ? product.DeliveryPrice : product.TakeOutPrice,
      Quantity: 1,
      TaxPercent: product.TaxPercent,
      OrderByWeight: product.OrderByWeight,
      DiscountLineAmount: 0,
      DiscountCashAmount: 0,
      DiscountOrderAmount: 0,
      Notes: '',
      IsMainCombo: false,
      Items: []
    });
    setTimeout(() => {
      setShowAddedAnimation(false);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="group h-[440px] "
    >
      <div className="relative h-full ">
        {/* Enhanced Glow Effect */}
        <div 
          className="absolute -inset-0.5 rounded-2xl blur opacity-0 group-hover:opacity-80 transition duration-500" 
          style={{
            background: `linear-gradient(to right, ${branchData?.SecondColor}, ${branchData?.SecondColor})`
          }}
        />
        
        {/* Main Card */}
        <Card 
          className="relative h-full flex flex-col overflow-hidden transition-all duration-300 border-2 border-transparent hover:border-[var(--border-color)] rounded-xl"
          style={{ 
            backgroundColor: 'white',
            ['--border-color' as any]: 'transparent'
          }}
        >
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
                  <p className="font-medium text-lg">{t.common.addedToCart}</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Image Section - Reduced height */}
          <div className="relative h-[180px]">
            <ProductImage 
              imageUrl={productTranslation?.ImageUrl || turkishTranslation?.ImageUrl} 
              alt={productTranslation?.Name || product.OriginalName} 
            />
            <ProductPrice price={selectedOrderType == OrderType.DELIVERY ? product.DeliveryPrice : product.TakeOutPrice} />
            {product.IsCombo && (
              <Badge 
                className="absolute top-4 left-4 text-primary-foreground gap-1.5"
                variant="secondary"
                style={{ color: 'white', backgroundColor: branchData?.SecondColor }}
              >
                <UtensilsCrossed className="h-3.5 w-3.5" />
                {t.common.menu}
              </Badge>
            )}
          </div>

          {/* Content Section */}
          <div className="flex flex-col flex-1 p-3">
            {/* Title */}
            <h3 className="text-lg font-bold line-clamp-2 min-h-[48px] mb-2"
                style={{ color: branchData?.SecondColor || 'inherit' }}>
              {productTranslation?.Name || product.OriginalName}
            </h3>

            {/* Description */}
            {productTranslation?.Description && (
              <p className="text-sm line-clamp-3 min-h-[48px] mb-2"
                 style={{ color: branchData?.SecondColor || 'inherit' }}>
                {productTranslation.Description}
              </p>
            )}

            {/* Meta Info Row */}
            <div className="flex items-center gap-3 mb-3 text-sm"
                 style={{ color: branchData?.SecondColor || 'inherit' }}>
              {product.PreperationTime > 0 && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{product.PreperationTime} {t.product.minutes}</span>
                </div>
              )}
            </div>

            {/* Add to Cart Button */}
            <div className="mt-auto">
              {product.IsCombo ? (
                <Link href={`/${branchData?.BranchID}/product/${categoryId}/${product.ProductID}`} className="block">
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
