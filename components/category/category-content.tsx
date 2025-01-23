"use client";

import { ProductCard } from '@/components/product/product-card';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/cart';
import { Skeleton } from '@/components/ui/skeleton';
import useBranchStore from '@/store/branch';

interface CategoryContentProps {
  params: { 
    branchId: string;
    categoryId: string;
  }
}

export default function CategoryContent({ params }: CategoryContentProps) {
  const { branchData, selectedLanguage } = useBranchStore();
  const {addItem} = useCartStore();

  if (!branchData || !selectedLanguage) {
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

  const category = branchData.Categories.find(
    (c) => c.CategoryID === params.categoryId
  );

  if (!category) {
    return (
      <div className="container mx-auto px-8 py-8">
        <h1 className="text-2xl font-bold text-red-500">Kategori bulunamadı</h1>
        <p className="text-muted-foreground mt-2">Lütfen geçerli bir kategori seçin.</p>
      </div>
    );
  }

  const translation = category.Translations[selectedLanguage.Key];

  return (
    <main className="container mx-auto px-8 py-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">
          {translation?.Name || category.OriginalName}
        </h1>
        {translation?.Description && (
          <p className="text-muted-foreground mb-4">{translation.Description}</p>
        )}
        <div className="h-1 w-20 bg-primary rounded-full"></div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {category.Products.map((product, index) => {
          return (
            <ProductCard
              key={product.ProductID}
              product={product}
              categoryId={params.categoryId}
              index={index}
            />
          );
        })}
      </div>
    </main>
  );
}
