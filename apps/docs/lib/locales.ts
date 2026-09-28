/**
 * The locale model for the site: which languages exist, how each one is
 * written, and how to get from an incoming request to one of them.
 *
 * Plain TypeScript with no React and no `server-only`, because every layer
 * needs it — the proxy, the root layout, the sitemap, the metadata exports and
 * the client-side language picker alike.
 */

export const LOCALES = ["en", "ar", "fr", "hi"] as const;

export type Locale = (typeof LOCALES)[number];

/** English is the default: it is what `/` falls back to and what `x-default` points at. */
export const DEFAULT_LOCALE: Locale = "en";

export interface LocaleMeta {
  /** The language in itself, which is what a reader scans the picker for. */
  nativeName: string;
  /** The same name in English, as a second line for everyone else. */
  englishName: string;
  dir: "ltr" | "rtl";
  /** Full tag for `og:locale` and `hreflang`, where a region is expected. */
  ogLocale: string;
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  en: { nativeName: "English", englishName: "English", dir: "ltr", ogLocale: "en_US" },
  ar: { nativeName: "العربية", englishName: "Arabic", dir: "rtl", ogLocale: "ar_EG" },
  fr: { nativeName: "Français", englishName: "French", dir: "ltr", ogLocale: "fr_FR" },
  hi: { nativeName: "हिन्दी", englishName: "Hindi", dir: "ltr", ogLocale: "hi_IN" },
};

/** Narrows a route parameter, which arrives as a bare `string`, to a real locale. */
export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function dirOf(locale: Locale): "ltr" | "rtl" {
  return LOCALE_META[locale].dir;
}

/**
 * Picks a locale from an `Accept-Language` header.
 *
 * Hand-written rather than pulled from `negotiator` and
 * `@formatjs/intl-localematcher`, which is what the Next.js guide reaches for:
 * this project does not add dependencies, and the whole of the algorithm we
 * need is "sort by q, match on the language subtag".
 *
 * Region is deliberately ignored, since the site has one variant per language:
 * `fr-CA`, `fr-BE` and `fr` all want the French pages.
 */
export function negotiateLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;

  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag = "", ...params] = part.trim().split(";");
      const q = params
        .map((p) => p.trim())
        .find((p) => p.startsWith("q="))
        ?.slice(2);
      const quality = q === undefined ? 1 : Number.parseFloat(q);
      return {
        language: tag.trim().toLowerCase().split("-")[0] ?? "",
        // A malformed q is treated as 0 rather than NaN, which would sort wrong.
        quality: Number.isFinite(quality) ? quality : 0,
      };
    })
    // A q of 0 means "explicitly not this one", so it never wins.
    .filter((entry) => entry.quality > 0)
    .sort((a, b) => b.quality - a.quality);

  for (const { language } of ranked) {
    if (isLocale(language)) return language;
  }
  return DEFAULT_LOCALE;
}

/**
 * The `hreflang` map for one locale-free path, plus `x-default`.
 *
 * Needed on every page rather than only on the layout: Next replaces the
 * `alternates` object wholesale when a page declares one of its own, so a page
 * that sets its own `canonical` silently drops the layout's language map — and
 * the docs pages, which are the ones worth translating, are exactly the pages
 * that set a canonical.
 */
export function languageAlternates(path: string): Record<string, string> {
  return {
    ...Object.fromEntries(LOCALES.map((locale) => [locale, `/${locale}${path}`])),
    "x-default": `/${DEFAULT_LOCALE}${path}`,
  };
}

/**
 * Swaps the locale segment of a path, keeping the reader where they were:
 * `/ar/docs/button` with `fr` gives `/fr/docs/button`.
 */
export function localisePath(pathname: string, locale: Locale): string {
  const segments = pathname.split("/");
  // segments[0] is the empty string before the leading slash.
  if (segments.length > 1 && isLocale(segments[1] ?? "")) {
    segments[1] = locale;
    return segments.join("/");
  }
  return `/${locale}${pathname === "/" ? "" : pathname}`;
}
