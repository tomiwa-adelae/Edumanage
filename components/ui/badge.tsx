import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground dark:bg-primary/80 [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground dark:bg-secondary/80 [a&]:hover:bg-secondary/90",
        pending:
          "border-transparent bg-yellow-500 text-white dark:bg-yellow-600 [a&]:hover:bg-yellow-500/90",
        success:
          "border-transparent bg-green-500 text-white dark:bg-green-600 [a&]:hover:bg-green-500/90",
        admin:
          "border-transparent bg-purple-500/15 text-purple-800 dark:text-purple-200 dark:bg-purple-900/30 [a&]:hover:bg-purple-500/90",
        parent:
          "border-transparent bg-amber-500/15 text-amber-800 dark:text-amber-200 dark:bg-amber-900/30 [a&]:hover:bg-amber-500/90",
        student:
          "border-transparent bg-green-500/15 text-green-800 dark:text-green-200 dark:bg-green-900/30 [a&]:hover:bg-green-500/90",
        teacher:
          "border-transparent bg-blue-500/15 text-blue-800 dark:text-blue-200 dark:bg-blue-900/30 [a&]:hover:bg-blue-500/90",
        bursar:
          "border-transparent bg-yellow-500/15 text-yellow-800 dark:text-yellow-200 dark:bg-yellow-900/30 [a&]:hover:bg-yellow-500/90",
        exam_officer:
          "border-transparent bg-orange-500/15 text-orange-800 dark:text-orange-200 dark:bg-orange-900/30 [a&]:hover:bg-orange-500/90",
        librarian:
          "border-transparent bg-pink-500/15 text-pink-800 dark:text-pink-200 dark:bg-pink-900/30 [a&]:hover:bg-pink-500/90",
        data_analyst:
          "border-transparent bg-indigo-500/15 text-indigo-800 dark:text-indigo-200 dark:bg-indigo-900/30 [a&]:hover:bg-indigo-500/90",
        it_support:
          "border-transparent bg-sky-500/15 text-sky-800 dark:text-sky-200 dark:bg-sky-900/30 [a&]:hover:bg-sky-500/90",
        principal:
          "border-transparent bg-rose-500/15 text-rose-800 dark:text-rose-200 dark:bg-rose-900/30 [a&]:hover:bg-rose-500/90",
        destructive:
          "border-transparent bg-destructive text-white dark:bg-destructive/80 [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/15 dark:focus-visible:ring-destructive/40",
        outline:
          "text-foreground dark:text-foreground border-foreground/20 dark:border-foreground/30 [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        outlinePrimary:
          "text-primary border-primary dark:text-primary/80 dark:border-primary/60 [a&]:hover:bg-primary/10",
        outlineSuccess:
          "text-green-500 border-green-500 dark:text-green-300 dark:border-green-300 [a&]:hover:bg-green-500/10",
        outlinePurple:
          "text-purple-500 border-purple-500 dark:text-purple-300 dark:border-purple-300 [a&]:hover:bg-purple-500/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
