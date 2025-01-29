"use client";

import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { useCartStore } from "@/store/cart";
import { Plus, Trash2, Minus, Edit } from "lucide-react";
import { ComboItemDetails } from "./combo-item-details";
import { calculateItemPrice } from "@/lib/utils/price-calculator";
import { CartProduct } from "@/types/cart";
import { motion } from "framer-motion";
import useBranchStore from "@/store/branch";
import { getNextProductImage } from "@/lib/utils/mock-images";
import { useRouter } from "next/navigation";

interface CartItemCardProps {
  item: CartProduct;
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { removeCartProductTransactionKey, updateCartProductTransactionKey } = useCartStore();
  const { branchData, selectedLanguage } = useBranchStore();
  const router = useRouter();

  const handleQuantityChange = (newQuantity: number) => {
    updateCartProductTransactionKey(item.TransactionKey!, {
      ...item,
      Quantity: Math.max(0, newQuantity)
    });
  };

  const handleEdit = () => {
    const category = branchData?.Categories.find(cat => 
      cat.Products.some(p => p.ProductID === item.MenuItemKey)
    );
    
    if (category && item.MenuItemKey) {
      router.push(`/${branchData?.BranchID}/product/${category.CategoryID}/${item.MenuItemKey}?transactionKey=${item.TransactionKey}`);
    }
  };

  // Find product translation for image
  const product = branchData?.Categories
    .flatMap(cat => cat.Products)
    .find(p => p.ProductID === item.MenuItemKey);
  
  const productTranslation = product?.Translations?.[selectedLanguage?.Key || ''];
  const turkishTranslation = product?.Translations?.[branchData?.Languages.find(language => language.Code.toLowerCase() === 'tr')?.Key || ''];
  const imageUrl = productTranslation?.ImageUrl || turkishTranslation?.ImageUrl || getNextProductImage();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="group relative"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/2 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
      
      {/* Main content */}
      <div className="relative p-4 rounded-2xl border border-gray-100 hover:border-primary/20 bg-white/50 backdrop-blur-sm transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/5">
        <div className="flex gap-4">
          {/* Product Image */}
          <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center bg-white">
            <img
              src={imageUrl}
              alt={item.MenuItemText}
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg text-gray-900 truncate">
                  {item.MenuItemText}
                </h3>
                {item.IsMainCombo && item.Notes && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {item.Notes}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 -mt-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  onClick={() => removeCartProductTransactionKey(item.TransactionKey!)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                {item.IsMainCombo && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 -mt-1 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                    onClick={handleEdit}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Combo Items */}
            {item.IsMainCombo && item?.Items.length > 0 && (
              <div className="mt-3 pt-3 border-t border-dashed border-gray-200">
                {item?.Items.map((comboItem) => (
                  <div key={comboItem.MenuItemKey} className="flex justify-between items-center text-sm text-gray-600 py-1">
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary font-medium">
                        {comboItem.Quantity}x
                      </span>
                      {comboItem.MenuItemText}
                    </span>
                    {comboItem.Price > 0 && (
                      <Price amount={comboItem.Price * comboItem.Quantity} className="text-sm font-medium" />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Quantity Controls and Price */}
            <div className="flex items-center justify-between gap-4 mt-4">
              <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-white hover:shadow-sm"
                  onClick={() => handleQuantityChange(item.Quantity! - 1)}
                  disabled={item.Quantity! <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center tabular-nums font-semibold text-gray-900">
                  {item.Quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-white hover:shadow-sm"
                  onClick={() => handleQuantityChange(item.Quantity! + 1)}
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
        </div>
      </div>
    </motion.div>
  );
}