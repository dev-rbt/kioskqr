"use client";

import { useMenuStore } from '@/store/menu';
import { ProductCard } from '@/components/product/product-card';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/cart';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect } from 'react';

export default function CategoryContent({ params }: { params: { id: string } }) {
  const { categories, products, isLoading, error, fetchData } = useMenuStore();
  const addToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const category = categories.find((c) => c.id === params.id);
  const categoryProducts = products.filter((product) => product.category === params.id);

  if (error) {
    return (
      <div className="container mx-auto px-8 py-8">
        <h1 className="text-2xl font-bold text-red-500">{error}</h1>
        <p className="text-muted-foreground mt-2">Lütfen daha sonra tekrar deneyin.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <main className="container mx-auto px-8 py-8">
        <Skeleton className="h-12 w-48 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[400px]" />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-8 py-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">{category?.name}</h1>
        <div className="h-1 w-20 bg-primary rounded-full"></div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categoryProducts.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            index={index}
            onAddToCart={addToCart}
          />
        ))}
      </div>
    </main>
  );
}
