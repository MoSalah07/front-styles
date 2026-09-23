/** Single-line text field on the shared control-height scale, with invalid and disabled states wired to ARIA. */
import * as React from "react";
import { cn } from "../lib/cn";

export type InputProps = React.ComponentProps<"input">;

function Input({ className, type, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-(--control-h-md) w-full min-w-0 rounded-input border border-input bg-transparent px-3 py-1 text-sm text-foreground",
        "transition-[color,box-shadow,border-color] duration-(--duration-fast) ease-standard outline-none",
        "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40",
        "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "dark:bg-input/20",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
