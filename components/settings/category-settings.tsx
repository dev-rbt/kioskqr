"use client";

import { useState } from 'react';
import { CategoryList } from './category-settings/category-list';
import { CategoryEdit } from './category-settings/category-edit';
import { Category } from '@/types/settings';
import useCategoryStore from "@/store/settings/category";
import useBranchStore from "@/store/settings/branch";
import useTemplateStore from "@/store/settings/template";
import { toast } from '@/hooks/use-toast';


export function CategorySettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const { categories, setCategories } = useCategoryStore();
  const branches = useBranchStore(state => state.branches);
  const templates = useTemplateStore(state => state.templates);

  const fetchCategories = async (type: "branch" | "template", id: string) => {
    if (!id) return;

    try {
      setIsLoading(true);
      let templateKey = "";

      if (type === "branch") {
        const selectedBranch = branches.find(b => b.BranchID.toString() === id);
        if (selectedBranch) {
          templateKey = selectedBranch.KioskMenuTemplateKey;
        }
      } else {
        const selectedTemplate = templates.find(t => t.TemplateKey.toString() === id);
        if (selectedTemplate) {
          templateKey = selectedTemplate.TemplateKey;
        }
      }

      if (!templateKey) {
        console.error('Template key not found');
        return;
      }

      const response = await fetch(`/api/categories/getCategories?templateKey=${templateKey}`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCategory = async (category: Category) => {
    try {
      const response = await fetch('/api/updateCategory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
      });

      if (!response.ok) {
        throw new Error('Failed to update category');
      }

      // Update zustand store
      // updateCategory(category);
      
      // Update selected category
      setSelectedCategory(category);

      toast({
        title: "Başarılı",
        description: "Kategori güncellendi",
      });
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: "Hata",
        description: "Kategori güncellenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };


  const handleSelectionChange = (type: "branch" | "template", id: string) => {
    setSelectedCategory(null);
    if (id) {
      fetchCategories(type, id);
    } else {
      setCategories([]);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <CategoryList
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        isLoading={isLoading}
        onSelectionChange={handleSelectionChange}
      />
      <CategoryEdit
        category={selectedCategory}
        onSave={handleSaveCategory}
        setCategory={setSelectedCategory}
      />
    </div>
  );
}