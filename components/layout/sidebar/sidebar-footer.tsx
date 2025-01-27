"use client";

import { useState } from 'react';
import useBranchStore from '@/store/branch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from 'framer-motion';
import { ChevronDown, Palette } from 'lucide-react';
import { useThemeStore } from '@/store/theme';

export function SidebarFooter() {
  const { branchData, selectedLanguage, setSelectedLanguage, t } = useBranchStore();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isColorOpen, setIsColorOpen] = useState(false);
  const { currentTheme, setTheme: setColorTheme } = useThemeStore();
  const languages = branchData?.Languages || [];

  return (
    <div className="p-4 border-t space-y-3">
      {/* Language Selector */}
      <DropdownMenu open={isLangOpen} onOpenChange={setIsLangOpen}>
        <DropdownMenuTrigger asChild>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full"
          >
            <div className="w-full px-4 py-3 rounded-xl flex items-center gap-3 bg-background hover:bg-muted transition-colors border border-input">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-base font-semibold text-primary uppercase">
                    {selectedLanguage?.Code || 'TR'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground font-medium">{t.common.languageSelection}</p>
                  <p className="font-medium">{selectedLanguage?.Name || 'Seçiniz'}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </motion.button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[280px]">
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.Key}
              onClick={() => {
                if (branchData) {
                  setSelectedLanguage(branchData.BranchID.toString(), language);
                  setIsLangOpen(false);
                }
              }}
              className="flex items-center gap-3 py-2 px-4"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary uppercase">
                  {language.Code}
                </span>
              </div>
              <span className="flex-1 font-medium">{language.Name}</span>
              {selectedLanguage?.Key === language.Key && (
                <div className="w-2 h-2 rounded-full bg-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Color Theme Selector
      <DropdownMenu open={isColorOpen} onOpenChange={setIsColorOpen}>
        <DropdownMenuTrigger asChild>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full"
          >
            <div className="w-full px-4 py-3 rounded-xl flex items-center gap-3 bg-background hover:bg-muted transition-colors border border-input">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Palette className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground font-medium">Tema Seçimi</p>
                  <div className="flex items-center gap-1 mt-1">
                    {themes.slice(0, 5).map((theme) => (
                      <div
                        key={theme.name}
                        className={cn(
                          "w-3 h-3 rounded-full transition-transform",
                          currentTheme === theme.name && "scale-125 ring-2 ring-offset-2 ring-offset-background ring-primary"
                        )}
                        style={{ background: `hsl(${theme.primary})` }}
                      />
                    ))}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </motion.button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[280px] p-2">
          <div className="grid grid-cols-3 gap-2">
            {themes.map((theme) => (
              <motion.button
                key={theme.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setColorTheme(theme.name);
                  document.documentElement.style.setProperty('--primary', theme.primary);
                  setIsColorOpen(false);
                }}
                className={cn(
                  "w-full aspect-square rounded-xl relative group/theme",
                  "hover:scale-105 transition-transform",
                  "focus:outline-none focus:ring-2 focus:ring-primary",
                  currentTheme === theme.name && "ring-2 ring-primary"
                )}
                style={{ background: `hsl(${theme.primary})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-black/20 rounded-xl" />
              </motion.button>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu> */}
    </div>
  );
}
