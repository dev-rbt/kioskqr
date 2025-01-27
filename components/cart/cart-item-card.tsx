"use client";

import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { useCartStore } from "@/store/cart";
import { Minus, Plus, Trash2 } from "lucide-react";
import { ComboItemDetails } from "./combo-item-details";
import { calculateItemPrice } from "@/lib/utils/price-calculator";
import { CartProduct } from "@/types/cart";

interface CartItemCardProps {
  item: CartProduct;
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { removeCartProduct, updateCartProduct } = useCartStore();

  const handleQuantityChange = (newQuantity: number) => {
    updateCartProduct(item.MenuItemKey, {
      ...item,
      Quantity: Math.max(0, newQuantity)
    });
  };

  return (
    <div className="glass-card glass-effect p-4 rounded-xl bg-gradient-to-br from-card/50 to-card hover:from-card/60 hover:to-card/90 transition-all duration-300">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
            {item.MenuItemText}
          </h3>
          {item.Notes && (
            <p className="text-sm text-muted-foreground/80 mt-0.5">
              Not: {item.Notes}
            </p>
          )}
          
          {item.IsMainCombo && item?.Items.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border/50">
              {item?.Items.map((item) => (
                <div key={item.MenuItemKey} className="flex justify-between items-center text-sm text-muted-foreground/80">
                  <span>{item.MenuItemText}</span>
                  <Price amount={item?.Price * item?.Quantity} className="text-sm" />
                </div>
              ))}
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 -mt-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          onClick={() => removeCartProduct(item.MenuItemKey)}
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
            onClick={() => handleQuantityChange(item.Quantity - 1)}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center tabular-nums font-semibold">
            {item.Quantity}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-secondary/50"
            onClick={() => handleQuantityChange(item.Quantity + 1)}
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
