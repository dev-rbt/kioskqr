import CategoryClientPage from './client-page';
import { fetchMenu } from '../../../lib/api';

export async function generateStaticParams() {
  try {
    const menuData = await fetchMenu();
    return menuData.map((category) => ({
      id: category.MenuGroupKey,
    }));
  } catch (error) {
    console.error('Error generating category paths:', error);
    // Fallback paths in case API is not available during build
    return [
      { id: '2a7c5348-6b07-4e23-a9b5-dd17a0db6804' },
      { id: 'babf2796-333a-4df3-9aa9-ea79582d1160' },
      { id: '5db8c883-7a20-4e44-ab34-b62143ca2594' },
      { id: '866b6ca3-f137-416a-acee-79dc61a3e17c' },
      { id: '7108109c-6ca8-4a60-8a73-33353a4cb96d' },
      { id: 'bac874f4-69bc-4831-9a24-39f0313b2096' },
      { id: '5dac49bd-3717-4a8c-a91d-e3c769f9403a' },
      { id: '1e43fad7-c321-464f-a841-6341b6a12fc4' },
      { id: 'b40f481d-a808-4aa6-8a79-0d2c3ad6567c' },
      { id: '8fd1169a-077d-432a-936a-1b6e66a3868f' }
    ];
  }
}

export default function CategoryPage({
  params,
}: {
  params: { id: string };
}) {
  return <CategoryClientPage params={params} />;
}
