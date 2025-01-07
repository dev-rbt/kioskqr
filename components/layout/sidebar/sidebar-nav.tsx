"use client";

import { useMenuStore } from '@/store/menu';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CategoryIcon } from '../category-icon';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export function SidebarNav() {
  const { categories, isLoading } = useMenuStore();
  const pathname = usePathname();
  const isHome = !pathname.includes('/category/');

  if (isLoading) {
    return (
      <div className="flex-1 p-4 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    );
  }

  return (
    <nav className="flex-1 p-4 space-y-3 overflow-auto">
      {/* All Menu Link */}
      <Link href="/menu" className="block">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "relative p-4 rounded-xl transition-all duration-300",
            isHome
              ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
              : "hover:bg-primary/10"
          )}
        >
          {/* Background Effects */}
          <div className={cn(
            "absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300",
            "bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10",
            "hover:opacity-100"
          )} />

          <div className="relative flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-lg transition-all duration-300",
              "bg-white/10 flex items-center justify-center",
              "group-hover:scale-110 group-hover:rotate-3"
            )}>
              <CategoryIcon categoryId="menu" className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Tüm Menü</h3>
              <p className="text-sm opacity-80">Kategorilere göz atın</p>
            </div>
          </div>
        </motion.div>
      </Link>

      {/* Category Links */}
      {categories.map((category, index) => (
        <Link key={category.id} href={`/menu/category/${category.id}`}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "relative p-4 rounded-xl transition-all duration-300",
              pathname.includes(`/category/${category.id}`)
                ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                : "hover:bg-primary/10"
            )}
          >
            {/* Background Effects */}
            <div className={cn(
              "absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300",
              "bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10",
              "hover:opacity-100"
            )} />

            <div className="relative flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-lg transition-all duration-300",
                "bg-white/10 flex items-center justify-center",
                "group-hover:scale-110 group-hover:rotate-3"
              )}>
                <CategoryIcon categoryId={category.id} className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{category.name}</h3>
                <p className="text-sm opacity-80">Ürünlere göz atın</p>
              </div>
            </div>
          </motion.div>
        </Link>
      ))}
    </nav>
  );
}
