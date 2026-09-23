/** Site footer with a brand blurb, column groups of links, a social and legal row, and a copyright line, each group its own navigation landmark. */
import * as React from "react";
import { cn } from "../lib/cn";
import { Separator } from "../components/separator";

export interface SiteFooterLink {
  label: string;
  href: string;
  /** Opens in a new tab and adds `rel="noopener noreferrer"`. */
  external?: boolean;
}

export interface SiteFooterGroup {
  /** Heading for the column; also names its navigation landmark. */
  title: string;
  links: SiteFooterLink[];
}

export interface SiteFooterSocialLink extends SiteFooterLink {
  /** Icon element; `label` becomes the accessible name. */
  icon?: React.ReactNode;
}

export interface SiteFooterProps extends React.ComponentProps<"footer"> {
  /** Wordmark or logo lockup. */
  brand?: React.ReactNode;
  /** A sentence or two under the brand. */
  blurb?: React.ReactNode;
  groups?: SiteFooterGroup[];
  social?: SiteFooterSocialLink[];
  legal?: SiteFooterLink[];
  /** Defaults to the current year with no owner name, so nothing is invented. */
  copyright?: React.ReactNode;
  /** Names the social navigation landmark. */
  socialLabel?: string;
  /** Names the legal navigation landmark. */
  legalLabel?: string;
}

const linkClass = cn(
  "text-sm text-muted-foreground underline-offset-4",
  "transition-colors duration-(--duration-fast) ease-standard",
  "hover:text-foreground hover:underline",
  "rounded-control outline-none focus-visible:ring-2 focus-visible:ring-ring",
);

function externalProps(link: SiteFooterLink) {
  return link.external ? { target: "_blank" as const, rel: "noopener noreferrer" } : {};
}

function SiteFooter({
  className,
  brand,
  blurb,
  groups = [],
  social = [],
  legal = [],
  copyright = `\u00A9 ${new Date().getFullYear()}`,
  socialLabel = "Social",
  legalLabel = "Legal",
  children,
  ...props
}: SiteFooterProps) {
  return (
    <footer
      data-slot="site-footer"
      className={cn("border-t bg-surface-1 text-foreground", className)}
      {...props}
    >
      <div className="mx-auto w-full max-w-(--container-content) px-(--gutter) py-(--section-y)">
        <div className={cn("grid gap-10", "md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16")}>
          <div data-slot="site-footer-brand" className="flex flex-col gap-4">
            {brand ? <div className="font-display text-2xl tracking-wide">{brand}</div> : null}
            {blurb ? (
              <p className="max-w-prose text-sm text-pretty text-muted-foreground">{blurb}</p>
            ) : null}
            {children}
          </div>

          {groups.length > 0 ? (
            <div
              data-slot="site-footer-groups"
              className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            >
              {groups.map((group) => (
                <nav key={group.title} aria-label={group.title} className="flex flex-col gap-3">
                  <h2 className="text-eyebrow font-semibold uppercase text-foreground">
                    {group.title}
                  </h2>
                  <ul className="flex flex-col gap-2">
                    {group.links.map((link) => (
                      <li key={`${group.title}-${link.href}-${link.label}`}>
                        <a href={link.href} className={linkClass} {...externalProps(link)}>
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>
          ) : null}
        </div>

        <Separator className="my-8" />

        <div
          data-slot="site-footer-meta"
          className="flex flex-col-reverse items-start gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <p data-slot="site-footer-copyright" className="text-sm text-muted-foreground">
            {copyright}
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {legal.length > 0 ? (
              <nav aria-label={legalLabel}>
                <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  {legal.map((link) => (
                    <li key={`${link.href}-${link.label}`}>
                      <a href={link.href} className={linkClass} {...externalProps(link)}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}

            {social.length > 0 ? (
              <nav aria-label={socialLabel}>
                <ul className="flex items-center gap-1">
                  {social.map((link) => (
                    <li key={`${link.href}-${link.label}`}>
                      <a
                        href={link.href}
                        aria-label={link.label}
                        title={link.label}
                        className={cn(
                          "inline-flex size-9 items-center justify-center rounded-control",
                          "text-muted-foreground",
                          "transition-colors duration-(--duration-fast) ease-standard",
                          "hover:bg-accent hover:text-accent-foreground",
                          "outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          "[&_svg]:size-4",
                        )}
                        {...externalProps(link)}
                      >
                        {link.icon ?? <span aria-hidden="true">{link.label.charAt(0)}</span>}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}

export { SiteFooter };
