import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Language } from '@/lib/i18n';
import { translations } from '@/lib/i18n';

interface LanguageState {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: typeof translations.tr;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      currentLanguage: 'tr',
      t: translations.tr,
      setLanguage: (language) => set({ 
        currentLanguage: language,
        t: translations[language]
      }),
    }),
    {
      name: 'language-storage',
    }
  )
);
