"use client";

import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface ProductHeaderProps {
  categoryId: string;
}

export function ProductHeader({ categoryId }: ProductHeaderProps) {
  return (
    <Link href={`/menu/category/${categoryId}`}>
      <Button variant="ghost" size="sm" className="hover:translate-x-1 transition-transform">
        <ChevronLeft className="h-4 w-4 mr-2" />
        Geri Dön
      </Button>
    </Link>
  );
}
