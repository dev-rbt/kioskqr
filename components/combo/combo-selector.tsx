"use client";

import { useState, useCallback, useRef } from 'react';
import { ComboSelections } from '@/types/combo';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { ComboGroup } from './combo-group';
import { calculateTotalPrice, calculateGroupProgress } from '@/lib/utils/combo-selector';
import { ComboGroup as ComboGroupType, ComboItem } from '@/types/branch';
import useBranchStore from '@/store/branch';
import { getNextProductImage } from '@/lib/utils/mock-images';
import { useKeyboardStore } from '@/components/ui/virtual-keyboard';

interface ComboSelectorProps {
  groups: ComboGroupType[];
  basePrice: number;
  onAddToCart: (selections: ComboSelections, note: string) => void;
}

export function ComboSelector({ groups, basePrice, onAddToCart }: ComboSelectorProps) {
  const [selections, setSelections] = useState<ComboSelections>({});
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [note, setNote] = useState("");
  const { toast } = useToast();
  const { t } = useBranchStore();
  const {branchData, selectedLanguage} = useBranchStore();
  const allGroups = [...groups, { OriginalName: t.common.completeOrder, IsForcedGroup: false, ForcedQuantity: 0, MaxQuantity: 0, Items: [] }];
  const noteInputRef = useRef<HTMLTextAreaElement>(null);
  const { setInputRef, setIsOpen } = useKeyboardStore();

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

      // If this is the last group and a selection was made, go to summary
      if (activeGroupIndex === groups.length - 1 && newQuantity > 0) {
        setTimeout(() => {
          setActiveGroupIndex(allGroups.length - 1); // Go to "Siparişi Tamamla"
        }, 300); // Small delay for better UX
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

    onAddToCart({ ...selections }, note);
  }, [groups, selections, onAddToCart, toast, note]);

  const handleFocus = useCallback(() => {
    if (noteInputRef.current) {
      setInputRef(noteInputRef.current);
      setIsOpen(true);
    }
  }, [setInputRef, setIsOpen]);

  const handleNoteChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value);
  }, []);

  const handleNoteInput = useCallback((e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    setNote(target.value);
  }, []);


  return (
    <motion.div 
      className="grid grid-cols-6 gap-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Left Side - Steps */}
      <div className="space-y-4 col-span-2">
        <h3 className="text-xl font-semibold">{t.common.menuSelections}</h3>
        <div className="space-y-2">
          {allGroups.map((group, index) => {
            const isComplete = isGroupComplete(group);
            const isActive = index === activeGroupIndex;
            
            return (
              <motion.div
                key={group.OriginalName}
                className={`p-4 rounded-xl cursor-pointer transition-colors ${
                  isActive ? 'bg-primary/10 border-primary/20' : 
                  'bg-secondary/10 border-secondary/20'
                } border`}
                onClick={() => setActiveGroupIndex(index)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{group.OriginalName}</div>
                    {group.ForcedQuantity > 0 && (
                      <div className="text-sm text-muted-foreground">
                        {group.ForcedQuantity} {t.common.requiredSelectionCount}
                      </div>
                    )}
                  </div>
                  {isComplete && (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  )}
                </div>
              </motion.div>
            );
          })}
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
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="p-6 space-y-6">
                <h3 className="text-2xl font-bold">{t.common.selectedProducts}</h3>
                <div className="space-y-4">
                  {Object.entries(selections).map(([groupName, items]) => (
                    <div key={groupName} className="space-y-2">
                      <div className="font-medium text-lg">{groupName}</div>
                      <div className="space-y-2">
                        {items.map((selection, idx) => (
                          <div 
                            key={idx} 
                            className="flex items-center justify-between p-4 bg-primary/5 border border-primary/10 rounded-lg hover:bg-primary/10 transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-16 h-16 rounded-lg overflow-hidden">
                                <img 
                                  src={selection.Item.Translations?.[selectedLanguage?.Key || 'en-US']?.ImageUrl ||   selection.Item.Translations?.[branchData?.Languages.find(language => language.Code.toLowerCase() === 'tr')?.Key || 'en-US']?.ImageUrl || getNextProductImage()} 
                                  alt={selection.Item.OriginalName}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-medium">{selection.Item.OriginalName}</div>
                                {selection.Item.ExtraPriceTakeOut > 0 && (
                                  <div className="text-sm text-muted-foreground">
                                    +{selection.Item.ExtraPriceTakeOut} ₺
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="font-medium">x{selection.Quantity}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="note" className="text-sm font-medium">{t.common.productNote}</label>
                      <textarea
                        id="note"
                        value={note}
                        onChange={handleNoteChange}
                        onInput={handleNoteInput}
                        onFocus={handleFocus}
                        ref={noteInputRef}
                        placeholder={t.common.enterProductNote}
                        className="w-full min-h-[100px] p-3 rounded-lg border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-medium">{t.common.totalAmount}</div>
                      <div className="text-2xl font-bold">{calculateTotalPrice(basePrice, selections)} ₺</div>
                    </div>
                    <Button 
                      className="w-full gap-2" 
                      size="lg"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {t.common.addToCart}
                    </Button>
                  </div>
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
