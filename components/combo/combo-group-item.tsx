"use client";

import { ComboGroup, ComboItem } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Price } from '@/components/ui/price';
import { Minus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { getNextProductImage } from '@/lib/utils/mock-images';

interface ComboGroupItemProps {
  item: ComboItem;
  group: ComboGroup;
  quantity: number;
  onSelect: (quantity: number) => void;
}

export function ComboGroupItem({ item, group, quantity, onSelect }: ComboGroupItemProps) {
  const canIncrease = group.MaxQuantity === 0 || quantity < group.MaxQuantity;
  const isSelected = quantity > 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onClick={() => {
        if (!isSelected && canIncrease) {
          onSelect(quantity + 1);
        }
      }}
      className="cursor-pointer"
    >
      <div className={`
        relative overflow-hidden rounded-2xl transition-all duration-300
        bg-gray-50 dark:bg-gray-800/50
        ${isSelected 
          ? 'ring-2 ring-primary shadow-lg shadow-primary/10' 
          : 'hover:ring-2 hover:ring-primary/50'
        }
      `}>
        {/* Product Image */}
        <div className="relative h-40 overflow-hidden">
          <img
            src={getNextProductImage()}
            alt={item.MenuItemText}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Title and Description */}
          <div className="space-y-1">
            <h4 className="font-bold text-lg leading-tight">{item.MenuItemText}</h4>
            {item.Description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {item.Description}
              </p>
            )}
          </div>

          {/* Price and Controls */}
          <div className="flex items-center justify-between gap-4">
            {item.ExtraPriceTakeOut_TL > 0 && (
              <div className="space-y-0.5">
                <div className="text-xs text-muted-foreground">Ek Ücret</div>
                <Price 
                  amount={item.ExtraPriceTakeOut_TL} 
                  className="text-lg font-semibold text-primary"
                />
              </div>
            )}

            {/* Quantity Controls */}
            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant={isSelected ? "default" : "secondary"}
                size="icon"
                disabled={quantity === 0}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(Math.max(0, quantity - 1));
                }}
                className="h-9 w-9"
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <span className="w-8 text-center tabular-nums font-bold text-lg">
                {quantity}
              </span>
              
              <Button
                variant={canIncrease ? "default" : "secondary"}
                size="icon"
                disabled={!canIncrease}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(quantity + 1);
                }}
                className="h-9 w-9"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
            {quantity}
          </div>
        )}
      </div>
    </motion.div>
  );
}
