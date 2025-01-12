import { create } from 'zustand';

interface Language {
  Code: string;
  Key: string;
  Name: string;
  IsActive: boolean;
  CreatedAt: Date;
  UpdatedAt: Date;
}

interface LanguageStore {
  languages: Language[];
  isLoading: boolean;
  error: string | null;
  setLanguages: (languages: Language[]) => void;
  fetchLanguages: () => Promise<void>;
}

const useLanguageStore = create<LanguageStore>((set) => ({
  languages: [],
  isLoading: false,
  error: null,
  setLanguages: (languages) => set({ languages }),
  fetchLanguages: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/getActiveLanguages');
      if (!response.ok) {
        throw new Error('Failed to fetch languages');
      }
      const data = await response.json();
      set({ languages: data, isLoading: false });
    } catch (error) {
      console.error('Error fetching languages:', error);
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false
      });
    }
  }
}));

export default useLanguageStore;
