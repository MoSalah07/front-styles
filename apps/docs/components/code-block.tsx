import { CodeBlock as UiCodeBlock, type CodeBlockProps as UiCodeBlockProps } from "@design-eg/ui";

export interface CodeBlockProps extends Omit<UiCodeBlockProps, "copyLabel"> {
  /** Accessible name for the copy button. */
  copyLabel?: string;
}

/**
 * The docs wrapper around the library's own CodeBlock, so every snippet on this
 * site is the component readers are about to install — copy button, toast and
 * all — rather than a separate implementation that can drift from it.
 */
export function CodeBlock({ copyLabel = "Copy code", ...props }: CodeBlockProps) {
  return <UiCodeBlock copyLabel={copyLabel} {...props} />;
}
