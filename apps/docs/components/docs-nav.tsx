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
import type { NavGroup } from "@/lib/registry";

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
function NavTree({ groups, onNavigate }: { groups: NavGroup[]; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Documentation" className="space-y-6 pb-10">
      <div className="space-y-1">
        <NavLink href="/docs" active={pathname === "/docs"} onNavigate={onNavigate}>
          Overview
        </NavLink>
        <NavLink
          href="/docs/templates"
          active={pathname === "/docs/templates"}
          onNavigate={onNavigate}
        >
          <span className="inline-flex items-center gap-2">
            <LayoutTemplate className="size-3.5" /> Template gallery
          </span>
        </NavLink>
      </div>

      {groups.map((group) => (
        <div key={group.id} className="space-y-1">
          <h2 className="px-3 text-eyebrow font-semibold text-muted-foreground uppercase">
            {group.label}
            <span className="ms-2 font-normal opacity-60">{group.items.length}</span>
          </h2>
          {group.items.map((item) => (
            <NavLink
              key={item.name}
              href={item.href}
              active={pathname === item.href}
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
export function DocsSidebarNav({ groups }: { groups: NavGroup[] }) {
  return (
    <ScrollArea className="h-[calc(100dvh-var(--header-h)-3.5rem)]" viewportClassName="pe-2">
      <NavTree groups={groups} />
    </ScrollArea>
  );
}

/** Mobile trigger plus the same tree inside a sheet. Hidden from `lg` up. */
export function DocsMobileNav({ groups }: { groups: NavGroup[] }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="lg:hidden" aria-label="Open the menu">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="start" className="w-80 max-w-[85vw]">
        <SheetHeader>
          <SheetTitle>Documentation</SheetTitle>
          <SheetDescription>Every component, block and template in the registry.</SheetDescription>
        </SheetHeader>
        <ScrollArea className="min-h-0 flex-1">
          <NavTree groups={groups} onNavigate={() => setOpen(false)} />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
