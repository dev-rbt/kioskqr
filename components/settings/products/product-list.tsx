"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductTranslation {
  languageKey: string;
  name: string;
  description: string;
}

interface BadgeTranslation {
  languageKey: string;
  name: string;
}

interface Badge {
  badgeKey: string;
  badge: {
    code: string;
    translations: BadgeTranslation[];
  };
}

interface Product {
  ProductKey: string;
  ProductName: string;
  CategoryID: number | null;
  ImageUrl: string;
  previewUrl?: string | null;
  translations: ProductTranslation[];
  badges: Badge[];
}

interface Category {
  id: number;
  name: string;
}

interface ProductListProps {
  products: Product[];
  categories: Category[];
  selectedProduct: string | null;
  onSelectProduct: (productId: string) => void;
}

export function ProductList({ products, categories, selectedProduct, onSelectProduct }: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.ProductName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
      (product.CategoryID !== null && product.CategoryID.toString() === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <Card className="p-4 md:col-span-1">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Ürünler</h3>
        </div>

        {/* Search and Filter */}
        <div className="space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Ürün ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Kategori seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Kategoriler</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {filteredProducts.map((product) => (
            <motion.button
              key={product.ProductKey}
              onClick={() => onSelectProduct(product.ProductKey)}
              className={`w-full text-left rounded-lg transition-all overflow-hidden ${
                selectedProduct === product.ProductKey
                  ? 'bg-primary text-primary-foreground ring-2 ring-primary'
                  : 'hover:bg-muted'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex gap-3">
                {/* Product Image */}
                <div className="relative w-20 h-20">
                  <img
                    src={product.previewUrl || product.ImageUrl || '/images/default-product.svg'}
                    alt={product.ProductName}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  {product.previewUrl && (
                    <div className="absolute bottom-0 right-0 bg-secondary text-secondary-foreground text-[10px] px-1 py-0.5 rounded">
                      Preview
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 p-2">
                  <div className="font-medium">{product.ProductName}</div>

                  {/* Category Badge */}
                  <div className="mt-1">
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {product.CategoryID !== null 
                        ? categories.find(c => c.id === product.CategoryID)?.name || 'Kategori Yok'
                        : 'Kategori Yok'
                      }
                    </span>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1 mt-1">
                    {product.badges?.map((badge) => (
                      <span
                        key={badge.badgeKey}
                        className="px-1.5 py-0.5 text-xs rounded-full bg-secondary text-secondary-foreground"
                      >
                        {badge.badge.translations?.[0]?.name || badge.badge.code}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </Card>
  );
}
