'use client';

import { useEffect, useState } from 'react';
import ProductContent from './product-content';
import { fetchMenu } from '../../../lib/api';
import { ApiCategory, ApiMenuItem } from '../../../types/api';

export default function ProductClientPage({
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
    
    async function checkProduct() {
      try {
        // Optional: Add a condition here to determine if we need to refetch
        // For example, based on time since last fetch
        const menuData: ApiCategory[] = await fetchMenu();
        const productExists = menuData.some((category: ApiCategory) => 
          category.Items.some((item: ApiMenuItem) => item.MenuItemKey === params.id)
        );
        
        setExists(productExists);
        if (!productExists) {
          setError('Product not found');
        }
      } catch (error) {
        // Don't show error since we have static data
        console.error('Error in product page:', error);
      } finally {
        setLoading(false);
      }
    }

    // Optionally fetch for revalidation
    // checkProduct();

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
    return <div>Product not found</div>;
  }

  return <ProductContent params={params} />;
}
