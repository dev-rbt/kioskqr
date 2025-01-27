"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart";
import useBranchStore from "@/store/branch";
import { useVirtualKeyboard } from "@/hooks/use-virtual-keyboard";

export function CartNotes() {
  const { cart, updateCart } = useCartStore();
  const { t } = useBranchStore();
  const [inputValue, setInputValue] = useState(cart.Notes || "");
  const inputRef = useVirtualKeyboard();

  useEffect(() => {
    setInputValue(cart.Notes || "");
  }, [cart.Notes]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    updateCart({ ...cart, Notes: value });
  };

  return (
    <div className="px-4 pb-4 border-b">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder={t.common.orderNotes || "Sipariş Notu"}
        className="w-full p-3 rounded-xl bg-primary/5 border border-primary/10 focus:border-primary/20 outline-none resize-none text-sm placeholder:text-muted-foreground/50"
      />
    </div>
  );
}
