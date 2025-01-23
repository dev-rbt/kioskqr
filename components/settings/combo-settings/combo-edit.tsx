"use client";

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Image as ImageIcon, Save, GripVertical } from 'lucide-react';
import TranslationsTabs from "@/components/translations-tabs";
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ComboProduct } from '@/types/settings';

interface ComboEditProps {
  selectedCombo: ComboProduct | null;
  onSave: (combo: ComboProduct) => void;
  setCombo: (combo: ComboProduct | null) => void;
}

const defaultTranslation = {
  name: '',
  description: '',
  ImageUrl: undefined,
  IsActive: true
};

export function ComboEdit({ selectedCombo: combo, onSave, setCombo }: ComboEditProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [imageFiles, setImageFiles] = useState<{ [key: string]: File }>({});
  const [imagePreviews, setImagePreviews] = useState<{ [key: string]: string }>({});
  const [openGroups, setOpenGroups] = useState<number[]>([]);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (combo?.comboGroups) {
      setOpenGroups([]);
    }
  }, [combo]);

  const toggleGroup = (index: number) => {
    setOpenGroups(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleSave = async () => {
    if (!combo) return;

    setIsUpdating(true);
    try {
      // Upload all pending images first
      const uploadPromises = Object.entries(imageFiles).map(async ([langKey, file]) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('comboKey', combo.ComboKey);
        formData.append('langKey', langKey);

        const response = await fetch('/api/combo-settings/uploadImage', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload image for ${langKey}`);
        }

        const data = await response.json();
        if (data.success && data.imagePath) {
          const translationIndex = combo.translations.findIndex(t => t.languageKey === langKey);
          if (translationIndex === -1) {
            combo.translations.push({ ...defaultTranslation, languageKey: langKey, ImageUrl: data.imagePath });
          } else {
            combo.translations[translationIndex].ImageUrl = data.imagePath;
          }
        }
      });

      await Promise.all(uploadPromises);

      // Then update combo data
      const response = await fetch('/api/combo-settings/updateComboMenu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(combo),
      });

      if (!response.ok) {
        throw new Error('Failed to update combo menu');
      }

      onSave(combo);

      // Clear previews and files after successful save
      setImageFiles({});
      setImagePreviews({});

      toast({
        title: "Başarılı",
        description: "Combo menü başarıyla güncellendi",
      });
    } catch (error) {
      console.error('Error updating combo:', error);
      toast({
        title: "Hata",
        description: "Combo menü güncellenirken bir hata oluştu",
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

  if (!combo) {
    return (
      <Card className="md:col-span-2 h-[calc(100vh-6rem)] flex flex-col overflow-hidden">
        <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
          <ImageIcon className="w-12 h-12 mb-4 text-muted-foreground/50" />
          <p>Düzenlemek için bir combo menü seçin</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="md:col-span-2 h-[calc(100vh-6rem)] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="text-lg font-semibold">Combo Menü Düzenle</h3>
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
              <Label className="text-sm">Orjinal Combo Adı</Label>
              <div className="px-3 py-1.5 rounded-md bg-muted text-sm">
                {combo.ComboName}
              </div>
            </div>
          </div>

          {/* Translations */}
          <div className="pt-2">
            <TranslationsTabs>
              {(lang) => {
                const translation = combo.translations.find(t => t.languageKey === lang.Key) || { ...defaultTranslation, languageKey: lang.Key };

                return (
                  <div className="space-y-4 pt-4">
                    {/* Image Upload for each language */}
                    <div className="space-y-2">
                      <Label className="text-sm">Menü Görseli ({lang.Name})</Label>
                      {(imagePreviews[lang.Key] || translation.ImageUrl) ? (
                        <div className="relative group rounded-lg overflow-hidden">
                          <img
                            src={imagePreviews[lang.Key] || translation.ImageUrl || ''}
                            alt={translation.name || combo.ComboName}
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
                      <Label className="text-sm">Menü Adı</Label>
                      <Input
                        placeholder={`Menü adı (${lang.Name})`}
                        value={translation.name}
                        className="h-8"
                        onChange={(e) => {
                          const translationIndex = combo.translations.findIndex(t => t.languageKey === lang.Key);
                          if (translationIndex === -1) {
                            combo.translations.push({ ...translation, name: e.target.value });
                          } else {
                            combo.translations[translationIndex].name = e.target.value;
                          }
                          setCombo({ ...combo });
                        }}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-sm">Açıklama</Label>
                      <Textarea
                        placeholder={`Menü açıklaması (${lang.Name})`}
                        value={translation.description || ''}
                        rows={3}
                        className="resize-none"
                        onChange={(e) => {
                          const translationIndex = combo.translations.findIndex(t => t.languageKey === lang.Key);
                          if (translationIndex === -1) {
                            combo.translations.push({ ...translation, description: e.target.value });
                          } else {
                            combo.translations[translationIndex].description = e.target.value;
                          }
                          setCombo({ ...combo });
                        }}
                      />
                    </div>
                  </div>
                );
              }}
            </TranslationsTabs>
          </div>

          {/* Combo Groups */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label> ({combo.comboGroups?.length || 0})</Label>
            </div>

            <div className="space-y-4">
              {combo.comboGroups?.map((group, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-4">
                    {/* Group Header */}
                    <div className="flex items-center gap-4">
                      <GripVertical className="w-5 h-5 text-muted-foreground cursor-move" />
                      <div className="flex-1">
                        <div className="grid grid-cols-12 items-center gap-4">
                          <div className="col-span-6">
                            <Input 
                              placeholder="Grup Adı" 
                              value={group.groupName}
                              onChange={(e) => {
                                combo.comboGroups[index].groupName = e.target.value;
                                setCombo({ ...combo });
                              }}
                            />
                          </div>
                          <div className="col-span-2 flex items-center gap-2">
                            <Label className="text-muted-foreground">Maks. Seçim:</Label>
                            <Input 
                              type="number" 
                              value={group.maxQuantity}
                              className="w-20"
                              disabled
                            />
                          </div>
                          <div className="col-span-4 flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Switch 
                                checked={group.IsForcedGroup}
                                disabled
                              />
                              <Label className="text-muted-foreground">Zorunlu Seçim</Label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Group Items */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Grup Ürünleri ({group.items?.length || 0})</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleGroup(index)}
                        >
                          {openGroups.includes(index) ? 'Ürünleri Gizle' : 'Ürünleri Göster'}
                        </Button>
                      </div>
                      {openGroups.includes(index) && (
                        <div className="grid grid-cols-2 gap-2">
                          {group.items?.map((item, itemIndex) => (
                            <div 
                              key={itemIndex}
                              className="flex items-center gap-3 p-2 bg-muted rounded-lg"
                            >
                              <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">{item.product.ProductName}</div>
                                <div className="text-sm text-muted-foreground">
                                  +{item.extraPriceTakeOut_TL} ₺
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}

              {combo.comboGroups?.length === 0 && (
                <div className="text-center p-8 text-muted-foreground">
                  Bu combo menüye henüz grup eklenmemiş
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
