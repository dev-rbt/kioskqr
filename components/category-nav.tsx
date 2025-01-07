"use client";

import { categories } from '@/lib/data';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Utensils, Coffee, Wine, Cake } from 'lucide-react';

const categoryIcons: Record<string, any> = {
  '1': Utensils,
  '2': Coffee,
  '3': Wine,
  '4': Cake,
};

export function CategoryNav() {
  const pathname = usePathname();

  return (
    <nav className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-hide">
          {categories.map((category) => {
            const isActive = pathname.includes(`/category/${category.id}`);
            const Icon = categoryIcons[category.id];
            
            return (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors min-w-[120px]",
                  "hover:bg-secondary/80",
                  isActive && "bg-primary text-primary-foreground"
                )}
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span className="text-sm font-medium whitespace-nowrap">
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
