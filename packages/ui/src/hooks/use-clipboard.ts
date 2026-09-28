"use client";

/** Writes text to the clipboard and reports success for a couple of seconds, falling back to a detached textarea where the async API is blocked. */
import * as React from "react";

export interface UseClipboardOptions {
  /** How long `copied` stays true, in milliseconds. */
  timeout?: number;
  /** Called with the text that reached the clipboard. */
  onCopy?: (value: string) => void;
  /** Called when the clipboard refused the write. */
  onError?: (error: Error) => void;
}

export interface UseClipboardResult {
  /** Writes `value`, resolving to whether it landed. Never throws. */
  copy: (value: string) => Promise<boolean>;
  /** True from a successful copy until `timeout` elapses. */
  copied: boolean;
  /** The last failure, or null. */
  error: Error | null;
  /** Clear `copied` and `error` before the timeout runs out. */
  reset: () => void;
}

/**
 * Legacy path for insecure origins, older Safari and permission-denied states.
 * Selects a detached textarea, copies, then restores whatever the user had
 * selected so the page does not visibly lose its selection.
 */
function copyWithExecCommand(value: string): boolean {
  if (typeof document === "undefined" || typeof document.execCommand !== "function") return false;

  const area = document.createElement("textarea");
  area.value = value;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  area.style.pointerEvents = "none";
  document.body.appendChild(area);

  const selection = document.getSelection();
  const previous = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

  let ok = false;
  try {
    area.select();
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }

  area.remove();
  if (selection && previous) {
    selection.removeAllRanges();
    selection.addRange(previous);
  }
  return ok;
}

/**
 * Clipboard state for any "copy this" affordance.
 *
 * The component owns the markup; this owns the write, the success window and
 * the failure. `copy` resolves to a boolean instead of throwing, so a caller
 * can branch on it without a try/catch at every call site.
 */
export function useClipboard({
  timeout = 2000,
  onCopy,
  onError,
}: UseClipboardOptions = {}): UseClipboardResult {
  const [copied, setCopied] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const mounted = React.useRef(true);

  // Callbacks are read through a ref so `copy` stays referentially stable even
  // when the caller passes inline arrow functions, which is the common case.
  const handlers = React.useRef({ onCopy, onError });
  handlers.current = { onCopy, onError };

  React.useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      clearTimeout(timer.current);
    };
  }, []);

  const reset = React.useCallback(() => {
    clearTimeout(timer.current);
    setCopied(false);
    setError(null);
  }, []);

  const copy = React.useCallback(
    async (value: string) => {
      let ok = false;
      try {
        if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(value);
          ok = true;
        } else {
          ok = copyWithExecCommand(value);
        }
      } catch {
        ok = copyWithExecCommand(value);
      }

      if (!mounted.current) return ok;

      if (!ok) {
        const failure = new Error("Clipboard write was refused by the browser.");
        setCopied(false);
        setError(failure);
        handlers.current.onError?.(failure);
        return false;
      }

      setError(null);
      setCopied(true);
      handlers.current.onCopy?.(value);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        if (mounted.current) setCopied(false);
      }, timeout);
      return true;
    },
    [timeout],
  );

  return { copy, copied, error, reset };
}
