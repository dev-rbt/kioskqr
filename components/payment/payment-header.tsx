"use client";

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PaymentHeaderProps {
  totalAmount: number;
  progress: number;
  onBack: () => void;
  t: any;
}

export function PaymentHeader({ totalAmount, progress, onBack, t }: PaymentHeaderProps) {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-100">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Button
          variant="ghost"
          size="lg"
          onClick={onBack}
          className="gap-2 group hover:bg-primary/10 text-gray-700 transition-all rounded-xl text-lg"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          {t.common.backToCart}
        </Button>

        {/* Progress Bar */}
        <div className="absolute left-0 right-0 bottom-0 h-1">
          <Progress value={progress} className="h-full rounded-none" />
        </div>

        {/* Amount Display */}
        <div className="flex items-center gap-4 bg-gradient-to-r from-primary/10 to-primary/5 px-5 py-2.5 rounded-2xl shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-600">{t.common.totalAmount}</span>
            <div className="flex items-baseline gap-1 font-bold">
              <span className="text-primary text-lg">₺</span>
              <span className="text-2xl text-gray-900">{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}