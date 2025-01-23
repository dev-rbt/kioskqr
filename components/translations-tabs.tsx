'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useLanguageStore from '@/store/settings/language';
import { ReactNode } from 'react';
import { Language } from '@/types/settings';

interface TranslationsTabsProps {
  title?: string;
  children: (lang: Language) => ReactNode;
}

export default function TranslationsTabs({
  title = 'Çeviriler',
  children,
}: TranslationsTabsProps) {
  const { languages } = useLanguageStore();
  const [activeLanguage, setActiveLanguage] = useState(languages[0].Key);

  return (
    <div className="space-y-4">
      <Label>{title}</Label>
      <Tabs value={activeLanguage} onValueChange={setActiveLanguage}>
        <TabsList className="w-full">
          {languages.map((lang) => (
            <TabsTrigger
              key={lang.Key}
              value={lang.Key}
              className="flex items-center gap-2"
            >
              <span className="text-lg">{lang.Code}</span>
              <span>{lang.Name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {languages.map((lang) => (
          <TabsContent
            key={lang.Key}
            value={lang.Key}
            className="space-y-4 mt-4"
          >
            {children(lang)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
