"use client";

/** Form label bound to a control, dimmed automatically when the control it labels is disabled. */
import * as React from "react";
import { Label as LabelPrimitive } from "radix-ui";
import { cn } from "../lib/cn";

export type LabelProps = React.ComponentProps<typeof LabelPrimitive.Root>;

function Label({ className, ...props }: LabelProps) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex select-none items-center gap-2 text-sm font-medium leading-none text-foreground",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
