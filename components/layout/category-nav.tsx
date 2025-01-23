"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useMenuStore } from '@/store/menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Menu } from 'lucide-react';
import useBranchStore from '@/store/branch';

export default function CategoryNav() {
  const pathname = usePathname();
  const { t } = useBranchStore()
  const { categories, isLoading } = useMenuStore();
  const isHome = !pathname.includes('/category/');

  if (isLoading) {
    return (
      <motion.nav 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-lg z-40"
      >
        <div className="h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <ScrollArea className="w-full border-b border-primary/20 shadow-lg">
          <div className="container mx-auto h-16 px-4">
            <div className="flex items-center gap-3 h-full">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 w-32" />
              ))}
            </div>
          </div>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>
        <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </motion.nav>
    );
  }

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-40"
    >
      {/* Top gradient border */}
      <div className="h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Navigation Background */}
      <div className="bg-gradient-to-b from-background/98 to-background/95 backdrop-blur-lg shadow-lg">
        {/* Decorative top line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        
        <ScrollArea className="w-full border-y border-primary/10">
          <div className="container mx-auto h-16 px-4">
            <div className="flex items-center gap-3 h-full">
              {/* Home Menu Link */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="shrink-0"
              >
                <Link
                  href="/menu"
                  className={cn(
                    "group relative flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300",
                    "hover:shadow-lg hover:shadow-primary/5",
                    "border-2 border-transparent",
                    isHome && "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-xl shadow-primary/20 border-primary/20"
                  )}
                >
                  {/* Icon Container */}
                  <div className={cn(
                    "relative p-2 rounded-lg transition-all duration-300",
                    isHome ? "bg-primary-foreground/10" : "bg-primary/10",
                    "group-hover:bg-primary/20",
                    "group-hover:scale-110 group-hover:rotate-3"
                  )}>
                    <Menu className="h-5 w-5" />
                  </div>

                  {/* Text */}
                  <span className="relative text-base font-medium whitespace-nowrap">
                    {t.common.menu}
                  </span>
                </Link>
              </motion.div>

              {/* Category Links */}
              {categories.map((category, index) => {
                const isActive = pathname.includes(`/category/${category.id}`);
                
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (index + 1) * 0.1 }}
                    className="shrink-0"
                  >
                    <Link
                      href={`/category/${category.id}`}
                      className={cn(
                        "group relative flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300",
                        "hover:shadow-lg hover:shadow-primary/5",
                        "border-2 border-transparent",
                        isActive && "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-xl shadow-primary/20 border-primary/20"
                      )}
                    >
                      {/* Icon Container */}
                      <div className={cn(
                        "relative p-2 rounded-lg transition-all duration-300",
                        isActive ? "bg-primary-foreground/10" : "bg-primary/10",
                        "group-hover:bg-primary/20",
                        "group-hover:scale-110 group-hover:rotate-3"
                      )}>
                          {/* <Image src={translation?.ImageUrl} alt={category.name} width={24} height={24} /> */}
                      </div>

                      {/* Text */}
                      <span className="relative text-base font-medium whitespace-nowrap">
                        {category.name}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>

        {/* Bottom shadow and gradient */}
        <div className="h-4 bg-gradient-to-b from-background/50 to-transparent" />
      </div>

      {/* Bottom gradient border */}
      <div className="h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </motion.nav>
  );
}
