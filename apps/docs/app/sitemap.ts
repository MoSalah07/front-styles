import type { MetadataRoute } from "next";
import { DOCS_MD_ROUTES, DOCS_ROUTES } from "@/lib/registry";
import { DEFAULT_LOCALE, LOCALES } from "@/lib/locales";
import { SITE } from "@/lib/site";

/**
 * Every page in every language, each entry naming its translations.
 *
 * `alternates.languages` is how a search engine is told that `/ar/docs/button`
 * and `/fr/docs/button` are the same page rather than four thin duplicates
 * competing with each other, so it belongs on every row, not only the root.
 *
 * The Markdown twins and the two llms files are outside the locale tree: they
 * are the machine-readable surface, in English, at one canonical URL each.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const alternatesFor = (route: string) => ({
    languages: Object.fromEntries(
      LOCALES.map((locale) => [locale, `${SITE.url}/${locale}${route}`]),
    ),
  });

  const localised = LOCALES.flatMap((locale) => [
    {
      url: `${SITE.url}/${locale}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      // The default language is the one that should rank; the rest follow it.
      priority: locale === DEFAULT_LOCALE ? 1 : 0.9,
      alternates: alternatesFor(""),
    },
    ...DOCS_ROUTES.map((route) => ({
      url: `${SITE.url}/${locale}${route}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      // The two hubs outrank the individual item pages.
      priority:
        (route === "/docs" || route === "/docs/templates" ? 0.9 : 0.7) *
        (locale === DEFAULT_LOCALE ? 1 : 0.9),
      alternates: alternatesFor(route),
    })),
  ]);

  return [
    ...localised,
    ...DOCS_MD_ROUTES.map((route) => ({
      url: `${SITE.url}${route}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.4,
    })),
    { url: `${SITE.url}/llms.txt`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    {
      url: `${SITE.url}/llms-full.txt`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];
}
