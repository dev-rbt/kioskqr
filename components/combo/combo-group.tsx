"use client";

import { Badge } from '@/components/ui/badge';
import { ComboGroupItem } from './combo-group-item';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { ComboGroup as ComboGroupType, ComboItem } from '@/types/branch';
import { ComboSelections } from '@/types/combo';
import useBranchStore from '@/store/branch';

interface ComboGroupProps {
  group: ComboGroupType;
  selections: ComboSelections;
  onSelect: (GroupName: string, Item: ComboItem, Quantity: number) => void;
  progress: number;
}

export function ComboGroup({ group, selections, onSelect, progress }: ComboGroupProps) {
  const { t } = useBranchStore();
  const currentSelections = selections[group.OriginalName] || [];
  const totalQuantity = currentSelections.reduce((sum, s) => sum + s.Quantity, 0);
  
  const isComplete = group.IsForcedGroup 
    ? totalQuantity >= group.ForcedQuantity
    : totalQuantity > 0;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
      {/* Group Header */}
      <div className="sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl z-10">
        <div className="p-6 space-y-4">
          {/* Title and Status */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">
                {group.OriginalName}
              </h3>
              <div className="flex items-center gap-2">
                {group.IsForcedGroup ? (
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${
                    isComplete ? 'bg-primary/10 text-primary' : 'bg-orange-500/10 text-orange-500'
                  }`}>
                    <AlertCircle className="w-4 h-4" />
                    <span className="font-medium">
                      {isComplete 
                        ? t.common.selectionCompleted
                        : `${group.ForcedQuantity} ${t.common.requiredSelections}`}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>{t.common.optionalSelection}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Selection Counter */}
            <div className="flex flex-col items-end gap-1">
              <div className="text-3xl font-bold tabular-nums text-primary">
                {totalQuantity}
                <span className="text-xl text-muted-foreground">
                  /{group.MaxQuantity || '∞'}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                {t.common.selectionsCount}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <motion.div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/80"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Selection Rules */}
          <div className="flex flex-wrap gap-2">
            {group.IsForcedGroup && (
              <Badge variant="default" className="bg-orange-500 hover:bg-orange-600">
                {t.common.requiredSelection}
              </Badge>
            )}
            {group.MaxQuantity > 0 && (
              <Badge variant="secondary">
                {t.common.maximumCount} {group.MaxQuantity} {t.common.pieces}
              </Badge>
            )}
            {group.ForcedQuantity > 0 && (
              <Badge variant="secondary">
                {group.ForcedQuantity} {t.common.mustSelect}
              </Badge>
            )}
          </div>
        </div>

        {/* Separator */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
      </div>

      {/* Items Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {group.Items.map((item) => {
            const selectedItem = selections[group.OriginalName]?.find(s => s.Item.MenuItemKey === item.MenuItemKey);
            const selectedQuantity = selectedItem?.Quantity || 0;
            return (
              <ComboGroupItem
                key={item.MenuItemKey}
                item={item}
                group={group}
                onSelect={(quantity) => onSelect(group.OriginalName, item, quantity)}
                totalGroupQuantity={totalQuantity}
                selectedQuantity={selectedQuantity}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
