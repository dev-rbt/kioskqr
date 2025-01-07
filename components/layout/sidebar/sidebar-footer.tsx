"use client";

import { ColorPicker } from '@/components/theme/color-picker';
import { LanguageSwitcher } from '@/components/language/language-switcher';

export function SidebarFooter() {
  return (
    <div className="p-4 border-t space-y-4">
      <div className="flex items-center justify-between gap-2">
        <LanguageSwitcher />
        <ColorPicker />
      </div>
    </div>
  );
}
