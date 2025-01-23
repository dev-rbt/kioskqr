import { create } from 'zustand';
import { Category } from '@/types/settings';

interface CategoryStore {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  updateCategory: (updatedCategory: Category) => void;
  deleteCategory: (categoryKey: string) => void;
}

const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],
  setCategories: (categories) => set({ categories }),
  updateCategory: (updatedCategory) =>
    set((state) => ({
      categories: state.categories.map((category) =>
        category.MenuGroupKey === updatedCategory.MenuGroupKey ? updatedCategory : category
      ),
    })),
  deleteCategory: (categoryKey) =>
    set((state) => ({
      categories: state.categories.filter((category) => category.MenuGroupKey !== categoryKey),
    })),
}));

export default useCategoryStore;
