"use client";

/** E-commerce product tile: an image on a token-surface fallback, an optional badge, a linked title, a star rating, locale-formatted prices, an add-to-cart action and a wishlist toggle. */
import * as React from "react";
import { Toggle as TogglePrimitive } from "radix-ui";
import { Heart, ImageIcon, ShoppingBag, Star } from "lucide-react";
import { Badge, type BadgeProps } from "../components/badge";
import { Button } from "../components/button";
import { cn } from "../lib/cn";
import { useI18n } from "../lib/i18n";

export interface ProductCardImage {
  src?: string;
  /**
   * Empty by default: the linked title right below already names the product,
   * so repeating it in the image would make a screen reader say it twice.
   */
  alt?: string;
  /** Drawn on the fallback surface when there is no `src`, or when it fails to load. */
  fallback?: React.ReactNode;
}

export type ProductCardTitleTag = "h2" | "h3" | "h4";

export interface ProductCardProps extends Omit<React.ComponentProps<"div">, "title"> {
  /** Product name. Rendered as the card's link. */
  title: string;
  /** Destination of the title link, which also stretches over the whole card. */
  href?: string;
  image?: ProductCardImage;
  /** Short label over the image, e.g. "New" or "-20%". */
  badge?: React.ReactNode;
  badgeVariant?: BadgeProps["variant"];
  /** Small line above the title, such as a category or a maker. */
  eyebrow?: React.ReactNode;
  /** Average rating. Omit it to hide the stars. */
  rating?: number;
  /** Highest possible rating. */
  ratingMax?: number;
  reviewCount?: number;
  /** Selling price in major units, e.g. `24.5`. Formatted in the active locale. */
  price: number;
  /** Price before the discount. Shown struck through only when it is higher than `price`. */
  compareAtPrice?: number;
  /** ISO 4217 code. */
  currency?: string;
  /** Heading level of the title, so the card fits the outline of the page around it. */
  titleAs?: ProductCardTitleTag;
  onAddToCart?: () => void;
  /** Visible text of the add-to-cart button. */
  addToCartLabel?: string;
  /** Hides the add-to-cart button, e.g. for an out-of-stock listing. */
  hideAddToCart?: boolean;
  /** Controlled wishlist state. */
  wishlisted?: boolean;
  defaultWishlisted?: boolean;
  onWishlistChange?: (wishlisted: boolean) => void;
  /** Accessible name of the wishlist toggle. Its pressed state is announced separately. */
  wishlistLabel?: string;
  /** Hides the wishlist toggle. */
  hideWishlist?: boolean;
}

function ProductCardStars({ value, max }: { value: number; max: number }) {
  const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const row = (filled: boolean) =>
    Array.from({ length: max }, (_, index) => (
      <Star
        key={index}
        aria-hidden="true"
        className={cn("size-4 shrink-0", filled && "fill-current")}
      />
    ));

  // Two identical rows of stars: an empty one, and a filled one clipped to the
  // rating from the inline start, so half stars need no second glyph and the
  // fill grows the right way in RTL too.
  return (
    <span
      data-slot="product-card-stars"
      aria-hidden="true"
      className="relative inline-flex text-muted-foreground/40"
    >
      {row(false)}
      <span
        className="absolute inset-y-0 start-0 flex overflow-hidden text-warning"
        style={{ width: `${percent}%` }}
      >
        {row(true)}
      </span>
    </span>
  );
}

function ProductCard({
  className,
  title,
  href = "#",
  image,
  badge,
  badgeVariant = "default",
  eyebrow,
  rating,
  ratingMax = 5,
  reviewCount,
  price,
  compareAtPrice,
  currency = "USD",
  titleAs: Title = "h3",
  onAddToCart,
  addToCartLabel: addToCartLabelProp,
  hideAddToCart = false,
  wishlisted,
  defaultWishlisted,
  onWishlistChange,
  wishlistLabel: wishlistLabelProp,
  hideWishlist = false,
  ...props
}: ProductCardProps) {
  const { t, locale } = useI18n();
  const titleId = React.useId();

  const money = React.useMemo(
    () => new Intl.NumberFormat(locale, { style: "currency", currency }),
    [locale, currency],
  );

  // A custom label is used verbatim, with the product name as its description;
  // the built-in one names the product itself, starting with the visible words
  // so voice control users can still say what they see.
  const addToCartLabel = addToCartLabelProp ?? t("productCard.addToCart");
  const addToCartName = addToCartLabelProp ? undefined : t("productCard.addToCartNamed", { title });
  const wishlistLabel = wishlistLabelProp ?? t("productCard.wishlist", { title });

  const ratingLabel =
    rating === undefined
      ? undefined
      : reviewCount === undefined
        ? t("productCard.ratingOnly", { rating, max: ratingMax })
        : t("productCard.rating", { rating, max: ratingMax, count: reviewCount });

  const onSale = compareAtPrice !== undefined && compareAtPrice > price;

  // Keyed on the source, so a new `src` gets a fresh attempt at loading.
  const [failedSrc, setFailedSrc] = React.useState<string>();
  const showImage = Boolean(image?.src) && failedSrc !== image?.src;
  const alt = image?.alt ?? "";

  return (
    <div
      data-slot="product-card"
      className={cn(
        "group/product-card relative isolate flex flex-col overflow-hidden rounded-card border bg-card text-card-foreground shadow-1",
        "transition-[border-color,box-shadow] duration-(--duration-normal) ease-standard",
        "hover:border-primary/40 hover:shadow-2",
        "has-[[data-slot=product-card-link]:focus-visible]:ring-2 has-[[data-slot=product-card-link]:focus-visible]:ring-ring",
        className,
      )}
      {...props}
    >
      <div
        data-slot="product-card-media"
        className="relative aspect-square overflow-hidden bg-surface-2"
      >
        {showImage ? (
          <img
            data-slot="product-card-image"
            src={image?.src}
            alt={alt}
            loading="lazy"
            decoding="async"
            onError={() => setFailedSrc(image?.src)}
            className={cn(
              "size-full object-cover",
              "motion-safe:transition-transform motion-safe:duration-(--duration-slower) motion-safe:ease-standard",
              "motion-safe:group-hover/product-card:scale-105",
            )}
          />
        ) : (
          <div
            data-slot="product-card-fallback"
            role={alt ? "img" : undefined}
            aria-label={alt || undefined}
            aria-hidden={alt ? undefined : true}
            className={cn(
              "flex size-full items-center justify-center bg-surface-2 text-muted-foreground",
              "[background-image:radial-gradient(90%_70%_at_50%_20%,color-mix(in_oklab,var(--primary)_10%,transparent),transparent_70%)]",
            )}
          >
            {image?.fallback ?? <ImageIcon aria-hidden="true" className="size-10 opacity-40" />}
          </div>
        )}

        {badge ? (
          <Badge
            data-slot="product-card-badge"
            variant={badgeVariant}
            className="absolute top-3 start-3 shadow-1"
          >
            {badge}
          </Badge>
        ) : null}

        {hideWishlist ? null : (
          <TogglePrimitive.Root
            data-slot="product-card-wishlist"
            pressed={wishlisted}
            defaultPressed={defaultWishlisted}
            onPressedChange={onWishlistChange}
            aria-label={wishlistLabel}
            className={cn(
              "absolute top-2 end-2 z-(--z-raised) inline-flex size-(--control-h-sm) items-center justify-center rounded-full",
              "bg-background/85 text-foreground shadow-1 backdrop-blur-sm",
              "transition-[color,background-color,transform] duration-(--duration-fast) ease-standard",
              "hover:bg-background hover:text-primary",
              "outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "data-[state=on]:text-primary [&[data-state=on]_svg]:fill-current",
              "motion-safe:active:scale-90",
              "[&_svg]:size-4",
            )}
          >
            <Heart aria-hidden="true" />
          </TogglePrimitive.Root>
        )}
      </div>

      <div data-slot="product-card-body" className="flex flex-1 flex-col gap-2 p-4">
        {eyebrow ? (
          <p
            data-slot="product-card-eyebrow"
            className="text-eyebrow font-semibold uppercase text-muted-foreground"
          >
            {eyebrow}
          </p>
        ) : null}

        <Title data-slot="product-card-title" className="text-body font-semibold leading-snug">
          <a
            id={titleId}
            data-slot="product-card-link"
            href={href}
            className={cn(
              "line-clamp-2 outline-none",
              "transition-colors duration-(--duration-fast) ease-standard hover:text-primary",
              "focus-visible:underline focus-visible:underline-offset-4",
              // One focus stop for the whole card: the link's hit area covers
              // it, and only the two buttons are raised above.
              "after:absolute after:inset-0 after:content-['']",
            )}
          >
            {title}
          </a>
        </Title>

        {ratingLabel ? (
          <div
            data-slot="product-card-rating"
            role="img"
            aria-label={ratingLabel}
            className="flex items-center gap-1.5"
          >
            <ProductCardStars value={rating ?? 0} max={ratingMax} />
            {reviewCount !== undefined ? (
              <span aria-hidden="true" className="text-caption text-muted-foreground tabular-nums">
                ({new Intl.NumberFormat(locale).format(reviewCount)})
              </span>
            ) : null}
          </div>
        ) : null}

        <p data-slot="product-card-price" className="flex flex-wrap items-baseline gap-x-2">
          {onSale ? <span className="sr-only">{t("productCard.currentPrice")} </span> : null}
          <span
            data-slot="product-card-current-price"
            className={cn("text-body font-semibold tabular-nums", onSale && "text-primary")}
          >
            {money.format(price)}
          </span>
          {onSale ? (
            <s
              data-slot="product-card-compare-price"
              className="text-sm text-muted-foreground tabular-nums"
            >
              <span className="sr-only">{t("productCard.originalPrice")} </span>
              {money.format(compareAtPrice)}
            </s>
          ) : null}
        </p>

        {hideAddToCart ? null : (
          <div data-slot="product-card-actions" className="mt-auto pt-2">
            <Button
              data-slot="product-card-add"
              type="button"
              size="sm"
              aria-label={addToCartName}
              aria-describedby={addToCartName ? undefined : titleId}
              onClick={onAddToCart}
              className="relative z-(--z-raised) w-full"
            >
              <ShoppingBag aria-hidden="true" />
              {addToCartLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export { ProductCard };
