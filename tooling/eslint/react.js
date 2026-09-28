import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import base from "./base.js";

/**
 * The base rules plus the ones that only make sense where JSX is.
 *
 * The accessibility plugin is the part that earns its place here: a component
 * library whose own docs site ships inaccessible markup is not credible, and
 * `packages/ui` already enforces the same contract through axe at test time.
 * This catches the same class of mistake a whole test run earlier.
 */
export default [
  ...base,

  {
    files: ["**/*.{jsx,tsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
    },
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: "detect" } },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,

      // React 19 with the automatic runtime: no React import, no scope check.
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      // Types come from TypeScript, so runtime propTypes are noise.
      "react/prop-types": "off",

      // The library is RTL-first, and these are the two rules that keep a
      // hardcoded direction out of the markup the way the token linter keeps
      // one out of the classes.
      "jsx-a11y/no-autofocus": ["warn", { ignoreNonDOM: true }],
      "jsx-a11y/anchor-is-valid": [
        "error",
        // next/link renders the anchor, so the href lives on the Link.
        { components: ["Link"], specialLink: ["hrefLeft", "hrefRight"] },
      ],
    },
  },

  {
    /**
     * A component library's primitives take their children through a props
     * spread, so the content rules cannot see what will be inside a heading or
     * an anchor and flag every wrapper as empty. Turning them off here is not
     * giving up the check: `a11y.test.tsx` runs axe over the rendered output,
     * which sees the real tree rather than the definition.
     */
    files: ["**/packages/ui/src/**/*.tsx", "**/components/**/*.tsx"],
    rules: {
      "jsx-a11y/heading-has-content": "off",
      "jsx-a11y/anchor-has-content": "off",
    },
  },

  {
    /**
     * Test fixtures hold JSX in arrays so a table-driven test can render each
     * one on its own. They are values, not a rendered list, so a key would do
     * nothing.
     */
    files: ["**/*.test.tsx"],
    rules: { "react/jsx-key": "off" },
  },
];
