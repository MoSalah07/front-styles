/**
 * The shape of a message catalogue, and the pure function that turns one entry
 * into a finished string.
 *
 * Kept free of React and of any `"use client"` directive on purpose: a server
 * component, a route handler or a build script can import this and read the
 * catalogues directly, which a client module would not allow.
 */

/**
 * A message whose wording changes with a number.
 *
 * The keys are CLDR plural categories, and which ones a language actually uses
 * is decided by `Intl.PluralRules`, not by us: English uses `one` and `other`,
 * French adds `many`, Hindi uses the same two as English, and Arabic uses all
 * six. `other` is required because it is the only category every language has,
 * so it is always there to fall back to.
 */
export type PluralForms = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };

/** Either a fixed string, or the set of forms a count selects between. */
export type MessageValue = string | PluralForms;

/** Values substituted into `{placeholder}` slots. */
export type MessageVars = Record<string, string | number>;

const PLACEHOLDER = /\{(\w+)\}/g;

/**
 * `Intl` constructors are not cheap and these are called on every render, so
 * each locale's rules are built once. Nothing here is per-user state — the
 * cache is keyed by the locale tag alone — so it is safe to share across
 * requests on a server.
 */
const pluralRules = new Map<string, Intl.PluralRules>();
const numberFormats = new Map<string, Intl.NumberFormat>();

function pluralRulesFor(locale: string): Intl.PluralRules {
  let rules = pluralRules.get(locale);
  if (!rules) {
    rules = new Intl.PluralRules(locale);
    pluralRules.set(locale, rules);
  }
  return rules;
}

function numberFormatFor(locale: string): Intl.NumberFormat {
  let format = numberFormats.get(locale);
  if (!format) {
    format = new Intl.NumberFormat(locale);
    numberFormats.set(locale, format);
  }
  return format;
}

/** True when the entry is a set of plural forms rather than one fixed string. */
export function isPluralForms(value: MessageValue): value is PluralForms {
  return typeof value !== "string";
}

/**
 * Picks the plural form for `count` and substitutes every `{placeholder}`.
 *
 * Numbers go through `Intl.NumberFormat` for the locale, which decides the
 * digits. Worth knowing before picking a tag: CLDR gives bare `ar` the Latin
 * digits most Arabic interfaces use, while the regional tags default to
 * Arabic-Indic — `ar` formats 2 as "2", `ar-EG` as "٢". Either is one tag
 * away (`ar-u-nu-arab`, `ar-EG-u-nu-latn`), which is the standard way to ask
 * and needs no option of ours.
 *
 * A placeholder with no matching variable is left as written rather than
 * blanked: a visible `{name}` in the UI points at the missing variable, where
 * an empty gap just looks like a layout bug.
 */
export function formatMessage(value: MessageValue, locale: string, vars?: MessageVars): string {
  let template: string;

  if (isPluralForms(value)) {
    const count = Number(vars?.count ?? 0);
    const category = pluralRulesFor(locale).select(count);
    template = value[category] ?? value.other;
  } else {
    template = value;
  }

  if (!vars) return template;

  return template.replace(PLACEHOLDER, (whole, name: string) => {
    const replacement = vars[name];
    if (replacement === undefined) return whole;
    return typeof replacement === "number"
      ? numberFormatFor(locale).format(replacement)
      : replacement;
  });
}
