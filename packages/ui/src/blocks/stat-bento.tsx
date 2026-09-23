"use client";

/** Bento grid of headline numbers in mixed tile sizes, with counters that animate the first time their tile scrolls into view. */
import * as React from "react";
import { cn } from "../lib/cn";

/** `useLayoutEffect` warns during SSR, so fall back to the passive effect there. */
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

/**
 * Tracks `prefers-reduced-motion`. It starts as `false` so the server and the
 * first client render agree; the effect corrects it before anything moves.
 */
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, []);

  return reduced;
}

export interface AnimatedNumberProps extends Omit<
  React.ComponentProps<"span">,
  "children" | "ref"
> {
  /** The final figure. */
  value: number;
  /** Where the count starts. */
  from?: number;
  /** Length of the count-up in milliseconds. */
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Fixed by default so the server and the client format identically. */
  locale?: string;
  /** Takes over formatting entirely when given. */
  format?: (value: number) => string;
}

function AnimatedNumber({
  className,
  value,
  from = 0,
  duration = 1400,
  decimals = 0,
  prefix = "",
  suffix = "",
  locale = "en-US",
  format,
  ...props
}: AnimatedNumberProps) {
  const reduced = usePrefersReducedMotion();
  const ref = React.useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = React.useState(from);
  const [started, setStarted] = React.useState(false);

  useIsomorphicLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    // No motion, or no observer to lean on: show the real figure at once.
    if (reduced || typeof IntersectionObserver === "undefined") {
      setCurrent(value);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setStarted(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced, value]);

  React.useEffect(() => {
    if (!started || reduced) return;
    let frame = 0;
    const startedAt = performance.now();
    const tick = (now: number) => {
      const progress = duration <= 0 ? 1 : Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(from + (value - from) * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, reduced, value, from, duration]);

  const render = React.useCallback(
    (n: number) =>
      format
        ? format(n)
        : `${prefix}${n.toLocaleString(locale, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })}${suffix}`,
    [format, prefix, suffix, locale, decimals],
  );

  return (
    <span
      ref={ref}
      data-slot="animated-number"
      className={cn("tabular-nums", className)}
      {...props}
    >
      {/* The animated text churns, so assistive tech gets the settled figure. */}
      <span aria-hidden="true">{render(current)}</span>
      <span className="sr-only">{render(value)}</span>
    </span>
  );
}

export type StatBentoProps = React.ComponentProps<"div">;

function StatBento({ className, ...props }: StatBentoProps) {
  return (
    <div
      data-slot="stat-bento"
      className={cn(
        "grid auto-rows-[minmax(9rem,auto)] grid-cols-2 gap-3 md:grid-cols-4",
        className,
      )}
      {...props}
    />
  );
}

export type StatBentoTileSize = "sm" | "tall" | "wide" | "lg";

const tileSizes: Record<StatBentoTileSize, string> = {
  sm: "col-span-1 row-span-1",
  tall: "col-span-1 row-span-2",
  wide: "col-span-2 row-span-1",
  lg: "col-span-2 row-span-2",
};

export interface StatBentoTileProps extends React.ComponentProps<"div"> {
  /** The figure itself, usually an `<AnimatedNumber>`. */
  value: React.ReactNode;
  /** Short name for the figure. */
  label: React.ReactNode;
  /** A sentence of context under the label. */
  description?: React.ReactNode;
  icon?: React.ReactNode;
  size?: StatBentoTileSize;
  /** Paints the tile on the brand surface for the one number that matters most. */
  featured?: boolean;
}

function StatBentoTile({
  className,
  value,
  label,
  description,
  icon,
  size = "sm",
  featured = false,
  children,
  ...props
}: StatBentoTileProps) {
  return (
    <div
      data-slot="stat-bento-tile"
      data-size={size}
      data-featured={featured || undefined}
      className={cn(
        "relative flex flex-col justify-between gap-4 overflow-hidden rounded-card border p-5",
        "transition-[border-color,box-shadow] duration-(--duration-normal) ease-standard",
        featured
          ? "brand-surface border-transparent shadow-2"
          : "bg-card text-card-foreground shadow-1 hover:border-primary/40",
        tileSizes[size],
        className,
      )}
      {...props}
    >
      {icon ? (
        <div
          data-slot="stat-bento-tile-icon"
          aria-hidden="true"
          className={cn(
            "flex size-8 items-center justify-center rounded-sm",
            featured ? "bg-transparent text-current" : "text-primary",
            "[&_svg]:size-5",
          )}
        >
          {icon}
        </div>
      ) : null}
      <div className="mt-auto flex flex-col gap-1">
        <div
          data-slot="stat-bento-tile-value"
          className={cn(
            "font-display leading-none",
            size === "lg" ? "text-display" : size === "wide" ? "text-h1" : "text-h2",
          )}
        >
          {value}
        </div>
        <div
          data-slot="stat-bento-tile-label"
          className={cn("text-eyebrow font-semibold uppercase", !featured && "text-primary")}
        >
          {label}
        </div>
        {description ? (
          <p
            data-slot="stat-bento-tile-description"
            className={cn("text-sm text-pretty", featured ? "opacity-85" : "text-muted-foreground")}
          >
            {description}
          </p>
        ) : null}
        {children}
      </div>
    </div>
  );
}

export { StatBento, StatBentoTile, AnimatedNumber };
