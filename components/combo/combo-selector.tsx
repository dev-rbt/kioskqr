"use client";

import { useState, useCallback } from 'react';
import { ComboGroup as ComboGroupType, ComboItem } from '@/types/api';
import { ComboSelections } from '@/types/combo';
import { ComboGroup } from './combo-group';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguageStore } from '@/store/language';
import { calculateTotalPrice, calculateGroupProgress } from '@/lib/utils/combo-selector';

interface ComboSelectorProps {
  groups: ComboGroupType[];
  basePrice: number;
  onAddToCart: (selections: ComboSelections) => void;
}

export function ComboSelector({ groups, basePrice, onAddToCart }: ComboSelectorProps) {
  const [selections, setSelections] = useState<ComboSelections>({});
  const { toast } = useToast();
  const { t } = useLanguageStore();

  const handleSelect = useCallback((groupName: string, item: ComboItem, quantity: number) => {
    setSelections(prev => {
      const group = groups.find(g => g.GroupName === groupName);
      if (!group) return prev;

      const currentSelections = prev[groupName] || [];
      const otherSelections = currentSelections.filter(s => s.item.MenuItemKey !== item.MenuItemKey);
      const newQuantity = quantity;

      const totalQuantity = otherSelections.reduce((sum, s) => sum + s.quantity, 0) + newQuantity;

      if (group.MaxQuantity > 0 && totalQuantity > group.MaxQuantity) {
        toast({
          title: t.common.error,
          description: t.product.maxQuantityError
            .replace('{group}', groupName)
            .replace('{max}', group.MaxQuantity.toString()),
          variant: "destructive"
        });
        return prev;
      }

      return {
        ...prev,
        [groupName]: [
          ...otherSelections,
          ...(newQuantity > 0 ? [{ groupName, item, quantity: newQuantity }] : [])
        ]
      };
    });
  }, [groups, toast, t]);

  const handleAddToCart = useCallback(() => {
    const requiredGroups = groups.filter(group => group.IsForcedGroup);
    const missingSelections = requiredGroups.filter(group => {
      const groupSelections = selections[group.GroupName] || [];
      return groupSelections.length === 0;
    });

    if (missingSelections.length > 0) {
      toast({
        title: t.common.error,
        description: t.product.requiredSelectionError.replace('{group}', missingSelections[0].GroupName),
        variant: "destructive"
      });
      return;
    }

    onAddToCart(selections);
  }, [groups, selections, onAddToCart, toast, t]);

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="space-y-6">
        {groups.map((group, index) => (
          <motion.div
            key={group.GroupName}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ComboGroup
              group={group}
              selections={selections}
              onSelect={handleSelect}
              progress={calculateGroupProgress(group, selections)}
            />
          </motion.div>
        ))}
      </div>
      
      <div className="sticky bottom-0 bg-background/95 backdrop-blur-lg border-t p-4 -mx-4">
        <Button 
          className="w-full gap-2 h-12 sm:h-14 text-base sm:text-lg relative overflow-hidden group"
          onClick={handleAddToCart}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-foreground/10 via-transparent to-primary-foreground/10 group-hover:translate-x-full duration-1000 transition-transform" />
          <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>{t.common.addToCart}</span>
          <span className="font-bold">({calculateTotalPrice(basePrice, selections).toFixed(2)} ₺)</span>
        </Button>
      </div>
    </motion.div>
  );
}
