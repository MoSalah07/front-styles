"use client";

/** Determinate progress bar whose fill grows from the reading edge, so it runs right-to-left under `dir="rtl"`. */
import * as React from "react";
import { Progress as ProgressPrimitive } from "radix-ui";
import { cn } from "../lib/cn";

export type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root>;

function Progress({ className, value, max = 100, ...props }: ProgressProps) {
  const safeMax = max > 0 ? max : 100;
  const percent =
    typeof value === "number" ? Math.min(100, Math.max(0, (value / safeMax) * 100)) : 0;

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={value}
      max={max}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-muted", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        // The fill is a full-width bar slid out of view by the remaining
        // percentage. `translate-x` is physical, so it has to be mirrored for
        // RTL or the bar would drain from the wrong edge.
        style={{ "--progress-remaining": `${100 - percent}%` } as React.CSSProperties}
        className={cn(
          "size-full flex-1 bg-primary",
          "-translate-x-(--progress-remaining) rtl:translate-x-(--progress-remaining)",
          "motion-safe:transition-transform motion-safe:duration-(--duration-fast) motion-safe:ease-standard",
        )}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
