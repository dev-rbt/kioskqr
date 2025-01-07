"use client";

import { ShoppingCart } from "lucide-react";
import { useLanguageStore } from "@/store/language";

export function CartEmpty() {
  const { t } = useLanguageStore();

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
        <ShoppingCart className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="font-medium text-lg mb-1">{t.common.emptyCart}</h3>
      <p className="text-muted-foreground text-sm">
        {t.common.emptyCartMessage}
      </p>
    </div>
  );
}
