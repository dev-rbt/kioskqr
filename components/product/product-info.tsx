"use client";

import { Star } from 'lucide-react';
import { ProductBadge } from '@/components/ui/product-badge';
import { Price } from '@/components/ui/price';
import { OrderType, Product } from '@/types/branch';
import useBranchStore from '@/store/branch';

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const {selectedOrderType, t} = useBranchStore();
  return (
    <div className="space-y-4">
      {/* Rating */}
      {product.Rating && (
        <div className="flex items-center gap-1 text-yellow-500">
          <Star className="h-5 w-5 fill-current" />
          <span className="font-medium text-lg">{product.Rating}</span>
        </div>
      )}

      {/* Price */}
      <div>
        <Price 
          amount={(selectedOrderType == OrderType.DELIVERY) ? product.DeliveryPrice : product.TakeOutPrice} 
          className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"
        />
        {product.IsCombo && (
          <p className="text-sm text-muted-foreground mt-1">
            {t.product.priceVariesBySelection}
          </p>
        )}
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {product.PreperationTime && (
          <ProductBadge icon="time" value={`${product.PreperationTime} ${t.product.minutes.toLowerCase()}`} />
        )}
        {product.Calories && (
          <ProductBadge icon="calories" value={`${product.Calories} ${t.product.calories.toLowerCase()}`} />
        )}

    
        {/* {product.isSpicy && (
          <ProductBadge 
            icon="spicy" 
            value="Acılı" 
            className="bg-red-100 text-red-700" 
          />
        )}
        {product.isVegetarian && (
          <ProductBadge 
            icon="vegetarian" 
            value="Vejetaryen" 
            className="bg-green-100 text-green-700" 
          />
        )} */}
      </div>
    </div>
  );
}
