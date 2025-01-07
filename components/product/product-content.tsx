"use client";

import { useMenuStore } from '@/store/menu';
import { ProductHeader } from '@/components/product/product-header';
import { ProductImage } from '@/components/product/product-image';
import { ProductInfo } from '@/components/product/product-info';
import { ProductIngredients } from '@/components/product/product-ingredients';
import { ProductAllergens } from '@/components/product/product-allergens';
import { ComboSelector } from '@/components/combo/combo-selector';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { notFound } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { useRouter } from 'next/navigation';
import { ComboSelections } from '@/types/combo';
import { ShoppingCart, Check, UtensilsCrossed } from 'lucide-react';
import { useLanguageStore } from '@/store/language';
import { containerVariants, itemVariants } from './animations';
import { useState } from 'react';
import type { Product } from '@/types';

export default function ProductContent({ params }: { params: { id: string } }) {
  const { products, isLoading, error } = useMenuStore();
  const addToCart = useCartStore((state) => state.addItem);
  const { t } = useLanguageStore();
  const router = useRouter();
  const [showAddedAnimation, setShowAddedAnimation] = useState(false);
  
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    notFound();
  }

  const handleComboAddToCart = (selections: ComboSelections) => {
    // Create a new product object with combo selections
    const comboProduct: Product = {
      ...product,
      comboSelections: selections
    };
    
    // Show animation
    setShowAddedAnimation(true);

    // Add to cart after a short delay
    setTimeout(() => {
      addToCart(comboProduct);
      
      // Navigate after animation
      setTimeout(() => {
        router.push(`/menu/category/${product.category}`);
      }, 500);
    }, 200);
  };

  const handleAddToCart = () => {
    setShowAddedAnimation(true);
    
    setTimeout(() => {
      addToCart(product);
      router.push(`/menu/category/${product.category}`);
    }, 700);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 pt-40 text-center">
        <h1 className="text-2xl font-bold text-red-500">{error}</h1>
        <p className="text-muted-foreground mt-2">{t.common.tryAgain}</p>
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
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-[200px]" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <motion.main
      className="container mx-auto px-4 pt-40 pb-24"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Added to Cart Animation */}
      <AnimatePresence>
        {showAddedAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-primary/95 text-primary-foreground p-8 rounded-2xl flex flex-col items-center gap-4 max-w-sm mx-4"
            >
              <div className="rounded-full bg-white/20 p-4">
                {product.isCombo ? (
                  <UtensilsCrossed className="w-12 h-12" />
                ) : (
                  <Check className="w-12 h-12" />
                )}
              </div>
              <h3 className="text-2xl font-bold text-center">{product.name}</h3>
              <p className="text-lg text-center text-primary-foreground/90">
                {product.isCombo 
                  ? "Menü başarıyla sepete eklendi!"
                  : "Ürün sepete eklendi!"}
              </p>
              <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
                <ShoppingCart className="w-4 h-4" />
                <span>Sepetinize eklendi</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={itemVariants}>
        <ProductHeader categoryId={product.category} />
      </motion.div>
      
      <div className="mt-6 max-w-6xl mx-auto">
        <div className="space-y-8">
          <motion.div variants={itemVariants}>
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
              <div className="grid lg:grid-cols-2 gap-8 items-start p-6">
                <div className="relative">
                  <ProductImage image={product.image} name={product.name} />
                  <div className="absolute top-4 right-4 bg-primary/90 text-primary-foreground px-4 py-2 rounded-full font-bold shadow-lg">
                    {product.price} ₺
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h1 className="text-4xl font-bold">{product.name}</h1>
                    <p className="text-lg text-muted-foreground">
                      {product.description}
                    </p>
                  </div>
                  
                  <ProductInfo product={product} />
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    {product.ingredients && (
                      <div className="bg-secondary/10 rounded-xl p-4">
                        <ProductIngredients ingredients={product.ingredients} />
                      </div>
                    )}
                    {product.allergens && (
                      <div className="bg-secondary/10 rounded-xl p-4">
                        <ProductAllergens allergens={product.allergens} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {product.isCombo && product.Combo ? (
            <motion.div variants={itemVariants}>
              <div className="mt-12 bg-secondary/20 rounded-2xl p-6 sm:p-8">
                <h2 className="text-3xl font-bold mb-8 text-center">
                  {t.product.menuSelections}
                </h2>
                <ComboSelector
                  groups={product.Combo}
                  basePrice={product.price}
                  onAddToCart={handleComboAddToCart}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div variants={itemVariants} className="sticky bottom-0 bg-background/95 backdrop-blur-lg border-t p-4">
              <Button 
                className="w-full gap-2" 
                size="lg"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4" />
                {t.common.addToCart} ({product.price} ₺)
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.main>
  );
}
