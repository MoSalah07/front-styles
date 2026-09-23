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
