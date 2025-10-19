"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const separatorVariants = cva("shrink-0 bg-border", {
  variants: {
    variant: {
      horizontal: "h-[3px] w-full",
      vertical: "h-full w-[1px]",
    },
    size: {
      sm: "",
      md: "",
      lg: "",
    },
  },
  compoundVariants: [
    {
      variant: "horizontal",
      size: "sm",
      className: "h-[3px]",
    },
    {
      variant: "horizontal",
      size: "md",
      className: "h-[4px]",
    },
    {
      variant: "horizontal",
      size: "lg",
      className: "h-[8px]",
    },
    {
      variant: "vertical",
      size: "sm",
      className: "w-[1px]",
    },
    {
      variant: "vertical",
      size: "md",
      className: "w-[2px]",
    },
    {
      variant: "vertical",
      size: "lg",
      className: "w-[3px]",
    },
  ],
  defaultVariants: {
    variant: "horizontal",
    size: "sm",
  },
});

export interface SeparatorProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>,
    VariantProps<typeof separatorVariants> {}

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(({ className, orientation = "horizontal", size, variant, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative
    orientation={orientation}
    className={cn(separatorVariants({ variant: variant || orientation, size }), className)}
    {...props}
  />
));
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator, separatorVariants };