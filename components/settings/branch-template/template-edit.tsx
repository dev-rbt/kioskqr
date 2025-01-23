"use client";

import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Image as ImageIcon, Save, Search, X } from 'lucide-react';
import { SettingsTemplate, Template } from '@/types/settings';
import { useToast } from '@/hooks/use-toast';
import useTemplateStore from "@/store/settings/template";
import { ColorPicker } from '@/components/ui/color-picker';
import useLanguageStore from '@/store/settings/language';
import useSettingBranchStore from '@/store/settings/branch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TemplateEditProps {
  template: SettingsTemplate | null;
  onSave: (template: Template) => void;
  setTemplate: (template: Template | null) => void;
}

export function TemplateEdit({ template, onSave, setTemplate }: TemplateEditProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const [pendingLogo, setPendingLogo] = useState<File | null>(null);
  const [pendingBanners, setPendingBanners] = useState<File[]>([]);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const [previewBanners, setPreviewBanners] = useState<string[]>([]);
  const [showLogoModal, setShowLogoModal] = useState(false);
  const { toast } = useToast();
  const {updateTemplate} = useTemplateStore();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const { languages } = useLanguageStore();
  const { branches } = useSettingBranchStore();
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [branchSearchQuery, setBranchSearchQuery] = useState('');
  const [activeLanguages, setActiveLanguages] = useState<Array<{ LanguageKey: string; IsActive: boolean }>>([]);

  // Template değiştiğinde şubeleri ve dilleri güncelle
  useEffect(() => {
    if (template) {
      // Şubeleri ayarla
      setSelectedBranches(template.Branches?.map(branch => branch.BranchID.toString()) || []);

      // Dilleri ayarla
      const templateLanguages = template.Languages || [];
      setActiveLanguages(
        languages.map(lang => ({
          LanguageKey: lang.Key,
          IsActive: templateLanguages.some(tl => tl.Key === lang.Key)
        }))
      );
    }
  }, [template?.TemplateKey, languages]);

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on("select", () => {
      setCurrentBanner(api.selectedScrollSnap());
    });
  }, [api]);

  const filteredBranches = branches.filter(branch =>
    branch.BranchName.toLowerCase().includes(branchSearchQuery.toLowerCase())
  );

  const handleSave = async () => {
    if (!template) return;

    setIsUpdating(true);
    try {
      // Önce logo ve banner'ları yükle
      let logoUrl = template.LogoUrl;
      if (pendingLogo) {
        console.log('Uploading new logo...');
        const formData = new FormData();
        formData.append('file', pendingLogo);
        formData.append('templateKey', template.TemplateKey);
        formData.append('type', 'logo');

        const response = await fetch('/api/settings-template/uploadImage', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload logo');
        }

        const data = await response.json();
        if (data.success) {
          console.log('Logo uploaded successfully:', data.imagePath);
          logoUrl = data.imagePath;
        }
      }

      // Mevcut banner'ları filtrele (blob URL'leri hariç)
      const existingBanners = template?.Banners?.filter(banner => 
        !banner?.ImageUrl?.startsWith('blob:') 
      );

      // Yeni banner'ları yükle
      const uploadedBanners = [...existingBanners];
      for (const file of pendingBanners) {
        console.log('Uploading banner...');
        const formData = new FormData();
        formData.append('file', file);
        formData.append('templateKey', template.TemplateKey);
        formData.append('type', 'banner');

        const response = await fetch('/api/settings-template/uploadImage', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload banner');
        }

        const data = await response.json();
        if (data.success) {
          console.log('Banner uploaded successfully:', data.imagePath);
          uploadedBanners.push({ BannerUrl: data.imagePath });
        }
      }

      console.log('Updating template with logo:', logoUrl);
      // Template'i güncelle
      const response = await fetch('/api/settings-template/updateTemplate', {
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
          LogoUrl: logoUrl,
          Languages: activeLanguages,
          Banners: uploadedBanners,
          BranchIDs: selectedBranches
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update template');
      }

      const updatedTemplate = {
        ...template,
        LogoUrl: logoUrl,
        Banners: uploadedBanners
      };

      // State'i temizle
      setPendingLogo(null);
      setPendingBanners([]);
      setPreviewLogo(null);
      setPreviewBanners([]);

      // Template'i güncelle
      updateTemplate(updatedTemplate.TemplateKey,updatedTemplate);
      onSave(updatedTemplate);

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

  const handleLogoDelete = async () => {
    if (template?.LogoUrl && !template.LogoUrl.startsWith('blob:')) {
      try {
        const response = await fetch('/api/settings-template/deleteImage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imagePath: template.LogoUrl }),
        });

        if (!response.ok) {
          throw new Error('Failed to delete logo file');
        }
      } catch (error) {
        console.error('Error deleting logo:', error);
        toast({
          title: "Hata",
          description: "Logo dosyası silinirken bir hata oluştu",
          variant: "destructive",
        });
        return;
      }
    }

    setTemplate({
      ...template!
    });
    setPendingLogo(null);
    setPreviewLogo(null);
    toast({
      title: "Başarılı",
      description: "Logo başarıyla kaldırıldı",
    });
  };

  const handleBannerDelete = async (index: number) => {
    const newBanners = [...template!.Banners];
    const deletedBanner = newBanners[index];
    
    // If it's not a temporary banner and has a real URL, delete the file
    if (!deletedBanner.isTemp && !deletedBanner.BannerUrl.startsWith('blob:')) {
      try {
        const response = await fetch('/api/settings-template/deleteImage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imagePath: deletedBanner.BannerUrl }),
        });

        if (!response.ok) {
          throw new Error('Failed to delete banner file');
        }
      } catch (error) {
        console.error('Error deleting banner:', error);
        toast({
          title: "Hata",
          description: "Banner dosyası silinirken bir hata oluştu",
          variant: "destructive",
        });
        return;
      }
    }
    
    newBanners.splice(index, 1);
    
    if (deletedBanner.isTemp) {
      const newPendingBanners = [...pendingBanners];
      newPendingBanners.splice(index - (template?.Banners?.length ?? 0 - pendingBanners.length), 1);
      setPendingBanners(newPendingBanners);
      
      const newPreviewBanners = [...previewBanners];
      newPreviewBanners.splice(index - (template?.Banners?.length ?? 0 - previewBanners.length), 1);
      setPreviewBanners(newPreviewBanners);
    }
    
    setTemplate({ ...template!, Banners: newBanners });
    if (currentBanner >= newBanners.length) {
      setCurrentBanner(Math.max(0, newBanners.length - 1));
    }
  };

  const handleLogoSelect = async (file: File) => {
    // If there's an existing logo, delete it first
    if (template.LogoUrl && !template.LogoUrl.startsWith('blob:')) {
      try {
        const response = await fetch('/api/settings-template/deleteImage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imagePath: template.LogoUrl }),
        });

        if (!response.ok) {
          throw new Error('Failed to delete old logo file');
        }
      } catch (error) {
        console.error('Error deleting old logo:', error);
        toast({
          title: "Uyarı",
          description: "Eski logo dosyası silinirken bir hata oluştu",
          variant: "destructive",
        });
      }
    }

    setPendingLogo(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewLogo(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Create a temporary URL for preview
    const tempUrl = URL.createObjectURL(file);
    setTemplate({
      ...template!,
      LogoUrl: tempUrl
    });
  };

  const handleBannerSelect = (files: File[]) => {
    const newPendingBanners = [...pendingBanners, ...files];
    setPendingBanners(newPendingBanners);

    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewBanners(prev => [...prev, ...newPreviewUrls]);

    const newBanners = files.map(file => ({
      BannerUrl: URL.createObjectURL(file),
      isTemp: true
    }));

    setTemplate({
      ...template!,
      Banners: [...(template!.Banners || []), ...newBanners]
    });
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
              <div className="flex items-center justify-between p-2 border rounded-md mb-2">
                <span>Tüm Şubeler</span>
                <Switch
                  checked={selectedBranches.length === branches.length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedBranches(branches.map(branch => branch.BranchID.toString()));
                    } else {
                      setSelectedBranches([]);
                    }
                  }}
                />
              </div>
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
                <div className="relative">
                  <img
                    src={template.LogoUrl}
                    alt="Logo"
                    className="h-12 w-12 object-contain cursor-pointer"
                    onClick={() => setShowLogoModal(true)}
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                    onClick={handleLogoDelete}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
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
                  if (file) handleLogoSelect(file);
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
                  if (files.length > 0) handleBannerSelect(files);
                }}
              />
            </div>
            <div className="relative border rounded-md p-4">
              {template.Banners && template.Banners.length > 0 ? (
                <div className="space-y-4">
                  <Carousel 
                    className="w-full"
                    setApi={setApi}
                  >
                    <CarouselContent>
                      {template.Banners.map((banner, index) => (
                        <CarouselItem key={index}>
                          <div className="relative h-[200px] overflow-hidden rounded-md">
                            <img
                              src={banner.BannerUrl}
                              alt={`Banner ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => handleBannerDelete(index)}
                            >
                              Sil
                            </Button>
                            {banner.isTemp && (
                              <div className="absolute bottom-2 right-2 bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs">
                                Kaydedilmedi
                              </div>
                            )}
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
                    <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
                  </Carousel>
                  <div className="flex justify-center gap-2">
                    {template.Banners.map((banner, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className={cn(
                          "w-2 h-2 p-0 rounded-full",
                          currentBanner === index && "bg-primary",
                          banner.isTemp && "border-dashed"
                        )}
                        onClick={() => {
                          api?.scrollTo(index);
                        }}
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
                            {template.DefaultLanguageKey === language.Key && (
                              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                Varsayılan
                              </span>
                            )}
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
                              
                              // Eğer varsayılan dil devre dışı bırakılıyorsa, varsayılan dili sıfırla
                              if (!checked && template.DefaultLanguageKey === language.Key) {
                                setTemplate({
                                  ...template,
                                  DefaultLanguageKey: ''
                                });
                              }
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
              value={template.DefaultLanguageKey || ''}
              onChange={(e) => setTemplate({ ...template, DefaultLanguageKey: e.target.value })}
            >
              <option value="">Seçiniz...</option>
              {languages
                .filter(lang => activeLanguages.find(l => l.LanguageKey === lang.Key)?.IsActive)
                .map(lang => (
                  <option key={lang.Key} value={lang.Key}>
                    {lang.Code} - {lang.Name}
                  </option>
                ))}
            </select>
            {!template.DefaultLanguageKey && activeLanguages.some(l => l.IsActive) && (
              <p className="text-sm text-destructive mt-1">
                Lütfen aktif dillerden birini varsayılan dil olarak seçin
              </p>
            )}
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
      {/* Logo Modal */}
      <Dialog open={showLogoModal} onOpenChange={setShowLogoModal}>
        <DialogContent className="max-w-screen-md">
          <DialogHeader>
            <DialogTitle>Logo Önizleme</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-6">
            <img
              src={template.LogoUrl}
              alt="Logo"
              className="max-h-[70vh] max-w-full object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}