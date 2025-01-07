'use client';

import CategoryContent from './category-content';
import { useEffect } from 'react';
import { useMenuStore } from '@/store/menu';

export default function CategoryClientPage({
  params,
}: {
  params: { id: string };
}) {
  const fetchData = useMenuStore((state) => state.fetchData);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return <CategoryContent params={params} />;
}
