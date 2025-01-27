'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import useBranchStore from '@/store/branch';
import { useCartStore } from '@/store/cart';
import { useInactivityTimer } from '@/hooks/useInactivityTimer';

const INACTIVITY_TIMEOUT = 60000; // 1 minute in milliseconds

export default function PaymentLayout({
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
      {children }
    </>
  );
}
