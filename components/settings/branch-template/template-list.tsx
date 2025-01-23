"use client";

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { SettingsTemplate } from '@/types/settings';
import axios from 'axios';

interface TemplateListProps {
    selectedTemplate: SettingsTemplate | null;
    onSelectTemplate: (template: SettingsTemplate) => void;
    onNewTemplate: () => void;
    isLoading?: boolean;
}

export function TemplateList({
    selectedTemplate,
    onSelectTemplate,
    onNewTemplate,
    isLoading = false,
}: TemplateListProps) {
    const [settingsTemplates, setSettingsTemplates] = useState<SettingsTemplate[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchTemplates = async () => {
        try {
            const response = await axios.get('/api/settings-template/getSettingsTemplates');
            if (response.status !== 200) {
                throw new Error('Failed to fetch templates');
            }
            setSettingsTemplates(response.data);

            // If there's a selected template, update it with fresh data
            if (selectedTemplate) {
                const updatedTemplate = response.data.find(
                    (t: SettingsTemplate) => t.TemplateKey === selectedTemplate.TemplateKey
                );
                if (updatedTemplate) {
                    onSelectTemplate(updatedTemplate);
                }
            }
        } catch (error) {
            console.error('Error fetching settings templates:', error);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, [selectedTemplate?.TemplateKey]);

    const handleTemplateSelect = (template: SettingsTemplate) => {
        // Ensure all required properties are present
        const selectedTemplateWithDefaults: SettingsTemplate = {
            ...template,
            Branches: template.Branches || [],
            Languages: template.Languages || [],
            Banners: template.Banners || [],
            MainColor: template.MainColor || '#FFFFFF',
            SecondColor: template.SecondColor || '#FFFFFF',
            AccentColor: template.AccentColor || '#FFFFFF',
            LogoUrl: template.LogoUrl || '',
            DefaultLanguageKey: template.DefaultLanguageKey || ''
        };
        onSelectTemplate(selectedTemplateWithDefaults);
    };

    const filteredTemplates = useMemo(() => {
        return settingsTemplates.filter((template) =>
            template.TemplateName?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [settingsTemplates, searchQuery]);

    return (
        <Card className="md:col-span-1 h-[calc(100vh-6rem)] flex flex-col overflow-hidden">
            <div className="p-4 border-b space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Şablonlar</h3>
                    <Button onClick={onNewTemplate} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Yeni Şablon
                    </Button>
                </div>

                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Şablon ara..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-2">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                    </div>
                ) : filteredTemplates.length > 0 ? (
                    filteredTemplates.map((template) => (
                        <motion.div
                            key={template.TemplateKey}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Card
                                className={`p-4 cursor-pointer transition-colors hover:bg-accent ${
                                    selectedTemplate?.TemplateKey === template.TemplateKey
                                        ? "bg-accent"
                                        : ""
                                }`}
                                onClick={() => handleTemplateSelect(template)}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium">{template.TemplateName}</h4>
                                        <div className="flex gap-2 mt-2">
                                            <div 
                                                className="w-4 h-4 rounded-full" 
                                                style={{ backgroundColor: template.MainColor }}
                                                title="Ana Renk"
                                            />
                                            <div 
                                                className="w-4 h-4 rounded-full"
                                                style={{ backgroundColor: template.SecondColor }}
                                                title="İkincil Renk"
                                            />
                                            <div 
                                                className="w-4 h-4 rounded-full"
                                                style={{ backgroundColor: template.AccentColor }}
                                                title="Vurgu Rengi"
                                            />
                                        </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {template.Branches?.length || 0} Şube
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        {searchQuery ? "Şablon bulunamadı" : "Henüz şablon eklenmemiş"}
                    </div>
                )}
            </div>
        </Card>
    );
}