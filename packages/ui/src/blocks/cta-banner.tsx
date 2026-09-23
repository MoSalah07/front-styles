/** Closing call to action on the brand surface, with an eyebrow, a display title, a line of copy, actions and a soft decorative glow. */
import * as React from "react";
import { cn } from "../lib/cn";

export type CtaBannerAlign = "start" | "center";

export interface CtaBannerProps extends Omit<React.ComponentProps<"section">, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  /** Usually one or two `<Button>`s. */
  actions?: React.ReactNode;
  /** Text and action alignment. */
  align?: CtaBannerAlign;
  /** Turn off the decorative glow on busy pages. */
  glow?: boolean;
}

function CtaBanner({
  className,
  title,
  description,
  eyebrow,
  actions,
  align = "center",
  glow = true,
  children,
  ...props
}: CtaBannerProps) {
  const centered = align === "center";

  return (
    <section
      data-slot="cta-banner"
      data-align={align}
      aria-label={typeof title === "string" ? title : undefined}
      className={cn(
        "brand-surface relative isolate overflow-hidden rounded-card px-(--gutter) py-(--section-y) shadow-3",
        className,
      )}
      {...props}
    >
      {glow ? (
        <div
          data-slot="cta-banner-glow"
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0",
            "[background-image:radial-gradient(55%_65%_at_50%_0%,color-mix(in_oklab,var(--brand-foreground)_24%,transparent),transparent_70%)]",
          )}
        />
      ) : null}
      <div
        className={cn(
          "relative mx-auto flex w-full max-w-(--container-narrow) flex-col gap-6",
          centered && "items-center text-center",
        )}
      >
        {eyebrow ? (
          <p
            data-slot="cta-banner-eyebrow"
            className="text-eyebrow font-semibold uppercase opacity-80"
          >
            {eyebrow}
          </p>
        ) : null}
        <h2 data-slot="cta-banner-title" className="font-display text-h1 uppercase text-balance">
          {title}
        </h2>
        {description ? (
          <p
            data-slot="cta-banner-description"
            className="max-w-prose text-body-lg text-pretty opacity-85"
          >
            {description}
          </p>
        ) : null}
        {children}
        {actions ? (
          <div
            data-slot="cta-banner-actions"
            className={cn("flex flex-wrap items-center gap-3", centered && "justify-center")}
          >
            {actions}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export { CtaBanner };
