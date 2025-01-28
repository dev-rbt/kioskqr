'use client';

import useBranchStore from '@/store/branch';
import { Inter } from 'next/font/google';
import { useEffect } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import Loader from '@/components/ui/loader';
import { useCartStore } from '@/store/cart';
import { VirtualKeyboard } from '@/components/ui/virtual-keyboard';
import { useInactivityRedirect } from '@/hooks/useInactivityRedirect';

const inter = Inter({ subsets: ['latin'] });

const INACTIVITY_TIMEOUT = 60000; // 1 minute in milliseconds

export default function BranchLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { branchId: string };
}) {
  const { fetchBranchData, isLoading, reset, selectedLanguage } = useBranchStore();
  const router = useRouter();
  const { clearCart } = useCartStore();
  const pathname = usePathname();
  const excludedPaths = [`/${params?.branchId}/payment`];
  const isExcludedPath = excludedPaths.some(path => pathname?.includes(path));

  useEffect(() => {
    if (params?.branchId) {
      fetchBranchData(params.branchId as string);
    }
  }, [fetchBranchData, params?.branchId]);

  useInactivityRedirect({
    timeout: INACTIVITY_TIMEOUT,
    excludedPaths: [],
    onTimeout: async () => {
      // Don't redirect if we're on an excluded path
      if (isExcludedPath) return;
      
      if (params?.branchId) {
        clearCart();
        await reset(params.branchId);
        await fetchBranchData(params.branchId);
        router.push(`/${params.branchId}`);
      }
    },
  });

  if (!params?.branchId) {
    return null;
  }

  return isLoading ? (
    <html lang={selectedLanguage?.Code.toLowerCase() || "tr"} dir={selectedLanguage?.Dir || "ltr"} suppressHydrationWarning>
      <body className={inter.className}>
        <Loader />
      </body>
    </html>
  ) : (
    <html lang={selectedLanguage?.Code.toLowerCase() || "tr"} dir={selectedLanguage?.Dir || "ltr"} suppressHydrationWarning>
      <body className={inter.className}>
        <div className="flex-1 flex flex-col">
          {children}
          <VirtualKeyboard />
        </div>
      </body>
    </html>
  );
}
