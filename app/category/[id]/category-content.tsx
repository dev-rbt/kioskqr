"use client";

import { useMenuStore } from '@/store/menu';
import { ProductCard } from '@/components/product/product-card';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/cart';
import { Skeleton } from '@/components/ui/skeleton';

export default function CategoryContent({ params }: { params: { id: string } }) {
  const { categories, products, isLoading, error } = useMenuStore();
  const addToCart = useCartStore((state) => state.addItem);

  const category = categories.find((c) => c.id === params.id);
  const categoryProducts = products.filter((product) => product.category === params.id);

  if (error) {
    return (
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-2xl font-bold text-red-500">{error}</h1>
        <p className="text-muted-foreground mt-2">Lütfen daha sonra tekrar deneyin.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <main className="container mx-auto px-4">
        <Skeleton className="h-12 w-48 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[400px]" />
          ))}
        </div>
      </main>
    );
  }

  return (
    <div className="relative min-h-screen pt-20">
      <main className="container relative mx-auto px-4">
        {/* Category Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary/90 to-primary/70 bg-clip-text text-transparent">
              {category?.name}
            </h1>
            <div className="h-1 w-20 bg-primary/20 rounded-full mx-auto" />
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </div>
  );
}
