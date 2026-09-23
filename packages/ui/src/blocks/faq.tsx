"use client";

/** Frequently asked questions as an accordion, optionally with the section heading parked in its own column beside the list. */
import * as React from "react";
import { cn } from "../lib/cn";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/accordion";

export interface FaqItem {
  question: React.ReactNode;
  answer: React.ReactNode;
  /** Stable value for controlling the open item; defaults to the index. */
  value?: string;
}

export type FaqLayout = "stacked" | "split";

export interface FaqProps extends Omit<React.ComponentProps<"section">, "title"> {
  items?: FaqItem[];
  title?: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  /** `split` puts the heading beside the list on large screens. */
  layout?: FaqLayout;
  /** Allow one open answer at a time, or several. */
  type?: "single" | "multiple";
  /** Value(s) open on first render. */
  defaultValue?: string | string[];
  /** Extra content under the heading, e.g. a "contact us" link. */
  aside?: React.ReactNode;
}

function Faq({
  className,
  items = [],
  title,
  description,
  eyebrow,
  layout = "stacked",
  type = "single",
  defaultValue,
  aside,
  children,
  ...props
}: FaqProps) {
  const headingId = React.useId();
  const split = layout === "split";
  const hasHeading = Boolean(eyebrow || title || description || aside);

  const list =
    type === "multiple" ? (
      <Accordion
        type="multiple"
        defaultValue={
          Array.isArray(defaultValue) ? defaultValue : defaultValue ? [defaultValue] : undefined
        }
        className="w-full"
      >
        {items.map((item, index) => (
          <FaqEntry key={item.value ?? index} item={item} index={index} />
        ))}
      </Accordion>
    ) : (
      <Accordion
        type="single"
        collapsible
        defaultValue={Array.isArray(defaultValue) ? defaultValue[0] : defaultValue}
        className="w-full"
      >
        {items.map((item, index) => (
          <FaqEntry key={item.value ?? index} item={item} index={index} />
        ))}
      </Accordion>
    );

  return (
    <section
      data-slot="faq"
      data-layout={layout}
      aria-labelledby={title ? headingId : undefined}
      className={cn(
        "mx-auto w-full max-w-(--container-content) px-(--gutter) py-(--section-y)",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          split
            ? "grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16"
            : "flex flex-col gap-10",
        )}
      >
        {hasHeading ? (
          <div data-slot="faq-heading" className={cn("flex flex-col gap-4", !split && "max-w-2xl")}>
            {eyebrow ? (
              <p className="inline-flex items-center gap-3 text-eyebrow font-semibold uppercase text-primary before:block before:h-px before:w-8 before:bg-primary before:content-['']">
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h2 id={headingId} className="font-display text-h2 uppercase text-balance">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="text-body-lg text-pretty text-muted-foreground">{description}</p>
            ) : null}
            {aside}
          </div>
        ) : null}
        <div data-slot="faq-list" className="min-w-0">
          {list}
          {children}
        </div>
      </div>
    </section>
  );
}

function FaqEntry({ item, index }: { item: FaqItem; index: number }) {
  return (
    <AccordionItem value={item.value ?? `faq-${index}`}>
      <AccordionTrigger className="py-5 text-body font-semibold hover:no-underline hover:text-primary">
        {item.question}
      </AccordionTrigger>
      <AccordionContent className="max-w-prose pb-5 text-body-sm text-pretty">
        {item.answer}
      </AccordionContent>
    </AccordionItem>
  );
}

export { Faq };
