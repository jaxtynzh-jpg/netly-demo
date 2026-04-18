import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-emerald-300/35 bg-emerald-50/90 text-emerald-800",
        neutral: "border-slate-200/85 bg-white/90 text-slate-700",
        warm: "border-amber-300/35 bg-amber-50/90 text-amber-800",
        info: "border-sky-300/35 bg-sky-50/90 text-sky-800",
        muted: "border-slate-200/80 bg-slate-100/95 text-slate-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
