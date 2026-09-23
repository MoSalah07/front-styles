---
"@design-eg/cli": patch
---

Fix `add` writing to `src/src/components/ui` on projects that use a `src` root. `init` already resolves the prefix into the saved config, and `add` was deriving it a second time.
