import { NextResponse, type NextRequest } from "next/server";
import { LOCALES, negotiateLocale } from "@/lib/locales";

/**
 * Sends every un-prefixed request to a locale.
 *
 * Every language carries its prefix, including the default: `/docs/button` has
 * no canonical form of its own, it redirects to `/en/docs/button`. Prefixing
 * only the non-default language is the other common shape, but it gives the
 * default locale a second URL for every page and makes `hreflang` and the
 * sitemap describe something other than what is served.
 *
 * In Next 16 this file is `proxy.ts`; it was `middleware.ts` before.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const prefixed = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (prefixed) return NextResponse.next();

  const locale = negotiateLocale(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  /**
   * Skips Next internals and everything served from `public/`, which is matched
   * by the file extension rather than by name: the registry JSON under `/r/`,
   * the generated Markdown twins under `/docs/*.md`, and the icons all live
   * there and must not be sent to a locale.
   */
  matcher: [
    "/((?!_next|llms\\.txt|llms-full\\.txt|robots\\.txt|sitemap\\.xml|manifest\\.webmanifest|.*\\.[^/]+$).*)",
  ],
};
