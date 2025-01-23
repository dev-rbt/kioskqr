import { create } from 'zustand';
import axios from 'axios';
import { Language } from '@/types/settings';

interface LanguageStore {
    languages: Language[];
    isLoading: boolean;
    error: string | null;
    fetchLanguages: () => Promise<void>;
    setLanguages: (languages: Language[]) => void;
}

const useLanguageStore = create<LanguageStore>((set) => ({
    languages: [],
    isLoading: false,
    error: null,
    fetchLanguages: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get('/api/getActiveLanguages');
            if (response.status !== 200) {
                throw new Error('Failed to fetch languages');
            }

            set({
                languages: response.data,
                isLoading: false
            });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'An error occurred',
                isLoading: false
            });
        }
    },
    setLanguages: (languages) => set({ languages }),
}));

export default useLanguageStore;