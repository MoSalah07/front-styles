<!--
Thanks for contributing. Keep this short: the checklist is what reviewers
actually read. Delete the rows that do not apply.
-->

## What this changes

<!-- One or two sentences. Link the issue it closes: Closes #123 -->

## Why

<!-- What was wrong, or what could not be built before. -->

## Screenshots

<!--
For anything visual, show it in all four states the library promises:
light, dark, LTR and RTL. A single light-mode screenshot is not enough.
-->

| Light | Dark |
| ----- | ---- |
|       |      |

| LTR | RTL |
| --- | --- |
|     |     |

## Checklist

- [ ] A changeset is included (`pnpm changeset`) for every published package touched, or this change touches no published package.
- [ ] `pnpm build`, `pnpm test`, `pnpm typecheck`, `pnpm lint` and `pnpm format` pass locally.
- [ ] New or changed components follow [AGENTS.md](../AGENTS.md): semantic tokens only, logical properties, `data-slot`, `className` merged through `cn()` last.
- [ ] Every interactive element has an accessible name, a visible focus ring, and keyboard behaviour that comes from a Radix primitive where one exists.
- [ ] Tests cover render, the accessible name, and the main interaction.
- [ ] Anything removed or renamed follows [VERSIONING.md](../VERSIONING.md): deprecated first, never removed outside a major.
- [ ] `packages/ui/src/index.ts` was not edited by hand (it is generated).
