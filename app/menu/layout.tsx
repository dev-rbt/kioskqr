"use client";

import { ThemeProvider } from '@/components/theme/theme-provider';
import { MenuProvider } from '@/components/menu/menu-provider';
import { Sidebar } from '@/components/layout/sidebar/sidebar';
import { CartFooter } from '@/components/cart/cart-footer';
import { usePathname } from 'next/navigation';

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isProductDetailPage = pathname?.startsWith('/menu/product/');

  return (
    <MenuProvider>
      <ThemeProvider />
      <div className="flex min-h-screen bg-menu">
        <Sidebar />
        <main className={`flex-1 ${!isProductDetailPage ? 'ml-80' : ''}`}>
          <div className="max-w-[1600px] mx-auto mb-32"> {/* Added margin bottom */}
            {children}
          </div>
        </main>
        <CartFooter />
      </div>
    </MenuProvider>
  );
}
