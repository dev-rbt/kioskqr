"use client";

import { Palette } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { themes } from '@/lib/themes';
import { useThemeStore } from '@/store/theme';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function ColorPicker() {
  const { currentTheme, setTheme } = useThemeStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative group px-3 py-2 rounded-xl hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-white opacity-70 group-hover:opacity-100 group-hover:rotate-12 transition-all" />
            <div className="hidden sm:flex items-center gap-1">
              {themes.slice(0, 3).map((theme) => (
                <div
                  key={theme.name}
                  className="w-2 h-2 rounded-full transition-transform group-hover:scale-110"
                  style={{ background: `hsl(${theme.primary})` }}
                />
              ))}
            </div>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 p-2">
        <div className="grid grid-cols-3 gap-1">
          {themes.map((theme) => (
            <motion.button
              key={theme.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setTheme(theme.name);
                document.documentElement.style.setProperty('--primary', theme.primary);
              }}
              className={cn(
                "w-14 h-14 rounded-xl relative group/theme",
                "hover:scale-105 transition-transform",
                "focus:outline-none focus:ring-2 focus:ring-white/20",
              )}
            >
              {/* Theme color preview */}
              <div
                className="absolute inset-2 rounded-lg"
                style={{ background: `hsl(${theme.primary})` }}
              />
              
              {/* Selection indicator */}
              {currentTheme === theme.name && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-2 h-2 bg-white rounded-full shadow-lg" />
                </motion.div>
              )}
              
              {/* Hover effect */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover/theme:opacity-100 transition-opacity bg-gradient-to-br from-white/20 to-transparent" />
            </motion.button>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
