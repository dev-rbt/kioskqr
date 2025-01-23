"use client";

import { ThemeProvider } from '@/components/theme/theme-provider';
import { Sidebar } from '@/components/layout/sidebar/sidebar';
import { CartFooter } from '@/components/cart/cart-footer';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import useBranchStore from '@/store/branch';

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const { branchData,fetchBranchData } = useBranchStore();
  const isProductDetailPage = pathname?.startsWith(`/${params?.branchId}/product/`);

  useEffect(() => {
    if (params?.branchId) {
      fetchBranchData(params.branchId as string);
    }
  }, [params?.branchId, fetchBranchData]);

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
