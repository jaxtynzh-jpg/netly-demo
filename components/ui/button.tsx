import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border border-sky-300/20 bg-[linear-gradient(135deg,#061321,#10334f)] px-5 py-3 text-white shadow-[0_18px_45px_-18px_rgba(14,165,233,0.55)] hover:-translate-y-0.5 hover:border-emerald-300/30 hover:shadow-[0_22px_55px_-18px_rgba(30,211,167,0.5)]",
        secondary:
          "border border-slate-200/80 bg-[rgba(255,255,255,0.88)] px-5 py-3 text-slate-900 shadow-[0_10px_25px_-18px_rgba(8,19,33,0.45)] backdrop-blur hover:-translate-y-0.5 hover:border-sky-200 hover:bg-white",
        ghost:
          "px-0 py-0 text-slate-600 hover:text-slate-900",
      },
      size: {
        default: "h-11",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
