"use client";

import { useState, useEffect } from "react";
import {CategorySettings} from '@/components/settings/category-settings';
import ProductSettings from '@/components/settings/product-settings';
import { ComboSettings } from '@/components/settings/combo-settings';
import { TemplateSettings } from '@/components/settings/template-settings';
import { PriceListSettings } from '@/components/settings/price-list-settings';
import { BranchSettings } from '@/components/settings/branch-settings';
import { ServiceSettings } from '@/components/settings/service-settings';
import { motion } from 'framer-motion';
import { 
  Building2, 
  FileText, 
  Receipt, 
  LayoutGrid, 
  Package, 
  UtensilsCrossed,
  Globe,
  RefreshCw,
  Tablet
} from 'lucide-react';
import { cn } from '@/lib/utils';
import useSettingLanguageStore from '@/store/settings/language';
import useSettingBranchStore from "@/store/settings/branch";
import useTemplateStore from "@/store/settings/template";
import usePriceTemplateStore from "@/store/settings/price-template";
import { Button } from "@/components/ui/button";
import { KioskSettings } from "@/components/settings/kiosk-settings";

const menuItems = [
  { id: 'branches', label: 'Şubeler', icon: Building2, component: BranchSettings },
  { id: 'templates', label: 'Şablonlar', icon: FileText, component: TemplateSettings },
  { id: 'price-lists', label: 'Fiyat Listeleri', icon: Receipt, component: PriceListSettings },
  { id: 'categories', label: 'Kategoriler', icon: LayoutGrid, component: CategorySettings },
  { id: 'products', label: 'Ürünler', icon: Package, component: ProductSettings },
  { id: 'combos', label: 'Combo Menüler', icon: UtensilsCrossed, component: ComboSettings },
  { id: 'services', label: 'Şube Ayarları', icon: Globe, component: ServiceSettings },
  { id: 'settings', label: 'Kiosk Ayarları', icon: Tablet, component: KioskSettings },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<string>('products');
  const [isUpdating, setIsUpdating] = useState(false);
  const { fetchLanguages } = useSettingLanguageStore();
  const { fetchBranches } = useSettingBranchStore();
  const { fetchTemplates } = useTemplateStore();
  const { fetchPriceTemplates } = usePriceTemplateStore();

  useEffect(() => {
    fetchLanguages();
    fetchBranches();
    fetchTemplates();
    fetchPriceTemplates();
  }, []);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch('/api/update', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to update data');
      }

    } catch (error) {
      console.error('Error updating data:', error);

    } finally {
      setIsUpdating(false);
    }
  };

  const ActiveComponent = menuItems.find(item => item.id === activeTab)?.component || menuItems[0].component;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="border-b">
        <div className="container mx-auto">
          <nav className="flex items-center justify-between  py-4">
            <div className="flex items-center space-x-2 ">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <motion.button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors",
                      isActive 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-muted"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleUpdate}
              disabled={isUpdating}
              className="ml-4"
            >
              <RefreshCw className={cn(
                "w-4 h-4 mr-2",
                isUpdating && "animate-spin"
              )} />
              {isUpdating ? "Güncelleniyor..." : "Verileri Güncelle"}
            </Button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto py-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <ActiveComponent />
        </motion.div>
      </main>
    </div>
  );
}