"use client";

/** Dialog that slides in from a screen edge; the `start` and `end` sides follow the reading direction, so they mirror in RTL. */
import * as React from "react";
import { X } from "lucide-react";
import { Dialog as SheetPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";
import { useT } from "../lib/i18n";

const sheetVariants = cva(
  [
    "fixed z-(--z-modal) flex flex-col gap-4 bg-card p-6 text-card-foreground shadow-3 outline-none",
    "motion-safe:transition-[opacity,transform] motion-safe:duration-(--duration-normal) motion-safe:ease-standard",
    "data-[state=open]:opacity-100 data-[state=closed]:opacity-0",
  ],
  {
    variants: {
      side: {
        top: [
          "inset-x-0 top-0 h-auto max-h-[80vh] border-b rounded-b-sheet",
          "data-[state=open]:translate-y-0 data-[state=closed]:-translate-y-full",
        ],
        bottom: [
          "inset-x-0 bottom-0 h-auto max-h-[80vh] border-t rounded-t-sheet",
          "data-[state=open]:translate-y-0 data-[state=closed]:translate-y-full",
        ],
        // `start-0` is inset-inline-start, so it lands on the right in RTL and
        // the closed-state transform has to leave through that same edge.
        start: [
          "inset-y-0 start-0 h-full w-3/4 max-w-sm border-e",
          "data-[state=open]:translate-x-0",
          "data-[state=closed]:-translate-x-full rtl:data-[state=closed]:translate-x-full",
        ],
        end: [
          "inset-y-0 end-0 h-full w-3/4 max-w-sm border-s",
          "data-[state=open]:translate-x-0",
          "data-[state=closed]:translate-x-full rtl:data-[state=closed]:-translate-x-full",
        ],
      },
    },
    defaultVariants: {
      side: "end",
    },
  },
);

function Sheet(props: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root {...props} />;
}

function SheetTrigger({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" className={cn(className)} {...props} />;
}

function SheetPortal(props: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal {...props} />;
}

function SheetClose({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" className={cn(className)} {...props} />;
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
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

export interface SheetContentProps
  extends React.ComponentProps<typeof SheetPrimitive.Content>, VariantProps<typeof sheetVariants> {
  /** Hide the built-in close button when the content supplies its own. */
  showCloseButton?: boolean;
  /** Accessible name for the built-in close button. */
  closeLabel?: string;
}

function SheetContent({
  className,
  children,
  side = "end",
  showCloseButton = true,
  closeLabel: closeLabelProp,
  ...props
}: SheetContentProps) {
  const t = useT();
  const closeLabel = closeLabelProp ?? t("sheet.close");

  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        data-side={side}
        className={cn(sheetVariants({ side }), className)}
        {...props}
      >
        {children}
        {showCloseButton ? (
          <SheetPrimitive.Close
            data-slot="sheet-close"
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
          </SheetPrimitive.Close>
        ) : null}
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 text-start", className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-h4 font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetPortal,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
  sheetVariants,
};
