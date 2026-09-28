"use client";

/** Page navigation built from button styles, with previous/next arrows that turn to follow the reading direction. */
import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "../lib/cn";
import { useT } from "../lib/i18n";
import { buttonVariants, type ButtonProps } from "./button";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  const t = useT();

  return (
    <nav
      data-slot="pagination"
      role="navigation"
      aria-label={t("pagination.label")}
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}

function PaginationItem(props: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

export interface PaginationLinkProps extends React.ComponentProps<"a"> {
  /** Marks the page the reader is on; also sets `aria-current="page"`. */
  isActive?: boolean;
  size?: ButtonProps["size"];
}

function PaginationLink({
  className,
  isActive = false,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      data-slot="pagination-link"
      data-active={isActive || undefined}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        buttonVariants({ variant: isActive ? "outline" : "ghost", size }),
        "cursor-pointer font-medium",
        className,
      )}
      {...props}
    />
  );
}

export interface PaginationNavProps extends Omit<PaginationLinkProps, "size"> {
  /** Visible label next to the arrow; pass `null` for an arrow-only control. */
  children?: React.ReactNode;
}

function PaginationPrevious({
  className,
  children,
  "aria-label": ariaLabel,
  ...props
}: PaginationNavProps) {
  const t = useT();
  // `undefined` means unset, so the catalogue supplies the label;
  // `null` still means an arrow-only control, as documented.
  const label = children === undefined ? t("pagination.previous") : children;

  return (
    <PaginationLink
      aria-label={ariaLabel ?? t("pagination.goToPrevious")}
      size="md"
      className={cn("gap-1 px-2.5 sm:ps-2.5", className)}
      {...props}
    >
      {/* `rtl:rotate-180` turns "back" into "towards the start of the line". */}
      <ChevronLeft className="size-4 rtl:rotate-180" />
      {label ? <span className="hidden sm:block">{label}</span> : null}
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  children,
  "aria-label": ariaLabel,
  ...props
}: PaginationNavProps) {
  const t = useT();
  const label = children === undefined ? t("pagination.next") : children;

  return (
    <PaginationLink
      aria-label={ariaLabel ?? t("pagination.goToNext")}
      size="md"
      className={cn("gap-1 px-2.5 sm:pe-2.5", className)}
      {...props}
    >
      {label ? <span className="hidden sm:block">{label}</span> : null}
      <ChevronRight className="size-4 rtl:rotate-180" />
    </PaginationLink>
  );
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  const t = useT();

  return (
    <span
      data-slot="pagination-ellipsis"
      aria-hidden="true"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">{t("pagination.morePages")}</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
