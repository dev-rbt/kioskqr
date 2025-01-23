"use client";

import { CategoryCard } from '@/components/home/category-card';
import { PageTitle } from '@/components/home/page-title';
import { useMenuStore } from '@/store/menu';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomeContent() {
  const { categories, isLoading, error } = useMenuStore();

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
        <Skeleton className="h-12 w-48 mx-auto mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 pt-40 ">
      <PageTitle title="Menümüz" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <CategoryCard key={category.id} category={category} index={index} />
        ))}
      </div>
    </main>
  );
}
