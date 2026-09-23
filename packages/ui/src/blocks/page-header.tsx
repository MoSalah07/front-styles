/** Top-of-page banner: optional breadcrumb trail, a title with a supporting line, and an action cluster parked at the inline end. */
import * as React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/breadcrumb";
import { cn } from "../lib/cn";

export interface PageHeaderCrumb {
  /** Visible text of the crumb. */
  label: React.ReactNode;
  /** Destination. The last crumb is rendered as the current page, with or without one. */
  href?: string;
}

export interface PageHeaderProps extends React.ComponentProps<"header"> {
  /** Ancestor trail rendered above the title. The final entry becomes the current page. */
  breadcrumbs?: readonly PageHeaderCrumb[];
}

function PageHeader({ className, breadcrumbs, children, ...props }: PageHeaderProps) {
  return (
    <header
      data-slot="page-header"
      className={cn("flex flex-col gap-3 border-b border-border pb-6", className)}
      {...props}
    >
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <Breadcrumb data-slot="page-header-breadcrumbs">
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <React.Fragment key={index}>
                  <BreadcrumbItem>
                    {isLast || !crumb.href ? (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {isLast ? null : <BreadcrumbSeparator />}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      ) : null}

      {/* Title and description stack in the first column; the action slot spans
          both rows in the second, so it stays level with the title. */}
      <div
        data-slot="page-header-row"
        className={cn(
          "grid auto-rows-min items-start gap-1.5",
          "has-data-[slot=page-header-actions]:grid-cols-[minmax(0,1fr)_auto]",
        )}
      >
        {children}
      </div>
    </header>
  );
}

function PageHeaderTitle({ className, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1
      data-slot="page-header-title"
      className={cn("text-h3 font-semibold tracking-tight text-foreground", className)}
      {...props}
    />
  );
}

function PageHeaderDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="page-header-description"
      className={cn("max-w-prose text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function PageHeaderActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-header-actions"
      // `justify-self-end` is the inline end, so the cluster mirrors in RTL.
      className={cn(
        "col-start-2 row-span-2 row-start-1 flex flex-wrap items-center gap-2 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

export { PageHeader, PageHeaderTitle, PageHeaderDescription, PageHeaderActions };
