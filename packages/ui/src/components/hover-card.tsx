"use client";

/** Preview card revealed when a pointer rests on its trigger; purely informational, so it never traps focus. */
import * as React from "react";
import { HoverCard as HoverCardPrimitive } from "radix-ui";
import { cn } from "../lib/cn";

function HoverCard({
  openDelay = 200,
  closeDelay = 150,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
  return <HoverCardPrimitive.Root openDelay={openDelay} closeDelay={closeDelay} {...props} />;
}

function HoverCardTrigger({
  className,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Trigger>) {
  return (
    <HoverCardPrimitive.Trigger
      data-slot="hover-card-trigger"
      className={cn(className)}
      {...props}
    />
  );
}

function HoverCardContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Content>) {
  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-(--z-popover) w-64 origin-(--radix-hover-card-content-transform-origin)",
          "rounded-md border bg-popover p-4 text-popover-foreground shadow-2 outline-none",
          "motion-safe:transition-opacity motion-safe:duration-(--duration-fast) motion-safe:ease-standard",
          "data-[state=open]:opacity-100 data-[state=closed]:opacity-0",
          "motion-safe:data-[state=open]:animate-scale-in",
          className,
        )}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  );
}

export { HoverCard, HoverCardTrigger, HoverCardContent };
