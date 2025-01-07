"use client";

import { motion } from 'framer-motion';
import { SidebarNav } from './sidebar-nav';
import { SidebarLogo } from './sidebar-logo';
import { SidebarFooter } from './sidebar-footer';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();
  
  // Check if current page is a product detail page
  const isProductDetailPage = pathname?.startsWith('/menu/product/');

  // Don't render sidebar on product detail pages
  if (isProductDetailPage) {
    return null;
  }

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-0 bottom-0 w-80 bg-background border-r flex flex-col z-50"
    >
      <SidebarLogo />
      <SidebarNav />
      <SidebarFooter />
    </motion.aside>
  );
}
