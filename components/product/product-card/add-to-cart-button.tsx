"use client";

import { Button } from '@/components/ui/button';
import { Plus, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import useBranchStore from '@/store/branch';

interface AddToCartButtonProps {
  onClick: () => void;
  isCombo?: boolean;
}

export function AddToCartButton({ onClick, isCombo }: AddToCartButtonProps) {
  const { t, branchData } = useBranchStore();

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="w-full"
    >
      <Button
        onClick={onClick}
        className="w-full h-10 hover:scale-105 active:scale-95 transition-all duration-200 gap-2 text-white"
        style={{ 
          backgroundColor: branchData?.AccentColor || '#000',
          color: 'white'
        }}
      >
        {isCombo ? (
          <>
            {t.common.viewMenu}
            <ChevronRight className="h-4 w-4" />
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" />
            {t.common.addToCart}
          </>
        )}
      </Button>
    </motion.div>
  );
}
