"use client";

/** KPI tile showing a label, a headline value, an optional icon and a trend delta, with a skeleton stand-in while the figure loads. */
import * as React from "react";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "../components/card";
import { Skeleton } from "../components/skeleton";
import { cn } from "../lib/cn";

/** Direction of the change against the comparison period. */
export type StatCardTrend = "up" | "down" | "flat";

const trendStyles: Record<StatCardTrend, string> = {
  up: "text-success",
  down: "text-destructive",
  flat: "text-muted-foreground",
};

const trendIcons: Record<StatCardTrend, React.ComponentType<{ className?: string }>> = {
  up: TrendingUp,
  down: TrendingDown,
  flat: Minus,
};

export interface StatCardProps extends React.ComponentProps<"div"> {
  /** What the figure measures, e.g. "Monthly revenue". */
  label: React.ReactNode;
  /** The figure itself, already formatted. */
  value: React.ReactNode;
  /** Glyph shown at the inline end of the label row. */
  icon?: React.ReactNode;
  /** Change against the comparison period, e.g. "+12.5%". */
  delta?: React.ReactNode;
  /** Colours the delta: `up` is success, `down` is destructive, `flat` is muted. */
  trend?: StatCardTrend;
  /** What the delta is measured against, e.g. "vs last month". */
  comparison?: React.ReactNode;
  /** Swap the value and delta for skeletons while the figure is being fetched. */
  loading?: boolean;
}

function StatCard({
  className,
  label,
  value,
  icon,
  delta,
  trend = "flat",
  comparison,
  loading = false,
  children,
  ...props
}: StatCardProps) {
  const TrendIcon = trendIcons[trend];

  return (
    <Card
      data-slot="stat-card"
      data-trend={trend}
      className={cn("gap-3 py-5", className)}
      {...props}
    >
      <div data-slot="stat-card-header" className="flex items-center justify-between gap-2 px-5">
        <span data-slot="stat-card-label" className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
        {icon ? (
          <span
            data-slot="stat-card-icon"
            aria-hidden="true"
            className="text-muted-foreground [&_svg]:size-4 [&_svg]:shrink-0"
          >
            {icon}
          </span>
        ) : null}
      </div>

      <div data-slot="stat-card-body" className="flex flex-col gap-1.5 px-5">
        {loading ? (
          <Skeleton data-slot="stat-card-value-skeleton" className="h-8 w-28" />
        ) : (
          <p
            data-slot="stat-card-value"
            className="text-h3 font-semibold leading-none tracking-tight tabular-nums text-foreground"
          >
            {value}
          </p>
        )}

        {loading ? (
          <Skeleton data-slot="stat-card-delta-skeleton" className="h-4 w-36" />
        ) : delta || comparison ? (
          <p className="flex flex-wrap items-center gap-1.5 text-xs">
            {delta ? (
              <span
                data-slot="stat-card-delta"
                data-trend={trend}
                className={cn(
                  "inline-flex items-center gap-1 font-medium tabular-nums",
                  trendStyles[trend],
                )}
              >
                <TrendIcon className="size-3.5 shrink-0" aria-hidden="true" />
                {delta}
              </span>
            ) : null}
            {comparison ? (
              <span data-slot="stat-card-comparison" className="text-muted-foreground">
                {comparison}
              </span>
            ) : null}
          </p>
        ) : null}

        {children}
      </div>
    </Card>
  );
}

export type StatCardGridProps = React.ComponentProps<"div">;

function StatCardGrid({ className, ...props }: StatCardGridProps) {
  return (
    <div
      data-slot="stat-card-grid"
      className={cn("grid gap-4 sm:grid-cols-2 xl:grid-cols-4", className)}
      {...props}
    />
  );
}

export { StatCard, StatCardGrid };
