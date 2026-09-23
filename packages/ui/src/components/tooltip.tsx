"use client";

/** Short text hint shown on hover or focus, with an arrow pointing back at its trigger. */
import * as React from "react";
import { Tooltip as TooltipPrimitive } from "radix-ui";
import { cn } from "../lib/cn";

function TooltipProvider({
  delayDuration = 200,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />;
}

function Tooltip({
  delayDuration = 200,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <TooltipPrimitive.Root {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return (
    <TooltipPrimitive.Trigger data-slot="tooltip-trigger" className={cn(className)} {...props} />
  );
}

function TooltipContent({
  className,
  sideOffset = 4,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "z-(--z-tooltip) w-fit max-w-xs origin-(--radix-tooltip-content-transform-origin)",
          "rounded-sm bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-2",
          "border text-balance",
          "motion-safe:transition-opacity motion-safe:duration-(--duration-fast) motion-safe:ease-standard",
          "data-[state=delayed-open]:opacity-100 data-[state=instant-open]:opacity-100",
          "data-[state=closed]:opacity-0",
          "motion-safe:data-[state=delayed-open]:animate-scale-in",
          className,
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow
          data-slot="tooltip-arrow"
          width={10}
          height={5}
          className="fill-popover"
        />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent };
