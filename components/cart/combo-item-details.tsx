"use client";

import { Price } from '@/components/ui/price';
import { ComboSelections } from '@/types/combo';

interface ComboItemDetailsProps {
  selections: ComboSelections;
  className?: string;
}

export function ComboItemDetails({ selections, className }: ComboItemDetailsProps) {
  return (
    <div className={className}>
      {Object.entries(selections).map(([groupName, items]) => (
        <div key={groupName} className="mt-2 first:mt-0">
          <p className="text-sm font-medium text-primary/90 mb-1.5">
            {groupName}
          </p>
          <ul className="space-y-1.5">
            {items.map((selectionItem) => (
              <li 
                key={selectionItem.Item.MenuItemKey} 
                className="text-sm flex items-center justify-between bg-secondary/20 rounded-lg px-3 py-1.5"
              >
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center bg-secondary/30 text-xs font-medium rounded-md w-5 h-5">
                    {selectionItem.Quantity}x
                  </span>
                  <span className="text-foreground/90">
                    {selectionItem.Item.OriginalName}
                  </span>
                </div>
                {selectionItem.Item.ExtraPriceTakeOut > 0 && (
                  <Price
                    amount={selectionItem.Item.ExtraPriceTakeOut * selectionItem.Quantity}
                    className="text-sm font-medium text-primary/90 ml-2"
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
