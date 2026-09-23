"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@design-eg/ui";
import { cn } from "@design-eg/ui/cn";

export interface CodeBlockProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** The text to render and copy. */
  code: string;
  /** Small label in the gutter, e.g. a file name or `bash`. */
  label?: string;
  /** Accessible name for the copy button. */
  copyLabel?: string;
}

/**
 * A plain, legible code surface with a copy button that reports success.
 * Deliberately unhighlighted: no tokenizer dependency, no hydration mismatch.
 */
export function CodeBlock({
  className,
  code,
  label,
  copyLabel = "Copy code",
  ...props
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  React.useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Clipboard is unavailable (insecure origin, denied permission). Fall back
      // to selecting nothing and simply not reporting success.
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      data-slot="code-block"
      className={cn("relative overflow-hidden rounded-card border bg-surface-1", className)}
      {...props}
    >
      <div className="flex items-center justify-between gap-2 border-b bg-surface-2 ps-4 pe-2 py-1.5">
        <span className="truncate font-mono text-xs text-muted-foreground">{label ?? "tsx"}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={copyLabel}
          onClick={copy}
          className="shrink-0"
        >
          {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
        </Button>
      </div>
      <pre className="max-h-[32rem] overflow-auto p-4 text-start font-mono text-xs leading-relaxed">
        <code>{code}</code>
      </pre>
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </div>
  );
}
