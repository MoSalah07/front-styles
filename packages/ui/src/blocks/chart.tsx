"use client";

/** Recharts wrappers that map series keys to labels and token colours, plus tooltip and legend content styled with the design system's surfaces. */
import * as React from "react";
import { Legend, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "../lib/cn";

/** Fallback ramp: series with no explicit colour cycle through the chart tokens. */
const CHART_PALETTE = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const;

export interface ChartSeriesConfig {
  /** Human name of the series, used in the tooltip and the legend. */
  label?: React.ReactNode;
  /** Glyph rendered before the label instead of the colour swatch. */
  icon?: React.ComponentType<{ className?: string }>;
  /**
   * Any CSS colour. Defaults to `var(--chart-1..5)` by position, so a chart is
   * on-palette without naming a single colour.
   */
  color?: string;
}

/** Maps every `dataKey` in a chart to its label and colour. */
export type ChartConfig = Record<string, ChartSeriesConfig>;

interface ChartContextValue {
  config: ChartConfig;
}

const ChartContext = React.createContext<ChartContextValue | null>(null);

/** Read the surrounding chart's config. Throws outside a `ChartContainer`. */
function useChart(): ChartContextValue {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used inside a <ChartContainer>.");
  }
  return context;
}

/** Resolves the colour a series should use, falling back to the token ramp. */
function seriesColor(config: ChartConfig, key: string): string {
  const index = Object.keys(config).indexOf(key);
  const fallback =
    CHART_PALETTE[(index < 0 ? 0 : index) % CHART_PALETTE.length] ?? CHART_PALETTE[0];
  return config[key]?.color ?? fallback;
}

export interface ChartContainerProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** Series keys mapped to their label and colour. */
  config: ChartConfig;
  /** The recharts chart element. */
  children: React.ComponentProps<typeof ResponsiveContainer>["children"];
  /** Accessible name for the figure. */
  label?: string;
}

function ChartContainer({
  className,
  config,
  children,
  label,
  style,
  ...props
}: ChartContainerProps) {
  // Every series key becomes a `--color-<key>` custom property on the wrapper,
  // so a chart child can write fill="var(--color-revenue)" and stay on palette
  // through brand and colour-mode switches.
  const variables = React.useMemo(() => {
    const entries: Record<string, string> = {};
    for (const key of Object.keys(config)) {
      entries[`--color-${key}`] = seriesColor(config, key);
    }
    return entries as React.CSSProperties;
  }, [config]);

  const value = React.useMemo(() => ({ config }), [config]);

  return (
    <ChartContext.Provider value={value}>
      <div
        data-slot="chart"
        // A figure role without a name says nothing useful, so it only appears
        // once the caller has supplied one.
        role={label ? "img" : undefined}
        aria-label={label}
        className={cn(
          "flex aspect-video w-full justify-center text-xs",
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground",
          "[&_.recharts-cartesian-grid_line]:stroke-border/60",
          "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border",
          "[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted/50",
          "[&_.recharts-reference-line_line]:stroke-border",
          /* design-eg-lint-disable-next-line raw-color */
          "[&_.recharts-sector[stroke='#fff']]:stroke-transparent", // matches recharts' own default stroke value
          "[&_.recharts-surface]:outline-none",
          className,
        )}
        style={{ ...variables, ...style }}
        {...props}
      >
        <ResponsiveContainer>{children}</ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

/** The recharts `Tooltip`, re-exported so charts import everything from one place. */
const ChartTooltip = Tooltip;

/** The recharts `Legend`, re-exported so charts import everything from one place. */
const ChartLegend = Legend;

/**
 * One entry of what recharts hands to a custom tooltip or legend. It is typed
 * structurally rather than with the library's generics, because the content
 * props are supplied by recharts at runtime through `cloneElement`.
 */
export interface ChartPayloadItem {
  value?: number | string;
  name?: number | string;
  dataKey?: string | number;
  color?: string;
  fill?: string;
  payload?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface ChartTooltipContentProps extends Omit<React.ComponentProps<"div">, "content"> {
  /** Set by recharts while the cursor is over the chart. */
  active?: boolean;
  /** Set by recharts: one entry per series at the hovered position. */
  payload?: ReadonlyArray<ChartPayloadItem>;
  /** Set by recharts: the category value under the cursor. */
  label?: React.ReactNode;
  /** Hide the heading row. */
  hideLabel?: boolean;
  /** Hide the colour swatches. */
  hideIndicator?: boolean;
  /** Shape of the swatch. */
  indicator?: "dot" | "line" | "dashed";
  /** Rewrite the heading, e.g. to format a date. */
  labelFormatter?: (
    label: React.ReactNode,
    payload: ReadonlyArray<ChartPayloadItem>,
  ) => React.ReactNode;
  /** Rewrite a single value, e.g. to add a currency symbol. */
  valueFormatter?: (value: number | string | undefined, item: ChartPayloadItem) => React.ReactNode;
}

function ChartTooltipContent({
  className,
  active,
  payload,
  label,
  hideLabel = false,
  hideIndicator = false,
  indicator = "dot",
  labelFormatter,
  valueFormatter,
  ...props
}: ChartTooltipContentProps) {
  const { config } = useChart();

  if (!active || !payload || payload.length === 0) return null;

  const heading = labelFormatter ? labelFormatter(label, payload) : label;

  return (
    <div
      data-slot="chart-tooltip"
      className={cn(
        "min-w-32 rounded-md border border-border bg-popover px-2.5 py-2 text-xs text-popover-foreground shadow-2",
        className,
      )}
      {...props}
    >
      {hideLabel || heading === undefined || heading === null || heading === "" ? null : (
        <p data-slot="chart-tooltip-label" className="mb-1.5 font-medium">
          {heading}
        </p>
      )}

      <ul className="flex flex-col gap-1">
        {payload.map((item, index) => {
          const key = String(item.dataKey ?? item.name ?? index);
          const series = config[key];
          const color = item.color ?? item.fill ?? seriesColor(config, key);
          const Icon = series?.icon;

          return (
            <li key={key} data-slot="chart-tooltip-item" className="flex items-center gap-2">
              {hideIndicator ? null : Icon ? (
                <Icon className="size-3 shrink-0 text-muted-foreground" />
              ) : (
                <span
                  aria-hidden="true"
                  className={cn(
                    "shrink-0",
                    indicator === "dot" && "size-2.5 rounded-full",
                    indicator === "line" && "h-0.5 w-3 rounded-full",
                    indicator === "dashed" && "h-0 w-3 border-t-2 border-dashed",
                  )}
                  style={
                    indicator === "dashed" ? { borderColor: color } : { backgroundColor: color }
                  }
                />
              )}
              <span className="text-muted-foreground">{series?.label ?? item.name ?? key}</span>
              <span className="ms-auto font-medium tabular-nums text-foreground">
                {valueFormatter ? valueFormatter(item.value, item) : item.value}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export interface ChartLegendContentProps extends Omit<React.ComponentProps<"div">, "content"> {
  /** Set by recharts: one entry per series. */
  payload?: ReadonlyArray<ChartPayloadItem>;
  /** Where recharts placed the legend, used to pick the right margin. */
  verticalAlign?: "top" | "middle" | "bottom";
  /** Hide the colour swatches. */
  hideIcon?: boolean;
}

function ChartLegendContent({
  className,
  payload,
  verticalAlign = "bottom",
  hideIcon = false,
  ...props
}: ChartLegendContentProps) {
  const { config } = useChart();

  if (!payload || payload.length === 0) return null;

  return (
    <div
      data-slot="chart-legend"
      className={cn(
        "flex flex-wrap items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className,
      )}
      {...props}
    >
      {payload.map((item, index) => {
        const key = String(item.dataKey ?? item.value ?? index);
        const series = config[key];
        const color = item.color ?? seriesColor(config, key);
        const Icon = series?.icon;

        return (
          <div
            key={key}
            data-slot="chart-legend-item"
            className="flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            {hideIcon ? null : Icon ? (
              <Icon className="size-3 shrink-0" />
            ) : (
              <span
                aria-hidden="true"
                className="size-2.5 shrink-0 rounded-xs"
                style={{ backgroundColor: color }}
              />
            )}
            {series?.label ?? item.value ?? key}
          </div>
        );
      })}
    </div>
  );
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  useChart,
};
