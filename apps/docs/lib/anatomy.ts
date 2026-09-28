/**
 * Types for the hand-written anatomy and prop notes, and the typed entry point
 * the docs app uses. The data itself lives in `./item-notes.mjs` so that
 * `scripts/gen-md.mjs`, which runs under bare node before `next build`, reads
 * exactly the same notes the pages render.
 */

export interface PropNote {
  name: string;
  type: string;
  defaultValue?: string;
  description: string;
}

export interface ItemNotes {
  /** Exported parts, in composition order. */
  anatomy?: string[];
  props?: PropNote[];
  /** Extra guidance rendered under the props table. */
  notes?: string[];
}

export { exportName, getItemNotes, ITEM_NOTES } from "./item-notes.mjs";
export { localiseItemNotes } from "./item-notes-i18n.mjs";
