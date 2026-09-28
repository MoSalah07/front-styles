"use client";

/** Button that copies a value to the clipboard and swaps its icon to a check while the copy is fresh. Works icon-only or with a label. */
import * as React from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "../lib/cn";
import { useT } from "../lib/i18n";
import { useClipboard } from "../hooks/use-clipboard";
import { Button, type ButtonProps } from "./button";

export interface CopyButtonProps extends Omit<
  ButtonProps,
  "value" | "onCopy" | "children" | "asChild"
> {
  /** The text to copy, or a function returning it — use the function form when the value is computed at click time. */
  value: string | (() => string | Promise<string>);
  /** Visible label. Leave it out for an icon-only button. */
  children?: React.ReactNode;
  /** Accessible name for the icon-only form, and the tooltip-ish title. */
  copyLabel?: string;
  /** Replaces the visible label and is announced once the copy lands. */
  copiedLabel?: string;
  /** How long the success state lasts, in milliseconds. */
  timeout?: number;
  /** Runs with the copied text — wire a toast here. */
  onCopy?: (value: string) => void;
  /** Runs when the browser refuses the clipboard write. */
  onCopyError?: (error: Error) => void;
  /** Replaces the idle icon. The success check is not replaceable, on purpose. */
  icon?: React.ReactNode;
}

/** Crossfades the two icons in place so the button never changes width. */
function CopyIcons({ copied, icon }: { copied: boolean; icon?: React.ReactNode }) {
  const transition =
    "absolute size-4 transition-[opacity,transform] duration-(--duration-fast) ease-standard";

  return (
    <span
      aria-hidden="true"
      data-slot="copy-button-icon"
      className="relative inline-flex size-4 shrink-0 items-center justify-center"
    >
      <span className={cn(transition, copied && "scale-75 opacity-0")}>
        {icon ?? <Copy className="size-4" />}
      </span>
      <Check
        className={cn(transition, "text-success", copied ? "scale-100" : "scale-75 opacity-0")}
      />
    </span>
  );
}

function CopyButton({
  className,
  value,
  children,
  copyLabel: copyLabelProp,
  copiedLabel: copiedLabelProp,
  timeout = 2000,
  onCopy,
  onCopyError,
  icon,
  variant = "ghost",
  size,
  onClick,
  ...props
}: CopyButtonProps) {
  const t = useT();
  const copyLabel = copyLabelProp ?? t("copyButton.copy");
  const copiedLabel = copiedLabelProp ?? t("copyButton.copied");
  const { copy, copied } = useClipboard({ timeout, onCopy, onError: onCopyError });

  async function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    await copy(typeof value === "function" ? await value() : value);
  }

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size ?? (children ? "sm" : "icon-sm")}
        data-slot="copy-button"
        data-copied={copied || undefined}
        aria-label={children ? undefined : copyLabel}
        title={copyLabel}
        onClick={handleClick}
        className={cn("font-medium", className)}
        {...props}
      >
        <CopyIcons copied={copied} icon={icon} />
        {children ? <span>{copied ? copiedLabel : children}</span> : null}
      </Button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? copiedLabel : ""}
      </span>
    </>
  );
}

export { CopyButton };
