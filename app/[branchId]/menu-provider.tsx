"use client";

import { useEffect } from 'react';
import { useMenuStore } from '@/store/menu';

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const fetchData = useMenuStore((state) => state.fetchData);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return <>{children}</>;
}
