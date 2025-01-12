"use client";

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from "@/components/ui/badge";
import { Plus, Image as ImageIcon, Search, Check, X } from 'lucide-react';
import { Category } from '@/types/category';
import useCategoryStore from "@/store/useCategoryStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useBranchStore from "@/store/useBranchStore";
import useTemplateStore from "@/store/useTemplateStore";

interface CategoryListProps {
  selectedCategory: Category | null;
  onSelectCategory: (category: Category) => void;
  isLoading?: boolean;
  onSelectionChange?: (type: "branch" | "template", id: string) => void;
}

export function CategoryList({
  selectedCategory,
  onSelectCategory,
  isLoading = false,
  onSelectionChange,
}: CategoryListProps) {
  const categories = useCategoryStore(state => state.categories);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"branch" | "template">("branch");
  const [selectedItemId, setSelectedItemId] = useState<string>("");

  const branches = useBranchStore(state => state.branches);
  const templates = useTemplateStore(state => state.templates);

  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      category.MenuGroupText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.Translations['🇹🇷']?.Name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  const handleTypeChange = (value: "branch" | "template") => {
    setSelectedType(value);
    setSelectedItemId("");
    onSelectionChange?.(value, "");
  };

  const handleItemChange = (value: string) => {
    setSelectedItemId(value);
    onSelectionChange?.(selectedType, value);
  };

  return (
    <Card className="md:col-span-1 h-[calc(100vh-6rem)] flex flex-col overflow-hidden">
      <div className="p-4 border-b space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Kategoriler</h3>
        </div>

        <div className="space-y-2">
          <Select value={selectedType} onValueChange={handleTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Seçim tipini belirleyin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="branch">Şube</SelectItem>
              <SelectItem value="template">Şablon</SelectItem>
            </SelectContent>
          </Select>

          {selectedType === "branch" ? (
            <Select value={selectedItemId} onValueChange={handleItemChange}>
              <SelectTrigger>
                <SelectValue placeholder="Şube seçiniz" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch.BranchID.toString()} value={branch.BranchID.toString()}>
                    {branch.BranchName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Select value={selectedItemId} onValueChange={handleItemChange}>
              <SelectTrigger>
                <SelectValue placeholder="Şablon seçiniz" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.TemplateKey.toString()} value={template.TemplateKey.toString()}>
                    {template.TemplateName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Kategori ara..."
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
        ) : filteredCategories.map((category) => (
          <motion.button
            key={category.MenuGroupKey}
            onClick={() => onSelectCategory(category)}
            className={`w-full text-left rounded-md transition-all p-2 ${
              selectedCategory?.MenuGroupKey === category.MenuGroupKey
                ? 'bg-primary/10 text-primary ring-1 ring-primary'
                : 'hover:bg-muted'
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex gap-3 items-center">
              {/* Category Image */}
              <div className="relative w-10 h-10 flex-shrink-0">
                {category.Translations['tr']?.ImageUrl ? (
                  <img
                    src={category.Translations['tr'].ImageUrl}
                    alt={category.Translations['tr']?.Name || category.MenuGroupText}
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full h-full bg-muted rounded-md flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Category Info */}
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">
                  {category.MenuGroupText}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <Badge variant="outline" className="h-4 text-xs px-1">
                    #{category.DisplayIndex}
                  </Badge>
                  <Badge variant="secondary" className="h-4 text-xs px-1">
                    {category.ProductCount} Ürün
                  </Badge>
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </Card>
  );
}
