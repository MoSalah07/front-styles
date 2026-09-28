"use client";

/** Toast system on sonner: a themed viewport that follows the app's theme and direction, plus `notify` for glass toasts with a tone chip, an action and a draining progress bar. */
import * as React from "react";
import { Check, CircleAlert, Info, LoaderCircle, TriangleAlert, X } from "lucide-react";
import { Toaster as SonnerToaster, toast, type ToasterProps } from "sonner";
import { cn } from "../lib/cn";
import { translateStandalone, useT } from "../lib/i18n";

type Theme = "light" | "dark";
type Direction = "ltr" | "rtl";

/** Which colour ramp and icon a toast wears. */
export type ToastTone = "default" | "success" | "error" | "warning" | "info" | "loading";

function readDocumentState(): { theme: Theme; dir: Direction } {
  if (typeof document === "undefined") return { theme: "light", dir: "ltr" };
  const root = document.documentElement;
  const dark = root.classList.contains("dark") || root.getAttribute("data-theme") === "dark";
  return { theme: dark ? "dark" : "light", dir: root.dir === "rtl" ? "rtl" : "ltr" };
}

/**
 * Reads the theme straight off `<html>` and re-reads it whenever the class or
 * `data-theme` changes. Deliberately not tied to next-themes: the library has to
 * work in any React app, and every one of them can set a class.
 */
function useDocumentState() {
  const [state, setState] = React.useState<{ theme: Theme; dir: Direction }>({
    theme: "light",
    dir: "ltr",
  });

  React.useEffect(() => {
    const sync = () => setState(readDocumentState());
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "dir"],
    });
    return () => observer.disconnect();
  }, []);

  return state;
}

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

function Toaster({ className, toastOptions, ...props }: ToasterProps) {
  const { theme, dir } = useDocumentState();

  return (
    <SonnerToaster
      data-slot="toaster"
      theme={theme}
      dir={dir}
      className={cn("toaster group", className)}
      style={{ zIndex: "var(--z-toast)" } as React.CSSProperties}
      {...props}
      toastOptions={{
        ...toastOptions,
        classNames: {
          toast: cn(
            "group toast w-full items-center gap-3 rounded-card border border-border",
            "bg-popover p-4 text-sm text-popover-foreground shadow-3",
            toastOptions?.classNames?.toast,
          ),
          title: cn("text-sm font-medium", toastOptions?.classNames?.title),
          description: cn("text-sm text-muted-foreground", toastOptions?.classNames?.description),
          actionButton: cn(
            "inline-flex h-(--control-h-sm) shrink-0 items-center justify-center rounded-control",
            "bg-primary px-3 text-xs font-semibold text-primary-foreground hover:bg-primary-hover",
            toastOptions?.classNames?.actionButton,
          ),
          cancelButton: cn(
            "inline-flex h-(--control-h-sm) shrink-0 items-center justify-center rounded-control",
            "bg-secondary px-3 text-xs font-semibold text-secondary-foreground hover:bg-secondary/80",
            toastOptions?.classNames?.cancelButton,
          ),
          closeButton: cn(
            "border-border bg-popover text-muted-foreground hover:text-foreground",
            toastOptions?.classNames?.closeButton,
          ),
          icon: cn("shrink-0", toastOptions?.classNames?.icon),
          success: cn("text-success", toastOptions?.classNames?.success),
          error: cn("text-destructive", toastOptions?.classNames?.error),
          warning: cn("text-warning", toastOptions?.classNames?.warning),
          info: cn("text-info", toastOptions?.classNames?.info),
          loading: cn("text-muted-foreground", toastOptions?.classNames?.loading),
        },
      }}
    />
  );
}

/* ------------------------------------------------------------------ notify */

const TONE_CHIP: Record<ToastTone, string> = {
  default: "bg-muted text-muted-foreground",
  success: "bg-success/15 text-success",
  error: "bg-destructive/15 text-destructive",
  warning: "bg-warning/15 text-warning",
  info: "bg-info/15 text-info",
  loading: "bg-muted text-muted-foreground",
};

const TONE_BAR: Record<ToastTone, string> = {
  default: "bg-primary",
  success: "bg-success",
  error: "bg-destructive",
  warning: "bg-warning",
  info: "bg-info",
  loading: "bg-muted-foreground",
};

const TONE_ICON: Record<ToastTone, React.ReactNode> = {
  default: <Info className="size-4" />,
  success: <Check className="size-4" />,
  error: <CircleAlert className="size-4" />,
  warning: <TriangleAlert className="size-4" />,
  info: <Info className="size-4" />,
  loading: <LoaderCircle className="size-4 motion-safe:animate-spin" />,
};

/** Errors and warnings linger; a loading toast waits for its own resolution. */
const TONE_DURATION: Record<ToastTone, number> = {
  default: 4000,
  success: 3500,
  error: 6000,
  warning: 5000,
  info: 4000,
  loading: Number.POSITIVE_INFINITY,
};

export interface NotifyOptions {
  /** Second line, for the detail that explains the title. */
  description?: React.ReactNode;
  /** One optional button, e.g. Undo or View. */
  action?: { label: React.ReactNode; onClick: () => void };
  /** Milliseconds on screen. `Infinity` keeps it until dismissed. */
  duration?: number;
  /** Render the dismiss button. */
  closeButton?: boolean;
  /** Replace the tone's icon. */
  icon?: React.ReactNode;
  /** Colour ramp, when calling `notify()` directly. */
  tone?: ToastTone;
  /** Reuse an id to replace a toast in place, e.g. loading -> success. */
  id?: string | number;
  /** Accessible name for the dismiss button. */
  closeLabel?: string;
}

/**
 * Drains from full to empty over the toast's lifetime, so the reader can see
 * how long is left. A plain width transition rather than a keyframe, so the
 * component carries no CSS of its own; it is dropped under reduced motion.
 */
function ToastProgress({ tone, duration }: { tone: ToastTone; duration: number }) {
  const reduced = usePrefersReducedMotion();
  const [started, setStarted] = React.useState(false);

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setStarted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (reduced || !Number.isFinite(duration) || duration <= 0) return null;

  return (
    <span
      aria-hidden="true"
      data-slot="toast-progress"
      className="absolute inset-x-0 bottom-0 h-0.5 overflow-hidden bg-border"
    >
      <span
        className={cn("block h-full transition-[width] ease-linear", TONE_BAR[tone])}
        style={{ width: started ? "0%" : "100%", transitionDuration: `${duration}ms` }}
      />
    </span>
  );
}

interface ToastCardProps extends NotifyOptions {
  tone: ToastTone;
  title: React.ReactNode;
  duration: number;
  onDismiss: () => void;
}

/** The card `notify` renders: tone rail, icon chip, copy, action, progress. */
function ToastCard({
  tone,
  title,
  description,
  action,
  duration,
  closeButton = true,
  closeLabel: closeLabelProp,
  icon,
  onDismiss,
}: ToastCardProps) {
  const t = useT();
  const closeLabel = closeLabelProp ?? t("toast.dismiss");

  return (
    <div
      data-slot="toast"
      data-tone={tone}
      className={cn(
        "relative flex w-full items-start gap-3 overflow-hidden rounded-card ps-4 pe-3 py-3.5",
        "glass text-foreground shadow-3",
      )}
    >
      <span aria-hidden="true" className={cn("absolute inset-y-0 start-0 w-0.5", TONE_BAR[tone])} />
      <span
        aria-hidden="true"
        data-slot="toast-icon"
        className={cn("grid size-8 shrink-0 place-items-center rounded-full", TONE_CHIP[tone])}
      >
        {icon ?? TONE_ICON[tone]}
      </span>

      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-sm leading-tight font-semibold">{title}</p>
        {description ? (
          <p className="mt-1 text-sm leading-snug text-muted-foreground">{description}</p>
        ) : null}
        {action ? (
          <button
            type="button"
            data-slot="toast-action"
            onClick={() => {
              action.onClick();
              onDismiss();
            }}
            className={cn(
              "mt-2.5 inline-flex h-(--control-h-sm) items-center rounded-control px-3",
              "bg-primary text-xs font-semibold text-primary-foreground",
              "transition-colors duration-(--duration-fast) ease-standard hover:bg-primary-hover",
              "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            )}
          >
            {action.label}
          </button>
        ) : null}
      </div>

      {closeButton ? (
        <button
          type="button"
          data-slot="toast-close"
          aria-label={closeLabel}
          onClick={onDismiss}
          className={cn(
            "-me-1 grid size-6 shrink-0 place-items-center rounded-control text-muted-foreground",
            "transition-colors duration-(--duration-fast) ease-standard hover:bg-accent hover:text-foreground",
            "outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        >
          <X className="size-3.5" />
        </button>
      ) : null}

      <ToastProgress tone={tone} duration={duration} />
    </div>
  );
}

function show(tone: ToastTone, title: React.ReactNode, options: NotifyOptions = {}) {
  const { duration = TONE_DURATION[tone], id, ...rest } = options;
  return toast.custom(
    (toastId) => (
      <ToastCard
        {...rest}
        tone={tone}
        title={title}
        duration={duration}
        onDismiss={() => toast.dismiss(toastId)}
      />
    ),
    { duration, id, className: "w-full" },
  );
}

/**
 * The opinionated toast API: one card, six tones, a progress bar. `toast` stays
 * exported alongside it for sonner's own surface — `toast.promise`,
 * `toast.custom` and the rest — which this deliberately does not re-wrap, since
 * re-exporting it would drag sonner's internal types into our .d.ts.
 */
const notify = Object.assign(
  (title: React.ReactNode, options?: NotifyOptions) =>
    show(options?.tone ?? "default", title, options),
  {
    success: (title: React.ReactNode, options?: NotifyOptions) => show("success", title, options),
    error: (title: React.ReactNode, options?: NotifyOptions) => show("error", title, options),
    warning: (title: React.ReactNode, options?: NotifyOptions) => show("warning", title, options),
    info: (title: React.ReactNode, options?: NotifyOptions) => show("info", title, options),
    loading: (title: React.ReactNode, options?: NotifyOptions) => show("loading", title, options),
    /**
     * Feedback for a copy affordance: short, quiet, and always the same shape.
     *
     * Imperative, so there is no context to read: the default message is
     * resolved from the document's language at call time instead.
     */
    copied: (message?: React.ReactNode, options?: NotifyOptions) =>
      show("success", message ?? translateStandalone("toast.copied"), {
        duration: 2000,
        closeButton: false,
        ...options,
      }),
    dismiss: toast.dismiss,
  },
);

export { Toaster, toast, notify };
export type { ToasterProps };
