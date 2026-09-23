/** Marketing hero with eyebrow, display title, description, actions and optional media, in a stacked, centered or split layout. */
import * as React from "react";
import { cn } from "../lib/cn";

export type HeroVariant = "default" | "centered" | "split";
export type HeroDecoration = "dots" | "gradient" | "none";

/**
 * Ornamental background layers. Both are painted from semantic tokens through
 * `color-mix`, so they follow the brand and the colour mode with no rebuild.
 */
const heroDecorations: Record<Exclude<HeroDecoration, "none">, string> = {
  dots: cn(
    "[background-image:radial-gradient(color-mix(in_oklab,var(--foreground)_14%,transparent)_1px,transparent_1px)]",
    "[background-size:24px_24px]",
    "[mask-image:radial-gradient(60%_60%_at_50%_0%,black,transparent)]",
  ),
  gradient:
    "[background-image:radial-gradient(70%_55%_at_50%_0%,color-mix(in_oklab,var(--primary)_22%,transparent),transparent_72%)]",
};

export interface HeroProps extends React.ComponentProps<"section"> {
  /** Stacked and start-aligned, centered, or text beside media. */
  variant?: HeroVariant;
  /** Decorative background layer. It is `aria-hidden` and never affects layout. */
  decoration?: HeroDecoration;
}

function isHeroMedia(child: React.ReactNode): boolean {
  return React.isValidElement(child) && child.type === HeroMedia;
}

function Hero({
  className,
  variant = "default",
  decoration = "dots",
  children,
  ...props
}: HeroProps) {
  // The media has to leave the text column in the split layout, so it is
  // pulled out of the child list rather than relying on source order.
  const items = React.Children.toArray(children);
  const media = items.filter(isHeroMedia);
  const content = items.filter((child) => !isHeroMedia(child));
  const split = variant === "split";

  return (
    <section
      data-slot="hero"
      data-variant={variant}
      className={cn("group/hero relative isolate overflow-hidden py-(--section-y)", className)}
      {...props}
    >
      {decoration === "none" ? null : (
        <div
          data-slot="hero-decoration"
          aria-hidden="true"
          className={cn("pointer-events-none absolute inset-0", heroDecorations[decoration])}
        />
      )}
      <div
        className={cn(
          "relative mx-auto w-full max-w-(--container-content) px-(--gutter)",
          split && "grid items-center gap-12 lg:grid-cols-2 lg:gap-16",
        )}
      >
        <div
          data-slot="hero-content"
          className={cn(
            "flex flex-col gap-6",
            variant === "default" && "max-w-3xl",
            variant === "centered" && "mx-auto max-w-3xl items-center text-center",
            split && "max-w-xl",
          )}
        >
          {content}
        </div>
        {media.length === 0 ? null : split ? media : <div className="mt-12">{media}</div>}
      </div>
    </section>
  );
}

function HeroEyebrow({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="hero-eyebrow"
      className={cn(
        "inline-flex items-center gap-3 text-eyebrow font-semibold uppercase text-primary",
        "before:block before:h-px before:w-8 before:bg-primary before:content-['']",
        className,
      )}
      {...props}
    />
  );
}

function HeroTitle({ className, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1
      data-slot="hero-title"
      className={cn("font-display text-display uppercase text-balance", className)}
      {...props}
    />
  );
}

function HeroDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="hero-description"
      className={cn("max-w-prose text-body-lg text-pretty text-muted-foreground", className)}
      {...props}
    />
  );
}

function HeroActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="hero-actions"
      className={cn(
        "flex flex-wrap items-center gap-3",
        "group-data-[variant=centered]/hero:justify-center",
        className,
      )}
      {...props}
    />
  );
}

function HeroMedia({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="hero-media"
      className={cn(
        "relative overflow-hidden rounded-media border bg-surface-1 shadow-3",
        "[&_img]:size-full [&_img]:object-cover [&_video]:size-full [&_video]:object-cover",
        className,
      )}
      {...props}
    />
  );
}

export { Hero, HeroEyebrow, HeroTitle, HeroDescription, HeroActions, HeroMedia };
