"use client";

import { useState } from 'react';
import { TemplateList } from './branch-template/template-list';
import { TemplateEdit } from './branch-template/template-edit';
import { SettingsTemplate, Template } from '@/types/settings';


export function ServiceSettings() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

/*
  const handleActiveLanguageToggle = (languageKey: string) => {
    if (!selectedTemplate) {
      toast.error('Lütfen önce bir şablon seçin');
      return;
    }

    const branchId = selectedTemplate.BranchID;
    const currentBranchLanguages = branchLanguages[branchId] || [];

    // Find if the language is currently active
    const isCurrentlyActive = currentBranchLanguages.some(
      lang => lang.LanguageKey === languageKey && lang.IsActive
    );

    // If trying to deactivate the last active language
    if (isCurrentlyActive && currentBranchLanguages.filter(l => l.IsActive).length === 1) {
      toast.error('En az bir dil aktif olmalıdır!');
      return;
    }

    // Update the branch languages
    const updatedBranchLanguages = currentBranchLanguages.map(lang =>
      lang.LanguageKey === languageKey
        ? { ...lang, IsActive: !lang.IsActive }
        : lang
    );

    // If the language doesn't exist in the branch languages, add it
    if (!currentBranchLanguages.some(lang => lang.LanguageKey === languageKey)) {
      updatedBranchLanguages.push({
        BranchID: branchId,
        LanguageKey: languageKey,
        IsActive: true
      });
    }

    // Update the store
    useBranchStore.setState(state => ({
      ...state,
      languages: {
        ...state.languages,
        [branchId]: updatedBranchLanguages
      }
    }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error('Logo dosyası 2MB\'dan küçük olmalıdır');
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/svg+xml'].includes(file.type)) {
        toast.error('Sadece PNG, JPG veya SVG formatları desteklenmektedir');
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Banner dosyası 5MB\'dan küçük olmalıdır');
        return;
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        toast.error('Sadece PNG veya JPG formatları desteklenmektedir');
        return;
      }
      
      // Dosyayı bannerFiles'a ekle
      setBannerFiles(prev => [...prev, file]);
      
      // Önizleme için base64'ü kullan
      const reader = new FileReader();
      reader.onload = (e) => {
        setBanners(prev => [...prev, { 
          BannerUrl: e.target?.result as string,
          isNew: true
        }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBanner = (index: number) => {
    setBanners(prev => prev.filter((_, i) => i !== index));
    setBannerFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (!selectedTemplate) return;

    const formData = new FormData();
    
    // Add logo if exists
    if (logoFile) {
      formData.append('logo', logoFile);
    }

    // Add banners if exist
    bannerFiles.forEach((file, index) => {
      if (file instanceof File) {
        formData.append(`banner${index}`, file);
      }
    });

    formData.append('branchId', selectedTemplate.BranchID.toString());

    try {
      const response = await fetch('/api/uploadFiles', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Dosya yükleme hatası');
      }

      const data = await response.json();
      return {
        logoPath: data.logoPath || '',
        bannerPaths: data.bannerPaths || []
      };
    } catch (error) {
      console.error('Error uploading files:', error);
      throw new Error('Dosya yükleme hatası');
    }
  };

  const handleSaveSettings = async () => {
    if (!selectedTemplate && !isNewTemplate) {
      toast.error('Lütfen bir şablon seçin veya yeni şablon oluşturun');
      return;
    }

    if (isNewTemplate && !templateName.trim()) {
      toast.error('Lütfen şablon adı giriniz');
      return;
    }

    setIsSaving(true);
    try {
      let uploadedPaths = { logoPath: '', bannerPaths: [] as string[] };
      if (logoFile || bannerFiles.length > 0) {
        uploadedPaths = await uploadFiles();
      }

      const existingBanners = banners
        .filter(banner => !banner.isNew)
        .map(banner => ({
          BannerUrl: banner.BannerUrl
        }));

      const finalBanners = [
        ...existingBanners,
        ...(uploadedPaths.bannerPaths || []).map(path => ({ 
          BannerUrl: path
        }))
      ];

      const response = await fetch('/api/updateTemplateSettings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: selectedTemplate?.BranchID,
          templateName: isNewTemplate ? templateName : selectedTemplate?.BranchName,
          isNewTemplate,
          defaultLanguageKey: currentActiveLanguage,
          activeLanguages: branchLanguages[selectedTemplate?.BranchID || -1]?.map(lang => ({ 
            LanguageKey: lang.LanguageKey, 
            IsActive: lang.IsActive 
          })) || [],
          themeColors,
          logoUrl: uploadedPaths.logoPath || logoUrl,
          banners: finalBanners
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      toast.success(isNewTemplate ? 'Şablon başarıyla oluşturuldu' : 'Şablon başarıyla güncellendi');
      setDeletedBanners([]);
      
      if (isNewTemplate) {
        setIsNewTemplate(false);
        setTemplateName('');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Şablon kaydedilirken bir hata oluştu');
    } finally {
      setIsSaving(false);
    }
  };*/

  const handleNewTemplate = () => {
    const newTemplate: SettingsTemplate = {
      TemplateKey: crypto.randomUUID(),
      TemplateName: '',
      MainColor: '#000000',
      SecondColor: '#666666',
      AccentColor: '#CCCCCC',
      DefaultLanguageKey: '',
      LogoUrl: '',
      Languages: [],
      Banners: [],
      IsActive: true
    };
    setSelectedTemplate(newTemplate);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TemplateList
          selectedTemplate={selectedTemplate}
          onSelectTemplate={setSelectedTemplate}
          onNewTemplate={handleNewTemplate}
         />
        <TemplateEdit
          template={selectedTemplate}
          onSave={(template) => {
            setSelectedTemplate(template);
          }}
          setTemplate={setSelectedTemplate}
        />
      </div>
    </div>
  );
}