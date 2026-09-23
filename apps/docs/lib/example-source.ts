import fs from "node:fs";
import path from "node:path";

const EXAMPLES_DIR = path.join(process.cwd(), "content", "examples");

/**
 * Reads an example module's own source at build time so the code block on a
 * docs page can never drift from the preview above it.
 */
export function getExampleSource(name: string): string | null {
  try {
    return fs.readFileSync(path.join(EXAMPLES_DIR, `${name}.tsx`), "utf8").trimEnd();
  } catch {
    return null;
  }
}
