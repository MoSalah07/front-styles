"use client";

/** Collapsible application sidebar: a provider, the shell with header, content and footer slots, grouped menus with icon-only collapsing, a trigger, and the inset that holds the page. */
import * as React from "react";
import { PanelLeft } from "lucide-react";
import { Slot } from "radix-ui";
import { Button } from "../components/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../components/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "../components/tooltip";
import { cn } from "../lib/cn";

/** Below this width the sidebar stops taking layout space and opens as a sheet. */
const MOBILE_BREAKPOINT = 768;
const SIDEBAR_SHORTCUT_KEY = "b";

export type SidebarState = "expanded" | "collapsed";

export interface SidebarContextValue {
  /** `collapsed` renders icons only; on mobile the sidebar is always expanded inside its sheet. */
  state: SidebarState;
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  /** Reading direction of the wrapper, so popovers can pick a physical side. */
  direction: "ltr" | "rtl";
  /** Opens or closes whichever of the two presentations is currently in use. */
  toggleSidebar: () => void;
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

/** Read the surrounding sidebar's state. Throws outside a `SidebarProvider`. */
function useSidebar(): SidebarContextValue {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used inside a <SidebarProvider>.");
  }
  return context;
}

/** Tracks the viewport against the mobile breakpoint without pulling in a dependency. */
function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const query = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return isMobile;
}

export interface SidebarProviderProps extends React.ComponentProps<"div"> {
  /** Initial expanded state when the component owns it. */
  defaultOpen?: boolean;
  /** Controlled expanded state. */
  open?: boolean;
  /** Notified whenever the expanded state changes, controlled or not. */
  onOpenChange?: (open: boolean) => void;
  /** Bind Ctrl/Cmd + B to the toggle. */
  keyboardShortcut?: boolean;
}

function SidebarProvider({
  className,
  style,
  children,
  defaultOpen = true,
  open: openProp,
  onOpenChange,
  keyboardShortcut = true,
  ...props
}: SidebarProviderProps) {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const [direction, setDirection] = React.useState<"ltr" | "rtl">("ltr");

  const open = openProp ?? uncontrolledOpen;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange, openProp],
  );

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile((current) => !current);
      return;
    }
    setOpen(!open);
  }, [isMobile, open, setOpen]);

  // Tooltips and sheets need a physical side; the wrapper's computed direction
  // is the only reliable source once `dir` can come from any ancestor.
  React.useEffect(() => {
    const element = wrapperRef.current;
    const resolved = element
      ? window.getComputedStyle(element).direction
      : document.documentElement.dir;
    setDirection(resolved === "rtl" ? "rtl" : "ltr");
  }, [isMobile]);

  React.useEffect(() => {
    if (!keyboardShortcut) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === SIDEBAR_SHORTCUT_KEY && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [keyboardShortcut, toggleSidebar]);

  const value = React.useMemo<SidebarContextValue>(
    () => ({
      state: open ? "expanded" : "collapsed",
      open,
      setOpen,
      openMobile,
      setOpenMobile,
      isMobile,
      direction,
      toggleSidebar,
    }),
    [direction, isMobile, open, openMobile, setOpen, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={value}>
      <div
        ref={wrapperRef}
        data-slot="sidebar-provider"
        data-state={value.state}
        className={cn("group/sidebar-wrapper flex min-h-svh w-full bg-background", className)}
        style={style}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export interface SidebarProps extends React.ComponentProps<"aside"> {
  /** Accessible name of the navigation landmark and of the mobile sheet. */
  label?: string;
  /** Description read out when the sidebar opens as a sheet on mobile. */
  mobileDescription?: string;
}

function Sidebar({
  className,
  children,
  label = "Main navigation",
  mobileDescription = "Navigate between the sections of the application.",
  ...props
}: SidebarProps) {
  const { state, isMobile, openMobile, setOpenMobile, direction } = useSidebar();

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent
          side="start"
          data-slot="sidebar"
          data-mobile="true"
          className={cn(
            "group/sidebar w-(--sidebar-w) max-w-[85vw] gap-0 border-sidebar-border bg-sidebar p-0 text-sidebar-foreground",
            className,
          )}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>{label}</SheetTitle>
            <SheetDescription>{mobileDescription}</SheetDescription>
          </SheetHeader>
          <nav aria-label={label} className="flex h-full min-h-0 w-full flex-col">
            {children}
          </nav>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside
      data-slot="sidebar"
      data-state={state}
      data-direction={direction}
      aria-label={label}
      className={cn(
        // The sidebar is the first flex child of the provider, so it lands on
        // the inline start and swaps sides in RTL without any positioning.
        "group/sidebar sticky top-0 z-(--z-sticky) hidden h-svh shrink-0 md:flex",
        "flex-col overflow-hidden border-e border-sidebar-border bg-sidebar text-sidebar-foreground",
        "w-(--sidebar-w) data-[state=collapsed]:w-(--sidebar-w-collapsed)",
        "motion-safe:transition-[width] motion-safe:duration-(--duration-normal) motion-safe:ease-standard",
        className,
      )}
      {...props}
    >
      {children}
    </aside>
  );
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn(
        "flex min-h-(--header-h) shrink-0 items-center gap-2 border-b border-sidebar-border p-2",
        "group-data-[state=collapsed]/sidebar:justify-center",
        className,
      )}
      {...props}
    />
  );
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-x-hidden overflow-y-auto p-2",
        className,
      )}
      {...props}
    />
  );
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn("flex shrink-0 flex-col gap-2 border-t border-sidebar-border p-2", className)}
      {...props}
    />
  );
}

function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group"
      className={cn("flex w-full min-w-0 flex-col gap-1 py-1", className)}
      {...props}
    />
  );
}

function SidebarGroupLabel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group-label"
      className={cn(
        "flex h-8 shrink-0 items-center px-2 text-xs font-semibold text-sidebar-foreground/60",
        "truncate transition-opacity duration-(--duration-fast) ease-standard",
        // Collapsed there is no room for a heading, so it folds away entirely.
        "group-data-[state=collapsed]/sidebar:h-0 group-data-[state=collapsed]/sidebar:overflow-hidden",
        "group-data-[state=collapsed]/sidebar:opacity-0",
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu"
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props}
    />
  );
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-item"
      className={cn("group/menu-item relative w-full min-w-0", className)}
      {...props}
    />
  );
}

export interface SidebarMenuButtonProps extends React.ComponentProps<"button"> {
  /** Marks the row for the section currently on screen. */
  isActive?: boolean;
  /** Glyph pinned at the inline start; it is all that survives in collapsed mode. */
  icon?: React.ReactNode;
  /**
   * Text shown in the collapsed-mode tooltip. Defaults to `children` when that
   * is a plain string.
   */
  tooltip?: React.ReactNode;
  /**
   * Render the child element instead of a `<button>`, for router links. Slot
   * takes exactly one child, so with `asChild` the caller supplies the icon and
   * the label itself and the `icon` prop is ignored.
   */
  asChild?: boolean;
}

function SidebarMenuButton({
  className,
  isActive = false,
  icon,
  tooltip,
  asChild = false,
  children,
  ...props
}: SidebarMenuButtonProps) {
  const { state, isMobile, direction } = useSidebar();

  const classes = cn(
    "flex h-(--control-h-md) w-full items-center gap-2 overflow-hidden rounded-control px-2 text-start text-sm",
    "text-sidebar-foreground outline-none select-none",
    "transition-[background-color,color,box-shadow] duration-(--duration-fast) ease-standard",
    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
    "focus-visible:ring-2 focus-visible:ring-sidebar-ring",
    "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
    "data-[active=true]:bg-sidebar-primary data-[active=true]:font-medium data-[active=true]:text-sidebar-primary-foreground",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    "group-data-[state=collapsed]/sidebar:justify-center group-data-[state=collapsed]/sidebar:px-0",
    className,
  );

  const shared = {
    "data-slot": "sidebar-menu-button",
    "data-active": isActive || undefined,
    "aria-current": isActive ? ("page" as const) : undefined,
    className: classes,
    ...props,
  };

  // Slot must receive exactly one child, so the icon and the label wrapper can
  // never be injected alongside a caller-supplied element.
  const button = asChild ? (
    <Slot.Root {...shared}>{children}</Slot.Root>
  ) : (
    <button type="button" {...shared}>
      {icon ? (
        <span data-slot="sidebar-menu-button-icon" aria-hidden="true" className="flex shrink-0">
          {icon}
        </span>
      ) : null}
      <span
        data-slot="sidebar-menu-button-label"
        className="min-w-0 flex-1 truncate group-data-[state=collapsed]/sidebar:hidden"
      >
        {children}
      </span>
    </button>
  );

  const hint = tooltip ?? (typeof children === "string" ? children : undefined);
  if (!hint || isMobile || state === "expanded") {
    return button;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side={direction === "rtl" ? "left" : "right"} sideOffset={8}>
        {hint}
      </TooltipContent>
    </Tooltip>
  );
}

export interface SidebarTriggerProps extends React.ComponentProps<typeof Button> {
  /** Accessible name of the icon-only button. */
  label?: string;
}

function SidebarTrigger({
  className,
  label = "Toggle sidebar",
  onClick,
  ...props
}: SidebarTriggerProps) {
  const { toggleSidebar, state, openMobile, isMobile } = useSidebar();

  return (
    <Button
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      aria-expanded={isMobile ? openMobile : state === "expanded"}
      className={cn("shrink-0", className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) toggleSidebar();
      }}
      {...props}
    >
      {/* The panel glyph points at the start edge, which flips in RTL. */}
      <PanelLeft aria-hidden="true" className="rtl:-scale-x-100" />
    </Button>
  );
}

function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn("flex min-h-svh min-w-0 flex-1 flex-col bg-background", className)}
      {...props}
    />
  );
}

export {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
};
