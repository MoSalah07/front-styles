"use client";

/** Sticky glass site header with a logo slot, inline navigation, action slot, and a sheet-based menu below the medium breakpoint. */
import * as React from "react";
import { Menu } from "lucide-react";
import { cn } from "../lib/cn";
import { useT } from "../lib/i18n";
import { Button } from "../components/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/sheet";

export interface SiteNavbarLink {
  label: string;
  href: string;
  /** Marks the link as the current page for assistive tech. */
  active?: boolean;
  /** Opens in a new tab and adds `rel="noopener noreferrer"`. */
  external?: boolean;
}

export interface SiteNavbarProps extends React.ComponentProps<"header"> {
  /** Logo lockup. Defaults to a neutral brand mark linking home. */
  logo?: React.ReactNode;
  links?: SiteNavbarLink[];
  /** Buttons shown beside the navigation on wide screens. */
  actions?: React.ReactNode;
  /** Actions repeated at the bottom of the mobile sheet. Falls back to `actions`. */
  mobileActions?: React.ReactNode;
  /** Pin the header to the top of the viewport. */
  sticky?: boolean;
  /** Names the inline navigation landmark. */
  navLabel?: string;
  /** Accessible name for the menu button. */
  menuLabel?: string;
  /** Heading inside the mobile sheet. */
  menuTitle?: string;
  /** Description inside the mobile sheet; visually hidden but announced. */
  menuDescription?: string;
}

function DefaultLogo() {
  const t = useT();

  return (
    <a
      href="/"
      className={cn(
        "inline-flex items-center gap-2 font-display text-2xl tracking-wide",
        "rounded-control outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      <span className="inline-block size-6 rounded-sm bg-primary" aria-hidden="true" />
      <span className="sr-only">{t("siteNavbar.home")}</span>
    </a>
  );
}

function externalProps(link: SiteNavbarLink) {
  return link.external ? { target: "_blank" as const, rel: "noopener noreferrer" } : {};
}

function SiteNavbar({
  className,
  logo = <DefaultLogo />,
  links = [],
  actions,
  mobileActions,
  sticky = true,
  navLabel: navLabelProp,
  menuLabel: menuLabelProp,
  menuTitle: menuTitleProp,
  menuDescription: menuDescriptionProp,
  children,
  ...props
}: SiteNavbarProps) {
  const t = useT();
  const navLabel = navLabelProp ?? t("siteNavbar.nav");
  const menuLabel = menuLabelProp ?? t("siteNavbar.openMenu");
  const menuTitle = menuTitleProp ?? t("siteNavbar.menuTitle");
  const menuDescription = menuDescriptionProp ?? t("siteNavbar.menuDescription");

  const [open, setOpen] = React.useState(false);

  return (
    <header
      data-slot="site-navbar"
      className={cn("top-0 z-(--z-sticky) w-full border-b glass", sticky && "sticky", className)}
      {...props}
    >
      <div className="mx-auto flex h-(--header-h) w-full max-w-(--container-content) items-center gap-4 px-(--gutter)">
        <div data-slot="site-navbar-logo" className="flex shrink-0 items-center">
          {logo}
        </div>

        {links.length > 0 ? (
          <nav
            data-slot="site-navbar-nav"
            aria-label={navLabel}
            className="ms-auto hidden items-center gap-1 md:flex"
          >
            {links.map((link) => (
              <Button
                key={`${link.href}-${link.label}`}
                variant="ghost"
                size="sm"
                asChild
                className={cn(link.active && "text-primary")}
              >
                <a
                  href={link.href}
                  aria-current={link.active ? "page" : undefined}
                  {...externalProps(link)}
                >
                  {link.label}
                </a>
              </Button>
            ))}
          </nav>
        ) : null}

        {children}

        <div
          data-slot="site-navbar-actions"
          className={cn("ms-auto flex items-center gap-2", links.length > 0 && "md:ms-4")}
        >
          {actions ? <div className="hidden items-center gap-2 md:flex">{actions}</div> : null}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label={menuLabel}
                className="md:hidden"
                data-slot="site-navbar-menu-trigger"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="end" className="w-[min(20rem,85vw)] gap-6">
              <SheetHeader>
                <SheetTitle>{menuTitle}</SheetTitle>
                <SheetDescription className="sr-only">{menuDescription}</SheetDescription>
              </SheetHeader>

              <nav
                data-slot="site-navbar-mobile-nav"
                aria-label={menuTitle}
                className="flex flex-col"
              >
                {links.map((link) => (
                  <a
                    key={`${link.href}-${link.label}`}
                    href={link.href}
                    aria-current={link.active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "border-b py-3 text-body font-medium last:border-b-0",
                      "transition-colors duration-(--duration-fast) ease-standard",
                      "hover:text-primary",
                      "outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      link.active && "text-primary",
                    )}
                    {...externalProps(link)}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              {(mobileActions ?? actions) ? (
                <div className="mt-auto flex flex-col gap-2 [&>*]:w-full">
                  {mobileActions ?? actions}
                </div>
              ) : null}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export { SiteNavbar };
