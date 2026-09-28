"use client";

/** Language and writing direction for the whole document: writes `lang` and `dir` on `<html>`, remembers the choice, and keeps every tab in step. */
import * as React from "react";

export type Direction = "ltr" | "rtl";

export interface LocaleOption {
  /** BCP 47 tag written to `<html lang>`, e.g. `en`, `ar`, `pt-BR`. */
  code: string;
  /** The language's name in itself — what a speaker of it scans the list for. */
  nativeName: string;
  /** The same name in English, shown as a second line for everyone else. */
  englishName?: string;
  /** Overrides the direction derived from `code`. */
  dir?: Direction;
}

/**
 * The four the library ships message catalogues, fonts and tests for. Pass your
 * own list to override; `useLocale` keeps working for any language, it simply
 * has no translated strings of its own beyond these.
 */
export const DEFAULT_LOCALES: readonly LocaleOption[] = [
  { code: "en", nativeName: "English", englishName: "English", dir: "ltr" },
  { code: "ar", nativeName: "العربية", englishName: "Arabic", dir: "rtl" },
  { code: "fr", nativeName: "Français", englishName: "French", dir: "ltr" },
  { code: "hi", nativeName: "हिन्दी", englishName: "Hindi", dir: "ltr" },
];

/** Shared with the pre-paint script, so the first frame and React never disagree. */
export const LOCALE_STORAGE_KEY = "design-eg:locale";

/**
 * Right-to-left primary language subtags. `Intl.Locale` can answer this in
 * newer engines but not in every browser the library supports, and the list of
 * RTL scripts is short enough to carry.
 */
const RTL_LANGUAGES = new Set([
  "ar",
  "arc",
  "ckb",
  "dv",
  "fa",
  "he",
  "khw",
  "ks",
  "ku",
  "ps",
  "sd",
  "syr",
  "ug",
  "ur",
  "yi",
]);

/** The direction a locale is written in, from its own `dir` or from its language subtag. */
export function directionOf(locale: LocaleOption | string): Direction {
  if (typeof locale !== "string") return locale.dir ?? directionOf(locale.code);
  const language = locale.toLowerCase().split(/[-_]/)[0] ?? "";
  return RTL_LANGUAGES.has(language) ? "rtl" : "ltr";
}

/**
 * Writes the locale onto `<html>`. Setting `lang` is what switches the Arabic
 * font stack and line-height in the base layer; setting `dir` is what every
 * logical property in the library mirrors against.
 */
export function applyLocale(locale: LocaleOption | string): Direction {
  const root = document.documentElement;
  const dir = directionOf(locale);
  root.lang = typeof locale === "string" ? locale : locale.code;
  root.dir = dir;
  return dir;
}

/** Same reason as use-theme: `storage` never fires in the tab that wrote it. */
const listeners = new Set<() => void>();

function emit() {
  for (const listener of [...listeners]) listener();
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function readLocale(storageKey: string, codes: string[], fallback: string): string {
  try {
    const saved = window.localStorage.getItem(storageKey);
    if (saved !== null && codes.includes(saved)) return saved;
  } catch {
    // Storage can be disabled outright; fall back to what the document says.
  }
  const current = document.documentElement.lang;
  return codes.includes(current) ? current : fallback;
}

export interface UseLocaleOptions {
  /** The languages to offer, in the order a picker should list them. */
  locales?: readonly LocaleOption[];
  /**
   * Controlled locale, which wins over the stored preference.
   *
   * For an app where the language is part of the URL — the usual shape in
   * Next.js — the route is the truth, and a stale stored value must not be
   * allowed to override the page that was actually served: the first client
   * render would otherwise flip `lang` and the font stack away from the markup
   * the server sent.
   */
  locale?: string;
  /** Used for the server render, and until the reader has chosen. Defaults to the first locale. */
  defaultLocale?: string;
  /** localStorage key holding the choice. Must match the pre-paint script's. */
  storageKey?: string;
}

export interface UseLocaleResult {
  /** The active BCP 47 tag. */
  locale: string;
  /** The full entry for `locale`, for rendering its name. */
  option: LocaleOption;
  locales: readonly LocaleOption[];
  /** The active direction, already applied to `<html dir>`. */
  dir: Direction;
  /** Ignores a code that is not in `locales`, so a stale value cannot strand the UI. */
  setLocale: (code: string) => void;
  /** False on the server and during hydration. See `useTheme` for why. */
  mounted: boolean;
}

/**
 * Reads and writes the document's language.
 *
 * Like `useTheme`, the document is the source of truth rather than a React
 * context, so this drops into any app. It deliberately does not touch routing
 * or message catalogues: wire the picker's `onLocaleChange` to your i18n
 * framework, and this keeps `lang`, `dir` and the stored preference correct
 * underneath it.
 */
export function useLocale(options: UseLocaleOptions = {}): UseLocaleResult {
  const {
    locales = DEFAULT_LOCALES,
    locale: controlledLocale,
    defaultLocale = locales[0]?.code ?? "en",
    storageKey = LOCALE_STORAGE_KEY,
  } = options;

  // `locales` is an inline literal at most call sites, so its identity changes
  // on every render. Deriving the codes as one string gives the snapshot a
  // dependency that only changes when the list really does.
  const codes = locales.map((locale) => locale.code).join(" ");
  const getSnapshot = React.useCallback(
    () => readLocale(storageKey, codes.split(" "), defaultLocale),
    [storageKey, codes, defaultLocale],
  );

  const stored = React.useSyncExternalStore(subscribe, getSnapshot, () => defaultLocale);
  const locale = controlledLocale ?? stored;
  const mounted = React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const option = locales.find((entry) => entry.code === locale) ??
    locales[0] ?? { code: locale, nativeName: locale };
  const dir = directionOf(option);

  // Mirrors applyLocale, but over the two primitives, so an inline `locales`
  // array cannot make this run on every render.
  React.useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.lang = locale;
    root.dir = dir;
  }, [mounted, locale, dir]);

  function setLocale(code: string) {
    const next = locales.find((entry) => entry.code === code);
    if (!next) return;
    try {
      window.localStorage.setItem(storageKey, next.code);
    } catch {
      // Nothing to do: the choice simply will not survive a reload.
    }
    applyLocale(next);
    emit();
  }

  return { locale, option, locales, dir, setLocale, mounted };
}
