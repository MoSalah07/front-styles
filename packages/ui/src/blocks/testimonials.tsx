/** Wall of customer quotes, either as an even grid or as a masonry-style column flow, each card carrying an avatar, a name, a role and an optional logo. */
import * as React from "react";
import { Quote } from "lucide-react";
import { cn } from "../lib/cn";
import { Avatar, AvatarFallback, AvatarImage } from "../components/avatar";

export type TestimonialsVariant = "grid" | "masonry";

export interface TestimonialsProps extends React.ComponentProps<"div"> {
  /** `grid` keeps every card the same height; `masonry` lets them flow in columns. */
  variant?: TestimonialsVariant;
  /** Columns at the widest breakpoint. */
  columns?: 2 | 3;
}

const gridColumns: Record<2 | 3, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
};

const masonryColumns: Record<2 | 3, string> = {
  2: "sm:columns-2",
  3: "sm:columns-2 lg:columns-3",
};

function Testimonials({ className, variant = "grid", columns = 3, ...props }: TestimonialsProps) {
  return (
    <div
      data-slot="testimonials"
      data-variant={variant}
      className={cn(
        variant === "grid"
          ? cn("grid items-start gap-4", gridColumns[columns])
          : cn(
              "gap-4 columns-1",
              masonryColumns[columns],
              // CSS columns have no row gap, so the cards carry their own.
              "[&>*]:mb-4 [&>*]:break-inside-avoid",
            ),
        className,
      )}
      {...props}
    />
  );
}

export interface TestimonialAvatar {
  src?: string;
  alt?: string;
  /** Initials shown while the image loads or if it fails. */
  fallback?: string;
}

export interface TestimonialCardProps extends Omit<React.ComponentProps<"figure">, "role"> {
  quote: React.ReactNode;
  /** Who said it. */
  name: React.ReactNode;
  /** Their title, team or company. This shadows the ARIA `role` attribute on purpose. */
  role?: React.ReactNode;
  avatar?: TestimonialAvatar;
  /** A wordmark for the quoted organisation, pinned to the top corner. */
  logo?: React.ReactNode;
  /** Show the decorative quote glyph. */
  showQuoteMark?: boolean;
}

function TestimonialCard({
  className,
  quote,
  name,
  role,
  avatar,
  logo,
  showQuoteMark = true,
  children,
  ...props
}: TestimonialCardProps) {
  return (
    <figure
      data-slot="testimonial-card"
      className={cn(
        "relative flex flex-col gap-5 rounded-card border bg-card p-6 text-card-foreground shadow-1",
        "transition-[border-color,box-shadow] duration-(--duration-normal) ease-standard",
        "hover:border-primary/40 hover:shadow-2",
        className,
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-4">
        {showQuoteMark ? (
          <Quote
            aria-hidden="true"
            className="size-6 shrink-0 fill-primary/15 text-primary rtl:-scale-x-100"
          />
        ) : (
          <span />
        )}
        {logo ? (
          <div
            data-slot="testimonial-card-logo"
            className="h-5 shrink-0 text-muted-foreground [&_img]:h-full [&_img]:w-auto [&_svg]:h-full [&_svg]:w-auto"
          >
            {logo}
          </div>
        ) : null}
      </div>

      <blockquote data-slot="testimonial-card-quote" className="text-body-lg text-pretty">
        {quote}
      </blockquote>

      {children}

      <figcaption
        data-slot="testimonial-card-author"
        className="mt-auto flex items-center gap-3 border-t pt-5"
      >
        {avatar ? (
          <Avatar className="size-9">
            {avatar.src ? <AvatarImage src={avatar.src} alt={avatar.alt ?? ""} /> : null}
            <AvatarFallback>{avatar.fallback}</AvatarFallback>
          </Avatar>
        ) : null}
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-semibold">{name}</span>
          {role ? <span className="truncate text-sm text-muted-foreground">{role}</span> : null}
        </div>
      </figcaption>
    </figure>
  );
}

export { Testimonials, TestimonialCard };
