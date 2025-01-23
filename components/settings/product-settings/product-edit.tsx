"use client";

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Image as ImageIcon, Save } from 'lucide-react';
import TranslationsTabs from "@/components/translations-tabs";
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Badge, Product } from '@/types/settings';
import axios from 'axios';
import ReactStars from "react-rating-stars-component";

interface ProductEditProps {
  selectedProduct: Product | null;
  badges: Badge[];
  onSave: (product: Partial<Product>) => Promise<void>;
  onPreviewImage: (productKey: string, previewUrl: string | null) => void;
}

export function ProductEdit({ selectedProduct, badges, onSave, onPreviewImage }: ProductEditProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [imageFiles, setImageFiles] = useState<{ [key: string]: File }>({});
  const [imagePreviews, setImagePreviews] = useState<{ [key: string]: string }>({});
  const [editedProduct, setEditedProduct] = useState<Product | null>(selectedProduct);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditedProduct(selectedProduct);
  }, [selectedProduct]);

  const handleSave = async () => {
    if (!editedProduct) return;

    setIsUpdating(true);
    try {
      // Upload all pending images first
      const uploadResults = await Promise.all(
        Object.entries(imageFiles).map(async ([langKey, file]) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('productKey', editedProduct.ProductID);
          formData.append('langKey', langKey);

          const response = await axios.post('/api/product-settings/uploadImage', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          if (response.status !== 200) {
            throw new Error(`Failed to upload image for ${langKey}`);
          }

          if (response.data.success && response.data.imagePath) {
            return {
              langKey,
              imagePath: response.data.imagePath
            };
          }
          return null;
        })
      );

      // Update translations with uploaded images
      const updatedTranslations = { ...editedProduct.Translations };
      uploadResults.forEach(result => {
        if (result) {
          const { langKey, imagePath } = result;
          updatedTranslations[langKey] = {
            ...(updatedTranslations[langKey] || {
              languageKey: langKey,
              name: editedProduct.OriginalName,
              description: null
            }),
            ImageUrl: imagePath
          };
        }
      });

      // Update state with new translations
      await setEditedProduct({ ...editedProduct, Translations: updatedTranslations });

      // Prepare data for API
      const productData = {
        ProductKey: editedProduct.ProductID,
        GroupID: editedProduct.GroupID,
        CategoryID: editedProduct.CategoryID,
        ProductCode: editedProduct.ProductCode,
        PreparationTime: editedProduct.PreparationTime,
        Weight: editedProduct.Weight,
        Rating: editedProduct.Rating,
        Calories: editedProduct.Calories,
        Translations: updatedTranslations,
        badges: badges.map(badge => ({
          BadgeKey: badge.BadgeKey,
          IsActive: editedProduct.activeBadges?.some(b => b.BadgeKey === badge.BadgeKey && b.IsActive) || false
        }))
      };

      // Update product data
      const response = await axios.put('/api/product-settings/updateProduct', productData);

      if (response.status !== 200) {
        throw new Error('Failed to update product');
      }

      // Then update product data in parent component
      await onSave(editedProduct);

      // Clear previews and files after successful save
      setImageFiles({});
      setImagePreviews({});

      toast({
        title: "Başarılı",
        description: "Ürün başarıyla güncellendi",
      });
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Hata",
        description: "Ürün güncellenirken bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImagePreview = (file: File, langKey: string) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviews(prev => ({
        ...prev,
        [langKey]: reader.result as string
      }));
    };
    reader.readAsDataURL(file);

    setImageFiles(prev => ({
      ...prev,
      [langKey]: file
    }));
  };

  const handleImageClick = (langKey: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('data-lang-key', langKey);
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const langKey = event.target.getAttribute('data-lang-key') || '';

    if (file) {
      handleImagePreview(file, langKey);
    }
  };

  if (!selectedProduct) {
    return (
      <Card className="md:col-span-2 h-[calc(100vh-6rem)] flex flex-col overflow-hidden">
        <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
          <ImageIcon className="w-12 h-12 mb-4 text-muted-foreground/50" />
          <p>Düzenlemek için bir ürün seçin</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="md:col-span-2 h-[calc(100vh-6rem)] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="text-lg font-semibold">Ürün Düzenle</h3>
        <Button
          onClick={handleSave}
          disabled={isUpdating}
          size="sm"
        >
          {isUpdating ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Kaydediliyor...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Kaydet
            </>
          )}
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
        <div className="p-4 space-y-4">
          {/* Basic Info */}
          <div className="grid gap-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm">Orjinal Ürün İsmi</Label>
                <div className="px-3 py-1.5 rounded-md bg-muted text-sm">
                  {editedProduct?.OriginalName}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Kategori</Label>
                <div className="px-3 py-1.5 rounded-md bg-muted text-sm">
                  {editedProduct?.CategoryName}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Gramaj Bazlı Satış</Label>
                <div className="px-3 py-1.5 rounded-md bg-muted flex items-center justify-between">
                  <span className="text-sm">
                    {editedProduct?.OrderByWeight ? 'Aktif' : 'Pasif'}
                  </span>
                  <Switch
                    checked={editedProduct?.OrderByWeight || undefined}
                    disabled
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm">Hazırlık Süresi (dakika)</Label>
                <Input
                  type="number"
                  value={editedProduct?.PreparationTime}
                  className="h-8"
                  onChange={(e) => {
                    if (!editedProduct) return;
                    setEditedProduct({ ...editedProduct, PreparationTime: parseInt(e.target.value) || 0 });
                  }}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Gramaj</Label>
                <Input
                  type="number"
                  value={editedProduct?.Weight}
                  className="h-8"
                  onChange={(e) => {
                    if (!editedProduct) return;
                    setEditedProduct({ ...editedProduct, Weight: parseInt(e.target.value) || 0 });
                  }}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Kalori</Label>
                <Input
                  type="number"
                  value={editedProduct?.Calories}
                  className="h-8"
                  onChange={(e) => {
                    if (!editedProduct) return;
                    setEditedProduct({ ...editedProduct, Calories: parseInt(e.target.value) || 0 });
                  }}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Rating</Label>
                <div className="flex items-center gap-2">
                  <ReactStars
                    count={5}
                    value={editedProduct?.Rating || 0}
                    onChange={(value: number) => {
                      if (!editedProduct) return;
                      setEditedProduct({ ...editedProduct, Rating: value });
                    }}
                    size={24}
                    isHalf={true}
                    char="★"
                    color="gray"
                    activeColor="#facc15"
                  />
                  <span className="text-sm text-muted-foreground">
                    {editedProduct?.Rating || '0.0'}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Translations */}
          <div className="pt-2">
            <TranslationsTabs>
              {(lang) => {
                const translation = editedProduct?.Translations?.[lang.Key] || {
                  MenuGroupKey: '',
                  LanguageKey:  lang.Key,
                  Name: null,
                  Description: null,
                  ImageUrl: null,
                  DisplayIndex: 0,
                  IsActive: undefined
                };

                return (
                  <div className="space-y-4 pt-4">
                    {/* Image Upload for each language */}
                    <div className="space-y-2">
                      <Label className="text-sm">Ürün Görseli ({lang.Name})</Label>
                      {(imagePreviews[lang.Key] || translation.ImageUrl) ? (
                        <div className="relative group rounded-lg overflow-hidden">
                          <img
                            src={imagePreviews[lang.Key] || translation.ImageUrl || undefined}
                            alt={editedProduct?.OriginalName}
                            className="w-full h-[160px] object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleImageClick(lang.Key)}
                            >
                              Görseli Değiştir
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="border-2 border-dashed rounded-lg h-[160px] hover:border-primary/50 transition-colors cursor-pointer"
                          onClick={() => handleImageClick(lang.Key)}
                        >
                          <div className="h-full flex flex-col items-center justify-center gap-2">
                            <ImageIcon className="w-8 h-8 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              Görsel yüklemek için tıklayın ({lang.Name})
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label className="text-sm">Ürün Adı</Label>
                      <Input
                        placeholder={`Ürün adı (${lang.Name})`}
                        value={translation.Name || ''}
                        className="h-8"
                        onChange={(e) => {
                          if (!editedProduct) return;
                          const updatedTranslations = { ...editedProduct.Translations };
                          updatedTranslations[lang.Key] = {
                            ...translation,
                            Name: e.target.value
                          };
                          setEditedProduct({ ...editedProduct, Translations: updatedTranslations });
                        }}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label className="text-sm">Açıklama</Label>
                      <Textarea
                        placeholder={`Ürün açıklaması (${lang.Name})`}
                        value={translation.Description || ''}
                        rows={3}
                        className="resize-none"
                        onChange={(e) => {
                          if (!editedProduct) return;
                          const updatedTranslations = { ...editedProduct.Translations };
                          updatedTranslations[lang.Key] = {
                            ...translation,
                            Description: e.target.value
                          };
                          setEditedProduct({ ...editedProduct, Translations: updatedTranslations });
                        }}
                      />
                    </div>

                    <div className="space-y-4">
                      <Label className="text-sm">Rozetler</Label>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {badges.map((badge) => {
                          console.log(badge)
                          const badgeTranslation = badge.translations[lang.Key].name || badge.Code;

                          return (
                            <div key={badge.BadgeKey} className="flex items-center gap-2">
                              <Switch
                                id={`badge-${badge.BadgeKey}-${lang.Key}`}
                                checked={editedProduct?.activeBadges?.some(b => b.BadgeKey.includes(badge.BadgeKey) && b.IsActive) || undefined}
                                onCheckedChange={(checked) => {
                                  if (!editedProduct) return;
                                  const updatedBadges = checked
                                    ? [...(editedProduct.activeBadges || []), { ...badge, IsActive: true }]
                                    : (editedProduct.activeBadges || []).filter(b => b.BadgeKey !== badge.BadgeKey);
                                  setEditedProduct({ ...editedProduct, activeBadges: updatedBadges });
                                }}
                              />
                              <Label htmlFor={`badge-${badge.BadgeKey}-${lang.Key}`} className="text-sm">
                                {badge.Code} ({badgeTranslation})
                              </Label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }}
            </TranslationsTabs>
          </div>
        </div>
      </div>
    </Card >
  );
}
