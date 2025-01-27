'use client';

import useBranchStore from '@/store/branch';
import { Inter } from 'next/font/google';
import { useEffect } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import Loader from '@/components/ui/loader';
import { TimerProvider } from '@/contexts/timer-context';
import { useCartStore } from '@/store/cart';
import { VirtualKeyboard } from '@/components/ui/virtual-keyboard'; // Import VirtualKeyboard component

const inter = Inter({ subsets: ['latin'] });

const INACTIVITY_TIMEOUT = 60000; // 1 minute in milliseconds

export default function BranchLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { branchId: string };
}) {
  const { fetchBranchData, isLoading, reset } = useBranchStore();
  const router = useRouter();
  const { clearCart } = useCartStore();
  const pathname = usePathname();

  useEffect(() => {
    console.log(params?.branchId)
    if (params?.branchId) {
      fetchBranchData(params.branchId as string);
    }
  }, [fetchBranchData, params?.branchId]);

  if (!params?.branchId) {
    return null;
  }
  return (
    <TimerProvider
      timeout={INACTIVITY_TIMEOUT}
      excludedPaths={[`/${params?.branchId}/payment`]}
      onTimeout={async () => {
        const branchId = params?.branchId?.toString();
        if (branchId) {
          clearCart();
          await reset(branchId);
          await fetchBranchData(branchId);
          router.push(`/${branchId}`);
        }
      }}
    >
      {isLoading ? (
        <html lang="tr" suppressHydrationWarning>
          <body className={inter.className}>
            <Loader />
          </body>
        </html>
      ) : (
        <html lang="tr" suppressHydrationWarning>
          <body className={inter.className}>
            <div className="flex-1 flex flex-col">
              {children}
              <VirtualKeyboard />
            </div>
          </body>
        </html>
      )}
    </TimerProvider>
  );
}
