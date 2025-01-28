"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { ComboSelections } from '@/types/combo';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, CheckCircle2, ChevronRight, ArrowRight, UtensilsCrossed } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ComboGroup } from './combo-group';
import { calculateTotalPrice, calculateGroupProgress } from '@/lib/utils/combo-selector';
import { ComboGroup as ComboGroupType, ComboItem } from '@/types/branch';
import useBranchStore from '@/store/branch';
import { getNextProductImage } from '@/lib/utils/mock-images';
import { useKeyboardStore } from '@/components/ui/virtual-keyboard';
import { useCartStore } from '@/store/cart';

interface ComboSelectorProps {
  groups: ComboGroupType[];
  basePrice: number;
  onAddToCart: (selections: ComboSelections, note: string) => void;
  existingTransactionKey?: string;
}

export function ComboSelector({ groups, basePrice, onAddToCart, existingTransactionKey }: ComboSelectorProps) {
  const [selections, setSelections] = useState<ComboSelections>({});
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [note, setNote] = useState("");
  const { toast } = useToast();
  const { t, branchData, selectedLanguage } = useBranchStore();
  const { cart } = useCartStore();
  const { setInputRef, setIsOpen } = useKeyboardStore();
  const allGroups = [...groups, { OriginalName: t.common.completeOrder, IsForcedGroup: false, ForcedQuantity: 0, MaxQuantity: 0, Items: [] }];
  const noteInputRef = useRef<HTMLTextAreaElement>(null);

  // Load existing selections if transactionKey is provided
  useEffect(() => {
    if (existingTransactionKey) {
      const existingItem = cart.Items.find(item => item.TransactionKey === existingTransactionKey);
      if (existingItem?.IsMainCombo && existingItem.Items) {
        // Convert existing combo items to selections format
        const existingSelections: ComboSelections = {};
        existingItem.Items.forEach(item => {
          const group = groups.find(g => g.Items.some(i => i.MenuItemKey === item.MenuItemKey));
          if (group) {
            const groupItem = group.Items.find(i => i.MenuItemKey === item.MenuItemKey);
            if (groupItem) {
              if (!existingSelections[group.OriginalName]) {
                existingSelections[group.OriginalName] = [];
              }
              existingSelections[group.OriginalName].push({
                GroupName: group.OriginalName,
                Item: groupItem,
                Quantity: item.Quantity || 1
              });
            }
          }
        });
        setSelections(existingSelections);
        if (existingItem.Notes) {
          setNote(existingItem.Notes);
        }
      }
    }
  }, [existingTransactionKey, cart.Items, groups]);

  const handleFocus = useCallback(() => {
    if (noteInputRef.current) {
      setInputRef(noteInputRef.current);
      setIsOpen(true);
    }
  }, [setInputRef, setIsOpen]);

  const handleSelect = useCallback((groupName: string, item: ComboItem, quantity: number) => {
    setSelections(prev => {
      const group = groups.find(g => g.OriginalName === groupName);
      if (!group) return prev;

      const currentSelections = prev[groupName] || [];
      const otherSelections = currentSelections.filter(s => s.Item.MenuItemKey !== item.MenuItemKey);
      const newQuantity = quantity;
      const totalQuantity = otherSelections.reduce((sum, s) => sum + s.Quantity, 0) + newQuantity;

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

      const newSelections = {
        ...prev,
        [groupName]: [
          ...otherSelections,
          ...(newQuantity > 0 ? [{ GroupName: groupName, Item: item, Quantity: newQuantity }] : [])
        ]
      };

      if (activeGroupIndex === groups.length - 1 && newQuantity > 0) {
        setTimeout(() => {
          setActiveGroupIndex(allGroups.length - 1);
        }, 300);
      } else if (group.ForcedQuantity > 0) {
        const currentGroupSelections = newSelections[groupName] || [];
        const currentTotalQuantity = currentGroupSelections.reduce((sum, s) => sum + s.Quantity, 0);
        
        if (currentTotalQuantity >= group.ForcedQuantity) {
          setActiveGroupIndex(prev => prev + 1);
        }
      }

      return newSelections;
    });
  }, [groups, toast, t, activeGroupIndex, allGroups]);

  const isGroupComplete = useCallback((group: ComboGroupType) => {
    if (group.OriginalName === t.common.completeOrder) return false;
    const groupSelections = selections[group.OriginalName] || [];
    const totalQuantity = groupSelections.reduce((sum, s) => sum + s.Quantity, 0);
    
    return group.IsForcedGroup 
      ? totalQuantity >= group.ForcedQuantity
      : totalQuantity > 0;
  }, [selections, t]);

  const handleAddToCart = useCallback(() => {
    const requiredGroups = groups.filter(group => group.IsForcedGroup || group.ForcedQuantity > 0);
    
    for (const group of requiredGroups) {
      const groupSelections = selections[group.OriginalName] || [];
      const totalQuantity = groupSelections.reduce((sum, s) => sum + s.Quantity, 0);

      if (groupSelections.length === 0) {
        toast({
          title: "Eksik Seçim",
          description: `${group.OriginalName} grubundan seçim yapmalısınız.`,
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      if (group.ForcedQuantity > 0 && totalQuantity < group.ForcedQuantity) {
        toast({
          title: "Yetersiz Seçim",
          description: `${group.OriginalName} grubundan ${group.ForcedQuantity} adet seçim yapmalısınız. Şu an ${totalQuantity} adet seçilmiş.`,
          variant: "destructive",
          duration: 3000,
        });
        return;
      }
    }

    const currentNote = noteInputRef.current?.value || "";
    onAddToCart({ ...selections }, currentNote);
  }, [groups, selections, onAddToCart, toast]);

  return (
    <motion.div 
      className="grid grid-cols-6 gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Left Side - Steps */}
      <div className="col-span-2 space-y-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 space-y-4">
          <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            {t.common.menuSelections}
          </h3>
          <div className="space-y-3">
            {allGroups.map((group, index) => {
              const isComplete = isGroupComplete(group);
              const isActive = index === activeGroupIndex;
              
              return (
                <motion.button
                  key={group.OriginalName}
                  onClick={() => setActiveGroupIndex(index)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary/10 ring-2 ring-primary/20' 
                      : 'hover:bg-gray-50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-lg font-semibold ${isActive ? 'text-primary' : 'text-gray-900'}`}>
                          {group.OriginalName}
                        </span>
                        {group.ForcedQuantity > 0 && (
                          <span className="text-sm text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full">
                            {group.ForcedQuantity} {t.common.requiredSelectionCount}
                          </span>
                        )}
                      </div>
                      {group.IsForcedGroup && (
                        <p className="text-sm text-gray-500 mt-1">
                          {t.common.requiredSelection}
                        </p>
                      )}
                    </div>
                    {isComplete && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-primary">
                          {t.common.selectionCompleted}
                        </span>
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Side - Active Group Items or Order Summary */}
      <div className="col-span-4">
        <motion.div
          key={activeGroupIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          {activeGroupIndex === allGroups.length - 1 ? (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-8 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <UtensilsCrossed className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {t.common.selectedProducts}
                    </h2>
                    <p className="text-gray-500">
                      {t.common.reviewYourSelections}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {Object.entries(selections).map(([groupName, items]) => (
                    <div key={groupName} className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">{groupName}</h3>
                      <div className="space-y-3">
                        {items.map((selection, idx) => (
                          <div 
                            key={idx} 
                            className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                          >
                            <div className="w-16 h-16 rounded-lg overflow-hidden">
                              <img 
                                src={selection.Item.Translations?.[selectedLanguage?.Key || 'en-US']?.ImageUrl || selection.Item.Translations?.[branchData?.Languages.find(language => language.Code.toLowerCase() === 'tr')?.Key || 'en-US']?.ImageUrl || getNextProductImage()} 
                                alt={selection.Item.OriginalName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">
                                {selection.Item.OriginalName}
                              </div>
                              {selection.Item.ExtraPriceTakeOut > 0 && (
                                <div className="text-sm text-primary">
                                  +{selection.Item.ExtraPriceTakeOut} ₺
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">
                                x{selection.Quantity}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-6 border-t">
                  <div className="space-y-2">
                    <label htmlFor="note" className="text-sm font-medium">{t.common.productNote}</label>
                    <textarea
                      id="note"
                      defaultValue={note}
                      onFocus={handleFocus}
                      ref={noteInputRef}
                      placeholder={t.common.enterProductNote}
                      className="w-full min-h-[100px] p-3 rounded-lg border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="flex items-center justify-between py-4">
                    <div className="text-lg font-medium text-gray-900">
                      {t.common.totalAmount}
                    </div>
                    <div className="text-3xl font-bold text-primary">
                      {calculateTotalPrice(basePrice, selections)} ₺
                    </div>
                  </div>

                  <Button 
                    className="w-full h-14 text-lg gap-2 bg-primary hover:bg-primary/90"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {existingTransactionKey ? t.common.update : t.common.addToCart}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <ComboGroup
              group={groups[activeGroupIndex]}
              selections={selections}
              onSelect={handleSelect}
              progress={calculateGroupProgress(groups[activeGroupIndex], selections)}
            />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}