"use client";

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { Template } from '@/types/template';
import useTemplateStore from "@/store/useTemplateStore";

interface TemplateListProps {
  selectedTemplate: Template | null;
  onSelectTemplate: (template: Template) => void;
  onNewTemplate: () => void;
  isLoading?: boolean;
}

export function TemplateList({
  selectedTemplate,
  onSelectTemplate,
  onNewTemplate,
  isLoading = false,
}: TemplateListProps) {
  const templates = useTemplateStore(state => state.templates);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) =>
      template.TemplateName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [templates, searchQuery]);

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
        ) : (
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
                onClick={() => onSelectTemplate(template)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{template.TemplateName}</h4>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}

        {!isLoading && filteredTemplates.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            {searchQuery
              ? "Aranan şablon bulunamadı"
              : "Henüz şablon eklenmemiş"}
          </div>
        )}
      </div>
    </Card>
  );
}