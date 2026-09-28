import type { MetadataRoute } from "next";
import { DEFAULT_LOCALE, LOCALE_META } from "@/lib/locales";
import { SITE } from "@/lib/site";

/**
 * The web app manifest, served at `/manifest.webmanifest`.
 *
 * The colours are the compiled dark crimson surfaces (`--background` is
 * `#141414`), so an installed window opens on the same near-black the site
 * paints rather than flashing white first.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: `${SITE.name}: ${SITE.tagline}`,
    short_name: SITE.name,
    description: SITE.description,
    start_url: `/${DEFAULT_LOCALE}`,
    scope: "/",
    display: "standalone",
    orientation: "any",
    lang: DEFAULT_LOCALE,
    dir: LOCALE_META[DEFAULT_LOCALE].dir,
    background_color: "#141414",
    theme_color: "#141414",
    categories: ["developer", "development", "education"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/favicon.ico", sizes: "16x16 32x32 48x48", type: "image/x-icon" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      { name: "Components", short_name: "Components", url: `/${DEFAULT_LOCALE}/docs` },
      {
        name: "Template gallery",
        short_name: "Templates",
        url: `/${DEFAULT_LOCALE}/docs/templates`,
      },
    ],
  };
}
