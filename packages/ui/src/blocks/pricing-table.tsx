"use client";

/** Pricing tiers side by side with a monthly/annual switch, where the featured tier sits on the brand surface and lifts above the row. */
import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "../lib/cn";
import { Badge } from "../components/badge";
import { Switch } from "../components/switch";

export type PricingPeriod = "monthly" | "annual";

export interface PricingTableProps extends Omit<React.ComponentProps<"div">, "onChange"> {
  /** Which price the tiers are showing. The parent owns this state. */
  period?: PricingPeriod;
  /** Called with the next period when the switch is toggled. */
  onPeriodChange?: (period: PricingPeriod) => void;
  /** Hide the switch when a table has a single billing period. */
  showToggle?: boolean;
  monthlyLabel?: string;
  annualLabel?: string;
  /** Accessible name for the switch, since its two labels sit outside it. */
  toggleLabel?: string;
  /** Optional badge beside the annual label, e.g. a discount. */
  annualNote?: React.ReactNode;
  /** Widest the row gets before it wraps. */
  columns?: 2 | 3 | 4;
}

const columnClasses: Record<2 | 3 | 4, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

function PricingTable({
  className,
  period = "monthly",
  onPeriodChange,
  showToggle = true,
  monthlyLabel = "Monthly",
  annualLabel = "Annual",
  toggleLabel = "Bill annually",
  annualNote,
  columns = 3,
  children,
  ...props
}: PricingTableProps) {
  return (
    <div
      data-slot="pricing-table"
      data-period={period}
      className={cn("flex flex-col gap-10", className)}
      {...props}
    >
      {showToggle ? (
        <div
          data-slot="pricing-toggle"
          className="flex flex-wrap items-center justify-center gap-3 text-sm font-medium"
        >
          <span
            data-slot="pricing-toggle-monthly"
            data-active={period === "monthly" || undefined}
            className={cn(period === "monthly" ? "text-foreground" : "text-muted-foreground")}
          >
            {monthlyLabel}
          </span>
          <Switch
            data-slot="pricing-toggle-switch"
            aria-label={toggleLabel}
            checked={period === "annual"}
            onCheckedChange={(checked) => onPeriodChange?.(checked ? "annual" : "monthly")}
          />
          <span
            data-slot="pricing-toggle-annual"
            data-active={period === "annual" || undefined}
            className={cn(period === "annual" ? "text-foreground" : "text-muted-foreground")}
          >
            {annualLabel}
          </span>
          {annualNote ? <Badge variant="soft">{annualNote}</Badge> : null}
        </div>
      ) : null}
      <div
        data-slot="pricing-tiers"
        className={cn("grid items-start gap-6", columnClasses[columns])}
      >
        {children}
      </div>
    </div>
  );
}

export interface PricingTierProps extends React.ComponentProps<"article"> {
  name: React.ReactNode;
  /** The headline figure, already formatted. */
  price: React.ReactNode;
  /** Suffix beside the price, e.g. "/month". */
  period?: React.ReactNode;
  description?: React.ReactNode;
  features?: React.ReactNode[];
  /** Usually a `<Button>`; it is stretched to the full tier width. */
  cta?: React.ReactNode;
  /** Paints the tier on the brand surface and lifts it out of the row. */
  featured?: boolean;
  /** Small label pinned to the top of the tier, e.g. "Most popular". */
  badge?: React.ReactNode;
}

function PricingTier({
  className,
  name,
  price,
  period,
  description,
  features = [],
  cta,
  featured = false,
  badge,
  children,
  ...props
}: PricingTierProps) {
  const nameId = React.useId();

  return (
    <article
      data-slot="pricing-tier"
      data-featured={featured || undefined}
      aria-labelledby={nameId}
      className={cn(
        "relative flex h-full flex-col gap-6 rounded-card border p-6",
        "transition-[transform,box-shadow] duration-(--duration-normal) ease-standard",
        featured
          ? "brand-surface z-(--z-raised) border-transparent shadow-3 lg:-translate-y-4"
          : "bg-card text-card-foreground shadow-1",
        className,
      )}
      {...props}
    >
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <h3
            id={nameId}
            data-slot="pricing-tier-name"
            className="text-eyebrow font-semibold uppercase"
          >
            {name}
          </h3>
          {badge ? (
            <Badge
              data-slot="pricing-tier-badge"
              variant={featured ? "outline" : "soft"}
              className={cn(featured && "border-current/40 bg-transparent text-current")}
            >
              {badge}
            </Badge>
          ) : null}
        </div>
        <p className="flex items-baseline gap-1.5">
          <span data-slot="pricing-tier-price" className="font-display text-h1">
            {price}
          </span>
          {period ? (
            <span
              data-slot="pricing-tier-period"
              className={cn("text-sm", featured ? "opacity-80" : "text-muted-foreground")}
            >
              {period}
            </span>
          ) : null}
        </p>
        {description ? (
          <p
            data-slot="pricing-tier-description"
            className={cn("text-sm text-pretty", featured ? "opacity-85" : "text-muted-foreground")}
          >
            {description}
          </p>
        ) : null}
      </header>

      {features.length > 0 ? (
        <ul data-slot="pricing-tier-features" className="flex flex-col gap-3 text-sm">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2.5">
              <Check
                aria-hidden="true"
                className={cn("mt-0.5 size-4 shrink-0", featured ? "text-current" : "text-primary")}
              />
              <span className={cn(featured ? "opacity-90" : "text-muted-foreground")}>
                {feature}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      {children}

      {cta ? (
        <div data-slot="pricing-tier-cta" className="mt-auto pt-2 [&>*]:w-full">
          {cta}
        </div>
      ) : null}
    </article>
  );
}

export { PricingTable, PricingTier };
