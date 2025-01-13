"use client";

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Image as ImageIcon, Save, X } from 'lucide-react';
import TranslationsTabs from "@/components/shared/translations-tabs";
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

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
  BadgeKey: string;
  Code: string;
  translations: BadgeTranslation[];
}

interface Product {
  ProductKey: string;
  ProductName: string;
  CategoryID: number | null;
  CategoryName: string;
  ImageUrl: string;
  translations: ProductTranslation[];
  activeBadges: string[];
  OrderByWeight: boolean;
  PreparationTime: number;
  Weight: number;
}

interface ProductEditProps {
  product: Product | null;
  badges: Badge[];
  onSave: (product: Partial<Product>) => Promise<void>;
  onPreviewImage: (productKey: string, previewUrl: string | null) => void;
}

export function ProductEdit({ product, badges, onSave, onPreviewImage }: ProductEditProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && product) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const previewUrl = reader.result as string;
        setPreviewImage(previewUrl);
        onPreviewImage(product.ProductKey, previewUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!product) return;
    setIsUpdating(true);

    try {
      // Eğer yeni bir görsel seçildiyse, önce onu yükle
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('productKey', product.ProductKey);

        const response = await fetch('/api/product-settings/uploadImage', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload image');
        }

        const data = await response.json();
        if (!data.success || !data.imagePath) {
          throw new Error('Image upload response missing path');
        }

        // Ürünü güncelle
        await onSave({ ...product, ImageUrl: data.imagePath });
      } else {
        // Görsel değişmemişse sadece ürünü güncelle
        await onSave(product);
      }

      toast({
        title: "Başarılı",
        description: "Ürün başarıyla güncellendi",
      });

      // Preview'ı temizle
      setPreviewImage(null);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Hata",
        description: "Ürün güncellenirken bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!product) {
    return (
      <Card className="p-6 md:col-span-2">
        <div className="text-center text-muted-foreground">
          Düzenlemek için bir ürün seçin
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 md:col-span-2">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Ürün Düzenle</h3>
          <div className="space-x-2">
            <Button 
              size="sm"
              onClick={handleSave}
              disabled={isUpdating}
            >
              <Save className="w-4 h-4 mr-2" />
              {isUpdating ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Orjinal Ürün İsmi</Label>
              <Input
                value={product.ProductName}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label>Kategori</Label>
              <Input
                value={product.CategoryName}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label>Gramaj Bazlı Satış</Label>
              <div className="flex items-center h-10">
                <Switch
                  id="weight-based-sale"
                  checked={product.OrderByWeight}
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Hazırlık Süresi (dakika)</Label>
              <Input
                type="number"
                value={product.PreparationTime}
                onChange={(e) => {
                  onSave({ ...product, PreparationTime: parseInt(e.target.value) || 0 });
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Gramaj</Label>
              <Input
                type="number"
                value={product.Weight}
                onChange={(e) => {
                  onSave({ ...product, Weight: parseInt(e.target.value) || 0 });
                }}
              />
            </div>
          </div>


          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />

          <TranslationsTabs title="Çeviriler">
            {(lang) => (

              <div className="space-y-4">
                          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Ürün Görseli</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleImageClick}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Görsel Yükle
              </Button>
            </div>
            <div className="relative border rounded-md p-4">
              {(previewImage || product.ImageUrl) ? (
                <div className="space-y-4">
                  <Carousel className="w-full">
                    <CarouselContent>
                      <CarouselItem>
                        <div className="relative h-[200px] overflow-hidden rounded-md">
                          <img
                            src={previewImage || product.ImageUrl}
                            alt={product.ProductName}
                            className="w-full h-full object-cover"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              setPreviewImage(null);
                              setSelectedFile(null);
                              if (product) {
                                onPreviewImage(product.ProductKey, null);
                                if (!previewImage) {
                                  onSave({ ...product, ImageUrl: '' });
                                }
                              }
                            }}
                          >
                            Sil
                          </Button>
                          {previewImage && (
                            <div className="absolute bottom-2 right-2 bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs">
                              Kaydedilmedi
                            </div>
                          )}
                        </div>
                      </CarouselItem>
                    </CarouselContent>
                  </Carousel>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[200px] border-2 border-dashed rounded-md">
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Henüz görsel eklenmemiş
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

                <div className="space-y-2">
                  <Label>Ürün Adı</Label>
                  <Input
                    value={product.translations?.find(t => t.languageKey === lang.Key)?.name || ''}
                    onChange={(e) => {
                      const updatedTranslations = [...(product.translations || [])];
                      const index = updatedTranslations.findIndex(t => t.languageKey === lang.Key);
                      if (index >= 0) {
                        updatedTranslations[index] = { ...updatedTranslations[index], name: e.target.value };
                      } else {
                        updatedTranslations.push({ languageKey: lang.Key, name: e.target.value, description: '' });
                      }
                      onSave({ ...product, translations: updatedTranslations });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Açıklama</Label>
                  <Textarea
                    value={product.translations?.find(t => t.languageKey === lang.Key)?.description || ''}
                    onChange={(e) => {
                      const updatedTranslations = [...(product.translations || [])];
                      const index = updatedTranslations.findIndex(t => t.languageKey === lang.Key);
                      if (index >= 0) {
                        updatedTranslations[index] = { ...updatedTranslations[index], description: e.target.value };
                      } else {
                        updatedTranslations.push({ languageKey: lang.Key, name: '', description: e.target.value });
                      }
                      onSave({ ...product, translations: updatedTranslations });
                    }}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Rozetler</Label>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {badges.map((badge) => {
                      const translation = badge.translations?.find(t => t.languageKey === lang.Key)?.name || badge.Code;
                      
                      return (
                        <div key={badge.BadgeKey} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Switch
                              id={`badge-${badge.BadgeKey}-${lang.Key}`}
                              checked={product.activeBadges?.includes(badge.BadgeKey) || false}
                              onCheckedChange={(checked) => {
                                const updatedBadges = checked 
                                  ? [...(product.activeBadges || []), badge.BadgeKey]
                                  : (product.activeBadges || []).filter(b => b !== badge.BadgeKey);
                                onSave({ ...product, activeBadges: updatedBadges });
                              }}
                            />
                            <Label htmlFor={`badge-${badge.BadgeKey}-${lang.Key}`}>
                              {badge.Code} ({translation})
                            </Label>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </TranslationsTabs>

        </div>
      </div>
    </Card>
  );
}
