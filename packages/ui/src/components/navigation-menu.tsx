"use client";

/** Site navigation bar on Radix: triggers open rich panels in one shared viewport that slides between them, beside plain links, and it follows the page into right-to-left. */
import * as React from "react";
import { ChevronDown } from "lucide-react";
import { Direction, NavigationMenu as NavigationMenuPrimitive } from "radix-ui";
import { cva } from "class-variance-authority";
import { cn } from "../lib/cn";
import { useI18n } from "../lib/i18n";

type Dir = "ltr" | "rtl";

function readDirection(element: Element): Dir {
  const computed = window.getComputedStyle(element).direction;
  if (computed === "rtl" || computed === "ltr") return computed;
  return element.closest("[dir]")?.getAttribute("dir") === "rtl" ? "rtl" : "ltr";
}

/**
 * Radix writes `dir` onto the nav, the list and every panel, and with no `dir`
 * prop and no DirectionProvider it writes "ltr": an Arabic page would get its
 * menu forced back to left-to-right, with the arrow keys and the panel motion
 * reversed along with it. So the direction is resolved here and handed down —
 * an explicit prop first, then Radix's provider or the i18n locale for the
 * first render (which keeps server output right when either is set), then the
 * computed direction of the menu's container once it is in the document.
 */
function useResolvedDirection(host: React.RefObject<HTMLElement | null>, dirProp?: Dir): Dir {
  const providerDir = Direction.useDirection();
  const { dir: localeDir } = useI18n();
  const [detected, setDetected] = React.useState<Dir | null>(null);

  React.useLayoutEffect(() => {
    if (dirProp) return;
    const container = host.current?.parentElement;
    if (!container) return;
    const update = () => setDetected(readDirection(container));
    update();
    // useLocale switches language by rewriting <html dir>; follow it live.
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["dir"] });
    return () => observer.disconnect();
  }, [dirProp, host]);

  return dirProp ?? detected ?? (providerDir === "rtl" || localeDir === "rtl" ? "rtl" : "ltr");
}

/** Whether panels render into the shared viewport or float under their own trigger. */
const ViewportContext = React.createContext(true);

export interface NavigationMenuProps extends React.ComponentProps<
  typeof NavigationMenuPrimitive.Root
> {
  /**
   * Render every panel inside one shared viewport under the list, which
   * resizes and slides between them. Set false to let each panel float under
   * its own trigger instead.
   */
  viewport?: boolean;
}

function NavigationMenu({
  className,
  children,
  viewport = true,
  dir: dirProp,
  ref,
  "aria-label": ariaLabel,
  ...props
}: NavigationMenuProps) {
  const { t } = useI18n();
  const hostRef = React.useRef<HTMLElement | null>(null);
  const dir = useResolvedDirection(hostRef, dirProp);

  const setRef = React.useCallback(
    (node: HTMLElement | null) => {
      hostRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  return (
    <ViewportContext.Provider value={viewport}>
      <NavigationMenuPrimitive.Root
        ref={setRef}
        data-slot="navigation-menu"
        data-viewport={viewport}
        dir={dir}
        // Radix's own default name is the English "Main".
        aria-label={ariaLabel ?? (props["aria-labelledby"] ? undefined : t("navigationMenu.label"))}
        className={cn(
          "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
          className,
        )}
        {...props}
      >
        {children}
        {viewport ? <NavigationMenuViewport /> : null}
      </NavigationMenuPrimitive.Root>
    </ViewportContext.Provider>
  );
}

export type NavigationMenuListProps = React.ComponentProps<typeof NavigationMenuPrimitive.List>;

function NavigationMenuList({ className, ...props }: NavigationMenuListProps) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn("flex flex-1 list-none items-center justify-center gap-1", className)}
      {...props}
    />
  );
}

export type NavigationMenuItemProps = React.ComponentProps<typeof NavigationMenuPrimitive.Item>;

function NavigationMenuItem({ className, ...props }: NavigationMenuItemProps) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  );
}

/**
 * The look of a top-level trigger, exported so a plain top-level link can
 * match it: `<NavigationMenuLink className={navigationMenuTriggerStyle()}>`.
 */
const navigationMenuTriggerStyle = cva([
  "group inline-flex h-(--control-h-md) w-max items-center justify-center gap-1",
  "rounded-md bg-transparent px-4 py-2 text-sm font-medium text-foreground",
  "outline-none transition-[color,background-color,box-shadow] duration-(--duration-fast) ease-standard",
  "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
  "focus-visible:ring-2 focus-visible:ring-ring",
  "disabled:pointer-events-none disabled:opacity-50",
  "data-[state=open]:bg-accent/50 data-[state=open]:text-accent-foreground",
  "data-[active]:bg-accent/50 data-[active]:text-accent-foreground",
]);

export type NavigationMenuTriggerProps = React.ComponentProps<
  typeof NavigationMenuPrimitive.Trigger
>;

function NavigationMenuTrigger({ className, children, ...props }: NavigationMenuTriggerProps) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), className)}
      {...props}
    >
      {children}
      <ChevronDown
        aria-hidden="true"
        className={cn(
          "relative top-px size-3 shrink-0",
          "motion-safe:transition-transform motion-safe:duration-(--duration-normal) motion-safe:ease-standard",
          "group-data-[state=open]:rotate-180",
        )}
      />
    </NavigationMenuPrimitive.Trigger>
  );
}

/**
 * Panel motion inside the shared viewport.
 *
 * No rtl: flip here, on purpose. Radix reverses the item order under
 * dir="rtl" before it picks from-start / from-end, so the values it writes are
 * already physical — "end" is the right-hand side in both directions — and a
 * physical translate-x follows the pointer as it is. Mirroring again would
 * send an Arabic panel in from the wrong side. What makes RTL correct is
 * NavigationMenu telling Radix the real direction; see useResolvedDirection.
 *
 * The slide is a translate transition seeded by @starting-style, because the
 * token layer ships fades but no slide keyframes. The fade-out stays an
 * animation: Radix's Presence keeps the outgoing panel mounted only while an
 * animation runs.
 */
const viewportContentMotion = [
  "motion-safe:transition-[translate] motion-safe:duration-(--duration-normal) motion-safe:ease-entrance",
  "motion-safe:data-[motion^=from-]:animate-fade-in motion-safe:data-[motion^=to-]:animate-fade-out",
  "motion-safe:data-[motion=from-end]:starting:translate-x-52",
  "motion-safe:data-[motion=from-start]:starting:-translate-x-52",
  "motion-safe:data-[motion=to-end]:translate-x-52",
  "motion-safe:data-[motion=to-start]:-translate-x-52",
];

export type NavigationMenuContentProps = React.ComponentProps<
  typeof NavigationMenuPrimitive.Content
>;

function NavigationMenuContent({ className, ...props }: NavigationMenuContentProps) {
  const inViewport = React.useContext(ViewportContext);

  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        inViewport
          ? ["start-0 top-0 w-full p-2 md:absolute md:w-auto", viewportContentMotion]
          : [
              "absolute start-0 top-full z-(--z-dropdown) mt-1.5 w-max origin-top overflow-hidden p-2",
              "rounded-md border bg-popover text-popover-foreground shadow-2",
              "motion-safe:data-[state=open]:animate-scale-in motion-safe:data-[state=closed]:animate-scale-out",
            ],
        className,
      )}
      {...props}
    />
  );
}

export type NavigationMenuViewportProps = React.ComponentProps<
  typeof NavigationMenuPrimitive.Viewport
>;

function NavigationMenuViewport({ className, ...props }: NavigationMenuViewportProps) {
  return (
    <div
      data-slot="navigation-menu-viewport-wrapper"
      className="absolute start-0 top-full isolate z-(--z-dropdown) flex justify-center"
    >
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          "relative mt-1.5 h-(--radix-navigation-menu-viewport-height) w-full origin-top overflow-hidden",
          "rounded-md border bg-popover text-popover-foreground shadow-3",
          "md:w-(--radix-navigation-menu-viewport-width)",
          "motion-safe:transition-[width,height] motion-safe:duration-(--duration-normal) motion-safe:ease-standard",
          "motion-safe:data-[state=open]:animate-scale-in motion-safe:data-[state=closed]:animate-scale-out",
          className,
        )}
        {...props}
      />
    </div>
  );
}

export type NavigationMenuLinkProps = React.ComponentProps<typeof NavigationMenuPrimitive.Link>;

function NavigationMenuLink({ className, ...props }: NavigationMenuLinkProps) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "flex flex-col gap-1 rounded-sm p-2 text-sm outline-none",
        "transition-[color,background-color,box-shadow] duration-(--duration-fast) ease-standard",
        "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        "focus-visible:ring-2 focus-visible:ring-ring",
        "data-[active]:bg-accent/50 data-[active]:text-accent-foreground",
        "[&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export type NavigationMenuIndicatorProps = React.ComponentProps<
  typeof NavigationMenuPrimitive.Indicator
>;

function NavigationMenuIndicator({ className, ...props }: NavigationMenuIndicatorProps) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        "top-full z-(--z-raised) flex h-1.5 items-end justify-center overflow-hidden",
        "motion-safe:transition-[width,transform] motion-safe:duration-(--duration-normal) motion-safe:ease-standard",
        "motion-safe:data-[state=visible]:animate-fade-in motion-safe:data-[state=hidden]:animate-fade-out",
        className,
      )}
      {...props}
    >
      {/* A rotated square whose rounded corner is the tip. The rounding sits on
          the logical start corner, so under rtl: the square turns the other
          way to bring that corner back to the top. */}
      <div
        data-slot="navigation-menu-indicator-arrow"
        className="relative top-3/5 size-2 rotate-45 rounded-ss-sm bg-border shadow-2 rtl:-rotate-45"
      />
    </NavigationMenuPrimitive.Indicator>
  );
}

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
};
