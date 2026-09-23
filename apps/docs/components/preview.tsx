import { cn } from "@design-eg/ui/cn";

export interface PreviewProps {
  children: React.ReactNode;
  /**
   * `stage` pads the demo on a card surface. `viewport` frames it like a browser
   * window instead, for blocks and templates that own a whole page.
   */
  variant?: "stage" | "viewport";
  className?: string;
}

/** The bordered area every live demo sits in. */
export function Preview({ children, variant = "stage", className }: PreviewProps) {
  if (variant === "viewport") {
    return (
      <div className={cn("overflow-hidden rounded-card border bg-background shadow-1", className)}>
        <div
          aria-hidden="true"
          className="flex h-8 items-center gap-1.5 border-b bg-surface-2 px-3"
        >
          <span className="size-2.5 rounded-full bg-destructive/60" />
          <span className="size-2.5 rounded-full bg-warning/60" />
          <span className="size-2.5 rounded-full bg-success/60" />
        </div>
        <div className="h-[36rem] overflow-auto">{children}</div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex min-h-40 items-center justify-center overflow-x-auto rounded-card border bg-card p-6 shadow-1 sm:p-10",
        className,
      )}
    >
      <div className="w-full max-w-full">{children}</div>
    </div>
  );
}
