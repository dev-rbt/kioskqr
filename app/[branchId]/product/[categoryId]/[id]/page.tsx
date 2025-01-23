"use client";

import ProductContent from '@/components/product/product-content';


export default function ProductPage({
  params,
}: {
  params: { id: string, categoryId: string, branchId: string };
}) {
  return <ProductContent params={params} />;
}
