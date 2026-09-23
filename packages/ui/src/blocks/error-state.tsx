"use client";

/** Centred failure panel with a destructive-tinted icon, a title, the error message and a retry button. */
import * as React from "react";
import { RefreshCw, TriangleAlert } from "lucide-react";
import { Button } from "../components/button";
import { cn } from "../lib/cn";

export interface ErrorStateProps extends Omit<React.ComponentProps<"div">, "title"> {
  /** Glyph shown above the title. Defaults to a warning triangle. */
  icon?: React.ReactNode;
  /** Short sentence naming what failed. */
  title?: React.ReactNode;
  /** The error text itself, or a human rewrite of it. */
  message?: React.ReactNode;
  /** Called when the retry button is pressed. Omit it to hide the button. */
  onRetry?: () => void;
  /** Accessible label and text of the retry button. */
  retryLabel?: string;
  /** Extra controls rendered next to retry, such as a link to support. */
  action?: React.ReactNode;
}

function ErrorState({
  className,
  icon,
  title = "Something went wrong",
  message,
  onRetry,
  retryLabel = "Try again",
  action,
  children,
  ...props
}: ErrorStateProps) {
  return (
    <div
      data-slot="error-state"
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-card border border-destructive/30 bg-destructive/5 px-6 py-12 text-center",
        className,
      )}
      {...props}
    >
      <div
        data-slot="error-state-icon"
        aria-hidden="true"
        className={cn(
          "mb-1 flex size-11 items-center justify-center rounded-full bg-destructive/12 text-destructive",
          "[&_svg]:size-5 [&_svg]:shrink-0",
        )}
      >
        {icon ?? <TriangleAlert />}
      </div>

      <p data-slot="error-state-title" className="text-base font-semibold text-destructive">
        {title}
      </p>

      {message ? (
        <p
          data-slot="error-state-message"
          className="max-w-prose text-balance text-sm text-muted-foreground"
        >
          {message}
        </p>
      ) : null}

      {onRetry || action ? (
        <div
          data-slot="error-state-action"
          className="mt-2 flex flex-wrap items-center justify-center gap-2"
        >
          {onRetry ? (
            <Button variant="outline" size="sm" onClick={onRetry}>
              <RefreshCw aria-hidden="true" />
              {retryLabel}
            </Button>
          ) : null}
          {action}
        </div>
      ) : null}

      {children}
    </div>
  );
}

export { ErrorState };
