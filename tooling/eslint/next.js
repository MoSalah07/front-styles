import react from "./react.js";

/**
 * The React rules, adjusted for an App Router project.
 *
 * Deliberately built on the plugins this package already depends on rather than
 * on `@next/eslint-plugin-next`: that plugin's value is mostly rules about
 * `<img>`, `<a>` and `next/head`, and what it would cost here is another
 * dependency to keep in step with the framework. The Next-specific part that
 * actually bites is the file conventions, which is what this file encodes.
 */
export default [
  ...react,

  {
    ignores: ["**/.next/**", "**/next-env.d.ts"],
  },

  {
    // Route files: every `page`, `layout`, `route`, `error`, `loading`,
    // `not-found`, `sitemap`, `robots`, `manifest`, `opengraph-image` and
    // `twitter-image` must default-export, and metadata routes legitimately
    // export loose `generateStaticParams`/`generateMetadata` helpers too.
    files: ["**/app/**/*.{ts,tsx}", "**/proxy.ts", "**/middleware.ts"],
    rules: {
      "import/no-default-export": "off",
      // A route handler runs on the server; logging from one is normal.
      "no-console": "off",
    },
  },

  {
    // Client Components read browser globals; Server Components read node's.
    // Both are already allowed by the base config, so the only thing left to
    // say is that a React hook may not be called from a Server Component —
    // which the hooks plugin cannot see, and TypeScript catches instead when
    // the module has no "use client".
    files: ["**/app/**/*.tsx", "**/components/**/*.tsx"],
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];
