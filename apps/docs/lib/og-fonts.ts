import { readFileSync } from "node:fs";
import { join } from "node:path";
import { DEFAULT_LOCALE, isLocale, LOCALE_META, type Locale } from "./locales";

/**
 * Narrows the raw `params.lang` a metadata route is handed.
 *
 * These routes are Route Handlers, where `next/root-params` does not resolve,
 * so the tag arrives as a bare string and has to be checked here rather than
 * by `getLocale`. An unknown tag falls back instead of 404ing: a share card is
 * not worth failing a page over.
 */
export function localeOf(lang: string): Locale {
  return isLocale(lang) ? lang : DEFAULT_LOCALE;
}

/**
 * The font data the Open Graph cards are rendered with.
 *
 * `next/og` renders through satori, which ships one Latin face and has no
 * fallback chain: a glyph it does not have comes out as an empty box, so an
 * Arabic or Hindi card built on the default font is a rectangle of tofu. The
 * two script faces are vendored in `assets/fonts` — see the README there for
 * the licence and for why they are not fetched.
 *
 * Read from disk rather than imported, because these are binaries and the
 * routes that use them are all prerendered at build time.
 */

const FONT_DIR = join(process.cwd(), "assets", "fonts");

/** Cached per file: a card route renders once per locale, and the build reuses these. */
const cache = new Map<string, Buffer>();

function load(file: string): Buffer {
  let data = cache.get(file);
  if (!data) {
    data = readFileSync(join(FONT_DIR, file));
    cache.set(file, data);
  }
  return data;
}

/** Satori's font descriptor. Typed here so the routes need no import from next/og. */
export interface OgFont {
  name: string;
  data: Buffer;
  weight: 400 | 700;
  style: "normal";
}

/** Which vendored face each script needs. Latin uses satori's built-in Geist. */
const SCRIPT_FONTS: Partial<Record<Locale, { name: string; files: [string, string] }>> = {
  ar: { name: "Cairo", files: ["cairo-400.ttf", "cairo-700.ttf"] },
  hi: {
    name: "Noto Sans Devanagari",
    files: ["noto-sans-devanagari-400.ttf", "noto-sans-devanagari-700.ttf"],
  },
};

/**
 * The fonts to hand `ImageResponse` for a locale, or `undefined` for the Latin
 * ones — passing nothing is what makes satori use its own bundled face, which
 * is already the right answer for English and French.
 */
export function ogFonts(locale: Locale): OgFont[] | undefined {
  const script = SCRIPT_FONTS[locale];
  if (!script) return undefined;

  const [regular, bold] = script.files;
  return [
    { name: script.name, data: load(regular), weight: 400, style: "normal" },
    { name: script.name, data: load(bold), weight: 700, style: "normal" },
  ];
}

/** The `fontFamily` the card should ask for, matching `ogFonts`. */
export function ogFontFamily(locale: Locale): string | undefined {
  return SCRIPT_FONTS[locale]?.name;
}

/**
 * Typographic settings a card has to vary by script.
 *
 * Letter-spacing is the one that actually breaks something rather than just
 * looking wrong: Arabic is a joined script, and spacing the letters of a word
 * pulls the joins apart into disconnected glyphs. Devanagari hangs from a
 * shirorekha that the same treatment would cut into segments. So tracking is a
 * Latin-only effect here, and so is upper-casing, which neither script has.
 */
export function ogTypography(locale: Locale) {
  const latin = !SCRIPT_FONTS[locale];
  return {
    dir: LOCALE_META[locale].dir,
    fontFamily: ogFontFamily(locale),
    /** Tracking for the eyebrow, which is spaced out in Latin. */
    eyebrowTracking: latin ? 8 : 0,
    /** Negative tracking tightens a big Latin headline; it damages the others. */
    titleTracking: latin ? -2 : 0,
    uppercase: latin,
  };
}
