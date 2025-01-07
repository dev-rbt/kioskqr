import ProductClientPage from './client-page';
import { fetchMenu } from '../../../lib/api';

export async function generateStaticParams() {
  try {
    const menuData = await fetchMenu();
    // Extract all product IDs from the menu data
    return menuData.flatMap(category => 
      category.Items.map(item => ({
        id: item.MenuItemKey
      }))
    );
  } catch (error) {
    console.error('Error generating product paths:', error);
    // Fallback paths in case API is not available during build
    return [
      { id: 'd92527ac-f862-41f5-a91a-8547ad737850' },
      { id: '832571e2-cd9a-4a12-9b36-6a13a082255b' },
      { id: 'e7282652-056d-40ce-a65a-64d24334b420' },
      { id: '4f9d3049-751d-4f5b-a267-1a844d5756ce' },
      { id: 'b0b2d8f3-9f0e-4d8e-8c9c-9d3b0e9f0e1d' },
      { id: 'c1c2d3e4-5f6g-7h8i-9j0k-1l2m3n4o5p6' },
      { id: 'd4e5f6g7-8h9i-0j1k-2l3m-4n5o6p7q8r9' },
      { id: 'e5f6g7h8-9i0j-1k2l-3m4n-5o6p7q8r9s0' },
      { id: 'f6g7h8i9-0j1k-2l3m-4n5o-6p7q8r9s0t1' },
      { id: 'g7h8i9j0-1k2l-3m4n-5o6p-7q8r9s0t1u2' }
    ];
  }
}

export default function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  return <ProductClientPage params={params} />;
}
