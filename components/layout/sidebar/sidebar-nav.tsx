"use client";

import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CategoryIcon } from '../category-icon';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import useBranchStore from '@/store/branch';
import { Category } from '@/types/branch';
import Image from 'next/image';
import { Home } from 'lucide-react';

interface SidebarNavProps {
  categories: Category[];
}

export function SidebarNav({ categories }: SidebarNavProps) {
  const pathname = usePathname();
  const { selectedLanguage, branchData, isLoading, t } = useBranchStore();
  const isHome = !pathname?.includes('/category/');
  const branchId = branchData?.BranchID;

  if (!branchId || !selectedLanguage || isLoading) {
    return (
      <div className="flex-1 p-4 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    );
  }

  return (
    <nav className="flex-1 p-4 pt-0 space-y-3 overflow-auto">
      {/* All Menu Link */}
      <Link href={`/${branchId}/menu`} className="block">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "relative p-4 rounded-xl transition-all duration-300"
          )}
          style={{
            backgroundColor: isHome ? branchData.SecondColor : 'transparent',
            color: isHome ? 'white' : branchData.SecondColor
          }}
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
              <Home className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{t.common.allMenus}</h3>
              <p className="text-sm opacity-80">{t.common.viewAllCategories}</p>
            </div>
          </div>
        </motion.div>
      </Link>

      {/* Category Links */}
      {categories.map((category, index) => {
        const translation = category.Translations?.[selectedLanguage.Key];
        const turkishTranslation = category.Translations?.[branchData?.Languages.find(language => language.Code.toLowerCase() === 'tr')?.Key || 'en-US'];

        const isActive = pathname?.includes(`/category/${category.CategoryID}`);
        let textColor = 'text-muted-foreground';
        if(isActive){
          textColor = 'white';
        }else{
          textColor = branchData.SecondColor;
        }

        return (
          <Link key={category.CategoryID} href={`/${branchId}/menu/category/${category.CategoryID}`}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "relative p-4 rounded-xl transition-all duration-300"
              )}
              style={{
                backgroundColor: isActive ? branchData.SecondColor : 'transparent',
                color: isActive ? 'white' : branchData.SecondColor
              }}
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
                  <Image width={65} height={65} src={translation?.ImageUrl || turkishTranslation?.ImageUrl} alt={category.OriginalName} />
                </div>
                <div >
                  <h3 className="font-semibold text-lg">{translation?.Name || category.OriginalName}</h3>
                  <p className="text-sm opacity-80">{translation?.Description || t.common.viewProducts} </p>
                </div>
              </div>
            </motion.div>
          </Link>
        );
      })}
    </nav>
  );
}
