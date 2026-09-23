/** Centred placeholder for a view with nothing in it yet: an icon, a title, a short explanation and an optional action. */
import * as React from "react";
import { cn } from "../lib/cn";

export interface EmptyStateProps extends Omit<React.ComponentProps<"div">, "title"> {
  /** Glyph shown above the title. Rendered inside a muted circle. */
  icon?: React.ReactNode;
  /** Short sentence naming what is missing. */
  title: React.ReactNode;
  /** One or two lines explaining how to fill the view. */
  description?: React.ReactNode;
  /** Buttons or links offered as the way out. */
  action?: React.ReactNode;
}

function EmptyState({
  className,
  icon,
  title,
  description,
  action,
  children,
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-card px-6 py-12 text-center",
        className,
      )}
      {...props}
    >
      {icon ? (
        <div
          data-slot="empty-state-icon"
          aria-hidden="true"
          className={cn(
            "mb-1 flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground",
            "[&_svg]:size-5 [&_svg]:shrink-0",
          )}
        >
          {icon}
        </div>
      ) : null}

      <p data-slot="empty-state-title" className="text-base font-semibold text-foreground">
        {title}
      </p>

      {description ? (
        <p
          data-slot="empty-state-description"
          className="max-w-prose text-balance text-sm text-muted-foreground"
        >
          {description}
        </p>
      ) : null}

      {action ? (
        <div
          data-slot="empty-state-action"
          className="mt-2 flex flex-wrap items-center justify-center gap-2"
        >
          {action}
        </div>
      ) : null}

      {children}
    </div>
  );
}

export { EmptyState };
