"use client";

import { useState } from 'react';
import { useMenuStore } from '@/store/menu';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from "@/components/ui/separator";
import { languages } from '@/lib/i18n';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Image as ImageIcon, Save, Trash2, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TranslationsTabs from "@/components/shared/translations-tabs";

export function ProductSettings() {
  const { products, categories } = useMenuStore();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeLanguage, setActiveLanguage] = useState('tr');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedProductData = selectedProduct 
    ? products.find(p => p.id === selectedProduct)
    : null;

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Products List */}
      <Card className="p-4 md:col-span-1">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Ürünler</h3>
            <Button size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Yeni
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Ürün ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Kategoriler</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredProducts.map((product) => (
              <motion.button
                key={product.id}
                onClick={() => setSelectedProduct(product.id)}
                className={`w-full text-left rounded-lg transition-all overflow-hidden ${
                  selectedProduct === product.id
                    ? 'bg-primary text-primary-foreground ring-2 ring-primary'
                    : 'hover:bg-muted'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex gap-3">
                  {/* Product Image */}
                  <div className="relative w-20 h-20">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1 p-2">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm opacity-70">{product.price} ₺</div>
                    
                    {/* Category Badge */}
                    <div className="mt-1">
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {categories.find(c => c.id === product.category)?.name || 'Kategori Yok'}
                      </span>
                    </div>
                    
                    {/* Badges */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {product.isSpicy && (
                        <span className="px-1.5 py-0.5 text-xs rounded-full bg-red-100 text-red-600">
                          Acılı
                        </span>
                      )}
                      {product.isVegetarian && (
                        <span className="px-1.5 py-0.5 text-xs rounded-full bg-green-100 text-green-600">
                          Vejetaryen
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </Card>

      {/* Product Edit Form */}
      <Card className="p-6 md:col-span-2">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Ürün Düzenle</h3>
            <div className="space-x-2">
              <Button variant="destructive" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Sil
              </Button>
              <Button size="sm">
                <Save className="w-4 h-4 mr-2" />
                Kaydet
              </Button>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <Label>Ürün Görseli</Label>
            {selectedProductData?.image ? (
              <div className="relative group">
                <img
                  src={selectedProductData.image}
                  alt={selectedProductData.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button variant="secondary">Görseli Değiştir</Button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                <div className="flex flex-col items-center gap-2">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Görsel yüklemek için tıklayın veya sürükleyin
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fiyat (₺)</Label>
              <Input 
                type="number" 
                placeholder="0.00"
                defaultValue={selectedProductData?.price}
              />
            </div>
            <div className="space-y-2">
              <Label>Kategori</Label>
              <Select defaultValue={selectedProductData?.category}>
                <SelectTrigger>
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Product Details */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Hazırlama Süresi (dk)</Label>
              <Input 
                type="number" 
                placeholder="15"
                defaultValue={selectedProductData?.prepTime}
              />
            </div>
            <div className="space-y-2">
              <Label>Gramaj (g)</Label>
              <Input 
                type="number" 
                placeholder="250"
                defaultValue={selectedProductData?.weight || ''}
              />
            </div>
            <div className="space-y-2">
              <Label>Kalori (kcal)</Label>
              <Input 
                type="number" 
                placeholder="350"
                defaultValue={selectedProductData?.calories}
              />
            </div>
          </div>

          {/* Translations */}
          <TranslationsTabs title="Çeviriler">
            {(lang) => (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Ürün Adı</Label>
                  <Input 
                    placeholder={`Ürün adı (${lang.Name})`}
                    defaultValue={lang.Code === '🇹🇷' ? selectedProductData?.name : ''}
                    onChange={(e) => console.log(`Name changed for ${lang.Code}:`, e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Açıklama</Label>
                  <Textarea 
                    placeholder={`Ürün açıklaması (${lang.Name})`}
                    defaultValue={lang.Code === '🇹🇷' ? selectedProductData?.description : ''}
                    onChange={(e) => console.log(`Description changed for ${lang.Code}:`, e.target.value)}
                  />
                </div>
                
                {/* Badge Translations */}
                <div className="space-y-4">
                  <Label>Rozetler</Label>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Spicy Badge */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Switch 
                          id={`spicy-${lang.Code}`}
                          defaultChecked={lang.Code === '🇹🇷' && selectedProductData?.isSpicy}
                        />
                        <Label htmlFor={`spicy-${lang.Code}`}>Acılı</Label>
                      </div>
                      <Input 
                        placeholder="Acılı rozet çevirisi" 
                        defaultValue={lang.Code === '🇹🇷' ? 'Acılı' : ''}
                      />
                    </div>

                    {/* Vegetarian Badge */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Switch 
                          id={`vegetarian-${lang.Code}`}
                          defaultChecked={lang.Code === '🇹🇷' && selectedProductData?.isVegetarian}
                        />
                        <Label htmlFor={`vegetarian-${lang.Code}`}>Vejetaryen</Label>
                      </div>
                      <Input 
                        placeholder="Vejetaryen rozet çevirisi"
                        defaultValue={lang.Code === '🇹🇷' ? 'Vejetaryen' : ''}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TranslationsTabs>
        </div>
      </Card>
    </div>
  );
}