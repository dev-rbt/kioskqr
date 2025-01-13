'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, GripVertical } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import axios from 'axios';

interface Badge {
    BadgeKey: string;
    Code: string;
    IsActive: boolean;
    translations: BadgeTranslation[];
}

interface BadgeTranslation {
    BadgeKey: string;
    LanguageKey: string;
    Name: string;
}

interface Language {
    Key: string;
    Code: string;
    Name: string;
    IsActive: boolean;
    DisplayOrderId: number;
}

export function KioskSettings() {
    const [badges, setBadges] = useState<Badge[]>([]);
    const [languages, setLanguages] = useState<Language[]>([]);
    const [newBadgeCode, setNewBadgeCode] = useState('');
    const [newBadgeNames, setNewBadgeNames] = useState<Record<string, string>>({});
    const [editingBadge, setEditingBadge] = useState<Badge | null>(null);
    const [editingBadgeNames, setEditingBadgeNames] = useState<Record<string, string>>({});
    const [newLanguageCode, setNewLanguageCode] = useState('');
    const [newLanguageName, setNewLanguageName] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Verileri yükle
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [languagesRes, badgesRes] = await Promise.all([
                    axios.get('/api/kiosk-settings/languages'),
                    axios.get('/api/kiosk-settings/badges')
                ]);
                setLanguages(languagesRes.data);
                setBadges(badgesRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const addBadge = async () => {
        try {
            if (newBadgeCode.trim()) {
                const translations = languages
                    .filter(lang => newBadgeNames[lang.Key])
                    .map(lang => ({
                        LanguageKey: lang.Key,
                        Name: newBadgeNames[lang.Key]
                    }));

                if (translations.length > 0) {
                    const response = await axios.post('/api/kiosk-settings/badges', {
                        Code: newBadgeCode.toUpperCase(),
                        translations
                    });

                    setBadges(prev => [...prev, response.data]);
                    setNewBadgeCode('');
                    setNewBadgeNames({});
                    
                }
            }
        } catch (error) {
            console.error('Error adding badge:', error);
      
        }
    };

    const removeBadge = async (badgeKey: string) => {
        try {
            await axios.delete(`/api/kiosk-settings/badges?key=${badgeKey}`);
            setBadges(prev => prev.filter(badge => badge.BadgeKey !== badgeKey));
     
        } catch (error) {
            console.error('Error removing badge:', error);
    
        }
    };

    const toggleBadgeStatus = async (badgeKey: string) => {
        try {
            const badge = badges.find(b => b.BadgeKey === badgeKey);
            if (badge) {
                const response = await axios.put('/api/kiosk-settings/badges', {
                    BadgeKey: badgeKey,
                    IsActive: !badge.IsActive
                });
                setBadges(prev => prev.map(b => 
                    b.BadgeKey === badgeKey ? response.data : b
                ));
            }
        } catch (error) {
            console.error('Error toggling badge status:', error);
       
        }
    };

    const startEditingBadge = (badge: Badge) => {
        setEditingBadge(badge);
        const names: Record<string, string> = {};
        badge.translations.forEach(t => {
            names[t.LanguageKey] = t.Name;
        });
        setEditingBadgeNames(names);
    };

    const cancelEditingBadge = () => {
        setEditingBadge(null);
        setEditingBadgeNames({});
    };

    const updateBadge = async () => {
        if (!editingBadge) return;

        try {
            const translations = languages
                .filter(lang => editingBadgeNames[lang.Key])
                .map(lang => ({
                    LanguageKey: lang.Key,
                    Name: editingBadgeNames[lang.Key]
                }));

            const response = await axios.put('/api/kiosk-settings/badges', {
                BadgeKey: editingBadge.BadgeKey,
                Code: editingBadge.Code,
                translations
            });

            setBadges(prev => prev.map(b => 
                b.BadgeKey === editingBadge.BadgeKey ? response.data : b
            ));
            setEditingBadge(null);
            setEditingBadgeNames({});
        } catch (error) {
            console.error('Error updating badge:', error);
        }
    };

    const addLanguage = async () => {
        try {
            if (newLanguageCode.trim() && newLanguageName.trim()) {
                const response = await axios.post('/api/kiosk-settings/languages', {
                    Code: newLanguageCode.toLowerCase(),
                    Name: newLanguageName
                });

                setLanguages(prev => [...prev, response.data]);
                setNewLanguageCode('');
                setNewLanguageName('');
          
            }
        } catch (error) {
            console.error('Error adding language:', error);
       
        }
    };

    const removeLanguage = async (key: string) => {
        try {
            await axios.delete(`/api/kiosk-settings/languages?key=${key}`);
            setLanguages(prev => prev.filter(lang => lang.Key !== key));
          
        } catch (error) {
            console.error('Error removing language:', error);
       
        }
    };

    const toggleLanguageStatus = async (key: string) => {
        try {
            const language = languages.find(l => l.Key === key);
            if (language) {
                const response = await axios.put('/api/kiosk-settings/languages', {
                    Key: key,
                    IsActive: !language.IsActive
                });
                setLanguages(prev => prev.map(l => 
                    l.Key === key ? response.data : l
                ));
            }
        } catch (error) {
            console.error('Error toggling language status:', error);
       
        }
    };

    const onDragEnd = async (result: any) => {
        if (!result.destination) return;

        const items = Array.from(languages);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Sıralama numaralarını güncelle
        const updatedItems = items.map((item, index) => ({
            ...item,
            DisplayOrderId: index + 1
        }));

        try {
            await axios.put('/api/kiosk-settings/update-language-order', {
                languages: updatedItems
            });
            setLanguages(updatedItems);
        } catch (error) {
            console.error('Error updating language order:', error);
           
        }
    };

    if (isLoading) {
        return <div>Yükleniyor...</div>;
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="text-xl font-bold">Diller</CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <Input
                                placeholder="Dil kodu (örn: tr, en)"
                                value={newLanguageCode}
                                onChange={(e) => setNewLanguageCode(e.target.value)}
                                className="w-32"
                            />
                            <Input
                                placeholder="Dil adı"
                                value={newLanguageName}
                                onChange={(e) => setNewLanguageName(e.target.value)}
                            />
                            <Button onClick={addLanguage}>
                                <Plus className="w-4 h-4 mr-2" />
                                Ekle
                            </Button>
                        </div>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="languages">
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="space-y-2"
                                    >
                                        {languages.map((language, index) => (
                                            <Draggable
                                                key={language.Key}
                                                draggableId={language.Key}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div {...provided.dragHandleProps}>
                                                                <GripVertical className="w-4 h-4 text-gray-500" />
                                                            </div>
                                                            <Switch
                                                                checked={language.IsActive}
                                                                onCheckedChange={() => toggleLanguageStatus(language.Key)}
                                                            />
                                                            <span className="font-semibold min-w-[50px]">{language.Code}</span>
                                                            <span className="min-w-[150px]">{language.Name}</span>
                                                            <span className="text-sm text-gray-500">Sıra: {language.DisplayOrderId}</span>
                                                        </div>
                                                        <button
                                                            onClick={() => removeLanguage(language.Key)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="text-xl font-bold">Rozetler</CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid grid-cols-4 gap-4">
                            <div className="col-span-4 flex gap-4">
                                <Input
                                    placeholder="Rozet kodu (örn: SPICY)"
                                    value={newBadgeCode}
                                    onChange={(e) => setNewBadgeCode(e.target.value)}
                                    className="w-40"
                                />
                                <Button onClick={addBadge}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Ekle
                                </Button>
                            </div>
                            {languages.map(lang => (
                                <Input
                                    key={lang.Key}
                                    placeholder={`${lang.Name} adı`}
                                    value={newBadgeNames[lang.Key] || ''}
                                    onChange={(e) => setNewBadgeNames(prev => ({
                                        ...prev,
                                        [lang.Key]: e.target.value
                                    }))}
                                />
                            ))}
                        </div>
                        <div className="space-y-2">
                            {badges.map((badge) => (
                                <div
                                    key={badge.BadgeKey}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                    {editingBadge?.BadgeKey === badge.BadgeKey ? (
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-3">
                                                <Switch
                                                    checked={badge.IsActive}
                                                    onCheckedChange={() => toggleBadgeStatus(badge.BadgeKey)}
                                                />
                                                <Input
                                                    value={editingBadge.Code}
                                                    onChange={(e) => setEditingBadge(prev => prev ? {...prev, Code: e.target.value.toUpperCase()} : null)}
                                                    className="w-40"
                                                />
                                                <div className="flex gap-2">
                                                    <Button onClick={updateBadge} variant="outline" size="sm">
                                                        Kaydet
                                                    </Button>
                                                    <Button onClick={cancelEditingBadge} variant="ghost" size="sm">
                                                        İptal
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-4 gap-2">
                                                {languages.map(lang => (
                                                    <Input
                                                        key={lang.Key}
                                                        placeholder={`${lang.Name} adı`}
                                                        value={editingBadgeNames[lang.Key] || ''}
                                                        onChange={(e) => setEditingBadgeNames(prev => ({
                                                            ...prev,
                                                            [lang.Key]: e.target.value
                                                        }))}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-4">
                                                <Switch
                                                    checked={badge.IsActive}
                                                    onCheckedChange={() => toggleBadgeStatus(badge.BadgeKey)}
                                                />
                                                <span className="font-semibold min-w-[100px]">{badge.Code}</span>
                                                <div className="flex flex-wrap gap-2">
                                                    {languages.map(lang => {
                                                        const translation = badge.translations.find(t => t.LanguageKey === lang.Key);
                                                        return (
                                                            <span
                                                                key={lang.Key}
                                                                className={`px-2 py-1 text-sm rounded ${translation ? 'bg-white' : 'bg-gray-200'}`}
                                                            >
                                                                {lang.Code}: {translation?.Name || '-'}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => startEditingBadge(badge)}
                                                    className="text-blue-500 hover:text-blue-700"
                                                >
                                                    Düzenle
                                                </button>
                                                <button
                                                    onClick={() => removeBadge(badge.BadgeKey)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}