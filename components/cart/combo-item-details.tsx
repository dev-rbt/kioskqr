"use client";

import { ComboSelections } from '@/types/combo';
import { Price } from '@/components/ui/price';

interface ComboItemDetailsProps {
  selections: ComboSelections;
  className?: string;
}

export function ComboItemDetails({ selections, className }: ComboItemDetailsProps) {
  return (
    <div className={className}>
      {Object.entries(selections).map(([groupName, groupSelections]) => (
        <div key={groupName} className="mt-2 first:mt-0">
          <p className="text-sm font-medium text-primary/90 mb-1.5">
            {groupName}
          </p>
          <ul className="space-y-1.5">
            {groupSelections.map((selection) => (
              <li 
                key={selection.item.MenuItemKey} 
                className="text-sm flex items-center justify-between bg-secondary/20 rounded-lg px-3 py-1.5"
              >
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center bg-secondary/30 text-xs font-medium rounded-md w-5 h-5">
                    {selection.quantity}x
                  </span>
                  <span className="text-foreground/90">
                    {selection.item.MenuItemText}
                  </span>
                </div>
                {selection.item.ExtraPriceTakeOut_TL > 0 && (
                  <Price
                    amount={selection.item.ExtraPriceTakeOut_TL * selection.quantity}
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
