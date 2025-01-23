import { tr } from './translations/tr';
import { en } from './translations/en';
import { az } from './translations/az';
import { ru } from './translations/ru';
import { ar } from './translations/ar';

export const translations = {
  tr,
  en,
  az,
  ru,
  ar,
} as const;

export type Translation = typeof translations.tr;
