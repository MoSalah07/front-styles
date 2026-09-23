/** Auto-fitting grid of feature cards, each with an icon, a title, a description and an optional link that makes the whole card clickable. */
import * as React from "react";
import { cn } from "../lib/cn";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/card";

export interface FeatureGridProps extends React.ComponentProps<"div"> {
  /** Narrowest a column may get before the grid drops one. */
  minColumnWidth?: string;
}

function FeatureGrid({ className, minColumnWidth = "17rem", style, ...props }: FeatureGridProps) {
  return (
    <div
      data-slot="feature-grid"
      style={{ ...style, "--feature-min": minColumnWidth } as React.CSSProperties}
      className={cn(
        "grid gap-4",
        "[grid-template-columns:repeat(auto-fit,minmax(min(100%,var(--feature-min)),1fr))]",
        className,
      )}
      {...props}
    />
  );
}

export interface FeatureCardLink {
  href: string;
  label: string;
  /** Opens in a new tab and adds `rel="noopener noreferrer"`. */
  external?: boolean;
}

export interface FeatureCardProps extends Omit<React.ComponentProps<typeof Card>, "title"> {
  /** Usually a lucide icon element; it is sized to 20px by the icon tile. */
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Renders a footer link that also stretches over the whole card. */
  link?: FeatureCardLink;
}

function FeatureCard({
  className,
  icon,
  title,
  description,
  link,
  children,
  ...props
}: FeatureCardProps) {
  return (
    <Card
      data-slot="feature-card"
      className={cn(
        "group/feature-card relative gap-4 bg-card/80",
        "transition-[transform,border-color,box-shadow] duration-(--duration-normal) ease-standard",
        "hover:border-primary/40 hover:shadow-2 motion-safe:hover:-translate-y-1",
        "focus-within:border-primary/40",
        className,
      )}
      {...props}
    >
      <CardHeader>
        {icon ? (
          <div
            data-slot="feature-card-icon"
            aria-hidden="true"
            className={cn(
              "mb-4 flex size-10 items-center justify-center rounded-md border bg-surface-2 text-primary",
              "transition-colors duration-(--duration-normal) ease-standard",
              "group-hover/feature-card:border-primary/40",
              "[&_svg]:size-5",
            )}
          >
            {icon}
          </div>
        ) : null}
        <CardTitle data-slot="feature-card-title">{title}</CardTitle>
      </CardHeader>
      {description || children ? (
        <CardContent className="text-sm text-pretty text-muted-foreground">
          {description}
          {children}
        </CardContent>
      ) : null}
      {link ? (
        <CardFooter>
          <a
            data-slot="feature-card-link"
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            className={cn(
              "inline-flex items-center gap-1.5 text-sm font-semibold text-primary",
              "rounded-control outline-none focus-visible:ring-2 focus-visible:ring-ring",
              // Stretch the hit area over the card so the card has exactly one
              // focus stop instead of a nested, invisible one.
              "after:absolute after:inset-0 after:content-['']",
            )}
          >
            {link.label}
            <ArrowRight
              aria-hidden="true"
              className={cn(
                "size-4",
                "motion-safe:transition-transform motion-safe:duration-(--duration-fast) motion-safe:ease-standard",
                "rtl:rotate-180 group-hover/feature-card:translate-x-0.5 rtl:group-hover/feature-card:-translate-x-0.5",
              )}
            />
          </a>
        </CardFooter>
      ) : null}
    </Card>
  );
}

export { FeatureGrid, FeatureCard };
