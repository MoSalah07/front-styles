"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutTemplate, Menu } from "lucide-react";
import {
  Button,
  ScrollArea,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@design-eg/ui";
import { cn } from "@design-eg/ui/cn";
import { BrandLogo } from "@/components/brand-logo";
import type { NavGroup } from "@/lib/registry";
import type { Locale } from "@/lib/locales";
import type { Dictionary } from "@/app/[lang]/dictionaries/types";

/**
 * The nav is a Client Component, so its copy is handed down as plain strings
 * from the server rather than read from a dictionary here — a JSON import would
 * put all four languages in the browser bundle.
 */
export interface DocsNavProps {
  groups: NavGroup[];
  nav: Dictionary["nav"];
  /** Group headings, keyed by the English name `lib/registry.ts` assigns. */
  groupLabels: Dictionary["groups"];
  locale: Locale;
}

const LINK_BASE =
  "block truncate rounded-control px-3 py-1.5 text-sm transition-colors duration-(--duration-fast) ease-standard outline-none focus-visible:ring-2 focus-visible:ring-ring";

function NavLink({
  href,
  children,
  active,
  onNavigate,
}: {
  href: string;
  children: React.ReactNode;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        LINK_BASE,
        active
          ? "bg-accent font-medium text-accent-foreground"
          : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}

/** The link list itself, shared by the desktop rail and the mobile sheet. */
function NavTree({
  groups,
  nav,
  groupLabels,
  locale,
  onNavigate,
}: DocsNavProps & { onNavigate?: () => void }) {
  const pathname = usePathname();

  // Registry hrefs are locale-free (`/docs/button`) because that is the shape
  // the sitemap and the Markdown twins share; the prefix goes on at render.
  const href = (path: string) => `/${locale}${path}`;
  const isCurrent = (path: string) => pathname === href(path);

  return (
    <nav aria-label={nav.documentation} className="space-y-6 pb-10">
      <div className="space-y-1">
        <NavLink href={href("/docs")} active={isCurrent("/docs")} onNavigate={onNavigate}>
          {nav.overview}
        </NavLink>
        <NavLink
          href={href("/docs/templates")}
          active={isCurrent("/docs/templates")}
          onNavigate={onNavigate}
        >
          <span className="inline-flex items-center gap-2">
            <LayoutTemplate className="size-3.5" /> {nav.templateGallery}
          </span>
        </NavLink>
      </div>

      {groups.map((group) => (
        <div key={group.id} className="space-y-1">
          <h2 className="px-3 text-eyebrow font-semibold text-muted-foreground uppercase">
            {groupLabels[group.label as keyof typeof groupLabels] ?? group.label}
            <span className="ms-2 font-normal opacity-60">{group.items.length}</span>
          </h2>
          {group.items.map((item) => (
            <NavLink
              key={item.name}
              href={href(item.href)}
              active={isCurrent(item.href)}
              onNavigate={onNavigate}
            >
              {item.title}
            </NavLink>
          ))}
        </div>
      ))}
    </nav>
  );
}

/** Desktop rail. Hidden below `lg`, where the sheet takes over. */
export function DocsSidebarNav(props: DocsNavProps) {
  return (
    <ScrollArea className="h-[calc(100dvh-var(--header-h)-3.5rem)]" viewportClassName="pe-2">
      <NavTree {...props} />
    </ScrollArea>
  );
}

/** Mobile trigger plus the same tree inside a sheet. Hidden from `lg` up. */
export function DocsMobileNav(props: DocsNavProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="lg:hidden"
          aria-label={props.nav.openMenu}
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="start" className="w-80 max-w-[85vw]">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <BrandLogo className="h-6 w-auto" label={`${props.nav.documentation} — design-eg`} />
          </SheetTitle>
          <SheetDescription>{props.nav.menuDescription}</SheetDescription>
        </SheetHeader>
        <ScrollArea className="min-h-0 flex-1">
          <NavTree {...props} onNavigate={() => setOpen(false)} />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
