'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useLanguageStore from '@/store/useLanguageStore';
import { ReactNode } from 'react';

interface TranslationsTabsProps {
  title?: string;
  children: (lang: { Code: string; Name: string }) => ReactNode;
}

export default function TranslationsTabs({
  title = 'Çeviriler',
  children,
}: TranslationsTabsProps) {
  const { languages } = useLanguageStore();
  const [activeLanguage, setActiveLanguage] = useState('🇹🇷');

  return (
    <div className="space-y-4">
      <Label>{title}</Label>
      <Tabs value={activeLanguage} onValueChange={setActiveLanguage}>
        <TabsList className="w-full">
          {languages.map((lang) => (
            <TabsTrigger
              key={lang.Code}
              value={lang.Code}
              className="flex items-center gap-2"
            >
              <span className="text-lg">{lang.Code}</span>
              <span>{lang.Name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {languages.map((lang) => (
          <TabsContent
            key={lang.Code}
            value={lang.Code}
            className="space-y-4 mt-4"
          >
            {children(lang)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
