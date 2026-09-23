/** Inline status message. A grid keeps an optional leading icon aligned with the title while the description wraps under both. */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const alertVariants = cva(
  [
    // One icon column that collapses to zero width when no icon is present, so
    // the title always starts flush with the padding in the icon-less case.
    "relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5",
    "has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3",
    "rounded-card border px-4 py-3 text-sm",
    "[&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  ],
  {
    variants: {
      variant: {
        default: "border-border bg-card text-card-foreground",
        destructive:
          "border-destructive/30 bg-destructive/10 text-destructive *:data-[slot=alert-description]:text-destructive/90",
        success:
          "border-success/30 bg-success/10 text-success-700 dark:text-success-300 *:data-[slot=alert-description]:opacity-90",
        warning:
          "border-warning/30 bg-warning/10 text-warning-700 dark:text-warning-300 *:data-[slot=alert-description]:opacity-90",
        info: "border-info/30 bg-info/10 text-info-700 dark:text-info-300 *:data-[slot=alert-description]:opacity-90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface AlertProps
  extends React.ComponentProps<"div">, VariantProps<typeof alertVariants> {}

function Alert({ className, variant, ...props }: AlertProps) {
  return (
    <div
      data-slot="alert"
      data-variant={variant ?? "default"}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn("col-start-2 min-h-4 font-medium tracking-tight", className)}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 grid justify-items-start gap-1 text-sm text-muted-foreground",
        "[&_p]:leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription, alertVariants };
