/** Page navigation built from button styles, with previous/next arrows that turn to follow the reading direction. */
import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "../lib/cn";
import { buttonVariants, type ButtonProps } from "./button";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      data-slot="pagination"
      role="navigation"
      aria-label="pagination"
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
  children = "Previous",
  "aria-label": ariaLabel = "Go to previous page",
  ...props
}: PaginationNavProps) {
  return (
    <PaginationLink
      aria-label={ariaLabel}
      size="md"
      className={cn("gap-1 px-2.5 sm:ps-2.5", className)}
      {...props}
    >
      {/* `rtl:rotate-180` turns "back" into "towards the start of the line". */}
      <ChevronLeft className="size-4 rtl:rotate-180" />
      {children ? <span className="hidden sm:block">{children}</span> : null}
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  children = "Next",
  "aria-label": ariaLabel = "Go to next page",
  ...props
}: PaginationNavProps) {
  return (
    <PaginationLink
      aria-label={ariaLabel}
      size="md"
      className={cn("gap-1 px-2.5 sm:pe-2.5", className)}
      {...props}
    >
      {children ? <span className="hidden sm:block">{children}</span> : null}
      <ChevronRight className="size-4 rtl:rotate-180" />
    </PaginationLink>
  );
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="pagination-ellipsis"
      aria-hidden="true"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More pages</span>
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
