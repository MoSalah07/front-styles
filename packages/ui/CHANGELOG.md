# @design-eg/ui

## 0.2.0

### Minor Changes

- 0bfbee5: Four more brands ship alongside `crimson`: `ocean` (product blue), `ember` (commerce orange), `forest` (deep green) and `slate` (cool grey). Each is one JSON seed compiled into full OKLCH ramps and light/dark semantic maps, and each clears every audited WCAG AA text pair in both modes.

  `SettingsPage` offers all six brands by default and wraps its brand toggles instead of overflowing on narrow cards.

- 0eb820e: Initial release.

  `@design-eg/tokens` compiles a brand from a single JSON seed into OKLCH colour ramps and a three-tier CSS variable system, with light and dark maps, a Tailwind v4 bridge and a WCAG contrast audit that fails the build. Ships two brands: `crimson` (dark-first, red on near-black) and `neutral` (monochrome).

  `@design-eg/ui` adds Button, Input, Label, Card, Badge, Separator, Skeleton and Switch. Radix primitives, CVA variants, RTL-safe logical properties, tree-shakeable per-component exports.

  `@design-eg/cli` adds `init` and `add`, backed by a shadcn-compatible registry so components can be installed as a package or copied into a project.

### Patch Changes

- Updated dependencies [0bfbee5]
- Updated dependencies [0eb820e]
  - @design-eg/tokens@0.2.0
