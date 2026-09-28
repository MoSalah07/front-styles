"use client";

/** Colour-mode state for the whole document: light, dark, or follow the system. Persists the choice, keeps every tab in step, and reacts when the OS preference flips. */
import * as React from "react";

/** What the reader picked. `system` keeps following the OS as it changes. */
export type Theme = "light" | "dark" | "system";

/** What is actually on screen once `system` has been resolved. */
export type ResolvedTheme = "light" | "dark";

/** The three choices, in the order a picker should list them. */
export const THEMES: readonly Theme[] = ["light", "dark", "system"];

/** Shared with the pre-paint script, so the first frame and React never disagree. */
export const THEME_STORAGE_KEY = "design-eg:theme";

const DARK_QUERY = "(prefers-color-scheme: dark)";

/**
 * `storage` only fires in *other* tabs, so a change made here needs its own
 * channel to reach the other hooks mounted on this page.
 */
const listeners = new Set<() => void>();

function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark" || value === "system";
}

function prefersDark(): boolean {
  return typeof window.matchMedia === "function" && window.matchMedia(DARK_QUERY).matches;
}

/** What `theme` means for the pixels on screen right now. */
export function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme !== "system") return theme;
  return prefersDark() ? "dark" : "light";
}

/**
 * Writes the mode onto `<html>`: the class and `data-theme` the token layer
 * selects on, `color-scheme` so scrollbars and native controls follow, and
 * `data-theme-choice` so a picker can tell "dark" from "system, which is dark".
 */
export function applyTheme(theme: Theme): ResolvedTheme {
  const root = document.documentElement;
  const resolved = resolveTheme(theme);
  root.classList.toggle("dark", resolved === "dark");
  root.classList.toggle("light", resolved === "light");
  root.dataset.theme = resolved;
  root.dataset.themeChoice = theme;
  root.style.colorScheme = resolved;
  return resolved;
}

function readTheme(storageKey: string): Theme {
  try {
    const saved = window.localStorage.getItem(storageKey);
    if (isTheme(saved)) return saved;
  } catch {
    // Storage can be disabled outright; fall back to what the document says.
  }
  const choice = document.documentElement.dataset.themeChoice;
  return isTheme(choice) ? choice : "system";
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  const media = typeof window.matchMedia === "function" ? window.matchMedia(DARK_QUERY) : null;
  media?.addEventListener?.("change", onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    media?.removeEventListener?.("change", onChange);
    window.removeEventListener("storage", onChange);
  };
}

function emit() {
  for (const listener of [...listeners]) listener();
}

export interface UseThemeOptions {
  /** Used for the server render, and until the reader has chosen. */
  defaultTheme?: Theme;
  /** localStorage key holding the choice. Must match the pre-paint script's. */
  storageKey?: string;
}

export interface UseThemeResult {
  /** The choice, which may be `system`. */
  theme: Theme;
  /** The choice with `system` resolved — always `light` or `dark`. */
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  /** Flips to whichever of light and dark is not currently showing. */
  toggleTheme: () => void;
  themes: readonly Theme[];
  /**
   * False on the server and during hydration. Render the neutral default while
   * it is false: reading storage during the first render makes the server and
   * the client disagree, and React throws the markup away.
   */
  mounted: boolean;
}

/**
 * Reads and writes the document's colour mode.
 *
 * The document is the single source of truth rather than a React context, so
 * this works in any app — with or without a provider, and alongside a pre-paint
 * script that has already set the class before React boots.
 */
export function useTheme(options: UseThemeOptions = {}): UseThemeResult {
  const { defaultTheme = "system", storageKey = THEME_STORAGE_KEY } = options;

  // Three separate stores rather than one object: each snapshot returns a
  // primitive, so useSyncExternalStore's identity check never loops.
  const theme = React.useSyncExternalStore(
    subscribe,
    () => readTheme(storageKey),
    () => defaultTheme,
  );
  const resolvedTheme = React.useSyncExternalStore(
    subscribe,
    () => resolveTheme(readTheme(storageKey)),
    () => (defaultTheme === "dark" ? "dark" : "light"),
  );
  const mounted = React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  // Keeps the document in step, including when `system` flips underneath us:
  // the choice is unchanged there, but the resolved mode is not.
  React.useEffect(() => {
    if (!mounted) return;
    applyTheme(theme);
  }, [mounted, theme, resolvedTheme]);

  const setTheme = React.useCallback(
    (next: Theme) => {
      try {
        window.localStorage.setItem(storageKey, next);
      } catch {
        // Nothing to do: the choice simply will not survive a reload.
      }
      applyTheme(next);
      emit();
    },
    [storageKey],
  );

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  return { theme, resolvedTheme, setTheme, toggleTheme, themes: THEMES, mounted };
}
