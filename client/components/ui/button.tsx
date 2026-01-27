import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-[hsl(var(--primary-dark))]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border-2 border-primary text-primary bg-background hover:bg-primary/10",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        blue: "bg-[hsl(var(--color-blue))] text-[hsl(var(--color-blue-foreground))] hover:bg-[hsl(210_70%_38%)]",
        emerald: "bg-[hsl(var(--color-emerald))] text-[hsl(var(--color-emerald-foreground))] hover:bg-[hsl(160_60%_35%)]",
        orange: "bg-[hsl(var(--color-orange))] text-[hsl(var(--color-orange-foreground))] hover:bg-[hsl(30_85%_40%)]",
        indigo: "bg-[hsl(var(--color-indigo))] text-[hsl(var(--color-indigo-foreground))] hover:bg-[hsl(250_70%_40%)]",
        amber: "bg-[hsl(var(--color-amber))] text-[hsl(var(--color-amber-foreground))] hover:bg-[hsl(40_95%_40%)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
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
