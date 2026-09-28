"use client";

/** Modal dialog centred over a dimming overlay, with header, footer and a close affordance in the inline-end corner. */
import * as React from "react";
import { X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { cn } from "../lib/cn";
import { useT } from "../lib/i18n";

function Dialog(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root {...props} />;
}

function DialogTrigger({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return (
    <DialogPrimitive.Trigger data-slot="dialog-trigger" className={cn(className)} {...props} />
  );
}

function DialogPortal(props: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal {...props} />;
}

function DialogClose({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" className={cn(className)} {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-(--z-overlay) bg-overlay",
        "motion-safe:transition-opacity motion-safe:duration-(--duration-fast) motion-safe:ease-standard",
        "data-[state=open]:opacity-100 data-[state=closed]:opacity-0",
        "motion-safe:data-[state=open]:animate-fade-in",
        className,
      )}
      {...props}
    />
  );
}

export interface DialogContentProps extends React.ComponentProps<typeof DialogPrimitive.Content> {
  /** Hide the built-in close button when the content supplies its own. */
  showCloseButton?: boolean;
  /** Accessible name for the built-in close button. */
  closeLabel?: string;
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  closeLabel: closeLabelProp,
  ...props
}: DialogContentProps) {
  const t = useT();
  const closeLabel = closeLabelProp ?? t("dialog.close");

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 start-1/2 z-(--z-modal) w-full max-w-lg",
          // `start-1/2` resolves to the right edge in RTL, so the centring
          // transform has to mirror with it.
          "-translate-x-1/2 -translate-y-1/2 rtl:translate-x-1/2",
          "grid gap-4 rounded-card border bg-card p-6 text-card-foreground shadow-3",
          "outline-none",
          "motion-safe:transition-opacity motion-safe:duration-(--duration-fast) motion-safe:ease-standard",
          "data-[state=open]:opacity-100 data-[state=closed]:opacity-0",
          "motion-safe:data-[state=open]:animate-scale-in",
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton ? (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            aria-label={closeLabel}
            className={cn(
              "absolute top-4 end-4 inline-flex size-7 items-center justify-center rounded-sm",
              "text-muted-foreground opacity-70",
              "transition-[color,background-color,opacity] duration-(--duration-fast) ease-standard",
              "hover:bg-accent hover:text-accent-foreground hover:opacity-100",
              "outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "disabled:pointer-events-none",
            )}
          >
            <X className="size-4" />
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-1.5 text-start", className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-h4 font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
};
