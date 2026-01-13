import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[6px] text-sm font-semibold uppercase tracking-wider ring-offset-background transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-night-green text-ivory hover:bg-pear hover:text-night-green hover:scale-[1.03] hover:shadow-lg",
        secondary:
          "border-2 border-night-green bg-transparent text-night-green hover:bg-pear hover:text-night-green hover:border-pear hover:scale-[1.03] hover:shadow-lg",
        hero:
          "bg-ivory text-night-green hover:bg-pear hover:scale-[1.03] hover:shadow-lg",
        heroOutline:
          "border-2 border-ivory bg-transparent text-ivory hover:bg-pear hover:text-night-green hover:border-pear hover:scale-[1.03] hover:shadow-lg",
        ghost:
          "text-night-green hover:bg-pear/20 hover:text-night-green",
        link:
          "text-night-green underline-offset-4 hover:underline hover:text-pear",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-pear hover:text-night-green hover:border-pear",
      },
      size: {
        default: "h-12 px-8 py-3",
        sm: "h-10 px-6 py-2 text-xs",
        lg: "h-14 px-10 py-4",
        xl: "h-16 px-12 py-5 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };





