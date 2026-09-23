<div align="center">

# design-eg

**A cinematic, RTL-first React design system.**

Contrast-checked design tokens · accessible Radix + Tailwind v4 components · a CLI that copies the source into your project.

[![MIT License](https://img.shields.io/badge/license-MIT-black)](./LICENSE)
[![npm](https://img.shields.io/badge/npm-%40design--eg-black)](https://www.npmjs.com/org/design-eg)

</div>

---

## What this is

Most design systems make you choose: install a package and inherit someone else's decisions, or copy files and lose upstream fixes. design-eg does both. The tokens and the CLI ship as npm packages. Every component is also a shadcn-compatible registry item you can copy and own.

```bash
# use it as a library
pnpm add @design-eg/ui

# or own the source
npx @design-eg/cli init
npx @design-eg/cli add button card
```

```css
/* globals.css */
@import "tailwindcss";
@import "@design-eg/ui/styles.css";
```

```tsx
import { Button } from "@design-eg/ui";

<Button size="lg">Continue</Button>;
```

## Principles

**One seed per brand.** A brand is a JSON file with a colour and a font stack. The compiler derives OKLCH ramps, maps them onto semantic roles for light and dark, and fails the build if any text pair drops below WCAG AA. Adding a brand is a pull request with one file, not a refactor.

**Three token tiers, enforced.** Primitives (`--brand-600`) feed semantics (`--primary`) feed component knobs (`--control-h-md`). Components only ever reference the semantic tier, so re-theming never means editing a component.

**RTL is not a plugin.** Logical properties throughout, a separate Arabic font stack with its own line-height, and a direction switch that changes nothing else. Arabic and English are both first-class.

**Dark mode is a re-point, not a filter.** Dark surfaces step through their own neutral scale and elevation becomes a hairline ring instead of a shadow, because shadows do not read on black.

**Accessibility comes from Radix.** Keyboard navigation, focus traps and ARIA are handled by primitives that already solved them. We supply the styling and the tokens.

## Packages

| Package                                  | Description                                                                  |
| ---------------------------------------- | ---------------------------------------------------------------------------- |
| [`@design-eg/tokens`](./packages/tokens) | Brand seeds compiled into CSS variables, a Tailwind v4 bridge and typed JSON |
| [`@design-eg/ui`](./packages/ui)         | React 19 components                                                          |
| [`@design-eg/cli`](./packages/cli)       | `init` and `add` commands                                                    |
| [`apps/docs`](./apps/docs)               | Documentation site and live playground                                       |

## Theming

Everything is driven by attributes on `<html>`:

```html
<html class="dark" data-brand="crimson" data-density="comfortable" dir="rtl" lang="ar"></html>
```

| Attribute              | Values                                                                 |
| ---------------------- | ---------------------------------------------------------------------- |
| `class` / `data-theme` | `light`, `dark` (nestable, so a dark hero can sit inside a light page) |
| `data-brand`           | `crimson` (default), `neutral`, or any brand you add                   |
| `data-density`         | `compact`, `comfortable`, `spacious`                                   |
| `dir`                  | `ltr`, `rtl`                                                           |

## Development

Requires Node 20.9+ and pnpm 9.

```bash
pnpm install
pnpm build          # tokens -> ui -> registry -> docs
pnpm dev            # docs site at localhost:3000
pnpm test           # component tests
pnpm typecheck
pnpm changeset      # record a version bump before merging
```

## What's in it

| Tier       | Count | Examples                                                                 |
| ---------- | ----- | ------------------------------------------------------------------------ |
| Primitives | 37    | button, input, select, dialog, dropdown-menu, table, tabs, form, command |
| Blocks     | 19    | data-table, app-sidebar, chart, stat-card, pricing-table, hero, faq      |
| Templates  | 8     | login-split, register, otp-verify, dashboard-shell, settings, 404, 500   |

Every one is a registry item with its own docs page and a live example.

## Quality gates

These run on every pull request and are the reason the library stays coherent:

| Check           | What it enforces                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------- |
| `lint:tokens`   | no raw colours, no off-scale palette classes, no literal z-index, no physical-direction utilities |
| `lint:css`      | stylelint over the token and component stylesheets                                                |
| `lint:registry` | every item is well formed and its dependencies resolve                                            |
| `lint:dist`     | the published entry points and every `exports` subpath exist                                      |
| `test`          | 72 tests, including 13 axe accessibility fixtures                                                 |

The allowed colour list is derived from the token CSS at runtime, so the linter
cannot fall out of step with the tokens.

## Roadmap

Shipped: tokens and theming, the full primitive set, the dashboard kit, the
marketing blocks, the page templates, the CLI and registry, the documentation
site, and the quality gates above.

Next: Storybook with visual regression, a Figma token sync, more brands, and the
discoverability work described in [ROADMAP.md](./ROADMAP.md).

## License

MIT
