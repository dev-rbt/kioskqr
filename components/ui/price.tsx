import { cn } from "@/lib/utils";

interface PriceProps {
  amount: number;
  className?: string;
}

export function Price({ amount, className }: PriceProps) {
  const formattedAmount = amount ? Number(amount).toFixed(2) : "0.00";
  
  return (
    <span className={cn("font-medium", className)}>
      {formattedAmount} ₺
    </span>
  );
}
