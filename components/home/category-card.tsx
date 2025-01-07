"use client";

import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Category } from '@/types';
import { useState } from 'react';
import Image from 'next/image';

interface CategoryCardProps {
  category: Category;
  index: number;
}

export function CategoryCard({ category, index }: CategoryCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/menu/category/${category.id}`}>
        <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden bg-white">
          <div className="relative aspect-[16/9]">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
            <div className="absolute inset-0">
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
                  imageError ? 'opacity-0' : 'opacity-100'
                }`}
                priority={index < 6}
                onError={() => setImageError(true)}
              />
              {imageError && (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <span className="text-2xl font-bold text-muted-foreground">
                    {category.name}
                  </span>
                </div>
              )}
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4 z-20">
              <h2 className="text-2xl font-bold text-white text-center drop-shadow-md">
                {category.name}
              </h2>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
