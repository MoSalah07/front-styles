import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import globals from "globals";

/**
 * The rules every package in the monorepo shares.
 *
 * Flat config, exported as an array so a package composes it with spread:
 *
 * ```js
 * import base from "@design-eg/eslint-config";
 * export default [...base, { rules: { ... } }];
 * ```
 *
 * `eslint-config-prettier` is last on purpose: it switches off every stylistic
 * rule that would otherwise argue with Prettier, which is what actually formats
 * this repo. ESLint here is for correctness, never for layout.
 */
export default [
  {
    // Build output and generated files. `src/index.ts` is written by
    // scripts/gen-barrel.mjs, and linting a generated file only ever produces
    // complaints nobody can act on.
    ignores: [
      "**/dist/**",
      "**/.next/**",
      "**/.turbo/**",
      "**/node_modules/**",
      "**/coverage/**",
      "packages/ui/src/index.ts",
      "apps/docs/public/**",
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      // An unused import is dead weight; an unused argument often is not, so
      // the usual underscore escape hatch applies to arguments and catches.
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      // `any` defeats the point of shipping types from a library, but it is a
      // warning rather than an error so it never blocks a work-in-progress.
      "@typescript-eslint/no-explicit-any": "warn",
      // Type-only imports are erased at build time; mixing them into value
      // imports keeps modules alive in the output that need not be.
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      eqeqeq: ["error", "always", { null: "ignore" }],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      // The French catalogues carry U+202F and U+00A0 deliberately — they are
      // the spaces French typography requires before `? ! ; :` — and the same
      // characters appear in the comments and regexes that describe them. The
      // rule still guards code, where an invisible space really is a bug.
      "no-irregular-whitespace": [
        "error",
        { skipStrings: true, skipComments: true, skipTemplates: true, skipRegExps: true },
      ],
    },
  },

  {
    // Anything whose output *is* its output: build scripts, config files, the
    // linters, and the CLI — a command-line tool that printed nothing would be
    // broken. `no-console` is aimed at a stray log left in a component.
    files: [
      "**/*.config.{js,mjs,ts}",
      "**/scripts/**",
      "**/tooling/**",
      "**/build.mjs",
      "**/packages/cli/src/**",
      "**/packages/mcp/src/**",
    ],
    languageOptions: { globals: globals.node },
    rules: { "no-console": "off" },
  },

  {
    files: ["**/*.test.{ts,tsx}", "**/test/**"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      // A declaration merge has to repeat the library's type parameters
      // verbatim, including the ones it does not use, or TypeScript rejects
      // the merge outright rather than adding to it.
      "@typescript-eslint/no-unused-vars": [
        "error",
        { args: "after-used", argsIgnorePattern: "^_", ignoreRestSiblings: true },
      ],
    },
  },

  prettier,
];
