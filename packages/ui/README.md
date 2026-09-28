# @design-eg/ui

React 19 components for [design-eg](https://github.com/design-eg/design-eg): Radix primitives, Tailwind v4, design tokens, RTL and dark mode built in.

## Install

```bash
pnpm add @design-eg/ui
```

```css
/* globals.css */
@import "tailwindcss";
@import "@design-eg/ui/styles.css";
```

```tsx
import { Button, Card, CardContent } from "@design-eg/ui";
// or tree-shaken per component
import { Button } from "@design-eg/ui/button";
```

## Prefer owning the source?

Copy components into your project with the CLI instead:

```bash
npx @design-eg/cli init
npx @design-eg/cli add button card
```

Every component is also published as a shadcn-compatible registry item, so `npx shadcn add <registry-url>/button.json` works too.

## Copy affordances and toasts

Mount the toast viewport once, then any copy button in the app can report through it:

```tsx
// app/layout.tsx
import { Toaster } from "@design-eg/ui";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
```

```tsx
import { CopyButton, InstallCommand, CodeBlock, notify, useClipboard } from "@design-eg/ui";

// a package manager switcher with a copy button, as on this library's own docs
<InstallCommand packageName="@design-eg/ui" />;
<InstallCommand command="@design-eg/cli add button" />;

// a code surface that copies itself
<CodeBlock code={source} label="button.tsx" lineNumbers />;

// the button on its own, anywhere
<CopyButton value={apiKey} onCopy={() => notify.copied("API key copied")} />;

// or just the logic
const { copy, copied } = useClipboard();
```

`notify` renders the library's own toast: a tone chip, an optional action and a
progress bar that drains over the toast's lifetime. `notify.success`, `.error`,
`.warning`, `.info`, `.loading` and `.copied` cover the usual cases; sonner's
`toast` is exported too for `toast.promise` and custom renders.
