"use client";

import { motion } from 'framer-motion';
import { SidebarNav } from './sidebar-nav';
import { SidebarLogo } from './sidebar-logo';
import { SidebarFooter } from './sidebar-footer';
import { usePathname } from 'next/navigation';
import useBranchStore from '@/store/branch';

export function Sidebar() {
  const pathname = usePathname();
  const { branchData, isLoading } = useBranchStore();
  
  // Check if current page is a product detail page
  const isProductDetailPage = pathname?.startsWith('/product/');

  // Don't render sidebar on product detail pages or while loading
  if (isProductDetailPage || isLoading || !branchData) {
    return null;
  }

  return (
    <motion.aside
      initial={{ x: -320 }}
      animate={{ x: 0 }}
      className="fixed top-0 left-0 z-30 h-screen w-80 bg-card border-r"
      style={{ scrollbarColor: branchData?.MainColor }}
    >
      <div className="flex flex-col h-full relative z-10" style={{ backgroundColor: '#f4f2f4', boxShadow: 'rgba(20, 3, 1, 0.1) 10px 0px 10px' }}>
        <SidebarLogo />
        <div 
          className="flex-1 overflow-y-auto py-6" 
          style={{ 
            backgroundColor: '#f4f2f4',
            scrollbarWidth: 'thin',
            scrollbarColor: `${branchData?.SecondColor} #f4f2f4`
          }}
        >
          <SidebarNav categories={branchData.Categories} />
        </div>
        <SidebarFooter />
      </div>
    </motion.aside>
  );
}
