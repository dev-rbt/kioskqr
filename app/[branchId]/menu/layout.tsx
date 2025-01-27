"use client";

import { ThemeProvider } from '@/components/theme/theme-provider';
import { Sidebar } from '@/components/layout/sidebar/sidebar';
import { CartFooter } from '@/components/cart/cart-footer';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import useBranchStore from '@/store/branch';
import { useCartStore } from '@/store/cart';
import { useInactivityTimer } from '@/hooks/useInactivityTimer';

const INACTIVITY_TIMEOUT = 60000; // 1 minute in milliseconds
//const INACTIVITY_TIMEOUT = 10000; // 10 seconds in milliseconds

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const params = useParams();
  const { fetchBranchData, reset } = useBranchStore();
  const { clearCart } = useCartStore();

  useInactivityTimer({
    timeout: INACTIVITY_TIMEOUT,
    onTimeout: async () => {
      const branchId = params?.branchId?.toString();
      if (branchId) {
        clearCart();
        await reset(branchId);
        await fetchBranchData(branchId);
        router.push(`/${branchId}`);
      }
    }
  });

  return (
    <>
      <ThemeProvider />
      <div className="flex min-h-screen bg-menu">
        <Sidebar />
        <main className='flex-1 ml-80'>
          <div className={`max-w-[1600px] mx-auto`}>
            {children}
          </div>
        </main>
        <CartFooter />
      </div>
    </>
  );
}
