"use client";

/** Confirmation prompt over AlertDialog that awaits an async handler, keeps itself open while the action runs, and shows a spinner on the confirm button. */
import * as React from "react";
import { LoaderCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/alert-dialog";
import { cn } from "../lib/cn";
import { useT } from "../lib/i18n";

export interface ConfirmDialogProps extends Omit<
  React.ComponentProps<typeof AlertDialogContent>,
  "title" | "onError"
> {
  /** Question posed to the user. */
  title: React.ReactNode;
  /** What will happen if they confirm, including anything irreversible. */
  description?: React.ReactNode;
  /** Text of the confirm button. */
  confirmLabel?: string;
  /** Text of the cancel button. */
  cancelLabel?: string;
  /** Tint the confirm button as destructive for irreversible actions. */
  destructive?: boolean;
  /**
   * Runs when the user confirms. While the returned promise is pending the
   * dialog stays open and both buttons are blocked; the dialog closes once it
   * resolves, and stays open if it rejects.
   */
  onConfirm: () => void | Promise<void>;
  /** Called when `onConfirm` rejects, so the caller can surface the failure. */
  onError?: (error: unknown) => void;
  /** Element that opens the dialog. Omit it when driving `open` yourself. */
  trigger?: React.ReactNode;
  /** Controlled open state. */
  open?: boolean;
  /** Notified whenever the open state changes, controlled or not. */
  onOpenChange?: (open: boolean) => void;
  /** Initial open state when the component owns it. */
  defaultOpen?: boolean;
}

function ConfirmDialog({
  className,
  title,
  description,
  confirmLabel: confirmLabelProp,
  cancelLabel: cancelLabelProp,
  destructive = false,
  onConfirm,
  onError,
  trigger,
  open,
  onOpenChange,
  defaultOpen = false,
  children,
  ...props
}: ConfirmDialogProps) {
  const t = useT();
  const confirmLabel = confirmLabelProp ?? t("confirmDialog.confirm");
  const cancelLabel = cancelLabelProp ?? t("confirmDialog.cancel");

  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const [pending, setPending] = React.useState(false);

  const isOpen = open ?? uncontrolledOpen;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (open === undefined) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange, open],
  );

  const handleConfirm = async (event: React.MouseEvent<HTMLButtonElement>) => {
    // Radix closes on click by default; the dialog has to survive long enough
    // to show the pending state and to stay open if the action fails.
    event.preventDefault();
    if (pending) return;

    try {
      setPending(true);
      await onConfirm();
      setOpen(false);
    } catch (error) {
      onError?.(error);
    } finally {
      setPending(false);
    }
  };

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(next) => {
        // Escape and the cancel button must not dismiss a running action.
        if (pending && !next) return;
        setOpen(next);
      }}
    >
      {trigger ? <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger> : null}

      <AlertDialogContent data-slot="confirm-dialog" className={cn(className)} {...props}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description ? <AlertDialogDescription>{description}</AlertDialogDescription> : null}
        </AlertDialogHeader>

        {children}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            data-slot="confirm-dialog-confirm"
            data-loading={pending || undefined}
            aria-busy={pending || undefined}
            disabled={pending}
            onClick={handleConfirm}
            className={cn(
              destructive &&
                "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80",
            )}
          >
            {pending ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : null}
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { ConfirmDialog };
