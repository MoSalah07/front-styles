import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/locales";
import type { Dictionary } from "./dictionaries/types";

/**
 * The site's own copy, one JSON file per language.
 *
 * Separate from `@design-eg/ui`'s catalogue on purpose: that one holds the
 * strings the *library* renders and ships to every consumer, this one holds the
 * strings this documentation site renders. Mixing them would push the docs
 * site's marketing copy into everybody else's bundle.
 *
 * The imports are dynamic so a request only ever parses the one language it is
 * serving.
 */
const DICTIONARIES: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./dictionaries/en.json").then((m) => m.default as Dictionary),
  ar: () => import("./dictionaries/ar.json").then((m) => m.default as Dictionary),
  fr: () => import("./dictionaries/fr.json").then((m) => m.default as Dictionary),
  hi: () => import("./dictionaries/hi.json").then((m) => m.default as Dictionary),
};

/**
 * The locale of the current request, read from the root `[lang]` segment.
 *
 * `next/root-params` is what saves every page and every nested helper from
 * threading `lang` down by hand. It only resolves in Server Components and
 * server-side utilities, which is also why this file needs no `server-only`
 * marker: importing it from a Client Component fails at build time already.
 */
export async function getLocale(): Promise<Locale> {
  const value = await lang();
  // A path such as /de/docs matches the segment but has no dictionary, so it is
  // a 404 rather than a page silently rendered in the wrong language.
  if (!value || !isLocale(value)) notFound();
  return value;
}

/** The copy for the current request. */
export async function getDictionary(): Promise<Dictionary> {
  return DICTIONARIES[await getLocale()]();
}

/**
 * The copy for an explicitly named locale.
 *
 * For the callers that cannot use `getLocale`: `generateImageMetadata` and
 * `generateStaticParams` run before the `[lang]` segment has been entered, so
 * `next/root-params` has nothing to resolve there and hands them `params`
 * instead. An unknown tag falls back to the default rather than 404ing, since
 * those functions describe a route rather than serve one.
 */
export async function dictionaryFor(locale: string): Promise<Dictionary> {
  return DICTIONARIES[isLocale(locale) ? locale : DEFAULT_LOCALE]();
}
