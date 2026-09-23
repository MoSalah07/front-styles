"use client";

/** Toast viewport for sonner, themed with design tokens and following the `dark` class the app puts on `<html>`. */
import * as React from "react";
import { Toaster as SonnerToaster, toast, type ToasterProps } from "sonner";
import { cn } from "../lib/cn";

type Theme = "light" | "dark";
type Direction = "ltr" | "rtl";

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

export { Toaster, toast, type ToasterProps };
