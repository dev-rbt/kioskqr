import { tr } from './translations/tr';
import { en } from './translations/en';
import { az } from './translations/az';
import { ru } from './translations/ru';
import { ar } from './translations/ar';

export const languages = {
  tr: { name: 'Türkçe', flag: '🇹🇷', dir: 'ltr' },
  en: { name: 'English', flag: '🇬🇧', dir: 'ltr' },
  az: { name: 'Azərbaycan', flag: '🇦🇿', dir: 'ltr' },
  ru: { name: 'Русский', flag: '🇷🇺', dir: 'ltr' },
  ar: { name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
} as const;

export const translations = {
  tr,
  en,
  az,
  ru,
  ar,
} as const;

export type Language = keyof typeof languages;
export type Translation = typeof translations.tr;
