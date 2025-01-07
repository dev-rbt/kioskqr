import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { themes } from '@/lib/themes';

interface ThemeStore {
  currentTheme: string;
  setTheme: (theme: string) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      currentTheme: 'default',
      setTheme: (theme) => set({ currentTheme: theme }),
    }),
    {
      name: 'theme-storage',
    }
  )
);
