"use client";

/** E-commerce storefront homepage: a search-first header with account and cart, a promo hero, category tiles, featured products, weekly deals, a value-props strip, a newsletter signup and the site footer, each fed through typed props with neutral demo content. */
import * as React from "react";
import {
  ArrowRight,
  BedDouble,
  Clock,
  Coffee,
  CookingPot,
  GlassWater,
  Lamp,
  Layers,
  Mail,
  NotebookPen,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sofa,
  Sprout,
  Tent,
  TreePine,
  Truck,
  User,
} from "lucide-react";
import { Badge } from "../components/badge";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { ProductCard, type ProductCardProps } from "../blocks/product-card";
import { SiteFooter, type SiteFooterProps } from "../blocks/site-footer";
import { cn } from "../lib/cn";
import { useI18n, type TranslateFn } from "../lib/i18n";

/* ------------------------------------------------------------------ types */

/** A section prop: omit it for the demo content, pass `null` or `false` to leave the section out. */
export type LandingStoreSection<T> = T | null | false;

export interface LandingStoreAction {
  label: React.ReactNode;
  /** Renders a link. Without it the action is a button driving `onClick`. */
  href?: string;
  onClick?: () => void;
}

export interface LandingStoreProduct extends Omit<
  ProductCardProps,
  "onAddToCart" | "onWishlistChange"
> {
  /** Stable key, handed back to `onAddToCart` and `onWishlistChange`. */
  id: string;
}

export interface LandingStoreCategory {
  title: React.ReactNode;
  href: string;
  /** Drawn on the tinted tile when there is no image. */
  icon?: React.ReactNode;
  /** A photo for the tile. Decorative: the title below already names it. */
  imageSrc?: string;
}

export interface LandingStoreValueProp {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
}

export interface LandingStoreHeaderProps extends React.ComponentProps<"header"> {
  /** Replaces the default wordmark. */
  logo?: React.ReactNode;
  /** Pin the header to the top of the viewport. */
  sticky?: boolean;
  searchLabel?: string;
  searchPlaceholder?: string;
  /** Receives the trimmed query when the search is submitted. */
  onSearch?: (query: string) => void;
  accountHref?: string;
  accountLabel?: string;
  /** Opens the cart. The button's name carries the item count. */
  onCartClick?: () => void;
}

export interface LandingStoreHeroProps extends Omit<React.ComponentProps<"section">, "title"> {
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** `null` removes the button. */
  primaryAction?: LandingStoreAction | null;
  secondaryAction?: LandingStoreAction | null;
  /** Replaces the decorative art. `null` removes it. */
  media?: React.ReactNode;
}

export interface LandingStoreCategoriesProps extends Omit<
  React.ComponentProps<"section">,
  "title"
> {
  title?: React.ReactNode;
  items?: LandingStoreCategory[];
}

export interface LandingStoreProductsProps extends Omit<React.ComponentProps<"section">, "title"> {
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  products?: LandingStoreProduct[];
  /** Link to the full listing. `null` removes it. */
  action?: LandingStoreAction | null;
}

export interface LandingStoreValuePropsProps extends Omit<
  React.ComponentProps<"section">,
  "title"
> {
  /** Names the strip, as a visually hidden heading. */
  label?: string;
  items?: LandingStoreValueProp[];
}

export interface LandingStoreNewsletterProps extends Omit<
  React.ComponentProps<"section">,
  "title" | "onSubmit"
> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  emailLabel?: string;
  placeholder?: string;
  submitLabel?: string;
  successMessage?: React.ReactNode;
  invalidMessage?: React.ReactNode;
  /** Receives the trimmed address once it passes a basic format check. */
  onSubscribe?: (email: string) => void;
}

export interface LandingStoreProps extends React.ComponentProps<"div"> {
  /** Store name, used in the default wordmark and footer. */
  brand?: string;
  /** ISO 4217 code for every product that does not set its own. */
  currency?: string;
  /** Controlled cart count. Without it the template counts its own add-to-cart clicks. */
  cartCount?: number;
  defaultCartCount?: number;
  header?: LandingStoreSection<LandingStoreHeaderProps>;
  hero?: LandingStoreSection<LandingStoreHeroProps>;
  categories?: LandingStoreSection<LandingStoreCategoriesProps>;
  featured?: LandingStoreSection<LandingStoreProductsProps>;
  deals?: LandingStoreSection<LandingStoreProductsProps>;
  valueProps?: LandingStoreSection<LandingStoreValuePropsProps>;
  newsletter?: LandingStoreSection<LandingStoreNewsletterProps>;
  footer?: LandingStoreSection<SiteFooterProps>;
  onAddToCart?: (product: LandingStoreProduct) => void;
  onWishlistChange?: (product: LandingStoreProduct, wishlisted: boolean) => void;
  /** Text of the skip link that jumps past the header. */
  skipLinkLabel?: string;
}

/** The anchor each section gets when its props carry no `id` of their own. */
export const LANDING_STORE_SECTION_IDS = {
  hero: "hero",
  categories: "categories",
  featured: "featured",
  deals: "deals",
  valueProps: "why-us",
  newsletter: "newsletter",
} as const;

const MAIN_ID = "main-content";

/** Invented store used when no `brand` is given. */
const DEFAULT_BRAND = "Oakmere";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Tints for the category tiles and product fallbacks, cycled in order. */
const TONES = [
  "bg-chart-1/12 text-chart-1",
  "bg-chart-2/12 text-chart-2",
  "bg-chart-3/12 text-chart-3",
  "bg-chart-4/12 text-chart-4",
  "bg-chart-5/12 text-chart-5",
] as const;

function tone(index: number): string {
  return TONES[index % TONES.length] ?? TONES[0];
}

function shown<T>(section: LandingStoreSection<T> | undefined): section is T | undefined {
  return section !== null && section !== false;
}

function sectionId<T extends { id?: string }>(
  section: LandingStoreSection<T> | undefined,
  fallback: string,
): string | undefined {
  if (!shown(section)) return undefined;
  return section?.id ?? fallback;
}

/* --------------------------------------------------------------- helpers */

function ActionButton({
  action,
  variant,
  size = "lg",
  className,
}: {
  action: LandingStoreAction;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
  className?: string;
}) {
  if (action.href) {
    return (
      <Button asChild variant={variant} size={size} className={className}>
        <a href={action.href} onClick={action.onClick}>
          {action.label}
        </a>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      onClick={action.onClick}
    >
      {action.label}
    </Button>
  );
}

function Wordmark({ brand }: { brand: string }) {
  return (
    <a
      href="/"
      data-slot="landing-store-logo"
      className={cn(
        "inline-flex items-center gap-2 font-display text-2xl tracking-wide",
        "rounded-control outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      <span
        aria-hidden="true"
        className="flex size-7 items-center justify-center rounded-full brand-surface [&_svg]:size-4"
      >
        <ShoppingBag />
      </span>
      {brand}
    </a>
  );
}

/** A tinted disc with an icon, standing in for a product photo. */
function ProductArt({ icon, index }: { icon: React.ReactNode; index: number }) {
  return (
    <span
      className={cn(
        "flex size-24 items-center justify-center rounded-full [&_svg]:size-10",
        tone(index),
      )}
    >
      {icon}
    </span>
  );
}

/* ---------------------------------------------------------- demo content */

function defaultCategories(t: TranslateFn): LandingStoreCategory[] {
  return [
    { title: t("landingStore.categoryKitchen"), href: "#", icon: <CookingPot /> },
    { title: t("landingStore.categoryHome"), href: "#", icon: <Sofa /> },
    { title: t("landingStore.categoryLighting"), href: "#", icon: <Lamp /> },
    { title: t("landingStore.categoryTextiles"), href: "#", icon: <BedDouble /> },
    { title: t("landingStore.categoryOutdoors"), href: "#", icon: <Tent /> },
    { title: t("landingStore.categoryStationery"), href: "#", icon: <NotebookPen /> },
  ];
}

function defaultFeatured(t: TranslateFn): LandingStoreProduct[] {
  return [
    {
      id: "stoneware-mug",
      title: t("landingStore.productMug"),
      eyebrow: t("landingStore.categoryKitchen"),
      price: 28,
      rating: 4.8,
      reviewCount: 214,
      badge: t("landingStore.badgeNew"),
      badgeVariant: "secondary",
      image: { fallback: <ProductArt icon={<Coffee />} index={0} /> },
    },
    {
      id: "linen-throw",
      title: t("landingStore.productThrow"),
      eyebrow: t("landingStore.categoryTextiles"),
      price: 96,
      rating: 4.6,
      reviewCount: 88,
      image: { fallback: <ProductArt icon={<Layers />} index={1} /> },
    },
    {
      id: "walnut-desk-lamp",
      title: t("landingStore.productLamp"),
      eyebrow: t("landingStore.categoryLighting"),
      price: 149,
      compareAtPrice: 179,
      rating: 4.9,
      reviewCount: 57,
      image: { fallback: <ProductArt icon={<Lamp />} index={2} /> },
    },
    {
      id: "glass-carafe",
      title: t("landingStore.productCarafe"),
      eyebrow: t("landingStore.categoryKitchen"),
      price: 34,
      rating: 4.4,
      reviewCount: 131,
      badge: t("landingStore.badgeNew"),
      badgeVariant: "secondary",
      image: { fallback: <ProductArt icon={<GlassWater />} index={3} /> },
    },
  ];
}

function defaultDeals(t: TranslateFn): LandingStoreProduct[] {
  return [
    {
      id: "cloth-notebook",
      title: t("landingStore.productNotebook"),
      eyebrow: t("landingStore.categoryStationery"),
      price: 14,
      compareAtPrice: 22,
      rating: 4.7,
      reviewCount: 342,
      image: { fallback: <ProductArt icon={<NotebookPen />} index={4} /> },
    },
    {
      id: "terracotta-planter",
      title: t("landingStore.productPlanter"),
      eyebrow: t("landingStore.categoryHome"),
      price: 24,
      compareAtPrice: 32,
      rating: 4.5,
      reviewCount: 76,
      image: { fallback: <ProductArt icon={<Sprout />} index={0} /> },
    },
    {
      id: "wool-picnic-blanket",
      title: t("landingStore.productBlanket"),
      eyebrow: t("landingStore.categoryOutdoors"),
      price: 72,
      compareAtPrice: 120,
      rating: 4.8,
      reviewCount: 49,
      image: { fallback: <ProductArt icon={<TreePine />} index={1} /> },
    },
  ];
}

function defaultValueProps(t: TranslateFn, freeShippingOver: string): LandingStoreValueProp[] {
  return [
    {
      icon: <Truck />,
      title: t("landingStore.freeShippingTitle"),
      description: t("landingStore.freeShippingDescription", { amount: freeShippingOver }),
    },
    {
      icon: <RotateCcw />,
      title: t("landingStore.returnsTitle"),
      description: t("landingStore.returnsDescription"),
    },
    {
      icon: <ShieldCheck />,
      title: t("landingStore.securePaymentTitle"),
      description: t("landingStore.securePaymentDescription"),
    },
  ];
}

/* -------------------------------------------------------------- sections */

function StoreHeader({
  brand,
  cartCount,
  header = {},
}: {
  brand: string;
  cartCount: number;
  header?: LandingStoreHeaderProps;
}) {
  const { t, locale } = useI18n();
  const searchId = React.useId();
  const {
    logo,
    sticky = true,
    searchLabel: searchLabelProp,
    searchPlaceholder: searchPlaceholderProp,
    onSearch,
    accountHref = "#",
    accountLabel: accountLabelProp,
    onCartClick,
    className,
    ...rest
  } = header;
  const searchLabel = searchLabelProp ?? t("landingStore.searchLabel");
  const searchPlaceholder = searchPlaceholderProp ?? t("landingStore.searchPlaceholder");
  const accountLabel = accountLabelProp ?? t("landingStore.account");

  const [query, setQuery] = React.useState("");

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch?.(query.trim());
  };

  const count = cartCount > 99 ? "99+" : new Intl.NumberFormat(locale).format(cartCount);

  return (
    <header
      data-slot="landing-store-header"
      className={cn("top-0 z-(--z-sticky) w-full border-b glass", sticky && "sticky", className)}
      {...rest}
    >
      <div className="mx-auto flex w-full max-w-(--container-content) flex-wrap items-center gap-x-4 gap-y-3 px-(--gutter) py-3 md:h-(--header-h) md:flex-nowrap md:py-0">
        <div data-slot="landing-store-header-logo" className="flex shrink-0 items-center">
          {logo ?? <Wordmark brand={brand} />}
        </div>

        <form
          role="search"
          aria-label={searchLabel}
          data-slot="landing-store-search"
          onSubmit={handleSearch}
          className="relative order-last w-full md:order-none md:mx-auto md:max-w-xl md:flex-1"
        >
          <label htmlFor={searchId} className="sr-only">
            {searchLabel}
          </label>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 start-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id={searchId}
            type="search"
            value={query}
            placeholder={searchPlaceholder}
            onChange={(event) => setQuery(event.target.value)}
            className="rounded-full bg-background/70 ps-9"
          />
        </form>

        <div
          data-slot="landing-store-header-actions"
          className="ms-auto flex items-center gap-1 md:ms-0"
        >
          <Button asChild variant="ghost" size="icon">
            <a href={accountHref} aria-label={accountLabel}>
              <User aria-hidden="true" />
            </a>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            data-slot="landing-store-cart"
            aria-label={t("landingStore.cart", { count: cartCount })}
            onClick={onCartClick}
            className="relative"
          >
            <ShoppingBag aria-hidden="true" />
            {cartCount > 0 ? (
              <span
                aria-hidden="true"
                data-slot="landing-store-cart-count"
                className={cn(
                  "absolute -top-0.5 -end-0.5 flex h-5 min-w-5 items-center justify-center rounded-badge px-1",
                  "bg-primary text-caption font-semibold text-primary-foreground tabular-nums",
                  "motion-safe:animate-scale-in",
                )}
              >
                {count}
              </span>
            ) : null}
          </Button>
        </div>
      </div>
    </header>
  );
}

function StoreHero({
  hero = {},
  featuredId,
  dealsId,
}: {
  hero?: LandingStoreHeroProps;
  featuredId?: string;
  dealsId?: string;
}) {
  const { t } = useI18n();
  const headingId = React.useId();
  const {
    id = LANDING_STORE_SECTION_IDS.hero,
    eyebrow,
    title,
    description,
    primaryAction,
    secondaryAction,
    media,
    className,
    ...rest
  } = hero;

  const primary =
    primaryAction === undefined
      ? {
          label: (
            <>
              {t("landingStore.heroPrimary")}
              <ArrowRight aria-hidden="true" className="rtl:-scale-x-100" />
            </>
          ),
          href: featuredId ? `#${featuredId}` : "#",
        }
      : primaryAction;
  const secondary =
    secondaryAction === undefined
      ? { label: t("landingStore.heroSecondary"), href: dealsId ? `#${dealsId}` : "#" }
      : secondaryAction;

  return (
    <section
      id={id}
      data-slot="landing-store-hero"
      aria-labelledby={headingId}
      className={cn(
        "mx-auto w-full max-w-(--container-content) scroll-mt-(--header-h) px-(--gutter) pt-6",
        className,
      )}
      {...rest}
    >
      <div className="brand-surface relative isolate grid items-center gap-10 overflow-hidden rounded-card px-6 py-12 shadow-3 sm:px-12 lg:grid-cols-2 lg:py-20">
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 z-(--z-below)",
            "[background-image:radial-gradient(60%_80%_at_85%_20%,color-mix(in_oklab,var(--brand-foreground)_22%,transparent),transparent_70%)]",
            "rtl:[background-image:radial-gradient(60%_80%_at_15%_20%,color-mix(in_oklab,var(--brand-foreground)_22%,transparent),transparent_70%)]",
          )}
        />
        <div className="flex max-w-xl flex-col gap-6">
          {eyebrow === null ? null : (
            <p className="text-eyebrow font-semibold uppercase opacity-85">
              {eyebrow ?? t("landingStore.heroEyebrow")}
            </p>
          )}
          <h1 id={headingId} className="font-display text-display uppercase text-balance">
            {title ?? t("landingStore.heroTitle")}
          </h1>
          <p className="max-w-prose text-body-lg text-pretty opacity-90">
            {description ?? t("landingStore.heroDescription")}
          </p>
          {primary || secondary ? (
            <div className="flex flex-wrap items-center gap-3">
              {primary ? <ActionButton action={primary} variant="secondary" /> : null}
              {secondary ? (
                <ActionButton
                  action={secondary}
                  variant="ghost"
                  className="border border-current/30 hover:bg-brand-foreground/10 hover:text-current"
                />
              ) : null}
            </div>
          ) : null}
        </div>

        {media === null ? null : (
          <div data-slot="landing-store-hero-media" className="relative">
            {media ?? <HeroArt />}
          </div>
        )}
      </div>
    </section>
  );
}

/** Three product silhouettes on the brand surface, drawn from tokens only. */
function HeroArt() {
  return (
    <div aria-hidden="true" className="relative mx-auto aspect-square w-full max-w-sm">
      <div className="absolute inset-[6%] rounded-full bg-brand-foreground/10" />
      <div className="absolute top-[10%] end-[8%] flex size-[38%] items-center justify-center rounded-full bg-brand-foreground text-brand shadow-3 [&_svg]:size-1/3 motion-safe:animate-fade-up">
        <Lamp />
      </div>
      <div className="absolute bottom-[10%] start-[6%] flex size-[46%] items-center justify-center rounded-card bg-background text-foreground shadow-3 [&_svg]:size-1/3 motion-safe:animate-fade-up">
        <Coffee />
      </div>
      <div className="absolute end-[14%] bottom-[4%] flex size-[26%] items-center justify-center rounded-card bg-surface-2 text-primary shadow-2 [&_svg]:size-1/3 motion-safe:animate-fade-up">
        <Sprout />
      </div>
    </div>
  );
}

function StoreCategories({ categories = {} }: { categories?: LandingStoreCategoriesProps }) {
  const { t } = useI18n();
  const headingId = React.useId();
  const {
    id = LANDING_STORE_SECTION_IDS.categories,
    title,
    items,
    className,
    ...rest
  } = categories;
  const heading = title ?? t("landingStore.categoriesTitle");

  return (
    <section
      id={id}
      data-slot="landing-store-categories"
      aria-labelledby={heading ? headingId : undefined}
      className={cn(
        "mx-auto w-full max-w-(--container-content) scroll-mt-(--header-h) px-(--gutter) py-(--section-y)",
        className,
      )}
      {...rest}
    >
      {heading ? (
        <h2 id={headingId} className="mb-8 font-display text-h2 uppercase text-balance">
          {heading}
        </h2>
      ) : null}
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {(items ?? defaultCategories(t)).map((category, index) => (
          <li key={index}>
            <a
              href={category.href}
              data-slot="landing-store-category"
              className="group/category flex flex-col items-center gap-3 rounded-card p-1 text-center outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "flex aspect-square w-full items-center justify-center overflow-hidden rounded-card border border-transparent",
                  "transition-[transform,border-color] duration-(--duration-normal) ease-standard",
                  "group-hover/category:border-primary/40 motion-safe:group-hover/category:-translate-y-1",
                  "[&_svg]:size-8",
                  tone(index),
                )}
              >
                {category.imageSrc ? (
                  <img src={category.imageSrc} alt="" className="size-full object-cover" />
                ) : (
                  category.icon
                )}
              </span>
              <span className="text-sm font-semibold group-hover/category:text-primary">
                {category.title}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ProductGrid({
  products,
  currency,
  onAddToCart,
  onWishlistChange,
  className,
}: {
  products: LandingStoreProduct[];
  currency: string;
  onAddToCart: (product: LandingStoreProduct) => void;
  onWishlistChange?: (product: LandingStoreProduct, wishlisted: boolean) => void;
  className?: string;
}) {
  const { t } = useI18n();

  return (
    <ul
      data-slot="landing-store-products"
      className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}
    >
      {products.map((product) => {
        const { id, className: cardClassName, currency: productCurrency, badge, ...card } = product;
        const onSale =
          product.compareAtPrice !== undefined && product.compareAtPrice > product.price;
        // A markdown with no badge of its own gets one worked out from the two prices.
        const saleBadge = onSale
          ? t("landingStore.badgeSale", {
              percent: Math.round((1 - product.price / (product.compareAtPrice ?? 1)) * 100),
            })
          : undefined;

        return (
          <li key={id} className="flex">
            <ProductCard
              {...card}
              badge={badge ?? saleBadge}
              currency={productCurrency ?? currency}
              className={cn("w-full", cardClassName)}
              onAddToCart={() => onAddToCart(product)}
              onWishlistChange={(wishlisted) => onWishlistChange?.(product, wishlisted)}
            />
          </li>
        );
      })}
    </ul>
  );
}

function StoreFeatured({
  featured = {},
  currency,
  onAddToCart,
  onWishlistChange,
}: {
  featured?: LandingStoreProductsProps;
  currency: string;
  onAddToCart: (product: LandingStoreProduct) => void;
  onWishlistChange?: (product: LandingStoreProduct, wishlisted: boolean) => void;
}) {
  const { t } = useI18n();
  const headingId = React.useId();
  const {
    id = LANDING_STORE_SECTION_IDS.featured,
    eyebrow,
    title,
    description,
    products,
    action,
    className,
    ...rest
  } = featured;
  const heading = title ?? t("landingStore.featuredTitle");
  const viewAll =
    action === undefined
      ? {
          label: (
            <>
              {t("landingStore.viewAll")}
              <ArrowRight aria-hidden="true" className="rtl:-scale-x-100" />
            </>
          ),
          href: "#",
        }
      : action;

  return (
    <section
      id={id}
      data-slot="landing-store-featured"
      aria-labelledby={heading ? headingId : undefined}
      className={cn(
        "mx-auto w-full max-w-(--container-content) scroll-mt-(--header-h) px-(--gutter) py-(--section-y)",
        className,
      )}
      {...rest}
    >
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="flex max-w-2xl flex-col gap-2">
          {eyebrow ? (
            <p className="text-eyebrow font-semibold uppercase text-primary">{eyebrow}</p>
          ) : null}
          {heading ? (
            <h2 id={headingId} className="font-display text-h2 uppercase text-balance">
              {heading}
            </h2>
          ) : null}
          <p className="text-body text-pretty text-muted-foreground">
            {description ?? t("landingStore.featuredDescription")}
          </p>
        </div>
        {viewAll ? <ActionButton action={viewAll} variant="ghost" size="md" /> : null}
      </div>
      <ProductGrid
        products={products ?? defaultFeatured(t)}
        currency={currency}
        onAddToCart={onAddToCart}
        onWishlistChange={onWishlistChange}
      />
    </section>
  );
}

function StoreDeals({
  deals = {},
  currency,
  onAddToCart,
  onWishlistChange,
}: {
  deals?: LandingStoreProductsProps;
  currency: string;
  onAddToCart: (product: LandingStoreProduct) => void;
  onWishlistChange?: (product: LandingStoreProduct, wishlisted: boolean) => void;
}) {
  const { t } = useI18n();
  const headingId = React.useId();
  const {
    id = LANDING_STORE_SECTION_IDS.deals,
    eyebrow,
    title,
    description,
    products,
    action,
    className,
    ...rest
  } = deals;
  const heading = title ?? t("landingStore.dealsTitle");
  const shopAll = action === undefined ? { label: t("landingStore.dealsCta"), href: "#" } : action;

  return (
    <section
      id={id}
      data-slot="landing-store-deals"
      aria-labelledby={heading ? headingId : undefined}
      className={cn(
        "mx-auto w-full max-w-(--container-content) scroll-mt-(--header-h) px-(--gutter) py-(--section-y)",
        className,
      )}
      {...rest}
    >
      <div className="relative isolate grid gap-8 overflow-hidden rounded-card border bg-surface-1 p-6 sm:p-8 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-(--z-below) [background-image:radial-gradient(50%_60%_at_0%_0%,color-mix(in_oklab,var(--primary)_14%,transparent),transparent_70%)] rtl:[background-image:radial-gradient(50%_60%_at_100%_0%,color-mix(in_oklab,var(--primary)_14%,transparent),transparent_70%)]"
        />
        <div className="flex flex-col items-start gap-4 lg:justify-center">
          {eyebrow === null ? null : (
            <Badge variant="soft">
              <Clock aria-hidden="true" />
              {eyebrow ?? t("landingStore.dealsEyebrow")}
            </Badge>
          )}
          {heading ? (
            <h2 id={headingId} className="font-display text-h2 uppercase text-balance">
              {heading}
            </h2>
          ) : null}
          <p className="text-body text-pretty text-muted-foreground">
            {description ?? t("landingStore.dealsDescription")}
          </p>
          {shopAll ? <ActionButton action={shopAll} size="md" /> : null}
        </div>
        <ProductGrid
          products={products ?? defaultDeals(t)}
          currency={currency}
          onAddToCart={onAddToCart}
          onWishlistChange={onWishlistChange}
          className="lg:grid-cols-3"
        />
      </div>
    </section>
  );
}

function StoreValueProps({
  valueProps = {},
  currency,
}: {
  valueProps?: LandingStoreValuePropsProps;
  currency: string;
}) {
  const { t, locale } = useI18n();
  const headingId = React.useId();
  const {
    id = LANDING_STORE_SECTION_IDS.valueProps,
    label,
    items,
    className,
    ...rest
  } = valueProps;
  const freeShippingOver = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(50);

  return (
    <section
      id={id}
      data-slot="landing-store-value-props"
      aria-labelledby={headingId}
      className={cn("scroll-mt-(--header-h) border-y bg-surface-1", className)}
      {...rest}
    >
      <h2 id={headingId} className="sr-only">
        {label ?? t("landingStore.valuePropsLabel")}
      </h2>
      <ul className="mx-auto grid w-full max-w-(--container-content) gap-6 px-(--gutter) py-8 sm:grid-cols-3">
        {(items ?? defaultValueProps(t, freeShippingOver)).map((item, index) => (
          <li key={index} data-slot="landing-store-value-prop" className="flex items-start gap-4">
            {item.icon ? (
              <span
                aria-hidden="true"
                className="flex size-10 shrink-0 items-center justify-center rounded-md border bg-card text-primary [&_svg]:size-5"
              >
                {item.icon}
              </span>
            ) : null}
            <div className="flex flex-col gap-1">
              <h3 className="text-body font-semibold">{item.title}</h3>
              {item.description ? (
                <p className="text-sm text-pretty text-muted-foreground">{item.description}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function StoreNewsletter({ newsletter = {} }: { newsletter?: LandingStoreNewsletterProps }) {
  const { t } = useI18n();
  const id = React.useId();
  const headingId = `${id}-heading`;
  const emailId = `${id}-email`;
  const errorId = `${id}-error`;
  const {
    id: sectionIdProp = LANDING_STORE_SECTION_IDS.newsletter,
    title,
    description,
    emailLabel,
    placeholder,
    submitLabel,
    successMessage,
    invalidMessage,
    onSubscribe,
    className,
    ...rest
  } = newsletter;

  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "invalid" | "subscribed">("idle");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = email.trim();
    if (!EMAIL_PATTERN.test(value)) {
      setStatus("invalid");
      return;
    }
    onSubscribe?.(value);
    setStatus("subscribed");
    setEmail("");
  };

  const invalid = status === "invalid";

  return (
    <section
      id={sectionIdProp}
      data-slot="landing-store-newsletter"
      aria-labelledby={headingId}
      className={cn(
        "mx-auto w-full max-w-(--container-content) scroll-mt-(--header-h) px-(--gutter) py-(--section-y)",
        className,
      )}
      {...rest}
    >
      <div className="grid gap-8 rounded-card border bg-card p-6 text-card-foreground shadow-1 sm:p-10 lg:grid-cols-2 lg:items-center lg:gap-12">
        <div className="flex flex-col gap-3">
          <span
            aria-hidden="true"
            className="mb-2 flex size-10 items-center justify-center rounded-md bg-primary/12 text-primary [&_svg]:size-5"
          >
            <Mail />
          </span>
          <h2 id={headingId} className="font-display text-h2 uppercase text-balance">
            {title ?? t("landingStore.newsletterTitle")}
          </h2>
          <p className="text-body text-pretty text-muted-foreground">
            {description ?? t("landingStore.newsletterDescription")}
          </p>
        </div>

        <form
          data-slot="landing-store-newsletter-form"
          noValidate
          onSubmit={handleSubmit}
          className="flex flex-col gap-3"
        >
          <Label htmlFor={emailId}>{emailLabel ?? t("landingStore.newsletterEmailLabel")}</Label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              id={emailId}
              type="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              placeholder={placeholder ?? t("landingStore.newsletterPlaceholder")}
              aria-invalid={invalid || undefined}
              aria-describedby={invalid ? errorId : undefined}
              onChange={(event) => {
                setEmail(event.target.value);
                if (status !== "idle") setStatus("idle");
              }}
              className="sm:flex-1"
            />
            <Button type="submit" className="shrink-0">
              {submitLabel ?? t("landingStore.newsletterSubmit")}
            </Button>
          </div>
          {invalid ? (
            <p id={errorId} role="alert" className="text-sm font-medium text-destructive">
              {invalidMessage ?? t("landingStore.newsletterInvalid")}
            </p>
          ) : null}
          {/* Always mounted, so the confirmation is announced when it appears. */}
          <p role="status" className="text-sm font-medium text-success">
            {status === "subscribed"
              ? (successMessage ?? t("landingStore.newsletterSuccess"))
              : null}
          </p>
        </form>
      </div>
    </section>
  );
}

function StoreFooter({
  brand,
  footer = {},
  categoriesId,
}: {
  brand: string;
  footer?: SiteFooterProps;
  categoriesId?: string;
}) {
  const { t } = useI18n();
  const { brand: brandNode, blurb, groups, legal, copyright, ...rest } = footer;
  const shop = categoriesId ? `#${categoriesId}` : "#";

  return (
    <SiteFooter
      brand={brandNode ?? brand}
      blurb={blurb ?? t("landingStore.footerBlurb")}
      groups={
        groups ?? [
          {
            title: t("landingStore.footerShop"),
            links: [
              { label: t("landingStore.categoryKitchen"), href: shop },
              { label: t("landingStore.categoryHome"), href: shop },
              { label: t("landingStore.categoryLighting"), href: shop },
              { label: t("landingStore.categoryTextiles"), href: shop },
            ],
          },
          {
            title: t("landingStore.footerHelp"),
            links: [
              { label: t("landingStore.footerShipping"), href: "#" },
              { label: t("landingStore.footerReturns"), href: "#" },
              { label: t("landingStore.footerContact"), href: "#" },
            ],
          },
          {
            title: t("landingStore.footerCompany"),
            links: [
              { label: t("landingStore.footerAbout"), href: "#" },
              { label: t("landingStore.footerJournal"), href: "#" },
            ],
          },
        ]
      }
      legal={
        legal ?? [
          { label: t("landingStore.footerPrivacy"), href: "#" },
          { label: t("landingStore.footerTerms"), href: "#" },
        ]
      }
      copyright={copyright ?? `© ${new Date().getFullYear()} ${brand}`}
      {...rest}
    />
  );
}

/* ------------------------------------------------------------------ page */

function LandingStore({
  className,
  brand = DEFAULT_BRAND,
  currency = "USD",
  cartCount: cartCountProp,
  defaultCartCount = 0,
  header,
  hero,
  categories,
  featured,
  deals,
  valueProps,
  newsletter,
  footer,
  onAddToCart,
  onWishlistChange,
  skipLinkLabel,
  ...props
}: LandingStoreProps) {
  const { t } = useI18n();
  const [innerCount, setInnerCount] = React.useState(defaultCartCount);
  const cartCount = cartCountProp ?? innerCount;
  const [announcement, setAnnouncement] = React.useState("");

  const handleAddToCart = (product: LandingStoreProduct) => {
    if (cartCountProp === undefined) setInnerCount((count) => count + 1);
    setAnnouncement(t("landingStore.addedToCart", { title: product.title }));
    onAddToCart?.(product);
  };

  const ids = {
    categories: sectionId(categories, LANDING_STORE_SECTION_IDS.categories),
    featured: sectionId(featured, LANDING_STORE_SECTION_IDS.featured),
    deals: sectionId(deals, LANDING_STORE_SECTION_IDS.deals),
  };

  return (
    <div
      data-slot="landing-store"
      className={cn(
        "relative flex min-h-svh w-full flex-col overflow-x-clip bg-background text-foreground",
        className,
      )}
      {...props}
    >
      <a
        href={`#${MAIN_ID}`}
        data-slot="landing-store-skip-link"
        className={cn(
          "sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-(--z-overlay)",
          "focus:rounded-control focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:shadow-2",
          "outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
      >
        {skipLinkLabel ?? t("landingStore.skipToContent")}
      </a>

      {shown(header) ? <StoreHeader brand={brand} cartCount={cartCount} header={header} /> : null}

      <main
        id={MAIN_ID}
        tabIndex={-1}
        data-slot="landing-store-main"
        className="flex-1 outline-none"
      >
        {shown(hero) ? (
          <StoreHero hero={hero} featuredId={ids.featured} dealsId={ids.deals} />
        ) : null}
        {shown(categories) ? <StoreCategories categories={categories} /> : null}
        {shown(featured) ? (
          <StoreFeatured
            featured={featured}
            currency={currency}
            onAddToCart={handleAddToCart}
            onWishlistChange={onWishlistChange}
          />
        ) : null}
        {shown(deals) ? (
          <StoreDeals
            deals={deals}
            currency={currency}
            onAddToCart={handleAddToCart}
            onWishlistChange={onWishlistChange}
          />
        ) : null}
        {shown(valueProps) ? <StoreValueProps valueProps={valueProps} currency={currency} /> : null}
        {shown(newsletter) ? <StoreNewsletter newsletter={newsletter} /> : null}
      </main>

      {shown(footer) ? (
        <StoreFooter brand={brand} footer={footer} categoriesId={ids.categories} />
      ) : null}

      <p role="status" data-slot="landing-store-announcer" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}

export { LandingStore };
