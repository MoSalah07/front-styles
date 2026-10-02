"use client";

/** Horizontal carousel on native CSS scroll snap, with previous and next controls, optional dots, arrow-key navigation and an imperative API, all mirrored correctly in right-to-left layouts. */
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../lib/cn";
import { useT } from "../lib/i18n";
import { Button } from "./button";

/** Position and controls, handed to `setApi` and returned by `useCarousel`. */
export interface CarouselApi {
  scrollPrev: () => void;
  scrollNext: () => void;
  /** Brings the slide at `index` to the inline-start edge of the track. */
  scrollTo: (index: number) => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  /** The slide nearest the inline-start edge of the track. */
  selectedIndex: number;
  /** Number of slides. */
  count: number;
}

interface CarouselPosition {
  canScrollPrev: boolean;
  canScrollNext: boolean;
  selectedIndex: number;
}

interface CarouselContextValue extends CarouselApi {
  setTrack: (node: HTMLDivElement | null) => void;
  setCount: (count: number) => void;
}

const CarouselContext = React.createContext<CarouselContextValue | null>(null);

/** Index of one slide and the total, given to each slide by `CarouselContent`. */
const CarouselSlideContext = React.createContext<{ index: number; count: number } | null>(null);

function useCarouselContext(part: string): CarouselContextValue {
  const context = React.useContext(CarouselContext);
  if (!context) throw new Error(`<${part}> must be rendered inside <Carousel>.`);
  return context;
}

/** The carousel's position and controls, for building a custom control inside `<Carousel>`. */
function useCarousel(): CarouselApi {
  const { scrollPrev, scrollNext, scrollTo, canScrollPrev, canScrollNext, selectedIndex, count } =
    useCarouselContext("useCarousel");
  return { scrollPrev, scrollNext, scrollTo, canScrollPrev, canScrollNext, selectedIndex, count };
}

/** `useLayoutEffect` warns during SSR, so fall back to the passive effect there. */
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

/**
 * The writing direction the track is actually laid out in. The computed style
 * is the truth in a browser; the `dir` attribute is the fallback for
 * environments with no style engine.
 */
function isRtl(element: Element): boolean {
  const computed = window.getComputedStyle(element).direction;
  if (computed === "rtl" || computed === "ltr") return computed === "rtl";
  return element.closest("[dir]")?.getAttribute("dir") === "rtl";
}

/**
 * The physical x of the edge slides snap to, and the length of the visible
 * snap area. Scroll padding moves the snap edge inwards, so a track with a
 * gutter still reports the first slide as aligned.
 */
function snapArea(track: HTMLElement, rtl: boolean) {
  const style = window.getComputedStyle(track);
  const start = parseFloat(style.getPropertyValue("scroll-padding-inline-start")) || 0;
  const end = parseFloat(style.getPropertyValue("scroll-padding-inline-end")) || 0;
  const box = track.getBoundingClientRect();
  return {
    edge: rtl ? box.right - start : box.left + start,
    span: Math.max(0, track.clientWidth - start - end),
  };
}

/**
 * How far a slide's inline start lies past the snap edge, measured along the
 * reading direction: positive means further on, in both LTR and RTL. Working
 * from rects rather than `scrollLeft` sidesteps the negative scroll offsets
 * browsers report in RTL.
 */
function inlineOffset(edge: number, rect: DOMRect, rtl: boolean): number {
  return rtl ? edge - rect.right : rect.left - edge;
}

function prefersReducedMotion(): boolean {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
}

function requestFrame(callback: () => void): number {
  return typeof window.requestAnimationFrame === "function"
    ? window.requestAnimationFrame(callback)
    : window.setTimeout(callback, 16);
}

function cancelFrame(id: number) {
  if (typeof window.cancelAnimationFrame === "function") window.cancelAnimationFrame(id);
  else window.clearTimeout(id);
}

export interface CarouselProps extends React.ComponentProps<"div"> {
  /**
   * Accessible name of the region. `aria-label` and `aria-labelledby` work as
   * well; with none of the three, the catalogue's generic name is used.
   */
  label?: string;
  /** Receives the API once mounted, and a fresh snapshot whenever the position changes. */
  setApi?: (api: CarouselApi) => void;
  /** Slides moved per previous or next step. `"auto"` pages by however many are fully visible. */
  slidesToScroll?: number | "auto";
}

function Carousel({
  className,
  label,
  setApi,
  slidesToScroll = 1,
  onKeyDown,
  children,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: CarouselProps) {
  const t = useT();
  const [track, setTrack] = React.useState<HTMLDivElement | null>(null);
  const [count, setCount] = React.useState(0);
  const [position, setPosition] = React.useState<CarouselPosition>({
    canScrollPrev: false,
    canScrollNext: false,
    selectedIndex: 0,
  });
  // Read by the step functions, which must see the latest measurement even
  // when they run before the re-render it triggers.
  const selectedRef = React.useRef(0);

  const measure = React.useCallback(() => {
    if (!track) return;
    const rtl = isRtl(track);
    const { edge } = snapArea(track, rtl);
    const max = Math.max(0, track.scrollWidth - track.clientWidth);
    // Negative in RTL in every current engine; its magnitude is what matters.
    const travelled = Math.abs(track.scrollLeft);

    let selectedIndex = 0;
    let nearest = Number.POSITIVE_INFINITY;
    Array.from(track.children).forEach((slide, index) => {
      const distance = Math.abs(inlineOffset(edge, slide.getBoundingClientRect(), rtl));
      if (distance < nearest - 0.5) {
        nearest = distance;
        selectedIndex = index;
      }
    });

    selectedRef.current = selectedIndex;
    const next: CarouselPosition = {
      canScrollPrev: travelled > 1,
      canScrollNext: travelled < max - 1,
      selectedIndex,
    };
    setPosition((current) =>
      current.canScrollPrev === next.canScrollPrev &&
      current.canScrollNext === next.canScrollNext &&
      current.selectedIndex === next.selectedIndex
        ? current
        : next,
    );
  }, [track]);

  // Scroll events arrive far faster than a frame, so they are coalesced into
  // one measurement per animation frame. Resizes re-measure too, since a new
  // breakpoint can change how many slides fit.
  React.useEffect(() => {
    if (!track) return;
    let frame: number | null = null;
    const schedule = () => {
      if (frame !== null) return;
      frame = requestFrame(() => {
        frame = null;
        measure();
      });
    };

    measure();
    track.addEventListener("scroll", schedule, { passive: true });
    track.addEventListener("scrollend", measure);
    const observer = typeof ResizeObserver === "function" ? new ResizeObserver(schedule) : null;
    observer?.observe(track);
    for (const slide of Array.from(track.children)) observer?.observe(slide);

    return () => {
      if (frame !== null) cancelFrame(frame);
      track.removeEventListener("scroll", schedule);
      track.removeEventListener("scrollend", measure);
      observer?.disconnect();
    };
  }, [track, measure, count]);

  const scrollTo = React.useCallback(
    (index: number) => {
      if (!track) return;
      const slides = track.children;
      const target = slides[Math.min(Math.max(index, 0), slides.length - 1)];
      if (!target) return;
      const rtl = isRtl(track);
      const offset = inlineOffset(snapArea(track, rtl).edge, target.getBoundingClientRect(), rtl);
      // Forward is towards negative x in RTL. `auto` defers to the track's CSS,
      // which only asks for smooth scrolling under motion-safe.
      const left = rtl ? -offset : offset;
      const behavior: ScrollBehavior = prefersReducedMotion() ? "auto" : "smooth";
      if (typeof track.scrollBy === "function") track.scrollBy({ left, behavior });
      else track.scrollLeft += left;
    },
    [track],
  );

  const step = React.useCallback(() => {
    if (slidesToScroll !== "auto") return Math.max(1, Math.floor(slidesToScroll));
    if (!track) return 1;
    const rtl = isRtl(track);
    const { edge, span } = snapArea(track, rtl);
    let visible = 0;
    for (const slide of Array.from(track.children)) {
      const rect = slide.getBoundingClientRect();
      const start = inlineOffset(edge, rect, rtl);
      if (start >= -1 && start + rect.width <= span + 1) visible += 1;
    }
    return Math.max(1, visible);
  }, [slidesToScroll, track]);

  const scrollPrev = React.useCallback(
    () => scrollTo(selectedRef.current - step()),
    [scrollTo, step],
  );
  const scrollNext = React.useCallback(
    () => scrollTo(selectedRef.current + step()),
    [scrollTo, step],
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    // A control inside a slide that owns the arrows (a slider, a text field)
    // either prevents the default or is editable; both keep their keys.
    if (event.defaultPrevented || isEditable(event.target)) return;
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    const rtl = isRtl(track ?? event.currentTarget);
    const forward = (event.key === "ArrowRight") !== rtl;
    event.preventDefault();
    if (forward) scrollNext();
    else scrollPrev();
  };

  const api = React.useMemo<CarouselApi>(
    () => ({ scrollPrev, scrollNext, scrollTo, count, ...position }),
    [scrollPrev, scrollNext, scrollTo, count, position],
  );

  React.useEffect(() => {
    setApi?.(api);
  }, [api, setApi]);

  const context = React.useMemo<CarouselContextValue>(
    () => ({ ...api, setTrack, setCount }),
    [api],
  );

  return (
    <CarouselContext.Provider value={context}>
      {/* The region never takes focus itself: the handler catches arrow keys
          bubbling up from the links and controls inside it, which is how the
          keys keep working wherever focus sits within the carousel. */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <div
        data-slot="carousel"
        role="region"
        aria-roledescription={t("carousel.roleDescription")}
        aria-label={label ?? ariaLabel ?? (ariaLabelledBy ? undefined : t("carousel.label"))}
        aria-labelledby={ariaLabelledBy}
        onKeyDown={handleKeyDown}
        className={cn("relative", className)}
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

/**
 * Children as a flat list of slides. Arrays flatten on their own; fragments
 * are opened too, so `<>{a}{b}</>` counts as two slides rather than one. Keys
 * are prefixed by the fragment they came from so two fragments never collide.
 */
function flattenSlides(
  children: React.ReactNode,
  prefix = "",
): { key: string; node: React.ReactNode }[] {
  return React.Children.toArray(children).flatMap((child, index) => {
    const key = `${prefix}${React.isValidElement(child) && child.key != null ? child.key : index}`;
    if (
      React.isValidElement<{ children?: React.ReactNode }>(child) &&
      child.type === React.Fragment
    ) {
      return flattenSlides(child.props.children, `${key}/`);
    }
    return [{ key, node: child }];
  });
}

export type CarouselContentProps = React.ComponentProps<"div">;

function CarouselContent({ className, children, ref, ...props }: CarouselContentProps) {
  const { setTrack, setCount } = useCarouselContext("CarouselContent");
  const slides = flattenSlides(children);
  const total = slides.length;

  useIsomorphicLayoutEffect(() => {
    setCount(total);
  }, [setCount, total]);

  const trackRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      setTrack(node);
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref, setTrack],
  );

  return (
    <div
      ref={trackRef}
      data-slot="carousel-content"
      className={cn(
        // The negative start margin pairs with each slide's start padding, so
        // a slide's basis is a clean fraction of the track with the gap inside.
        "-ms-4 flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain",
        "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        "motion-safe:scroll-smooth",
        className,
      )}
      {...props}
    >
      {slides.map(({ key, node }, index) => (
        <CarouselSlideContext.Provider key={key} value={{ index, count: total }}>
          {node}
        </CarouselSlideContext.Provider>
      ))}
    </div>
  );
}

export type CarouselItemProps = React.ComponentProps<"div">;

function CarouselItem({ className, "aria-label": ariaLabel, ...props }: CarouselItemProps) {
  const t = useT();
  const slide = React.useContext(CarouselSlideContext);

  return (
    <div
      data-slot="carousel-item"
      role="group"
      aria-roledescription={t("carousel.slideRoleDescription")}
      aria-label={
        ariaLabel ??
        (slide
          ? t("carousel.slideLabel", { index: slide.index + 1, count: slide.count })
          : undefined)
      }
      className={cn("min-w-0 shrink-0 grow-0 basis-full snap-start ps-4", className)}
      {...props}
    />
  );
}

export type CarouselButtonProps = React.ComponentProps<typeof Button>;

const controlClasses =
  "absolute top-1/2 -translate-y-1/2 bg-background/80 shadow-2 backdrop-blur-sm";

function CarouselPrevious({
  className,
  variant = "outline",
  size = "icon-sm",
  disabled,
  onClick,
  children,
  "aria-label": ariaLabel,
  ...props
}: CarouselButtonProps) {
  const t = useT();
  const { canScrollPrev, scrollPrev } = useCarouselContext("CarouselPrevious");

  return (
    <Button
      type="button"
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      aria-label={ariaLabel ?? t("carousel.previous")}
      disabled={disabled || !canScrollPrev}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) scrollPrev();
      }}
      className={cn(controlClasses, "start-2", className)}
      {...props}
    >
      {children ?? <ChevronLeft aria-hidden="true" className="rtl:-scale-x-100" />}
    </Button>
  );
}

function CarouselNext({
  className,
  variant = "outline",
  size = "icon-sm",
  disabled,
  onClick,
  children,
  "aria-label": ariaLabel,
  ...props
}: CarouselButtonProps) {
  const t = useT();
  const { canScrollNext, scrollNext } = useCarouselContext("CarouselNext");

  return (
    <Button
      type="button"
      data-slot="carousel-next"
      variant={variant}
      size={size}
      aria-label={ariaLabel ?? t("carousel.next")}
      disabled={disabled || !canScrollNext}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) scrollNext();
      }}
      className={cn(controlClasses, "end-2", className)}
      {...props}
    >
      {children ?? <ChevronRight aria-hidden="true" className="rtl:-scale-x-100" />}
    </Button>
  );
}

export interface CarouselDotsProps extends React.ComponentProps<"div"> {
  /** Names the group of dots. Defaults to the catalogue. */
  label?: string;
}

function CarouselDots({ className, label, ...props }: CarouselDotsProps) {
  const t = useT();
  const { count, selectedIndex, scrollTo } = useCarouselContext("CarouselDots");

  if (count < 2) return null;

  return (
    <div
      data-slot="carousel-dots"
      role="group"
      aria-label={label ?? t("carousel.dots")}
      className={cn("flex items-center justify-center gap-2 pt-4", className)}
      {...props}
    >
      {Array.from({ length: count }, (_, index) => {
        const active = index === selectedIndex;
        return (
          <button
            key={index}
            type="button"
            data-slot="carousel-dot"
            data-active={active || undefined}
            aria-label={t("carousel.goTo", { index: index + 1 })}
            aria-current={active ? "true" : undefined}
            onClick={() => scrollTo(index)}
            className={cn(
              // The dot is small; the pseudo-element gives it a usable hit area.
              "relative h-2 w-2 rounded-badge bg-muted-foreground/40",
              "after:absolute after:-inset-2 after:content-['']",
              "motion-safe:transition-[width,background-color] motion-safe:duration-(--duration-normal) motion-safe:ease-standard",
              "hover:bg-muted-foreground/70",
              "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "data-active:w-6 data-active:bg-primary",
            )}
          />
        );
      })}
    </div>
  );
}

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
  useCarousel,
};
