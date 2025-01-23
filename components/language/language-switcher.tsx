"use client";

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from 'framer-motion';
import { Globe, ChevronDown } from 'lucide-react';
import useBranchStore from '@/store/branch';
import { Language } from '@/types/branch';

export function LanguageSwitcher() {
  const { selectedLanguage, setSelectedLanguage, branchData } = useBranchStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (language: Language) => {
    setSelectedLanguage(branchData?.BranchID.toString() || '', language);
    setIsOpen(false);
  };

  if (!branchData || !selectedLanguage) return null;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group pb-20"
        >
          <div className="relative px-6 py-3 rounded-xl flex items-center gap-3 bg-background border border-primary/20 hover:border-primary/40 transition-all duration-300">
            <div className="relative flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <span className="text-3xl">{selectedLanguage.Code}</span>
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-primary uppercase tracking-wider">
                    Language
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-primary">
                    {selectedLanguage.Name}
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
          {branchData.Languages.map((language) => (
            <DropdownMenuItem
              key={language.Key}
              className={`
                flex items-center gap-4 p-4 cursor-pointer rounded-xl
                transition-all duration-200
                ${selectedLanguage.Key === language.Key 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-primary/10'
                }
              `}
              onSelect={() => handleSelect(language)}
            >
              <div className={`
                flex items-center justify-center w-12 h-12 rounded-lg
                ${selectedLanguage.Key === language.Key 
                  ? 'bg-primary-foreground/10' 
                  : 'bg-primary/5'
                }
              `}>
                <span className="text-3xl">{language.Code}</span>
              </div>
              <div className="flex-1">
                <div className="font-bold text-lg">{language.Name}</div>
                <div className="text-sm opacity-80">
                  {selectedLanguage.Key === language.Key ? 'Active' : 'Choose'}
                </div>
              </div>
              {selectedLanguage.Key === language.Key && (
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
