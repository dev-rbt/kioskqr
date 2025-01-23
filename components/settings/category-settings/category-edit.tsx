"use client";

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from "@/components/ui/switch";
import { Image as ImageIcon, Save } from 'lucide-react';
import TranslationsTabs from "@/components/translations-tabs";
import { Category } from '@/types/settings';
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import useCategoryStore from "@/store/settings/category";

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
  const [imageFiles, setImageFiles] = useState<{ [key: string]: File }>({});
  const [imagePreviews, setImagePreviews] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();
  const updateCategory = useCategoryStore(state => state.updateCategory);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    if (!category) return;

    setIsUpdating(true);
    try {
      // Upload all pending images first
      const uploadPromises = Object.entries(imageFiles).map(async ([langKey, file]) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('templateKey', category.TemplateKey);
        formData.append('menuGroupKey', category.MenuGroupKey);
        formData.append('menuGroupText', category.MenuGroupText);
        formData.append('langKey', langKey);

        const response = await fetch('/api/categories/uploadImage', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload image for ${langKey}`);
        }

        const data = await response.json();
        if (data.success && data.imagePath) {
          if (!category.Translations[langKey]) {
            category.Translations[langKey] = { ...defaultTranslation };
          }
          category.Translations[langKey].ImageUrl = data.imagePath;
        }
      });

      await Promise.all(uploadPromises);

      // Then update category data
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

      // Clear previews and files after successful save
      setImageFiles({});
      setImagePreviews({});

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
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="text-lg font-semibold">Kategori Düzenle</h3>
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
                if (!category.Translations[lang.Key]) {
                  category.Translations[lang.Key] = { ...defaultTranslation };
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
                          value={category.Translations[lang.Key].DisplayIndex}
                          className="h-8"
                          onChange={(e) => {
                            category.Translations[lang.Key].DisplayIndex = parseInt(e.target.value) || 0;
                            setCategory({ ...category });
                          }}
                          disabled={isUpdating}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-sm">Durum</Label>
                        <div className="px-3 py-1.5 rounded-md bg-muted flex items-center justify-between">
                          <span className="text-sm">
                            {category.Translations[lang.Key].IsActive ? 'Aktif' : 'Pasif'}
                          </span>
                          <Switch
                            checked={category.Translations[lang.Key].IsActive}
                            onCheckedChange={(checked) => {
                              category.Translations[lang.Key].IsActive = checked;
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
                      {(imagePreviews[lang.Key] || category.Translations[lang.Key].ImageUrl) ? (
                        <div className="relative group rounded-lg overflow-hidden">
                          <img
                            src={imagePreviews[lang.Key] || category.Translations[lang.Key].ImageUrl || ''}
                            alt={category.Translations[lang.Key].Name || category.MenuGroupText}
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
                      <Label className="text-sm">Kategori Adı</Label>
                      <Input
                        placeholder={`Kategori adı (${lang.Name})`}
                        value={category.Translations[lang.Key].Name}
                        className="h-8"
                        onChange={(e) => {
                          category.Translations[lang.Key].Name = e.target.value;
                          setCategory({ ...category });
                        }}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-sm">Açıklama</Label>
                      <Textarea
                        placeholder={`Kategori açıklaması (${lang.Name})`}
                        value={category.Translations[lang.Key].Description || ''}
                        rows={3}
                        className="resize-none"
                        onChange={(e) => {
                          category.Translations[lang.Key].Description = e.target.value || null;
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
    </Card>
  );
}
