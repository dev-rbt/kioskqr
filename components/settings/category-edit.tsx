"use client";

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from "@/components/ui/switch";
import { Image as ImageIcon, Save } from 'lucide-react';
import TranslationsTabs from "@/components/shared/translations-tabs";
import { Category } from '@/types/category';
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import useCategoryStore from "@/store/useCategoryStore";

interface CategoryEditProps {
  category: Category | null;
  onSave: (category: Category) => void;
  setCategory: (category: Category | null) => void;
}

const defaultTranslation = {
  Name: '',
  Description: null,
  ImageUrl: null,
  DisplayIndex: 0,
  IsActive: true
};

export function CategoryEdit({ category, onSave, setCategory }: CategoryEditProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const updateCategory = useCategoryStore(state => state.updateCategory);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    if (!category) return;

    setIsUpdating(true);
    try {
      const response = await fetch('/api/categories/updateCategory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          MenuGroupKey: category.MenuGroupKey,
          Translations: category.Translations
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update category translations');
      }

      updateCategory(category);
      onSave(category);

      toast({
        title: "Başarılı",
        description: "Kategori başarıyla güncellendi",
      });
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: "Hata",
        description: "Kategori güncellenirken bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageUpload = async (file: File, langCode: string) => {
    if (!category) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('templateKey', category.TemplateKey);
    formData.append('menuGroupKey', category.MenuGroupKey);
    formData.append('menuGroupText', category.MenuGroupText);
    formData.append('langCode', langCode);

    try {
      const response = await fetch('/api/categories/uploadImage', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();

      if (data.success && data.imagePath) {
        // Update category with new image URL
        if (!category.Translations[langCode]) {
          category.Translations[langCode] = { ...defaultTranslation };
        }
        category.Translations[langCode].ImageUrl = data.imagePath;
        setCategory({ ...category });

        toast({
          title: "Başarılı",
          description: "Görsel başarıyla yüklendi",
        });
      } else {
        throw new Error('Image upload response missing path');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Hata",
        description: "Görsel yüklenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  const handleImageClick = (langCode: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('data-lang-code', langCode);
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const langCode = event.target.getAttribute('data-lang-code') || '';
    
    if (file) {
      handleImageUpload(file, langCode);
    }
  };

  if (!category) {
    return (
      <Card className="md:col-span-2 h-[calc(100vh-6rem)] flex flex-col overflow-hidden">
        <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
          <ImageIcon className="w-12 h-12 mb-4 text-muted-foreground/50" />
          <p>Düzenlemek için bir kategori seçin</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="md:col-span-2 h-[calc(100vh-6rem)] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Kategori Düzenle</h3>
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
            <div className="space-y-1.5">
              <Label className="text-sm">Orjinal Kategori Adı</Label>
              <div className="px-3 py-1.5 rounded-md bg-muted text-sm">
                {category.MenuGroupText}
              </div>
            </div>
          </div>

          {/* Translations */}
          <div className="pt-2">
            <TranslationsTabs>
              {(lang) => {
                if (!category.Translations[lang.Code]) {
                  category.Translations[lang.Code] = { ...defaultTranslation };
                }
                
                return (
                  <div className="space-y-4 pt-4">
                    {/* Settings for each language */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-sm">Sıralama</Label>
                        <Input
                          type="number"
                          placeholder="Örn: 1"
                          value={category.Translations[lang.Code].DisplayIndex}
                          className="h-8"
                          onChange={(e) => {
                            category.Translations[lang.Code].DisplayIndex = parseInt(e.target.value) || 0;
                            setCategory({ ...category });
                          }}
                          disabled={isUpdating}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-sm">Durum</Label>
                        <div className="px-3 py-1.5 rounded-md bg-muted flex items-center justify-between">
                          <span className="text-sm">
                            {category.Translations[lang.Code].IsActive ? 'Aktif' : 'Pasif'}
                          </span>
                          <Switch
                            checked={category.Translations[lang.Code].IsActive}
                            onCheckedChange={(checked) => {
                              category.Translations[lang.Code].IsActive = checked;
                              setCategory({ ...category });
                            }}
                            disabled={isUpdating}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Image Upload for each language */}
                    <div className="space-y-2">
                      <Label className="text-sm">Kategori Görseli ({lang.Name})</Label>
                      {category.Translations[lang.Code].ImageUrl ? (
                        <div className="relative group rounded-lg overflow-hidden">
                          <img
                            src={category.Translations[lang.Code].ImageUrl || ''}
                            alt={category.Translations[lang.Code].Name || category.MenuGroupText}
                            className="w-full h-[160px] object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button 
                              variant="secondary" 
                              size="sm"
                              onClick={() => handleImageClick(lang.Code)}
                            >
                              Görseli Değiştir
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="border-2 border-dashed rounded-lg h-[160px] hover:border-primary/50 transition-colors cursor-pointer"
                          onClick={() => handleImageClick(lang.Code)}
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
                      <Label className="text-sm">Kategori Adı</Label>
                      <Input
                        placeholder={`Kategori adı (${lang.Name})`}
                        value={category.Translations[lang.Code].Name}
                        className="h-8"
                        onChange={(e) => {
                          category.Translations[lang.Code].Name = e.target.value;
                          setCategory({ ...category });
                        }}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-sm">Açıklama</Label>
                      <Textarea
                        placeholder={`Kategori açıklaması (${lang.Name})`}
                        value={category.Translations[lang.Code].Description || ''}
                        rows={3}
                        className="resize-none"
                        onChange={(e) => {
                          category.Translations[lang.Code].Description = e.target.value || null;
                          setCategory({ ...category });
                        }}
                      />
                    </div>
                  </div>
                );
              }}
            </TranslationsTabs>
          </div>
        </div>
      </div>

      {/* Footer with Save Button */}
      <div className="p-4 border-t bg-muted/50">
        <Button
          className="w-full"
          onClick={handleSave}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Kaydediliyor...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Değişiklikleri Kaydet
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
