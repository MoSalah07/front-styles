/** Primary action control. Six variants, three sizes plus icon sizes, a loading state, and asChild composition for links. */
import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const buttonVariants = cva(
  [
    "inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap",
    "rounded-control text-sm font-semibold",
    "transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-(--duration-fast) ease-standard",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
    "aria-invalid:ring-2 aria-invalid:ring-destructive/40",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    "motion-safe:active:scale-[0.98]",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        sm: "h-(--control-h-sm) gap-1.5 px-3 text-xs",
        md: "h-(--control-h-md) px-4",
        lg: "h-(--control-h-lg) px-6 text-base",
        icon: "size-(--control-h-md)",
        "icon-sm": "size-(--control-h-sm)",
        "icon-lg": "size-(--control-h-lg)",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  /** Render the child element instead of a `<button>`, merging props and styles. */
  asChild?: boolean;
  /** Show a spinner and block interaction while an action is pending. */
  loading?: boolean;
}

function Spinner() {
  return (
    <svg
      className="animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M12 3a9 9 0 1 0 9 9" />
    </svg>
  );
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const shared = {
    "data-slot": "button",
    "data-variant": variant ?? "default",
    "data-loading": loading || undefined,
    "aria-busy": loading || undefined,
    className: cn(buttonVariants({ variant, size }), className),
    ...props,
  };

  // Slot requires exactly one child, so the spinner and any conditional null
  // must not reach it. With asChild the caller owns the markup.
  if (asChild) {
    return (
      <Slot.Root aria-disabled={disabled || loading || undefined} {...shared}>
        {children}
      </Slot.Root>
    );
  }

  return (
    <button disabled={disabled || loading} {...shared}>
      {loading ? <Spinner /> : null}
      {children}
    </button>
  );
}

export { Button, buttonVariants };
