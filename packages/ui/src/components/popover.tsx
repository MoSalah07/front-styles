"use client";

/** Floating panel anchored to a trigger, used for rich content that needs focus, such as a small form or a picker. */
import * as React from "react";
import { Popover as PopoverPrimitive } from "radix-ui";
import { cn } from "../lib/cn";

function Popover(props: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root {...props} />;
}

function PopoverTrigger({
  className,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return (
    <PopoverPrimitive.Trigger data-slot="popover-trigger" className={cn(className)} {...props} />
  );
}

function PopoverAnchor({
  className,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return (
    <PopoverPrimitive.Anchor data-slot="popover-anchor" className={cn(className)} {...props} />
  );
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-(--z-popover) w-72 origin-(--radix-popover-content-transform-origin)",
          "rounded-md border bg-popover p-4 text-popover-foreground shadow-2 outline-none",
          "motion-safe:transition-opacity motion-safe:duration-(--duration-fast) motion-safe:ease-standard",
          "data-[state=open]:opacity-100 data-[state=closed]:opacity-0",
          "motion-safe:data-[state=open]:animate-scale-in",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

export { Popover, PopoverTrigger, PopoverAnchor, PopoverContent };
