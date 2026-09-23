# Contributing

## Setup

```bash
pnpm install
pnpm build
pnpm dev
```

## Adding a component

1. Create `packages/ui/src/components/<name>.tsx`.
2. Export it from `packages/ui/src/index.ts`.
3. Add `packages/ui/src/components/<name>.test.tsx` covering render, interaction and the accessible name.
4. Show it in `apps/docs/components/showcase.tsx`.
5. Run `pnpm changeset` and pick `minor`.

The registry picks up new files automatically, so no registry edit is needed.

## Rules that CI enforces

- **No raw colours.** No hex, `rgb()` or `hsl()` in a component. Use a semantic token.
- **No literal z-index.** Use the `--z-*` scale.
- **Logical properties only.** `ms-*`/`me-*`, not `ml-*`/`mr-*`. `start-*`/`end-*`, not `left-*`/`right-*`.
- **Every interactive element has an accessible name**, and every focusable element has a visible focus ring.
- **Components take `className`** and merge it through `cn()` so consumers can override.
- **Radix first.** If a primitive exists for the behaviour, wrap it rather than rebuilding it.

## Adding a brand

Create `packages/tokens/brands/<name>.brand.json` with a seed colour, then run `pnpm --filter @design-eg/tokens build`. The build prints a contrast report per brand and fails on an AA violation. Fix it by overriding the offending token in the brand's `overrides` block rather than by lowering the threshold.

## Commits and releases

Conventional commits. Every change to a published package needs a changeset. Merging the generated "Version Packages" pull request publishes to npm.
