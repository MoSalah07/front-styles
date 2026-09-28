/**
 * The built-in catalogues and the lookup that picks one for a locale.
 *
 * Deliberately not a client module. `I18nProvider` and the hooks next door are
 * `"use client"`, and a plain function exported from a client module cannot be
 * called on the server at all. Keeping the catalogues here means a server
 * component, a route handler, a metadata export or a build script can read
 * them directly — `getMessages("ar")["dialog.close"]` works anywhere.
 */
import { en, type MessageKey, type Messages } from "./en";
import { ar } from "./ar";
import { fr } from "./fr";
import { hi } from "./hi";

export type { MessageKey, Messages };
export type { MessageValue, MessageVars, PluralForms } from "./types";
export { formatMessage, isPluralForms } from "./types";
export { en, ar, fr, hi };

/** Every language the library ships strings for, keyed by language subtag. */
export const MESSAGES = { en, ar, fr, hi } as const;

/** The subtags `MESSAGES` covers. A locale outside this set falls back to `en`. */
export type BuiltInLocale = keyof typeof MESSAGES;

export const BUILT_IN_LOCALES = Object.keys(MESSAGES) as BuiltInLocale[];

/** The catalogue used when a locale has none of its own. */
export const DEFAULT_LOCALE: BuiltInLocale = "en";

/** Narrows a free-form tag to one of the shipped catalogues. */
export function hasMessages(locale: string): locale is BuiltInLocale {
  return locale in MESSAGES;
}

/**
 * The catalogue for a locale.
 *
 * Matches the full tag first and then the language subtag, so `fr-CA` and
 * `ar-EG` land on French and Arabic rather than silently falling back to
 * English. Anything with no catalogue at all returns English, because a page
 * in the wrong language still reads; a page of missing-key placeholders does
 * not.
 */
export function getMessages(locale: string): Messages {
  if (hasMessages(locale)) return MESSAGES[locale];
  const language = locale.toLowerCase().split(/[-_]/)[0] ?? "";
  return hasMessages(language) ? MESSAGES[language] : MESSAGES[DEFAULT_LOCALE];
}
