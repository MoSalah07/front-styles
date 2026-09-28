/**
 * Fails when a prop description or a note has been added, renamed or removed in
 * `lib/item-notes.mjs` without the translations following.
 *
 * Worth a gate of its own because the failure is silent otherwise: a missing
 * key falls back to English, which is the right behaviour at runtime and
 * exactly why nobody would notice a whole new component arriving untranslated.
 */
import { ITEM_NOTES } from "../lib/item-notes.mjs";
import { ITEM_NOTE_TRANSLATIONS, TRANSLATED_LOCALES } from "../lib/item-notes-i18n.mjs";

const needed = new Set();
for (const [item, notes] of Object.entries(ITEM_NOTES)) {
  for (const prop of notes.props ?? []) {
    // `className` is on nearly every item and is translated once, under `*`.
    needed.add(prop.name === "className" ? "*.className" : `${item}.${prop.name}`);
  }
  (notes.notes ?? []).forEach((_, index) => needed.add(`${item}.notes.${index}`));
}

let failed = false;

for (const locale of TRANSLATED_LOCALES) {
  const table = ITEM_NOTE_TRANSLATIONS[locale];
  const missing = [...needed].filter((key) => !(key in table));
  // A stale key is a description that moved or a component that was removed:
  // harmless at runtime, but it means the two files have drifted apart.
  const stale = Object.keys(table).filter((key) => !needed.has(key));

  if (missing.length || stale.length) {
    failed = true;
    console.error(`${locale}:`);
    if (missing.length) console.error(`  untranslated: ${missing.join(", ")}`);
    if (stale.length) console.error(`  no longer used: ${stale.join(", ")}`);
  }
}

if (failed) {
  console.error("\nnotes i18n: out of step with lib/item-notes.mjs");
  process.exit(1);
}

console.log(`notes i18n: ${needed.size} keys covered in ${TRANSLATED_LOCALES.join(", ")} — OK`);
