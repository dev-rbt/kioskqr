import { cn } from "@/lib/utils";
import { Clock, Flame, Leaf, Scale } from "lucide-react";

export type BadgeIcon = "time" | "spicy" | "vegetarian" | "calories";

interface ProductBadgeProps {
  icon: BadgeIcon;
  value: string;
  className?: string;
}

const icons: Record<BadgeIcon, React.ComponentType<any>> = {
  time: Clock,
  spicy: Flame,
  vegetarian: Leaf,
  calories: Scale,
};

export function ProductBadge({ icon, value, className }: ProductBadgeProps) {
  const Icon = icons[icon];

  return (
    <div className={cn(
      "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm",
      className
    )}>
      <Icon className="h-3.5 w-3.5" />
      <span>{value}</span>
    </div>
  );
}
