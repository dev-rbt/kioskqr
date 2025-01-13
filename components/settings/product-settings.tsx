"use client";

import { useState, useEffect } from 'react';
import { ProductList } from '@/components/settings/products/product-list';
import { ProductEdit } from '@/components/settings/products/product-edit';

interface ProductTranslation {
  languageKey: string;
  name: string;
  description: string;
}

interface BadgeTranslation {
  languageKey: string;
  name: string;
}

interface Badge {
  badgeKey: string;
  badge: {
    code: string;
    translations: BadgeTranslation[];
  };
}

interface Product {
  ProductKey: string;
  ProductName: string;
  CategoryID: number;
  ImageUrl: string;
  previewUrl?: string | null;
  translations: ProductTranslation[];
  badges: Badge[];
  TaxPercent: number;
  OrderByWeight: boolean;
}

interface Category {
  id: number;
  name: string;
}

export default function ProductSettings() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchBadges();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/product-settings/getProducts');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBadges = async () => {
    try {
      const response = await fetch('/api/product-settings/getBadges');
      if (!response.ok) throw new Error('Failed to fetch badges');
      const data = await response.json();
      setBadges(data);
    } catch (error) {
      console.error('Error fetching badges:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/product-settings/getCategories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSaveProduct = async (updatedProduct: Partial<Product>) => {
    try {
      const response = await fetch('/api/product-settings/updateProduct', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });

      if (!response.ok) throw new Error('Failed to update product');

      fetchProducts(); // Refresh the products list
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handlePreviewImage = (productKey: string, previewUrl: string | null) => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.ProductKey === productKey
          ? { ...product, previewUrl }
          : product
      )
    );
    setPreviewImage(previewUrl);
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="container py-6">
      <div className="grid md:grid-cols-3 gap-6">
        <ProductList
          products={products}
          categories={categories}
          selectedProduct={selectedProduct}
          onSelectProduct={setSelectedProduct}
        />
        <ProductEdit
          product={selectedProduct}
          badges={badges}
          onSave={handleSaveProduct}
          onPreviewImage={handlePreviewImage}
          previewImage={previewImage}
        />
      </div>
    </div>
  );
}