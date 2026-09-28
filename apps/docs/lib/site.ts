import { SITE_URL } from "./site-url.mjs";

export const SITE = {
  name: "design-eg",
  tagline: "A cinematic, RTL-first React design system.",
  description:
    "design-eg is an open-source React design system: contrast-checked design tokens, accessible Radix + Tailwind v4 components, ready-made blocks and page templates, plus a CLI that copies the source into your project.",
  url: SITE_URL,
  github: "https://github.com/design-eg/design-eg",
  npm: "https://www.npmjs.com/org/design-eg",
  locale: "en",
  keywords: [
    "react design system",
    "tailwind v4 components",
    "radix ui",
    "shadcn registry",
    "rtl components",
    "arabic ui kit",
    "design tokens",
    "dark mode",
  ],
} as const;
