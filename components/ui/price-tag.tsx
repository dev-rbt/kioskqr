"use client";

import { cn } from "@/lib/utils";
import { Price } from "./price";
import useBranchStore from "@/store/branch";

interface PriceTagProps {
  amount: number;
  className?: string;
}

export function PriceTag({ amount, className }: PriceTagProps) {
  const { branchData } = useBranchStore();

  return (
    <div className={cn("relative group", className)}>
      {/* Main Tag */}
      <div className="relative backdrop-blur-sm rounded-l-xl pl-4 pr-8 py-2 shadow-lg"
           style={{ backgroundColor: branchData?.AccentColor || '#000' }}>
        {/* Curved Edge */}
        <div className="absolute -right-4 inset-y-0 w-4">
          <div className="absolute inset-0" style={{ backgroundColor: branchData?.AccentColor || '#000' }}>
            <div className="absolute inset-0 w-full h-full">
              <svg viewBox="0 0 20 50" preserveAspectRatio="none" className="h-full w-full" style={{ fill: branchData?.AccentColor || '#000' }}>
                <path d="M0 0C10 0 20 25 20 25C20 25 10 50 0 50Z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="relative" style={{ color: 'white' }}>
          <Price amount={amount} className="text-lg font-bold" />
        </div>

        {/* Decorative Elements */}
        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/20" />
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/20" />
      </div>

      {/* Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-l-xl" />
    </div>
  );
}
