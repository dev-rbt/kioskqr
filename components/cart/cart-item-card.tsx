"use client";

import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { useCartStore } from "@/store/cart";
import { Minus, Plus, Trash2 } from "lucide-react";
import { ComboItemDetails } from "./combo-item-details";
import { calculateItemPrice } from "@/lib/utils/price-calculator";
import type { CartItem } from "@/types";

interface CartItemCardProps {
  item: CartItem;
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { removeItem, updateQuantity } = useCartStore();

  return (
    <div className="glass-card glass-effect p-4 rounded-xl bg-gradient-to-br from-card/50 to-card hover:from-card/60 hover:to-card/90 transition-all duration-300">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
            {item.product.name}
          </h3>
          <p className="text-sm text-muted-foreground/80 line-clamp-1 mt-0.5">
            {item.product.description}
          </p>
          
          {item.product.comboSelections && (
            <ComboItemDetails 
              selections={item.product.comboSelections}
              className="mt-3 pt-3 border-t border-border/50"
            />
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 -mt-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          onClick={() => removeItem(item.product.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 bg-secondary/30 hover:bg-secondary/40 transition-colors rounded-lg p-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-secondary/50"
            onClick={() => updateQuantity(item.product.id, Math.max(0, item.quantity - 1))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center tabular-nums font-semibold">
            {item.quantity}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-secondary/50"
            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <Price 
          amount={calculateItemPrice(item)} 
          className="text-lg font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"
        />
      </div>
    </div>
  );
}
