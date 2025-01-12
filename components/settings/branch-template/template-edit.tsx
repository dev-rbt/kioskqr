"use client";

import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Image as ImageIcon, Save, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Template } from '@/types/template';
import { useToast } from '@/hooks/use-toast';
import useTemplateStore from "@/store/useTemplateStore";
import { ColorPicker } from '@/components/ui/color-picker';
import useLanguageStore from '@/store/useLanguageStore';
import useBranchStore from '@/store/useBranchStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface TemplateEditProps {
  template: Template | null;
  onSave: (template: Template) => void;
  setTemplate: (template: Template | null) => void;
}

export function TemplateEdit({ template, onSave, setTemplate }: TemplateEditProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);
  const { toast } = useToast();
  const updateTemplate = useTemplateStore(state => state.updateTemplate);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const { languages } = useLanguageStore();
  const { branches } = useBranchStore();
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [branchSearchQuery, setBranchSearchQuery] = useState('');
  const [activeLanguages, setActiveLanguages] = useState<Array<{ LanguageKey: string; IsActive: boolean }>>(
    languages.map(lang => ({
      LanguageKey: lang.Key,
      IsActive: template?.Languages?.some(tl => tl.LanguageKey === lang.Key && tl.IsActive) || false,
    }))
  );

  const filteredBranches = branches.filter(branch =>
    branch.BranchName.toLowerCase().includes(branchSearchQuery.toLowerCase())
  );

  const handleSave = async () => {
    if (!template) return;

    setIsUpdating(true);
    try {
      const response = await fetch('/api/templates/updateTemplate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          TemplateKey: template.TemplateKey,
          TemplateName: template.TemplateName,
          MainColor: template.MainColor,
          SecondColor: template.SecondColor,
          AccentColor: template.AccentColor,
          DefaultLanguageKey: template.DefaultLanguageKey,
          LogoUrl: template.LogoUrl,
          Languages: activeLanguages,
          Banners: template.Banners,
          BranchIDs: selectedBranches
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update template');
      }

      updateTemplate(template);
      onSave(template);

      toast({
        title: "Başarılı",
        description: "Şablon başarıyla güncellendi",
      });
    } catch (error) {
      console.error('Error updating template:', error);
      toast({
        title: "Hata",
        description: "Şablon güncellenirken bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogoUpload = async (file: File) => {
    if (!template) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('templateKey', template.TemplateKey);
    formData.append('type', 'logo');

    try {
      const response = await fetch('/api/templates/uploadImage', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload logo');
      }

      const data = await response.json();

      if (data.success && data.imagePath) {
        setTemplate({
          ...template,
          LogoUrl: data.imagePath
        });
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Hata",
        description: "Logo yüklenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  const handleBannerUpload = async (file: File) => {
    if (!template) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('templateKey', template.TemplateKey);
    formData.append('type', 'banner');

    try {
      const response = await fetch('/api/templates/uploadImage', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload banner');
      }

      const data = await response.json();

      if (data.success && data.imagePath) {
        setTemplate({
          ...template,
          Banners: [...(template.Banners || []), { BannerUrl: data.imagePath }]
        });
      }
    } catch (error) {
      console.error('Error uploading banner:', error);
      toast({
        title: "Hata",
        description: "Banner yüklenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  const handleBranchToggle = (branchId: string) => {
    setSelectedBranches(prev => {
      if (prev.includes(branchId)) {
        return prev.filter(id => id !== branchId);
      } else {
        return [...prev, branchId];
      }
    });
  };

  if (!template) {
    return (
      <Card className="md:col-span-2 h-[calc(100vh-6rem)] flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          Lütfen düzenlemek için bir şablon seçin veya yeni bir şablon oluşturun
        </div>
      </Card>
    );
  }

  return (
    <Card className="md:col-span-2 h-[calc(100vh-6rem)] overflow-auto">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Şablon Düzenle</h3>
          <Button onClick={handleSave} disabled={isUpdating}>
            <Save className="h-4 w-4 mr-2" />
            {isUpdating ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Şablon Adı</Label>
            <Input
              value={template.TemplateName}
              onChange={(e) => setTemplate({ ...template, TemplateName: e.target.value })}
              placeholder="Şablon adı giriniz..."
            />
          </div>

          {/* Kullanılan Şubeler */}
          <div>
            <Label>Kullanılan Şubeler</Label>
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Şube ara..."
                  className="pl-8"
                  value={branchSearchQuery}
                  onChange={(e) => setBranchSearchQuery(e.target.value)}
                />
              </div>
              <ScrollArea className="h-[200px] border rounded-md">
                <div className="p-4 space-y-2">
                  {filteredBranches.map((branch) => (
                    <div
                      key={branch.BranchID}
                      className="flex items-center justify-between p-2 border rounded-md"
                    >
                      <span>{branch.BranchName}</span>
                      <Switch
                        checked={selectedBranches.includes(branch.BranchID.toString())}
                        onCheckedChange={() => handleBranchToggle(branch.BranchID.toString())}
                      />
                    </div>
                  ))}
                  {filteredBranches.length === 0 && (
                    <div className="text-center text-muted-foreground py-4">
                      {branchSearchQuery
                        ? "Aranan şube bulunamadı"
                        : "Şube bulunamadı"}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          <div>
            <Label>Logo</Label>
            <div className="mt-2 flex items-center space-x-4">
              {template.LogoUrl && (
                <img
                  src={template.LogoUrl}
                  alt="Logo"
                  className="h-12 w-12 object-contain"
                />
              )}
              <Button
                variant="outline"
                onClick={() => logoInputRef.current?.click()}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Logo Yükle
              </Button>
              <input
                type="file"
                ref={logoInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleLogoUpload(file);
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-base">Bannerlar</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => bannerInputRef.current?.click()}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Banner Ekle
              </Button>
              <input
                type="file"
                ref={bannerInputRef}
                className="hidden"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  files.forEach(file => handleBannerUpload(file));
                }}
              />
            </div>
            <div className="relative border rounded-md p-4">
              {template.Banners && template.Banners.length > 0 ? (
                <div className="space-y-4">
                  <div className="relative h-[200px] overflow-hidden rounded-md">
                    <div 
                      className="flex transition-transform duration-300 ease-in-out h-full"
                      style={{ 
                        transform: `translateX(-${currentBanner * 100}%)`,
                        width: `${template.Banners.length * 100}%`
                      }}
                    >
                      {template.Banners.map((banner, index) => (
                        <div 
                          key={index}
                          className="relative w-full h-full flex-shrink-0"
                        >
                          <img
                            src={banner.BannerUrl}
                            alt={`Banner ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              const newBanners = [...template.Banners];
                              newBanners.splice(index, 1);
                              setTemplate({ ...template, Banners: newBanners });
                              if (currentBanner >= newBanners.length) {
                                setCurrentBanner(Math.max(0, newBanners.length - 1));
                              }
                            }}
                          >
                            Sil
                          </Button>
                        </div>
                      ))}
                    </div>
                    {template.Banners.length > 1 && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute left-2 top-1/2 -translate-y-1/2"
                          onClick={() => setCurrentBanner((prev) => (prev > 0 ? prev - 1 : template.Banners.length - 1))}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => setCurrentBanner((prev) => (prev < template.Banners.length - 1 ? prev + 1 : 0))}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                  <div className="flex justify-center gap-2">
                    {template.Banners.map((_, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className={cn(
                          "w-2 h-2 p-0 rounded-full",
                          currentBanner === index && "bg-primary"
                        )}
                        onClick={() => setCurrentBanner(index)}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[200px] border-2 border-dashed rounded-md">
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">Henüz banner eklenmemiş</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <Label>Kullanılan Diller</Label>
            <div className="space-y-2">
              <div className="relative">
                <ScrollArea className="h-[200px] border rounded-md">
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-2">
                      {languages.map((language) => (
                        <div
                          key={language.Key}
                          className="flex items-center justify-between p-2 border rounded-md"
                        >
                          <div className="flex items-center gap-2">
                            <span>{language.Code}</span>
                            <span className="text-sm">{language.Name}</span>
                          </div>
                          <Switch
                            checked={activeLanguages.find(l => l.LanguageKey === language.Key)?.IsActive || false}
                            onCheckedChange={(checked) => {
                              setActiveLanguages(prev =>
                                prev.map(lang =>
                                  lang.LanguageKey === language.Key
                                    ? { ...lang, IsActive: checked }
                                    : lang
                                )
                              );
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>

          <div>
            <Label>Varsayılan Dil</Label>
            <select
              className="w-full mt-1 p-2 border rounded-md"
              value={template.DefaultLanguageKey}
              onChange={(e) => setTemplate({ ...template, DefaultLanguageKey: e.target.value })}
            >
              <option value="">Seçiniz...</option>
              {languages
                .filter(lang => activeLanguages.find(l => l.LanguageKey === lang.Key)?.IsActive)
                .map(lang => (
                  <option key={lang.Key} value={lang.Key}>
                    {lang.Code} {lang.Name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <Label>Tema Renkleri</Label>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center space-y-2 p-2 border rounded-md">
                  <span className="text-sm">Ana Renk</span>
                  <ColorPicker
                    value={template.MainColor}
                    onChange={(color) => setTemplate({ ...template, MainColor: color })}
                  />
                </div>
                <div className="flex flex-col items-center space-y-2 p-2 border rounded-md">
                  <span className="text-sm">İkincil Renk</span>
                  <ColorPicker
                    value={template.SecondColor}
                    onChange={(color) => setTemplate({ ...template, SecondColor: color })}
                  />
                </div>
                <div className="flex flex-col items-center space-y-2 p-2 border rounded-md">
                  <span className="text-sm">Vurgu Rengi</span>
                  <ColorPicker
                    value={template.AccentColor}
                    onChange={(color) => setTemplate({ ...template, AccentColor: color })}
                  />
                </div>
              </div>

              <div className="border rounded-md p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium">Tema Önizleme</span>
                </div>
                <div className="space-y-4">
                  {/* Header Preview */}
                  <div 
                    className="h-16 rounded-md flex items-center px-4"
                    style={{ backgroundColor: template.MainColor }}
                  >
                    <div className="h-8 w-8 rounded bg-white" />
                    <div className="ml-4 h-4 w-24 rounded" style={{ backgroundColor: template.SecondColor }} />
                  </div>

                  {/* Content Preview */}
                  <div className="space-y-2">
                    <div className="h-4 w-3/4 rounded" style={{ backgroundColor: template.SecondColor }} />
                    <div className="h-4 w-1/2 rounded" style={{ backgroundColor: template.SecondColor }} />
                    <div 
                      className="h-10 w-32 rounded flex items-center justify-center text-white mt-4"
                      style={{ backgroundColor: template.AccentColor }}
                    >
                      Button
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}