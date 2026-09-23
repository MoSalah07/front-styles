---
"@design-eg/tokens": minor
"@design-eg/ui": minor
"@design-eg/cli": minor
---

Initial release.

`@design-eg/tokens` compiles a brand from a single JSON seed into OKLCH colour ramps and a three-tier CSS variable system, with light and dark maps, a Tailwind v4 bridge and a WCAG contrast audit that fails the build. Ships two brands: `crimson` (dark-first, red on near-black) and `neutral` (monochrome).

`@design-eg/ui` adds Button, Input, Label, Card, Badge, Separator, Skeleton and Switch. Radix primitives, CVA variants, RTL-safe logical properties, tree-shakeable per-component exports.

`@design-eg/cli` adds `init` and `add`, backed by a shadcn-compatible registry so components can be installed as a package or copied into a project.
