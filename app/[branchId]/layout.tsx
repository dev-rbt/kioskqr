'use client';
import useBranchStore from '@/store/branch';
import { Inter } from 'next/font/google';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Loader from '@/components/ui/loader';

const inter = Inter({ subsets: ['latin'] });

export default function BranchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const { fetchBranchData, isLoading } = useBranchStore();

  useEffect(() => {
    if (params?.branchId) {
      fetchBranchData(params.branchId as string);
    }
  }, [fetchBranchData, params?.branchId]);

  if (!params?.branchId) {
    return null;
  }


  return !isLoading ? (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  ) : (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>
        <Loader />
      </body>
    </html>
  );
}
