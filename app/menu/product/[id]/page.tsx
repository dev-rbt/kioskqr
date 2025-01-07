import ProductContent from '@/components/product/product-content';
import { fetchMenu } from '@/lib/api';

export async function generateStaticParams() {
  try {
    const menuData = await fetchMenu();
    return menuData.flatMap(category => 
      category.Items.map(item => ({
        id: item.MenuItemKey
      }))
    );
  } catch (error) {
    console.error('Error generating product paths:', error);
    return [];
  }
}

export default function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  return <ProductContent params={params} />;
}
