"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { LanguageSelect } from "@design-eg/ui";
import { LOCALES, LOCALE_META, isLocale, localisePath, type Locale } from "@/lib/locales";

/** The picker's list, built from the site's locale model rather than restated. */
const PICKER_LOCALES = LOCALES.map((code) => ({
  code,
  nativeName: LOCALE_META[code].nativeName,
  englishName: LOCALE_META[code].englishName,
  dir: LOCALE_META[code].dir,
}));

/**
 * The route's locale, and a way to move to the same page in another language.
 *
 * `/ar/docs/button` picking French gives `/fr/docs/button`: the reader stays on
 * the page they were reading, which is the whole point of putting the locale in
 * the first segment.
 */
export function useRouteLocale() {
  const pathname = usePathname();
  const router = useRouter();

  const segment = pathname.split("/")[1] ?? "";
  const locale: Locale = isLocale(segment) ? segment : "en";

  const goTo = React.useCallback(
    (code: string) => {
      if (isLocale(code)) router.push(localisePath(pathname, code));
    },
    [pathname, router],
  );

  return { locale, goTo };
}

export type LanguageSwitchProps = Omit<
  React.ComponentProps<typeof LanguageSelect>,
  "locale" | "locales" | "onLocaleChange"
>;

/**
 * `LanguageSelect` wired to the router.
 *
 * The language is a route segment here, not a stored preference, so the picker
 * navigates instead of only rewriting `<html lang>` — and it is given the
 * route's locale as its controlled value, so a stale stored choice can never
 * contradict the page that was actually served.
 */
export function LanguageSwitch(props: LanguageSwitchProps) {
  const { locale, goTo } = useRouteLocale();

  return (
    <LanguageSelect
      {...props}
      locale={locale}
      locales={PICKER_LOCALES}
      onLocaleChange={(next) => goTo(next.code)}
    />
  );
}
