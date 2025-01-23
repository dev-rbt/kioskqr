"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Search } from 'lucide-react';
import useBranchStore from '@/store/branch';

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const { t } = useBranchStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="relative group">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl blur-xl group-hover:blur-2xl transition-all opacity-75 group-hover:opacity-100" />
          
          {/* Button content */}
          <div className="relative bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300 px-4 py-2 rounded-xl flex items-center gap-3">
            <Search className="h-4 w-4 text-white group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline-block text-sm text-white font-medium">
              {t.common.search}
            </span>
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-white/20 bg-white/10 px-1.5 font-mono text-[10px] font-medium text-white/70 opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
            
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </button>
      </DialogTrigger>
      {/* Rest of the dialog content remains the same */}
    </Dialog>
  );
}
