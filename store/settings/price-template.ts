import { create } from 'zustand';
import { PriceTemplate } from '@/types/settings';

interface PriceTemplateStore {
  priceTemplates: PriceTemplate[];
  isLoading: boolean;
  error: string | null;
  setPriceTemplates: (priceTemplates: PriceTemplate[]) => void;
  fetchPriceTemplates: () => Promise<void>;
}

const usePriceTemplateStore = create<PriceTemplateStore>((set) => ({
  priceTemplates: [],
  isLoading: false,
  error: null,
  setPriceTemplates: (priceTemplates) => set({ priceTemplates }),
  fetchPriceTemplates: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/getPriceTemplates');
      if (!response.ok) {
        throw new Error('Failed to fetch price templates');
      }
      const data = await response.json();
      set({ priceTemplates: data, isLoading: false });
    } catch (error) {
      console.error('Error fetching price templates:', error);
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false
      });

    }
  }
}));

export default usePriceTemplateStore;
