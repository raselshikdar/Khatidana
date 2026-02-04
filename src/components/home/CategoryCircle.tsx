import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryCircleProps {
  name: string;
  nameBn?: string;
  icon: LucideIcon;
  color: string;
  onClick?: () => void;
}

export const CategoryCircle = ({ name, nameBn, icon: Icon, color, onClick }: CategoryCircleProps) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 group"
    >
      <div
        className={cn(
          "w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center",
          "transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg",
          color
        )}
      >
        <Icon className="h-7 w-7 md:h-8 md:w-8 text-card" />
      </div>
      <div className="text-center">
        <p className="text-xs md:text-sm font-medium text-foreground">{name}</p>
        {nameBn && (
          <p className="text-[10px] text-muted-foreground font-bengali">{nameBn}</p>
        )}
      </div>
    </button>
  );
};
