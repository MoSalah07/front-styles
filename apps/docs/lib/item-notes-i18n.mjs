import { AR } from "./item-notes-ar.mjs";
import { FR } from "./item-notes-fr.mjs";
import { HI } from "./item-notes-hi.mjs";

/**
 * Overlays the translated prop descriptions and notes onto the English source.
 *
 * Plain ESM with JSDoc types, like `item-notes.mjs` next to it, because
 * `scripts/gen-md.mjs` runs under bare node before `next build` and has to read
 * exactly what the pages render.
 *
 * @typedef {import("./anatomy").ItemNotes} ItemNotes
 */

/** @type {Record<string, Record<string, string>>} */
const TRANSLATIONS = { ar: AR, fr: FR, hi: HI };

/**
 * A translated string for `<item>.<prop>`, falling back to `*.<prop>` for a
 * prop that repeats across items — `className` is on nearly every one — and
 * then to `undefined`, which leaves the English in place.
 *
 * Falling back rather than failing is the point: a key that has not been
 * translated yet shows the English sentence, which a reader can still use. An
 * empty cell in a props table teaches nothing.
 */
function lookup(table, item, key) {
  return table[`${item}.${key}`] ?? table[`*.${key}`];
}

/**
 * The notes for one registry item, in `locale`.
 *
 * Returns the English object unchanged for English and for any language with
 * no table, so the common path allocates nothing.
 *
 * @param {ItemNotes | undefined} notes
 * @param {string} locale
 * @returns {ItemNotes | undefined}
 */
export function localiseItemNotes(notes, item, locale) {
  const table = TRANSLATIONS[locale];
  if (!notes || !table) return notes;

  return {
    ...notes,
    // `anatomy` is a list of exported component names — Dialog, DialogTrigger —
    // so it is code, and stays as it is in every language.
    props: notes.props?.map((prop) => {
      const description = lookup(table, item, prop.name);
      return description ? { ...prop, description } : prop;
    }),
    notes: notes.notes?.map((line, index) => table[`${item}.notes.${index}`] ?? line),
  };
}

/** The languages with a notes table, for a build-time completeness check. */
export const TRANSLATED_LOCALES = Object.keys(TRANSLATIONS);

export { TRANSLATIONS as ITEM_NOTE_TRANSLATIONS };
