import next from "@design-eg/eslint-config/next";

/**
 * One flat config for the whole workspace.
 *
 * Flat config resolves relative to this file rather than to each package, so a
 * monorepo picks its rules by path instead of by dropping a config in every
 * folder. `next` already layers react on base, and every block inside it is
 * scoped by a `files` pattern — the JSX rules to `.tsx`, the App Router rules
 * to `app/`, which only `apps/docs` has — so one spread covers all three tiers
 * without this file having to know which package is which.
 *
 * ESLint is for correctness here, never for layout: `eslint-config-prettier`
 * is applied inside the base config and switches off everything Prettier owns.
 */
export default [
  ...next,

  {
    ignores: [
      "**/dist/**",
      "**/.next/**",
      "**/.turbo/**",
      "**/node_modules/**",
      "**/test-results/**",
      "**/playwright-report/**",
      // Generated: the barrel is written by scripts/gen-barrel.mjs, and the
      // catalogue is a snapshot of the built registry.
      "packages/ui/src/index.ts",
      "packages/mcp/src/catalogue.generated.json",
      "packages/tokens/dist/**",
      "apps/docs/public/**",
    ],
  },

  {
    /**
     * The docs examples are the demonstration, not production code: logging
     * what a submit handler receives is the point of showing a controlled
     * template, and `href="#"` is how a link is shown without navigating away
     * from the page the reader is reading.
     */
    files: ["apps/docs/content/examples/**/*.tsx"],
    rules: {
      "no-console": "off",
      "jsx-a11y/anchor-is-valid": "off",
    },
  },
];
