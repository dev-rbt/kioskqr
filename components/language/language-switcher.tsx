"use client";

import { useState } from 'react';
import { useLanguageStore } from '@/store/language';
import { languages, type Language } from '@/lib/i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from 'framer-motion';
import { Globe, ChevronDown } from 'lucide-react';

export function LanguageSwitcher() {
  const { currentLanguage, setLanguage } = useLanguageStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (language: Language) => {
    setLanguage(language);
    setIsOpen(false);
    document.documentElement.dir = languages[language].dir;
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group pb-20" // Added bottom padding
        >
          <div className="relative px-6 py-3 rounded-xl flex items-center gap-3 bg-background border border-primary/20 hover:border-primary/40 transition-all duration-300">
            {/* Content */}
            <div className="relative flex items-center gap-4">
              {/* Flag Container */}
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <span className="text-3xl">{languages[currentLanguage].flag}</span>
              </div>
              
              {/* Text Content */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-primary uppercase tracking-wider">
                    Language
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-primary">
                    {languages[currentLanguage].name}
                  </span>
                  <ChevronDown className="w-4 h-4 text-primary group-hover:text-primary transition-colors" />
                </div>
              </div>
            </div>
          </div>
        </motion.button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        className="w-72 p-3 mt-2"
      >
        <div className="space-y-1">
          {Object.entries(languages).map(([key, { name, flag }]) => (
            <DropdownMenuItem
              key={key}
              className={`
                flex items-center gap-4 p-4 cursor-pointer rounded-xl
                transition-all duration-200
                ${currentLanguage === key 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-primary/10'
                }
              `}
              onSelect={() => handleSelect(key as Language)}
            >
              <div className={`
                flex items-center justify-center w-12 h-12 rounded-lg
                ${currentLanguage === key 
                  ? 'bg-primary-foreground/10' 
                  : 'bg-primary/5'
                }
              `}>
                <span className="text-3xl">{flag}</span>
              </div>
              <div className="flex-1">
                <div className="font-bold text-lg">{name}</div>
                <div className="text-sm opacity-80">
                  {currentLanguage === key ? 'Aktif Dil' : 'Choose'}
                </div>
              </div>
              {currentLanguage === key && (
                <motion.div
                  layoutId="activeLanguage"
                  className="w-3 h-3 rounded-full bg-primary-foreground"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
