import CategoryContent from '@/components/category/category-content';
import { fetchMenu } from '@/lib/api';

export async function generateStaticParams() {
  try {
    const menuData = await fetchMenu();
    return menuData.map((category) => ({
      id: category.MenuGroupKey,
    }));
  } catch (error) {
    console.error('Error generating category paths:', error);
    return [];
  }
}

export default function CategoryPage({
  params,
}: {
  params: { id: string };
}) {
  return <CategoryContent params={params} />;
}
