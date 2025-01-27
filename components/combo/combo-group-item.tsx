"use client";

import { ComboGroup, ComboItem } from '@/types/branch';
import { Button } from '@/components/ui/button';
import { Price } from '@/components/ui/price';
import { Minus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { getNextProductImage } from '@/lib/utils/mock-images';
import useBranchStore from '@/store/branch';
import { useEffect, useState } from 'react';

interface ComboGroupItemProps {
  item: ComboItem;
  group: ComboGroup;
  onSelect: (quantity: number) => void;
  totalGroupQuantity: number;
  selectedQuantity: number;
}

export function ComboGroupItem({ item, group, onSelect, totalGroupQuantity, selectedQuantity }: ComboGroupItemProps) {
  const {branchData, selectedLanguage} = useBranchStore();
  const [isSelected, setIsSelected] = useState(selectedQuantity > 0);
  const translation = item.Translations?.[selectedLanguage?.Key || ''];
  const turkishTranslation = item.Translations?.[branchData?.Languages.find(language => language.Code.toLowerCase() === 'tr')?.Key || 'en-US'];
  
  const canIncrease = group.MaxQuantity === 0 || (totalGroupQuantity < group.MaxQuantity);
  
  useEffect(() => { 
    setIsSelected(selectedQuantity > 0);
  }, [selectedQuantity]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity === 0 || (group.MaxQuantity === 0 || totalGroupQuantity < group.MaxQuantity)) {
      onSelect(newQuantity);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onClick={(e) => {
        e.preventDefault();
        if (canIncrease && !isSelected) {
          handleQuantityChange(selectedQuantity + 1);
        }
      }}
      className={`cursor-pointer ${!canIncrease && !isSelected ? 'opacity-50' : ''}`}
    >
      <div className={`
        relative overflow-hidden rounded-2xl transition-all duration-300
        ${selectedQuantity > 0 
          ? 'bg-green-50 dark:bg-green-900/20 ring-2 ring-green-500 shadow-lg shadow-green-500/10' 
          : 'bg-gray-50 dark:bg-gray-800/50 hover:ring-2 hover:ring-primary/50'
        }
      `}>
        {/* Product Image */}
        <div className="relative h-40 overflow-hidden">
          <img
            src={translation?.ImageUrl || turkishTranslation?.ImageUrl || getNextProductImage()}
            alt={translation?.Name || item.OriginalName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Title and Description */}
          <div className="space-y-1">
            <h4 className={`font-bold text-lg leading-tight ${selectedQuantity > 0 ? 'text-green-700 dark:text-green-400' : ''}`}>
              {translation?.Name || item.OriginalName}
            </h4>
          </div>

          {/* Price and Controls */}
          <div className="flex items-center justify-between gap-4">
            {item.ExtraPriceTakeOut > 0 && (
              <div className="space-y-0.5">
                <div className="text-xs text-muted-foreground">Ek Ücret</div>
                <Price 
                  amount={item.ExtraPriceTakeOut} 
                  className={`text-lg font-semibold ${selectedQuantity > 0 ? 'text-green-600' : 'text-primary'}`}
                />
              </div>
            )}

            {/* Quantity Controls */}
            <div className="flex items-center gap-2 ml-auto">
              {selectedQuantity > 0 && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuantityChange(0);
                  }}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              )}
              {selectedQuantity > 0 && (
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedQuantity > 0 ? 'bg-green-100 text-green-700' : 'bg-primary/10 text-primary'
                }`}>
                  {selectedQuantity}
                </div>
              )}
              {canIncrease && (
                <Button
                  variant={isSelected ? "default" : "secondary"}
                  size="icon"
                  className={`h-8 w-8 ${selectedQuantity > 0 ? 'bg-green-500 hover:bg-green-600 text-white' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuantityChange(selectedQuantity + 1);
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
