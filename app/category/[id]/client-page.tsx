'use client';

import { useEffect, useState } from 'react';
import CategoryContent from './category-content';
import { fetchMenu } from '../../../lib/api';
import { ApiCategory } from '../../../types/api';

export default function CategoryClientPage({
  params,
}: {
  params: { id: string };
}) {
  const [loading, setLoading] = useState(false); // Start with false since we have static data
  const [error, setError] = useState<string | null>(null);
  const [exists, setExists] = useState(true); // Start with true since the page was statically generated

  // Only fetch if needed (e.g., for revalidation)
  useEffect(() => {
    const controller = new AbortController();
    
    async function checkCategory() {
      try {
        // Optional: Add a condition here to determine if we need to refetch
        // For example, based on time since last fetch
        const menuData: ApiCategory[] = await fetchMenu();
        const categoryExists = menuData.some((category: ApiCategory) => 
          category.MenuGroupKey === params.id
        );
        
        setExists(categoryExists);
        if (!categoryExists) {
          setError('Category not found');
        }
      } catch (error) {
        // Don't show error since we have static data
        console.error('Error in category page:', error);
      } finally {
        setLoading(false);
      }
    }

    // Optionally fetch for revalidation
    // checkCategory();

    return () => {
      controller.abort();
    };
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!exists) {
    return <div>Category not found</div>;
  }

  return <CategoryContent params={params} />;
}
