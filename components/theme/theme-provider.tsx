"use client";

import { useEffect } from 'react';
import { useThemeStore } from '@/store/theme';
import { themes } from '@/lib/themes';

export function ThemeProvider() {
  const currentTheme = useThemeStore((state) => state.currentTheme);

  useEffect(() => {
    const theme = themes.find(t => t.name === currentTheme);
    if (theme) {
      document.documentElement.style.setProperty('--primary', theme.primary);
    }
  }, [currentTheme]);

  return null;
}
