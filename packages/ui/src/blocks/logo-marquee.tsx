"use client";

/** Endlessly scrolling strip of logos that pauses on hover, mirrors its direction in RTL, and falls back to a static wrapped row under reduced motion. */
import * as React from "react";
import { cn } from "../lib/cn";

/**
 * Tracks `prefers-reduced-motion`. It starts as `false` so the server and the
 * first client render agree; the effect corrects it before the user sees motion.
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

export interface LogoMarqueeProps extends React.ComponentProps<"div"> {
  /** Seconds for one full pass of the strip. Larger is slower. */
  speed?: number;
  /** Gap between logos, as a CSS length. */
  gap?: string;
  /** Pause the animation while hovered or focused within. */
  pauseOnHover?: boolean;
  /** Fade the leading and trailing edges into the background. */
  fade?: boolean;
  /** Accessible name for the strip, e.g. "Customers". */
  label?: string;
}

function LogoMarquee({
  className,
  speed = 40,
  gap = "3.5rem",
  pauseOnHover = true,
  fade = true,
  label = "Logos",
  style,
  children,
  ...props
}: LogoMarqueeProps) {
  const reduced = usePrefersReducedMotion();

  const shell = (
    <div
      data-slot="logo-marquee"
      data-reduced={reduced || undefined}
      role="group"
      aria-label={label}
      style={
        {
          ...style,
          "--marquee-gap": gap,
          "--marquee-duration": `${speed}s`,
        } as React.CSSProperties
      }
      className={cn(
        "group/marquee relative w-full overflow-hidden",
        // Symmetrical mask, so it reads the same in both directions.
        fade && "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className,
      )}
      {...props}
    >
      {reduced ? (
        <div
          data-slot="logo-marquee-track"
          className="flex flex-wrap items-center justify-center gap-(--marquee-gap) py-2"
        >
          {children}
        </div>
      ) : (
        <div
          data-slot="logo-marquee-track"
          className={cn(
            "flex w-max items-center gap-(--marquee-gap) py-2",
            // The strip is duplicated, so one pass is exactly half its width.
            // In RTL the row is laid out from the end edge, so it must travel
            // the other way to reveal the copy that sits off-screen.
            "[--marquee-to:-50%] rtl:[--marquee-to:50%]",
            "[animation:marquee_var(--marquee-duration)_linear_infinite]",
            pauseOnHover &&
              "group-hover/marquee:[animation-play-state:paused] group-focus-within/marquee:[animation-play-state:paused]",
          )}
        >
          <div className="flex shrink-0 items-center gap-(--marquee-gap)">{children}</div>
          <div className="flex shrink-0 items-center gap-(--marquee-gap)" aria-hidden="true">
            {children}
          </div>
        </div>
      )}
    </div>
  );

  return shell;
}

export type LogoMarqueeItemProps = React.ComponentProps<"div">;

function LogoMarqueeItem({ className, ...props }: LogoMarqueeItemProps) {
  return (
    <div
      data-slot="logo-marquee-item"
      className={cn(
        "flex h-8 shrink-0 items-center text-muted-foreground",
        "transition-[color,opacity] duration-(--duration-normal) ease-standard",
        "opacity-70 hover:text-foreground hover:opacity-100",
        "[&_img]:h-full [&_img]:w-auto [&_svg]:h-full [&_svg]:w-auto",
        className,
      )}
      {...props}
    />
  );
}

export { LogoMarquee, LogoMarqueeItem };
