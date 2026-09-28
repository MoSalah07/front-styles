# Versioning and deprecation

This is the promise the packages make to the code that depends on them. It
applies to `@design-eg/tokens`, `@design-eg/ui`, `@design-eg/cli` and
`@design-eg/mcp`, and to the registry that the CLI reads.

## Semantic versioning

The packages follow [semver](https://semver.org). Until `1.0.0`, a minor bump
may carry a breaking change; from `1.0.0` on, it may not.

The packages version together through Changesets, but they are not lockstep: a
change to the CLI does not bump the UI package.

### What counts as breaking

| Package  | Breaking                                                                                                                                           |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tokens` | removing or renaming a semantic variable (`--primary`), changing a variable's meaning, dropping a brand, changing the contrast floor               |
| `ui`     | removing a component or an export, removing a prop or a variant, renaming a `data-slot`, changing default rendered markup in a way that breaks CSS |
| `cli`    | renaming a command or a flag, changing the shape of `components.json`, changing where files are written                                            |
| registry | renaming or removing an item, changing an item's `name`, `type` or file path                                                                       |
| `mcp`    | renaming or removing a tool, or changing the shape of a tool's result                                                                              |

### What does not count

Adding a component, a variant, a prop with a default, a token, a brand or a
registry item. Changing a colour ramp within its contrast guarantee. Internal
refactors that keep the rendered markup, the `data-slot` attributes and the
public types identical. Documentation and examples.

Because `data-slot` attributes are a documented styling and testing hook, they
are part of the public surface — treat renaming one exactly like renaming a prop.

## Supported peer versions

| Peer         | Supported                |
| ------------ | ------------------------ |
| React        | 19 and up                |
| Tailwind CSS | 4 and up                 |
| Node         | 20.9 and up (CI runs 22) |

Dropping support for a version listed here is a major bump.

## Deprecation lifecycle

Nothing is removed without a warning that shipped first.

1. **Announce.** The replacement lands in the same release as the deprecation,
   so there is never a window with no supported path. The changeset says what
   replaced what, in one line, in the imperative: "`Foo` is deprecated, use
   `Bar`".
2. **Mark.** Every deprecated surface carries a JSDoc `@deprecated` tag naming
   the replacement, so editors surface it at the call site:

   ```tsx
   /** @deprecated Use `Sheet` instead. Removed in 2.0. */
   export const Drawer = Sheet;
   ```

   Deprecated components keep working and keep their tests. A deprecated prop
   still does what it did; it does not become a no-op.

3. **Warn at runtime, in development only.** For anything a type cannot catch —
   a prop value, a CSS variable read from a consumer's stylesheet — warn once
   per process behind `process.env.NODE_ENV !== "production"`. Never warn in a
   production bundle, and never warn in a loop.
4. **Wait.** A deprecated surface stays for at least **two minor releases and 90
   days**, whichever is longer. Removal happens only in a major release.
5. **Remove.** The major release notes list every removal with its replacement,
   and the docs page for the removed item keeps redirecting to the replacement
   rather than 404ing.

A deprecated item stays in the registry and keeps its docs page, with a
`Deprecated` badge and the replacement linked at the top of the page.

## Tokens deprecated in place

A semantic token cannot simply disappear: a consumer may be reading it from
their own CSS. When a token is replaced, the old name is kept as an alias that
points at the new one for the whole deprecation window:

```css
/* Deprecated: use --surface-2. Removed in 2.0. */
--panel: var(--surface-2);
```

## Security and support window

The latest major receives fixes. The previous major receives security fixes only,
for six months after the new major ships. Anything older is unsupported.

## Release mechanics

Every change to a published package needs a changeset (`pnpm changeset`).
Merging the generated "Version Packages" pull request publishes to npm and
writes each package's `CHANGELOG.md`. See [CONTRIBUTING.md](./CONTRIBUTING.md).
