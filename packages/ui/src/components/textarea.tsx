"use client";

/** Multi-line text field that matches the input styling and grows with its content. */
import * as React from "react";
import { cn } from "../lib/cn";

export type TextareaProps = React.ComponentProps<"textarea">;

function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-16 w-full min-w-0 field-sizing-content resize-y rounded-input border border-input bg-transparent px-3 py-2 text-sm text-foreground",
        "transition-[color,box-shadow,border-color] duration-(--duration-fast) ease-standard outline-none",
        "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
        "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40",
        "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:resize-none disabled:opacity-50",
        "dark:bg-input/20",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
