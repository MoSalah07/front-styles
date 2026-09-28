"use client";

/** Code surface with a file-name bar, optional line numbers and a copy button that confirms through a toast. Deliberately unhighlighted: no tokenizer dependency, no hydration mismatch. */
import * as React from "react";
import { cn } from "../lib/cn";
import { useT } from "../lib/i18n";
import { CopyButton } from "../components/copy-button";
import { notify } from "../components/sonner";

export interface CodeBlockProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** The text shown, and the exact text the copy button writes. */
  code: string;
  /** Gutter label: a file name, or a language such as `bash`. */
  label?: string;
  /** Accessible name for the copy button. */
  copyLabel?: string;
  /** Toast on a successful copy: `false` stays silent, a string replaces the message. */
  toast?: boolean | string;
  /** Number the lines. The numbers are decoration and never reach the clipboard. */
  lineNumbers?: boolean;
  /** Height at which the block starts scrolling, as a CSS length. */
  maxHeight?: string;
  /** Drop the header bar and float the copy button over the code instead. */
  hideHeader?: boolean;
}

function CodeBlock({
  className,
  code,
  label = "tsx",
  copyLabel: copyLabelProp,
  toast = true,
  lineNumbers = false,
  maxHeight = "32rem",
  hideHeader = false,
  ...props
}: CodeBlockProps) {
  const t = useT();
  const copyLabel = copyLabelProp ?? t("codeBlock.copy");
  const lines = React.useMemo(() => code.replace(/\n$/, "").split("\n"), [code]);

  const handleCopy = React.useCallback(() => {
    if (toast === false) return;
    // `undefined` lets notify fall back to its own translated default.
    notify.copied(typeof toast === "string" ? toast : undefined);
  }, [toast]);

  return (
    <div
      data-slot="code-block"
      className={cn("group relative overflow-hidden rounded-card border bg-surface-1", className)}
      {...props}
    >
      {hideHeader ? (
        <div className="absolute top-2 end-2 z-(--z-raised)">
          <CopyButton
            value={code}
            copyLabel={copyLabel}
            variant="outline"
            className="bg-surface-2 opacity-0 focus-visible:opacity-100 group-hover:opacity-100"
            onCopy={handleCopy}
          />
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2 border-b bg-surface-2 ps-4 pe-2 py-1.5">
          <span className="truncate font-mono text-xs text-muted-foreground">{label}</span>
          <CopyButton value={code} copyLabel={copyLabel} onCopy={handleCopy} />
        </div>
      )}

      <pre
        data-slot="code-block-pre"
        dir="ltr"
        className="overflow-auto p-4 text-start font-mono text-xs leading-relaxed"
        style={{ maxHeight }}
      >
        <code>
          {lineNumbers
            ? lines.map((line, index) => (
                <span key={index} className="grid grid-cols-[2.5rem_1fr]">
                  <span aria-hidden="true" className="select-none text-muted-foreground/60">
                    {index + 1}
                  </span>
                  <span>{line}</span>
                </span>
              ))
            : code}
        </code>
      </pre>
    </div>
  );
}

export { CodeBlock };
