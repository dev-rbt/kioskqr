"use client";

import { CategoryCard } from '@/components/home/category-card';
import useBranchStore from '@/store/branch';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { HeroSlider } from './hero-slider';

export default function HomeContent() {
  const { branchData, isLoading, error,t } = useBranchStore();

  if (error) {
    return (
      <div className="container mx-auto px-4 pt-40 text-center">
        <h1 className="text-2xl font-bold text-red-500">{error}</h1>
        <p className="text-muted-foreground mt-2">Lütfen daha sonra tekrar deneyin.</p>
      </div>
    );
  }

  if (isLoading || !branchData) {
    return (
      <main className="container mx-auto px-4 pt-40 ">
        <Skeleton className="h-12 w-48 mx-auto mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative w-full h-[500px] bg-white overflow-hidden">
        <HeroSlider banners={branchData.Banners}/>
      </div>

      {/* Categories Section */}
      <div className="container mx-auto px-4 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-3">{t.common.categories}</h2>
          <div className="h-1 w-20 bg-primary rounded-full mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {branchData.Categories.map((category, index) => (
            <CategoryCard key={category.CategoryID} category={category} index={index} branchId={branchData.BranchID.toString()} />
          ))}
        </div>
      </div>
    </main>
  );
}
