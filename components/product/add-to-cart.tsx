"use client";

import { Button } from '@/components/ui/button';
import { Price } from '@/components/ui/price';
import { Plus } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useRouter } from 'next/navigation';
import type { Product } from '@/types';

interface AddToCartProps {
  product: Product;
}

export function AddToCart({ product }: AddToCartProps) {
  const addToCart = useCartStore((state) => state.addItem);
  const router = useRouter();

  const handleAddToCart = () => {
    addToCart(product);
    router.push(`/category/${product.category}`);
  };

  return (
    <div className="flex items-center justify-between pt-4 border-t">
      <Price amount={product.price} className="text-2xl" />
      <Button 
        onClick={handleAddToCart} 
        size="lg" 
        className="hover:scale-105 transition-transform"
      >
        <Plus className="h-4 w-4 mr-2" />
        Sepete Ekle
      </Button>
    </div>
  );
}
