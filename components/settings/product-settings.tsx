"use client";

import { useState, useEffect } from 'react';
import { ProductList } from '@/components/settings/product-settings/product-list';
import { ProductEdit } from '@/components/settings/product-settings/product-edit';
import axios from 'axios';
import { Badge, Product } from '@/types/settings';
import useTemplateStore from '@/store/settings/template';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


export default function ProductSettings() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [categories, setCategories] = useState<{id: number, name: string}[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('all');
  const { templates, fetchTemplates, isLoading: templatesLoading } = useTemplateStore();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchTemplates();
  }, [fetchTemplates]);
  useEffect(() => {
    if (selectedProduct) {
      fetchBadges();
    }
  }, [selectedProduct]);
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/product-settings/getProducts');
      if (response.status !== 200) throw new Error('Failed to fetch products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBadges = async () => {
    console.log("asdas",selectedProduct?.ProductID)
    if(selectedProduct?.ProductID){
      try {
      
        const response = await axios.get(`/api/product-settings/getBadges?productKey=${selectedProduct?.ProductID}`);
        if (response.status !== 200) throw new Error('Failed to fetch badges');
        setBadges(response.data);
      } catch (error) {
        console.error('Error fetching badges:', error);
      }
    }

  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/product-settings/getCategories');
      if (response.status !== 200) throw new Error('Failed to fetch categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSaveProduct = async (updatedProduct: Partial<Product>) => {

  };

  const handlePreviewImage = (productKey: string, previewUrl: string | null) => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.ProductID === productKey
          ? { ...product, previewUrl }
          : product
      )
    );
    setPreviewImage(previewUrl);
  };

  const filteredProducts = selectedTemplate === 'all' 
    ? products 
    : products.filter(product => product.TemplateKey === selectedTemplate);

  if (loading || templatesLoading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="container py-6">
      <div className="mb-6">
        <Select
          value={selectedTemplate}
          onValueChange={setSelectedTemplate}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Şablon seçin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Şablonlar</SelectItem>
            {templates.map((template) => (
              <SelectItem key={template.TemplateKey} value={template.TemplateKey}>
                {template.TemplateName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <ProductList
          products={filteredProducts}
          categories={categories}
          selectedProduct={selectedProduct}
          onSelectProduct={setSelectedProduct}
        />
        <ProductEdit
          selectedProduct={selectedProduct}
          badges={badges}
          onSave={handleSaveProduct}
          onPreviewImage={handlePreviewImage}
        />
      </div>
    </div>
  );
}