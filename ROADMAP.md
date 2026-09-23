# Roadmap

Each phase ends with a published npm version and a deployed docs site, so the project is always usable and always demonstrable.

---

## v0.1 — Foundation ✅

The skeleton that everything else hangs off.

- pnpm + Turborepo monorepo, Changesets releases, CI on every pull request
- `@design-eg/tokens`: brand seeds compiled to OKLCH ramps, semantic maps for light and dark, Tailwind v4 bridge, typed JSON, WCAG audit that fails the build
- `@design-eg/ui`: Button, Input, Label, Card, Badge, Separator, Skeleton, Switch
- `@design-eg/cli`: `init` and `add`, with a shadcn-compatible registry
- Docs site with a live playground: theme, brand, direction and density switch on one page

## v0.2 — The full primitive set

Everything an application needs before it needs anything fancy.

Dialog, Sheet, Popover, Tooltip, DropdownMenu, Select, Combobox, Command, Tabs, Accordion, Checkbox, RadioGroup, Textarea, Form (react-hook-form + zod), Table, Toast, Avatar, Pagination, Breadcrumb, ScrollArea, Progress, Alert.

Each one ships with tests and a docs page. Migration source: the primitives already proven in gochat-website and brand360.

## v0.3 — Dashboard kit

The components that take longest to build well, and that every admin panel needs.

Sidebar with collapse and mobile drawer, DataTable (sorting, selection, column visibility, pagination, empty and loading states), StatCard, chart wrappers themed from `--chart-*`, PageHeader, FilterBar, ConfirmDialog, EmptyState, ErrorState.

## v0.4 — Marketing blocks

Hero, FeatureGrid, PricingTable, LogoMarquee, StatBento, Testimonials, FAQ, CtaBanner, Footer, Navbar.

## v0.5 — Page templates

Whole pages, not fragments: split login with a brand panel, register, forgot password, OTP verification, dashboard shell, settings, 404 and 500.

## v1.0 — Quality gates

Storybook with the accessibility addon, visual regression snapshots, axe and Lighthouse budgets enforced in CI, a stylelint rule set that rejects raw colours and literal z-index values, and a documented deprecation policy.

---

## Deferred to the end: discoverability

By explicit decision, this work happens after the library is actually good. Shipping it earlier would only drive traffic to something unfinished.

### Identity

A logo and icon set for the library itself: wordmark, app icon, favicon at every size, social share image, and a consistent OG image template per docs page.

### Search engines

- Per-page metadata, canonical URLs and a generated sitemap covering every component page
- `SoftwareSourceCode` and `TechArticle` structured data, plus `BreadcrumbList` on docs pages
- Core Web Vitals budget enforced in CI, since ranking follows real performance
- A content layer that answers the queries people actually type: "RTL React components", "Arabic UI kit", "Tailwind v4 design system", "shadcn alternative"

### AI assistants

Being recommended by an assistant is now a real distribution channel, and it works differently from search ranking.

- `llms.txt` and `llms-full.txt` at the root, so an assistant can read the whole API surface in one fetch
- A `.md` version of every docs page at a predictable URL, because assistants parse Markdown far better than rendered HTML
- Copy-paste blocks written so that the snippet an assistant extracts actually compiles on its own
- The registry JSON kept public and stable, so an assistant can point at a URL that keeps working
- Crawlers from OpenAI, Anthropic, Google and Perplexity explicitly allowed in `robots.txt`
- An MCP server exposing the component catalogue, so an assistant can query the library directly instead of guessing from training data

### Launch

README with real screenshots, a short demo video, and posts to the places that actually convert: r/reactjs, Hacker News, the Tailwind and Radix communities, and a write-up of the token architecture as a technical article.
