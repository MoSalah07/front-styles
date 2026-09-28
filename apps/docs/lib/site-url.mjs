/**
 * The canonical origin, in plain ESM so that `scripts/gen-md.mjs` — which runs
 * under bare node before `next build` — writes the same absolute URLs the pages
 * render. `./site` re-exports it as `SITE.url`.
 *
 * Set `NEXT_PUBLIC_SITE_URL` in the hosting dashboard to move the site; it is
 * read from the real process environment, which both `next build` and the
 * generator see.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://design-eg.vercel.app";
