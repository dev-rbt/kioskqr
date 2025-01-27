"use client";

import { Button } from '@/components/ui/button';
import { Price } from '@/components/ui/price';
import { Plus } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useRouter } from 'next/navigation';
import { CartProduct } from '@/types/cart';
import useBranchStore from '@/store/branch';

interface AddToCartProps {
  product: CartProduct;
}

export function AddToCart({ product }: AddToCartProps) {
  const {addCartProduct} = useCartStore();
  const {t} = useBranchStore();
  const router = useRouter();

  const handleAddToCart = () => {
    addCartProduct(product);
    router.push(`/category/${product.categoryId}`);
  };

  return (
    <div className="flex items-center justify-between pt-4 border-t">
      <Price amount={product.Price || 0} className="text-2xl" />
      <Button 
        onClick={handleAddToCart} 
        size="lg" 
        className="hover:scale-105 transition-transform"
      >
        <Plus className="h-4 w-4 mr-2" />
        {t.common.addToCart}
      </Button>
    </div>
  );
}
