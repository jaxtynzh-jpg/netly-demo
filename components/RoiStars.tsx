import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type RoiStarsProps = {
  score: 1 | 2 | 3 | 4 | 5;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
};

const sizeClassMap = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

const colorClassMap = {
  1: "text-slate-300",
  2: "text-slate-400",
  3: "text-amber-400",
  4: "text-emerald-500",
  5: "text-emerald-500",
};

export function RoiStars({ score, size = "md", showLabel = true }: RoiStarsProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, index) => {
          const filled = index < score;

          return (
            <Star
              key={index}
              className={cn(
                sizeClassMap[size],
                filled ? colorClassMap[score] : "text-slate-200",
              )}
              fill={filled ? "currentColor" : "none"}
            />
          );
        })}
      </div>
      {showLabel ? <span className="text-sm font-medium text-slate-600">{score}/5 ROI</span> : null}
    </div>
  );
}
