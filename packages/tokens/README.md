# @design-eg/tokens

Design tokens for [design-eg](https://github.com/design-eg/design-eg). A brand is a single JSON seed; the compiler turns it into a complete, contrast-checked CSS variable system with light and dark modes.

```
brands/*.brand.json ──► dist/index.css   (primitives → semantic → component)
                        dist/tailwind.css (Tailwind v4 @theme bridge)
                        dist/tokens.json  (resolved values for docs, charts, Figma)
```

## Install

```bash
pnpm add @design-eg/tokens
```

```css
/* globals.css */
@import "tailwindcss";
@import "@design-eg/tokens/css";
@import "@design-eg/tokens/tailwind.css";
```

## Switching brand, mode and density

```html
<html class="dark" data-brand="crimson" data-density="comfortable" dir="rtl"></html>
```

- `data-brand` selects a compiled brand (`crimson` is the default and needs no attribute).
  Shipped: `crimson` (red), `ocean` (blue), `ember` (orange), `forest` (green),
  `slate` (grey), `iris` (indigo), `violet` (purple), `jade` (bright green),
  `coral` (pink-red) and `neutral` (monochrome).
- `.dark` / `.light` or `data-theme="dark|light"` switch modes and can be nested (a dark hero inside a light page).
- `data-density="compact|comfortable|spacious"` scales control heights.

## Token tiers

| Tier      | Example                                                       | Rule                                               |
| --------- | ------------------------------------------------------------- | -------------------------------------------------- |
| Primitive | `--brand-600`, `--neutral-900`, `--radius`, `--ease-entrance` | Never referenced directly by components            |
| Semantic  | `--primary`, `--background`, `--border`, `--shadow-2`         | What components use; re-pointed per mode and brand |
| Component | `--control-h-md`, `--radius-control`, `--header-h`            | Per-component knobs                                |

Semantic names follow the shadcn/ui convention, so any shadcn registry item renders correctly on top of these tokens.

## Adding a brand

Create `brands/<name>.brand.json`:

```json
{
  "name": "plum",
  "seed": "#7C3AED",
  "radius": "0.75rem",
  "neutral": { "tint": 0.008 },
  "overrides": { "dark": { "primary-hover": "{brand.-2}" } }
}
```

Run `pnpm build`. The build fails if any text pair drops below WCAG AA.

## Ref grammar

| Ref                         | Meaning                                           |
| --------------------------- | ------------------------------------------------- |
| `{brand}`                   | the exact seed step                               |
| `{brand.+1}` / `{brand.-1}` | one step darker / lighter than the seed           |
| `{neutral.900}`             | an absolute step                                  |
| `{on:brand}`                | white or black, whichever has the better contrast |
| `{neutral.0 @ 0.1}`         | same colour at 10% alpha                          |

## JavaScript

```ts
import { tokens, brands } from "@design-eg/tokens";
tokens.brands.crimson.modes.dark.primary.hex; // "#e50914"
```
