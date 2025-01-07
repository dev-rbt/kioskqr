"use client";

import { useCartStore } from "@/store/cart";
import { CartItemCard } from "./cart-item-card";
import { motion, AnimatePresence } from "framer-motion";

export function CartItems() {
  const { items } = useCartStore();

  return (
    <div className="space-y-6">
      <AnimatePresence initial={false}>
        {items.map((item) => (
          <motion.div
            key={`${item.product.id}-${JSON.stringify(item.product.comboSelections)}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CartItemCard item={item} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
