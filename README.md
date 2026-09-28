<div align="center">

# design-eg

**A cinematic, RTL-first React design system.**

Contrast-checked design tokens · accessible Radix + Tailwind v4 components · a CLI that copies the source into your project.

[![MIT License](https://img.shields.io/badge/license-MIT-black)](./LICENSE)
[![npm](https://img.shields.io/badge/npm-%40design--eg-black)](https://www.npmjs.com/org/design-eg)
[![React 19](https://img.shields.io/badge/react-19-black)](https://react.dev)
[![Tailwind v4](https://img.shields.io/badge/tailwind-v4-black)](https://tailwindcss.com)

[Use it in a project](#use-it-in-your-project) · [Theming](#theming) · [Run it as a developer](#run-it-as-a-developer) · [Deploy](#deploying-the-docs-site)

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

```tsx
import { Button } from "@design-eg/ui";

<Button size="lg">Continue</Button>;
```

## Links

| What              | Where                                                       |
| ----------------- | ----------------------------------------------------------- |
| Docs & playground | <https://design-eg.vercel.app> <!-- TODO: custom domain --> |
| Component index   | <https://design-eg.vercel.app/docs>                         |
| Templates         | <https://design-eg.vercel.app/docs/templates>               |
| Registry base URL | <https://design-eg.vercel.app/r>                            |
| npm               | <https://www.npmjs.com/org/design-eg>                       |
| Source            | <https://github.com/design-eg/design-eg>                    |

> **Moving to a custom domain?** The URL lives in exactly three places — see
> [Deploying the docs site](#deploying-the-docs-site). Change those and every
> docs link, sitemap entry and `npx` registry fetch follows.

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
| [`@design-eg/mcp`](./packages/mcp)       | MCP server, so an AI assistant can query the catalogue instead of guessing   |
| [`apps/docs`](./apps/docs)               | Documentation site and live playground, in English, Arabic, French and Hindi |

---

# Use it in your project

## Requirements

| Thing        | Version | Why                                               |
| ------------ | ------- | ------------------------------------------------- |
| Node         | 20.9+   | the CLI and the build target it                   |
| React        | 19+     | components use the React 19 ref-as-prop signature |
| Tailwind CSS | 4+      | tokens ship as a `@theme` bridge, not a JS config |

Tailwind v4 is configured in CSS, not in `tailwind.config.js`. If your project
still has a v3 setup, migrate it first — there is nothing to port from this
library, but the `@import "tailwindcss"` entry is required.

## Option A — install the package

Fastest path. You get fixes with a version bump, and you do not edit the
component source.

### 1. Install

```bash
pnpm add @design-eg/ui react react-dom
pnpm add -D tailwindcss @tailwindcss/postcss
```

### 2. Wire PostCSS

```js
// postcss.config.mjs
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

### 3. Import the stylesheet

One line after Tailwind. It pulls in the token variables, the Tailwind v4
bridge, the base layer, and a `@source` directive so Tailwind sees the class
names inside the shipped components.

```css
/* app/globals.css */
@import "tailwindcss";
@import "@design-eg/ui/styles.css";
```

### 4. Set the theme attributes on `<html>`

```tsx
// app/layout.tsx — Next.js App Router
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className="dark" data-brand="crimson" data-density="comfortable">
      <body>{children}</body>
    </html>
  );
}
```

### 5. Use a component

```tsx
import { Button, Card, CardContent } from "@design-eg/ui";

export default function Page() {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4">
        <p>Ready when you are.</p>
        <Button size="lg">Continue</Button>
      </CardContent>
    </Card>
  );
}
```

Per-component imports work too, and keep the bundle honest if your bundler does
not tree-shake well:

```tsx
import { Button } from "@design-eg/ui/button";
```

### Next.js note

Next needs to compile the packages when you consume them from a workspace or a
local tarball:

```ts
// next.config.ts
const nextConfig = {
  transpilePackages: ["@design-eg/ui", "@design-eg/tokens"],
};
export default nextConfig;
```

### Vite note

Nothing special. Use `@tailwindcss/vite` instead of the PostCSS plugin and
import the same stylesheet from your entry CSS.

```ts
// vite.config.ts
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({ plugins: [react(), tailwindcss()] });
```

## Option B — own the source

The CLI copies the real component file into your repository. After that it is
your code: edit it, delete half of it, no upstream to fight.

```bash
# inside your React project
npx @design-eg/cli init
npx @design-eg/cli add button card dialog
```

`init` does four things:

1. writes `design-eg.json` at the project root,
2. writes a `cn()` helper into your lib folder,
3. adds the token imports to your global stylesheet,
4. installs `@design-eg/tokens`, `clsx`, `tailwind-merge`, `class-variance-authority` and `radix-ui`.

It detects `src/`, finds your global CSS, and asks before overwriting. Pass `-y`
to accept the defaults, `--no-install` to skip the dependency install.

```jsonc
// design-eg.json
{
  "tsx": true,
  "registry": "https://design-eg.vercel.app/r",
  "paths": {
    "ui": "src/components/ui",
    "lib": "src/lib",
    "hooks": "src/hooks",
    "css": "src/app/globals.css",
  },
  "aliases": {
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks",
    "utils": "@/lib/utils",
  },
}
```

`add` resolves registry dependencies depth-first, so `add data-table` also pulls
the `table`, `checkbox` and `dropdown-menu` items it builds on plus the `cn`
helper, and installs whatever npm packages those items declare.

| Flag                   | Effect                                      |
| ---------------------- | ------------------------------------------- |
| `-y, --yes`            | skip the confirmation prompt                |
| `-o, --overwrite`      | replace files that already exist            |
| `-c, --cwd <path>`     | target a different project directory        |
| `-r, --registry <url>` | use another registry URL, or a local folder |
| `--no-install`         | write files, install nothing                |

## Option C — the shadcn CLI

Every item is a shadcn-compatible JSON document, so the tool you already use
works:

```bash
npx shadcn@latest add https://design-eg.vercel.app/r/button.json
```

## Optional peer dependencies

Install these only when you use the component that needs them. Nothing else in
the library imports them.

| Component                        | Needs                                           |
| -------------------------------- | ----------------------------------------------- |
| `Command`, command palette       | `cmdk`                                          |
| `Toaster` and toasts             | `sonner`                                        |
| `InputOTP`                       | `input-otp`                                     |
| `Form`                           | `react-hook-form`, `@hookform/resolvers`, `zod` |
| `Chart` and the dashboard charts | `recharts`                                      |

Icons come from `lucide-react`, which is a real dependency and installs with the
package.

---

# Theming

Everything is driven by attributes on `<html>`:

```html
<html class="dark" data-brand="crimson" data-density="comfortable" dir="rtl" lang="ar"></html>
```

| Attribute              | Values                                                                 |
| ---------------------- | ---------------------------------------------------------------------- |
| `class` / `data-theme` | `light`, `dark` (nestable, so a dark hero can sit inside a light page) |
| `data-brand`           | `crimson` (default), `ocean`, `ember`, `forest`, `slate`, `neutral`    |
| `data-density`         | `compact`, `comfortable`, `spacious`                                   |
| `dir`                  | `ltr`, `rtl`                                                           |

Switching any of them is a one-line DOM write — no provider, no context, no
re-render:

```ts
document.documentElement.classList.toggle("dark");
document.documentElement.dataset.brand = "neutral";
document.documentElement.dir = "rtl";
document.documentElement.lang = "ar";
```

To avoid a flash of the wrong theme, restore the choice before paint. The docs
site does it in [`theme-script.tsx`](./apps/docs/components/theme-script.tsx) —
copy that file.

### The shipped pickers

Two blocks put those writes behind a dropdown, and two hooks expose the same
state if you would rather build your own control:

```tsx
import { LanguageSelect, ThemeSelect, useLocale, useTheme } from "@design-eg/ui";

<ThemeSelect />                       // Light · Dark · System
<LanguageSelect />                    // English · العربية — sets lang *and* dir
<ThemeSelect variant="ghost" />       // icon-only, for a header
```

Both read `<html>` rather than a React context, so they agree with the pre-paint
script, with each other, and with a second tab. `useTheme()` returns
`{ theme, resolvedTheme, setTheme, toggleTheme, mounted }`; `useLocale()` returns
`{ locale, option, locales, dir, setLocale, mounted }`. Choosing Arabic flips
`dir` to `rtl`, which is the entire RTL pass for every component on the page.

### Brands

Six brands ship compiled. Each is one JSON seed in
[`packages/tokens/brands`](./packages/tokens/brands) — the ramps, the light and
dark maps and the contrast audit are all derived from it.

| `data-brand` | Seed      | Identity                                               |
| ------------ | --------- | ------------------------------------------------------ |
| `crimson`    | `#E50914` | Cinematic dark-first red on near-black. The default.   |
| `ocean`      | `#1D4ED8` | High-trust product blue for enterprise SaaS.           |
| `ember`      | `#EA580C` | Warm commerce orange for energetic calls to action.    |
| `forest`     | `#15803D` | Deep green for finance and health. Steady, never neon. |
| `slate`      | `#475569` | Cool grey for dense tools — colour is spent on data.   |
| `neutral`    | `#171717` | Monochrome. Colour is reserved for status only.        |

Every one of them clears WCAG AA on all 32 audited text pairs, in light and in
dark. Swapping brands never changes a component — only the values the tokens
point at.

### Fonts

The token tier exposes `--font-body`, `--font-ar`, `--font-title` and
`--font-code`. Point them at your own fonts once:

```css
:root {
  --font-body: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --font-ar: var(--font-cairo), "Segoe UI", Tahoma, sans-serif;
}
```

`:lang(ar)` already switches to `--font-ar` and opens up the line-height.

### A new brand

Add `packages/tokens/brands/<name>.brand.json` with a seed colour and rebuild
the tokens. The compiler derives the ramps, prints a contrast report, and fails
on a WCAG AA violation. Then `data-brand="<name>"` is live.

## What's in it

| Tier       | Count | Examples                                                                 |
| ---------- | ----- | ------------------------------------------------------------------------ |
| Primitives | 38    | button, input, select, dialog, dropdown-menu, table, tabs, form, command |
| Blocks     | 23    | data-table, app-sidebar, chart, theme-select, language-select, hero, faq |
| Templates  | 8     | login-split, register, otp-verify, dashboard-shell, settings, 404, 500   |
| Hooks      | 3     | use-theme, use-locale, use-clipboard                                     |

Every one is a registry item with its own docs page and a live example.

---

# Run it as a developer

## Prerequisites

| Tool | Version                     | Check           |
| ---- | --------------------------- | --------------- |
| Node | 22 (`.nvmrc`), 20.9 minimum | `node -v`       |
| pnpm | 9.15.9, pinned in the root  | `pnpm -v`       |
| Git  | any                         | `git --version` |

pnpm is pinned through `packageManager`, so let Corepack hand you the right one:

```bash
corepack enable
corepack prepare pnpm@9.15.9 --activate
```

## First run

```bash
git clone https://github.com/design-eg/design-eg.git
cd design-eg
pnpm install
pnpm build     # tokens -> ui -> registry -> docs
pnpm dev       # docs site on http://localhost:3000
```

**Build before dev, the first time.** `apps/docs` imports `@design-eg/ui`, which
imports `@design-eg/tokens/css` — a file that does not exist until the token
compiler has run. Turborepo enforces that order through `dependsOn: ["^build"]`,
so `pnpm build` is all you need. After that, `pnpm dev` runs every package in
watch mode at once and an edit to a component hot-reloads in the docs site.

On Windows both PowerShell and Git Bash work. Nothing in the toolchain needs
WSL.

## Everyday commands

Run these from the repo root.

| Command              | What it does                                               |
| -------------------- | ---------------------------------------------------------- |
| `pnpm dev`           | tokens watch + library watch + docs on :3000               |
| `pnpm build`         | full build, in dependency order                            |
| `pnpm test`          | 233 tests across tokens, ui, cli and mcp, axe included     |
| `pnpm typecheck`     | `tsc` across every package                                 |
| `pnpm lint:js`       | ESLint: correctness, hooks and accessibility               |
| `pnpm lint:tokens`   | the styling contract: no raw colours, no `z-50`, no `ml-*` |
| `pnpm lint:css`      | stylelint over the token and component stylesheets         |
| `pnpm lint:registry` | every registry item is well formed and its deps resolve    |
| `pnpm lint:dist`     | every published entry point and `exports` subpath exists   |
| `pnpm format`        | prettier, write                                            |
| `pnpm format:check`  | prettier, verify — this is what CI runs                    |
| `pnpm changeset`     | record a version bump before merging                       |
| `pnpm clean`         | drop build output and `node_modules`                       |

Scoping to one package is faster while you work:

```bash
pnpm --filter @design-eg/ui test
pnpm --filter @design-eg/ui test:watch
pnpm --filter @design-eg/ui build
pnpm --filter @design-eg/tokens build     # prints the contrast report
pnpm --filter docs dev
pnpm --filter @design-eg/visual-tests test:visual   # after pnpm build
```

## Repo layout

```
.
├── apps/
│   └── docs/                  Next.js docs site + live playground
│       └── public/r/          generated registry JSON (74 items) — do not edit
├── packages/
│   ├── tokens/                brand seeds -> CSS variables + Tailwind bridge
│   │   ├── brands/            one JSON file per brand
│   │   └── scripts/build.mjs  the compiler (OKLCH ramps, WCAG audit)
│   ├── ui/
│   │   └── src/
│   │       ├── components/    primitives   -> registry:ui
│   │       ├── blocks/        composites   -> registry:block
│   │       ├── templates/     whole pages  -> registry:block
│   │       ├── lib/cn.ts      the class helper
│   │       ├── styles/        the published stylesheet entry
│   │       └── index.ts       GENERATED — never edit by hand
│   ├── cli/                   init + add
│   ├── mcp/                   MCP server over a baked copy of the registry
│   └── registry/              builds the JSON registry from the ui sources
├── tooling/                   shared tsconfig and ESLint, the lint scripts, the visual suite
└── AGENTS.md                  the component contract — read before writing one
```

## How a change flows

```
brands/*.brand.json
        │  packages/tokens/scripts/build.mjs
        ▼
dist/index.css + tailwind.css          CSS variables, Tailwind v4 @theme
        │
        ▼
packages/ui/src/**/*.tsx  ──build──►  packages/ui/dist        the npm package
        │
        │  packages/registry/build.mjs
        ▼
apps/docs/public/r/*.json              what the CLI and shadcn fetch
        │
        ▼
apps/docs                              docs pages + live examples
```

Two consequences worth remembering: a component's **file-level doc comment
becomes its registry description**, and `packages/ui/src/index.ts` is regenerated
by `scripts/gen-barrel.mjs` on every build — edit it and the next build throws
your change away.

## Adding a component

1. Create `packages/ui/src/components/<name>.tsx` following the template in
   [AGENTS.md](./AGENTS.md): `"use client"` if it holds state, a real sentence as
   the doc comment, `className` merged through `cn()` last, `data-slot` on every
   element, logical properties only.
2. Add `<name>.test.tsx` next to it: it renders, its accessible name is right,
   its main interaction works.
3. Show it in `apps/docs/components/showcase.tsx`.
4. `pnpm build && pnpm test && pnpm typecheck && pnpm format`.
5. `pnpm changeset`, and pick `minor`.

The registry picks new files up automatically. There is no registry file to edit
and no barrel export to add.

## Trying the CLI against the local registry

You do not need the deployed site to test `add`. Point the CLI at the folder the
registry build writes:

```bash
pnpm build                                  # produces apps/docs/public/r

cd /path/to/some-test-app
node /path/to/design-eg/packages/cli/dist/index.mjs init
node /path/to/design-eg/packages/cli/dist/index.mjs add button \
  --registry /path/to/design-eg/apps/docs/public/r
```

A relative `--registry` resolves against the target project, and anything that
does not start with `http` is treated as a folder.

To test the **package** rather than the registry, pack a tarball and install it:

```bash
pnpm --filter @design-eg/ui exec npm pack     # design-eg-ui-0.1.0.tgz
cd /path/to/some-test-app
pnpm add /path/to/design-eg/packages/ui/design-eg-ui-0.1.0.tgz
```

## Troubleshooting

| Symptom                                      | Cause and fix                                                                                                 |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `Cannot find module '@design-eg/tokens/css'` | tokens were never built. `pnpm build`, or `pnpm --filter @design-eg/tokens build`.                            |
| Components render unstyled                   | the global CSS is missing `@import "@design-eg/ui/styles.css"` after Tailwind.                                |
| Your edit to `src/index.ts` vanished         | it is generated. Export from the component file and the barrel picks it up.                                   |
| `lint:tokens` fails on a new component       | a raw colour, a literal `z-50`, or `ml-*`/`left-*`. Use a token and `ms-*`/`start-*`.                         |
| The tokens build fails on contrast           | the brand seed drops a text pair below AA. Override that token in the brand file, do not lower the threshold. |
| A stale build keeps coming back              | `pnpm clean && pnpm install && pnpm build` clears the Turborepo cache too.                                    |
| `pnpm install` picks the wrong pnpm          | `corepack enable`, then re-run. The version is pinned in the root `package.json`.                             |

## Quality gates

These run on every pull request and are the reason the library stays coherent:

| Check           | What it enforces                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------- |
| `lint:js`       | ESLint for correctness, hooks and accessibility                                                   |
| `lint:tokens`   | no raw colours, no off-scale palette classes, no literal z-index, no physical-direction utilities |
| `lint:css`      | stylelint over the token and component stylesheets                                                |
| `lint:registry` | every item is well formed and its dependencies resolve                                            |
| `lint:dist`     | the published entry points and every `exports` subpath exist                                      |
| `test`          | 233 tests, including axe fixtures in all four languages                                           |
| `format:check`  | prettier, so no pull request is a diff of whitespace                                              |
| Visual          | Playwright screenshots of the docs site across theme, brand, language and density                 |
| Lighthouse      | budgets in `.lighthouserc.json`: accessibility and SEO at 100, performance at 90, Core Web Vitals |

The allowed colour list is derived from the token CSS at runtime, so the linter
cannot fall out of step with the tokens.

---

# Deploying the docs site

The docs app is a standard Next.js build inside the monorepo.

| Setting         | Value                                                        |
| --------------- | ------------------------------------------------------------ |
| Framework       | Next.js                                                      |
| Root directory  | `apps/docs`                                                  |
| Install command | `pnpm install`                                               |
| Build command   | `pnpm build` — Turborepo builds tokens → ui → registry first |
| Output          | `.next`                                                      |
| Node version    | 22                                                           |

The deployment is also the registry host: `apps/docs/public/r/*.json` is served
at `<your-domain>/r/<name>.json`, which is exactly what `npx @design-eg/cli add`
fetches.

## Pointing it at a custom domain

When the domain is live, change it in three places:

1. **`NEXT_PUBLIC_SITE_URL`** — set it in the hosting dashboard. It feeds
   [`apps/docs/lib/site.ts`](./apps/docs/lib/site.ts), which drives canonical
   URLs, Open Graph tags, `sitemap.ts` and `robots.ts`. No code change needed.
2. **[`packages/cli/src/lib/constants.ts`](./packages/cli/src/lib/constants.ts)** —
   `DEFAULT_REGISTRY_URL` and the config `$schema` URL. This is the value baked
   into every `design-eg.json` the CLI writes, so it only reaches users in a
   released version of the CLI.
3. **This README and the package READMEs** — the links table above and the
   `npx shadcn add <url>` examples.

Projects that already ran `init` keep the old URL in their `design-eg.json`, so
keep the previous host redirecting to the new one, or tell them to edit that one
line.

## Releasing

Conventional commits, Changesets for versions.

```bash
pnpm changeset          # describe the change, pick the bump
git push
```

Merging to `main` opens a "Version Packages" pull request. Merging _that_ one
publishes `@design-eg/tokens`, `@design-eg/ui`, `@design-eg/cli` and
`@design-eg/mcp` to npm through [`release.yml`](./.github/workflows/release.yml).

## Roadmap

Built: tokens and theming with six brands, the full primitive set, the dashboard
kit, the marketing blocks, the page templates, the CLI and registry, the MCP
server, the documentation site in four languages, and the quality gates above.

Next: the first npm release and docs deploy, a Figma token sync, and the rest of
the discoverability work described in [ROADMAP.md](./ROADMAP.md).

## Contributing

[CONTRIBUTING.md](./CONTRIBUTING.md) for the workflow, [AGENTS.md](./AGENTS.md)
for the component contract. Read the second one before writing a component — it
is what CI checks.

## Author

Built and maintained by [Dr-Code-07](https://github.com/Dr-Code-07).

<!-- TODO: swap in your full name and portfolio link -->

## License

MIT
