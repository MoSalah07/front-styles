# OG card fonts

Four TrueType faces, vendored so the Open Graph images can be rendered at build
time without a network call.

| File                           | Family               | Script     | Used by |
| ------------------------------ | -------------------- | ---------- | ------- |
| `cairo-400.ttf`                | Cairo                | Arabic     | `/ar`   |
| `cairo-700.ttf`                | Cairo                | Arabic     | `/ar`   |
| `noto-sans-devanagari-400.ttf` | Noto Sans Devanagari | Devanagari | `/hi`   |
| `noto-sans-devanagari-700.ttf` | Noto Sans Devanagari | Devanagari | `/hi`   |

## Why they are here rather than fetched

`next/og` renders through satori, which ships one Latin face (Geist) and has no
font fallback of its own: text in a script it has no glyphs for comes out as
empty boxes. English and French cards are fine on the built-in face; Arabic and
Hindi are not.

The alternative is fetching from Google Fonts inside the image route, which
works but makes every build depend on the network. These files are ~600 KB in
total and make the build reproducible offline, which is the trade this project
already made elsewhere.

They are TrueType rather than woff2 because satori cannot read woff2.

## Licence

Both families are licensed under the **SIL Open Font License 1.1**, which
expressly permits bundling and redistribution alongside software.

- Cairo — Copyright 2009 The Cairo Project Authors, <https://github.com/Gue3bara/Cairo>
- Noto Sans Devanagari — Copyright 2022 The Noto Project Authors, <https://github.com/notofonts/devanagari>

Full licence text: <https://openfontlicense.org>

## Refreshing them

```bash
pnpm --filter docs fonts:og
```

`scripts/fetch-og-fonts.mjs` re-downloads all four and checks the magic bytes,
so a Google Fonts response that is not actually a font fails loudly instead of
being written to disk.
