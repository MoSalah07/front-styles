"use client";

/** Selects the message catalogue the library renders its own default strings from, and exposes locale-bound Intl formatters, so a page in Arabic, French or Hindi needs no per-component label props. */
import * as React from "react";
import {
  DEFAULT_LOCALE,
  formatMessage,
  getMessages,
  type MessageKey,
  type Messages,
  type MessageVars,
} from "./messages";
import { directionOf, type Direction } from "../hooks/use-locale";

export type { MessageKey, Messages, MessageVars };
export type { BuiltInLocale, MessageValue, PluralForms } from "./messages";
export { BUILT_IN_LOCALES, DEFAULT_LOCALE, MESSAGES, getMessages, hasMessages } from "./messages";
/**
 * The plural-and-interpolation primitive, exported so an application can run
 * its own catalogue through the same rules the library uses rather than
 * reaching for a second i18n implementation alongside this one.
 */
export { formatMessage, isPluralForms } from "./messages";

/** Looks a message up and returns it ready to render. */
export type TranslateFn = (key: MessageKey, vars?: MessageVars) => string;

export interface I18nContextValue {
  /** The active BCP 47 tag, e.g. `ar`, `fr-CA`. */
  locale: string;
  /** The resolved catalogue, including any `messages` override. */
  messages: Messages;
  t: TranslateFn;
  /** Writing direction of `locale`, for components that need it in JS. */
  dir: Direction;
}

/**
 * No provider means English.
 *
 * That default is what keeps this addition non-breaking: every component below
 * renders exactly the strings it rendered before unless something above it
 * asks for another language.
 */
const I18nContext = React.createContext<I18nContextValue | null>(null);

export interface I18nProviderProps {
  /** BCP 47 tag. Falls back to the language subtag, then to English. */
  locale?: string;
  /**
   * Overrides merged over the built-in catalogue, so an app can reword one
   * string — or add a language the library does not ship — without forking a
   * whole catalogue.
   */
  messages?: Partial<Messages>;
  children?: React.ReactNode;
}

/**
 * Provides the catalogue for `locale` to everything below it.
 *
 * Pairs with `useLocale`, which owns `<html lang>` and `<html dir>`: that hook
 * decides how the document is laid out and which font stack the base layer
 * picks, this provider decides which words are in it. They are separate on
 * purpose — an app already running next-intl can keep its own strings and use
 * `useLocale` alone, and neither half needs the other to work.
 */
function I18nProvider({ locale = DEFAULT_LOCALE, messages, children }: I18nProviderProps) {
  const value = React.useMemo<I18nContextValue>(() => {
    const base = getMessages(locale);
    // A new object only when there is actually an override to merge; otherwise
    // the catalogue is the shared frozen module object.
    const resolved = messages ? { ...base, ...messages } : base;

    return {
      locale,
      messages: resolved,
      dir: directionOf(locale),
      t: (key, vars) => formatMessage(resolved[key], locale, vars),
    };
  }, [locale, messages]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/** The English catalogue, built once, for every subtree with no provider. */
const fallback: I18nContextValue = {
  locale: DEFAULT_LOCALE,
  messages: getMessages(DEFAULT_LOCALE),
  dir: "ltr",
  t: (key, vars) => formatMessage(getMessages(DEFAULT_LOCALE)[key], DEFAULT_LOCALE, vars),
};

/** The active locale, its catalogue, its direction and `t`. */
export function useI18n(): I18nContextValue {
  return React.useContext(I18nContext) ?? fallback;
}

/**
 * Just the translate function, which is what a component almost always wants:
 *
 * ```tsx
 * const t = useT();
 * const closeLabel = closeLabelProp ?? t("dialog.close");
 * ```
 *
 * The prop stays ahead of the catalogue, so an explicit label always wins.
 */
export function useT(): TranslateFn {
  return useI18n().t;
}

/**
 * Translation for code that runs outside the React tree — `notify.copied()`
 * and any other imperative helper, which has no context to read from.
 *
 * Takes the language from `<html lang>`, kept current by `useLocale` or by the
 * route that rendered the document. That is only sound because these call
 * sites are browser-only by nature: a toast has nowhere to appear on a server,
 * so there is no shared-document hazard here of the kind a module-level locale
 * would create. Inside a component, use `useT` instead.
 */
export function translateStandalone(key: MessageKey, vars?: MessageVars): string {
  const locale =
    typeof document === "undefined"
      ? DEFAULT_LOCALE
      : document.documentElement.lang || DEFAULT_LOCALE;
  return formatMessage(getMessages(locale)[key], locale, vars);
}

export interface Formatters {
  number: Intl.NumberFormat;
  date: Intl.DateTimeFormat;
  time: Intl.DateTimeFormat;
  relativeTime: Intl.RelativeTimeFormat;
  list: Intl.ListFormat;
}

/**
 * `Intl` formatters bound to the active locale, so a figure in a stat card or
 * a date in a table follows the reader's language along with the words around
 * it. Memoised per locale, since constructing these is the expensive part.
 */
export function useFormatters(): Formatters {
  const { locale } = useI18n();

  return React.useMemo(
    () => ({
      number: new Intl.NumberFormat(locale),
      date: new Intl.DateTimeFormat(locale, { dateStyle: "medium" }),
      time: new Intl.DateTimeFormat(locale, { timeStyle: "short" }),
      relativeTime: new Intl.RelativeTimeFormat(locale, { numeric: "auto" }),
      list: new Intl.ListFormat(locale),
    }),
    [locale],
  );
}

export { I18nProvider };
