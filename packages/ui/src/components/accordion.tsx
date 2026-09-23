"use client";

/** Vertically stacked disclosure sections; the open panel animates its height and its chevron flips. */
import * as React from "react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { cn } from "../lib/cn";

/** Inline copy of the lucide `chevron-down` glyph: lucide-react is not a dependency of this package. */
function ChevronDownIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export type AccordionProps = React.ComponentProps<typeof AccordionPrimitive.Root>;

function Accordion({ className, ...props }: AccordionProps) {
  return <AccordionPrimitive.Root data-slot="accordion" className={cn(className)} {...props} />;
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b border-border last:border-b-0", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex" data-slot="accordion-header">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger flex flex-1 items-start justify-between gap-4",
          "py-4 text-start text-sm font-medium",
          "transition-[color,box-shadow] duration-(--duration-fast) ease-standard",
          "outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon
          data-slot="accordion-chevron"
          className={cn(
            "pointer-events-none size-4 shrink-0 translate-y-0.5 text-muted-foreground",
            "motion-safe:transition-transform motion-safe:duration-(--duration-fast) motion-safe:ease-standard",
            "group-data-[state=open]/accordion-trigger:rotate-180",
          )}
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className={cn(
        "overflow-hidden text-sm",
        // Radix publishes --radix-accordion-content-height; the keyframes that
        // consume it live in the token layer so every component shares them.
        "motion-safe:data-[state=open]:animate-accordion-down",
        "motion-safe:data-[state=closed]:animate-accordion-up",
      )}
      {...props}
    >
      <div className={cn("pb-4 pt-0 text-muted-foreground", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
