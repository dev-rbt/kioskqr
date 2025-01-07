"use client";

import { useMenuStore } from '@/store/menu';
import { ProductHeader } from '@/components/product/product-header';
import { ProductImage } from '@/components/product/product-image';
import { ProductInfo } from '@/components/product/product-info';
import { ProductIngredients } from '@/components/product/product-ingredients';
import { ProductAllergens } from '@/components/product/product-allergens';
import { ComboSelector } from '@/components/combo/combo-selector';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { notFound } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { useRouter } from 'next/navigation';
import { ComboSelections } from '@/types/combo';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export default function ProductContent({ params }: { params: { id: string } }) {
  const { products, isLoading, error } = useMenuStore();
  const addToCart = useCartStore((state) => state.addItem);
  const router = useRouter();
  const product = products.find((p) => p.id === params.id);

  if (error) {
    return (
      <div className="container mx-auto px-4 pt-40 text-center">
        <h1 className="text-2xl font-bold text-red-500">{error}</h1>
        <p className="text-muted-foreground mt-2">Lütfen daha sonra tekrar deneyin.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 pt-40">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="h-[400px] rounded-lg" />
          <div className="space-y-6">
            <div>
              <Skeleton className="h-10 w-3/4 mb-4" />
              <Skeleton className="h-4 w-1/4 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-8 w-24" />
              ))}
            </div>
            <Skeleton className="h-[100px]" />
            <Skeleton className="h-[100px]" />
            <Skeleton className="h-16" />
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    notFound();
  }

  const handleComboAddToCart = (selections: ComboSelections) => {
    addToCart({
      ...product,
      comboSelections: selections
    });
    router.push(`/category/${product.category}`);
  };

  return (
    <motion.main
      className="container mx-auto px-4 pt-40 pb-24"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <ProductHeader categoryId={product.category} />
      </motion.div>
      
      <div className="grid md:grid-cols-2 gap-8 mt-6">
        <motion.div variants={itemVariants}>
          <ProductImage image={product.image} name={product.name} />
        </motion.div>
        
        <motion.div className="space-y-6" variants={itemVariants}>
          <ProductInfo product={product} />
          
          {product.ingredients && (
            <ProductIngredients ingredients={product.ingredients} />
          )}

          {product.allergens && (
            <ProductAllergens allergens={product.allergens} />
          )}
          
          {product.isCombo && product.Combo ? (
            <div className="border-t pt-6">
              <h2 className="text-2xl font-bold mb-6">Menü Seçimleri</h2>
              <ComboSelector
                groups={product.Combo}
                basePrice={product.price}
                onAddToCart={handleComboAddToCart}
              />
            </div>
          ) : (
            <div className="sticky bottom-0 bg-background/95 backdrop-blur-lg border-t p-4">
              <Button 
                className="w-full gap-2" 
                size="lg"
                onClick={() => {
                  addToCart(product);
                  router.push(`/category/${product.category}`);
                }}
              >
                <ShoppingCart className="h-4 w-4" />
                Sepete Ekle ({product.price} ₺)
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </motion.main>
  );
}
