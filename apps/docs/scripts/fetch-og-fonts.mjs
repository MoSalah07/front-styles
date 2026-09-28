/**
 * Vendors the two script fonts the OG cards need.
 *
 * Google Fonts serves woff2 to a modern browser and TrueType to an old one, and
 * satori can only read the latter — hence the ancient user agent. The TTF comes
 * back from an extensionless /l/font url, so the file is validated by its magic
 * bytes rather than by its extension.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const out = resolve("apps/docs/assets/fonts");
mkdirSync(out, { recursive: true });

// Google Fonts picks the format from the user agent: a modern one gets woff2,
// MSIE gets EOT, and this one gets plain TrueType, which is the only format
// satori can parse.
const LEGACY_UA = {
  "User-Agent":
    "Mozilla/5.0 (Linux; U; Android 2.3.7; en-us; Nexus One Build/FRF91) AppleWebKit/533.1",
};

const FAMILIES = [
  { file: "cairo-400.ttf", query: "Cairo:wght@400" },
  { file: "cairo-700.ttf", query: "Cairo:wght@700" },
  { file: "noto-sans-devanagari-400.ttf", query: "Noto+Sans+Devanagari:wght@400" },
  { file: "noto-sans-devanagari-700.ttf", query: "Noto+Sans+Devanagari:wght@700" },
];

/** sfnt magic numbers: TrueType, legacy Apple TrueType, CFF/OpenType, collection. */
const MAGIC = new Set([0x00010000, 0x74727565, 0x4f54544f, 0x74746366]);

for (const { file, query } of FAMILIES) {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${query}&display=swap`;
  const css = await (await fetch(cssUrl, { headers: LEGACY_UA })).text();

  const match = css.match(/url\((https:[^)]+)\)/);
  if (!match) {
    console.error(`${file}: no font url in the stylesheet`);
    console.error(css.slice(0, 400));
    process.exit(1);
  }

  const bytes = Buffer.from(await (await fetch(match[1], { headers: LEGACY_UA })).arrayBuffer());
  const magic = bytes.readUInt32BE(0);
  if (!MAGIC.has(magic)) {
    console.error(`${file}: not a font (magic 0x${magic.toString(16)}, ${bytes.length} bytes)`);
    process.exit(1);
  }

  writeFileSync(resolve(out, file), bytes);
  console.log(`${file}  ${(bytes.length / 1024).toFixed(0)} KB`);
}
