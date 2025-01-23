"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from '@/types/settings';
import useLanguageStore from '@/store/settings/language';




interface ProductListProps {
  products: Product[];
  categories: {id: number, name: string}[];
  selectedProduct: Product | null;
  onSelectProduct: (product: Product) => void;
  isLoading?: boolean;
}

export function ProductList({ 
  products, 
  categories, 
  selectedProduct, 
  onSelectProduct,
  isLoading = false 
}: ProductListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const {languages} = useLanguageStore();
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.OriginalName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
      (product.CategoryID !== null && product.CategoryID.toString() === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <Card className="md:col-span-1 h-[calc(100vh-6rem)] flex flex-col overflow-hidden">
      <div className="p-4 border-b space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Ürünler</h3>
        </div>

        <div className="space-y-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
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

          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Ürün ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredProducts.map((product) => (
          <motion.button
            key={product.ProductID}
            onClick={() => onSelectProduct(product)}
            className={`w-full text-left rounded-md transition-all p-2 ${
              selectedProduct?.ProductID === product.ProductID
                ? 'bg-primary/10 text-primary ring-1 ring-primary'
                : 'hover:bg-muted'
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex gap-3 items-center">
              {/* Product Image */}
              <div className="relative w-10 h-10 flex-shrink-0">
                {product.Translations[languages[0]?.Key]?.ImageUrl ? (
                  <img
                    src={product.Translations[languages[0]?.Key]?.ImageUrl || ''}
                    alt={product.OriginalName}
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full h-full bg-muted rounded-md flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">
                  {product.OriginalName}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  {product.CategoryID !== null && (
                    <Badge variant="outline" className="h-4 text-xs px-1">
                      {categories.find(c => c.id === product.CategoryID)?.name}
                    </Badge>
                  )}
                  {product.activeBadges?.filter(b => b.IsActive).length > 0 && (
                    <Badge variant="secondary" className="h-4 text-xs px-1">
                      {product.activeBadges?.filter(b => b.IsActive).length} Rozet
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </Card>
  );
}
