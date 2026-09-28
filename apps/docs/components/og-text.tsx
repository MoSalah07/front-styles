/**
 * Right-to-left text for the Open Graph cards.
 *
 * satori shapes Arabic correctly — the letters join — but it implements no part
 * of the bidi algorithm: it ignores `direction` and `textAlign` outright and
 * lays every word out left to right in logical order, which puts an Arabic
 * sentence backwards. A browser never has this problem, so this is only ever
 * needed for the rendered cards, never for the pages.
 *
 * What it does instead is let flexbox do the reordering. The text is split into
 * runs, and `row-reverse` with `wrap` fills them from the inline end towards
 * the start and wraps onto the next line — which is exactly right-to-left
 * paragraph flow. Line breaking stays satori's job, one run at a time.
 */

/** A run of Latin letters, digits or the punctuation that binds to them. */
const LATIN = /[A-Za-z0-9@./:+#%–—_-]+/g;

/** Splits one whitespace-delimited word at its script boundaries. */
function segments(word: string): string[] {
  const parts: string[] = [];
  let index = 0;

  for (const match of word.matchAll(LATIN)) {
    if (match.index > index) parts.push(word.slice(index, match.index));
    parts.push(match[0]);
    index = match.index + match[0].length;
  }
  if (index < word.length) parts.push(word.slice(index));

  return parts.length ? parts : [word];
}

/**
 * Whitespace-delimited words, each already split into its script runs.
 *
 * Adjacent Latin words are merged so a phrase like `Tailwind v4` stays in
 * reading order rather than being reversed into `v4 Tailwind`.
 */
function words(text: string): string[][] {
  const out: string[][] = [];

  for (const word of text.split(/\s+/).filter(Boolean)) {
    const parts = segments(word);
    const previous = out[out.length - 1];
    const allLatin = (list: string[]) =>
      list.every((part) => /^[A-Za-z0-9@./:+#%–—_-]+$/.test(part));

    if (previous && allLatin(previous) && allLatin(parts)) {
      previous[previous.length - 1] += ` ${parts.join("")}`;
    } else {
      out.push(parts);
    }
  }

  return out;
}

export interface OgRtlTextProps {
  children: string;
  /** Applied to the block: width, font size, colour, line height. */
  style?: Record<string, unknown>;
  /** Space between words. Scales with the font size at the call site. */
  wordGap?: number;
  /** Space between wrapped lines. */
  lineGap?: number;
}

export function OgRtlText({ children, style, wordGap = 10, lineGap = 6 }: OgRtlTextProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row-reverse",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        alignContent: "flex-start",
        columnGap: wordGap,
        rowGap: lineGap,
        ...style,
      }}
    >
      {words(children).map((parts, index) => (
        // One word. Its own runs reverse inside it with no gap, so a token like
        // `وTailwind` keeps the conjunction on the reading side of the name.
        <div key={index} style={{ display: "flex", flexDirection: "row-reverse" }}>
          {parts.map((part, part_index) => (
            <span key={part_index} style={{ display: "flex" }}>
              {part}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
