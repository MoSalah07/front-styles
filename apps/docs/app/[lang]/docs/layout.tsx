import Link from "next/link";
import { Separator } from "@design-eg/ui";
import { BrandLogo } from "@/components/brand-logo";
import { DocsMobileNav, DocsSidebarNav } from "@/components/docs-nav";
import { GithubMark } from "@/components/icons";
import { PlaygroundControls } from "@/components/playground-controls";
import { NAV_GROUPS, REGISTRY_ITEMS } from "@/lib/registry";
import { SITE } from "@/lib/site";
import { formatMessage } from "@design-eg/ui";
import { getDictionary, getLocale } from "../dictionaries";

/**
 * Docs shell: a sticky header that carries the playground controls, so any page
 * can be read in any theme, brand, direction and density; a sidebar listing
 * every registry item by category; and the content column.
 *
 * The header is two rows tall (`--header-h` plus a 3.5rem control strip), which
 * is what the sticky offsets below are calculated from.
 */
export default async function DocsLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const { nav, groups, playground } = await getDictionary();
  const navProps = { groups: NAV_GROUPS, nav, groupLabels: groups, locale };

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-(--z-sticky) border-b glass">
        <div className="mx-auto flex h-(--header-h) max-w-(--container-wide) items-center gap-2 px-(--gutter)">
          <DocsMobileNav {...navProps} />
          <Link
            href={`/${locale}`}
            className="flex items-center rounded-control outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <BrandLogo className="h-6 w-auto" />
          </Link>
          <span aria-hidden="true" className="text-muted-foreground">
            /
          </span>
          <Link href={`/${locale}/docs`} className="text-sm font-medium">
            {nav.docs}
          </Link>
          <nav aria-label={nav.secondary} className="ms-auto flex items-center gap-4 text-sm">
            <span className="hidden text-muted-foreground sm:inline">
              {formatMessage(nav.itemCount, locale, { count: REGISTRY_ITEMS.length })}
            </span>
            <a
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
              href={SITE.github}
              rel="noopener"
            >
              <GithubMark className="size-4" />
              <span className="sr-only sm:not-sr-only">GitHub</span>
            </a>
          </nav>
        </div>
        <Separator />
        <div className="mx-auto flex h-14 max-w-(--container-wide) items-center overflow-x-auto px-(--gutter)">
          <PlaygroundControls copy={playground} />
        </div>
      </header>

      <div className="mx-auto flex max-w-(--container-wide) gap-8 px-(--gutter)">
        <aside className="sticky top-[calc(var(--header-h)+3.5rem)] hidden h-[calc(100dvh-var(--header-h)-3.5rem)] w-60 shrink-0 pt-8 lg:block">
          <DocsSidebarNav {...navProps} />
        </aside>
        <main className="min-w-0 flex-1 py-10">{children}</main>
      </div>

      <footer className="border-t">
        <div className="mx-auto flex max-w-(--container-wide) flex-wrap items-center justify-between gap-4 px-(--gutter) py-8 text-sm text-muted-foreground">
          <p>{SITE.name} · MIT License</p>
          <p className="flex gap-4">
            <a className="underline-offset-4 hover:underline" href="/llms.txt">
              llms.txt
            </a>
            <a className="underline-offset-4 hover:underline" href="/llms-full.txt">
              llms-full.txt
            </a>
            <a className="underline-offset-4 hover:underline" href="/r/registry.json">
              registry.json
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
