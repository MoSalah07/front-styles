"use client";

/** Developer-platform marketing homepage composed from the marketing blocks: navbar, hero, logo strip, features, a code-and-preview section, three steps, stats, pricing, testimonials, FAQ, closing call to action and footer, each one replaceable or hidden through its own prop. */
import * as React from "react";
import {
  ArrowRight,
  Blocks,
  BookOpen,
  ChartColumn,
  Check,
  CircleCheck,
  Clock,
  Globe,
  Hexagon,
  Leaf,
  Mountain,
  Orbit,
  Plug,
  Rocket,
  ShieldCheck,
  Triangle,
  UserPlus,
  Waves,
  Webhook,
  Zap,
} from "lucide-react";
import { Badge } from "../components/badge";
import { Button } from "../components/button";
import { CodeBlock, type CodeBlockProps } from "../blocks/code-block";
import { CtaBanner, type CtaBannerProps } from "../blocks/cta-banner";
import { Faq, type FaqItem, type FaqProps } from "../blocks/faq";
import {
  FeatureCard,
  FeatureGrid,
  type FeatureCardProps,
  type FeatureGridProps,
} from "../blocks/feature-grid";
import {
  Hero,
  HeroActions,
  HeroDescription,
  HeroEyebrow,
  HeroMedia,
  HeroTitle,
  type HeroProps,
} from "../blocks/hero";
import { LogoMarquee, LogoMarqueeItem, type LogoMarqueeProps } from "../blocks/logo-marquee";
import {
  PricingTable,
  PricingTier,
  type PricingPeriod,
  type PricingTableProps,
  type PricingTierProps,
} from "../blocks/pricing-table";
import { SiteFooter, type SiteFooterProps } from "../blocks/site-footer";
import { SiteNavbar, type SiteNavbarLink, type SiteNavbarProps } from "../blocks/site-navbar";
import {
  AnimatedNumber,
  StatBento,
  StatBentoTile,
  type StatBentoProps,
  type StatBentoTileProps,
} from "../blocks/stat-bento";
import {
  TestimonialCard,
  Testimonials,
  type TestimonialCardProps,
  type TestimonialsProps,
} from "../blocks/testimonials";
import { cn } from "../lib/cn";
import { useI18n, type TranslateFn } from "../lib/i18n";

/* ------------------------------------------------------------------ types */

/** A section prop: omit it for the demo content, pass `null` or `false` to leave the section out. */
export type LandingSaasSection<T> = T | null | false;

/** Eyebrow, heading and lead paragraph shared by every titled section. */
export interface LandingSaasHeading {
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
}

export interface LandingSaasAction {
  label: React.ReactNode;
  /** Renders a link. Without it the action is a button driving `onClick`. */
  href?: string;
  onClick?: () => void;
}

export interface LandingSaasHeroProps extends Omit<HeroProps, "title">, LandingSaasHeading {
  /** `null` removes the button. */
  primaryAction?: LandingSaasAction | null;
  secondaryAction?: LandingSaasAction | null;
  /** Replaces the decorative product mock. `null` removes the media column. */
  media?: React.ReactNode;
}

export interface LandingSaasLogosProps extends Omit<LogoMarqueeProps, "title"> {
  /** Line above the strip; also names the strip for assistive tech. */
  title?: React.ReactNode;
  /** One node per logo. Each is wrapped in a `LogoMarqueeItem`. */
  items?: React.ReactNode[];
}

export interface LandingSaasFeaturesProps
  extends Omit<FeatureGridProps, "title">, LandingSaasHeading {
  items?: FeatureCardProps[];
}

export interface LandingSaasCodeProps
  extends Omit<Partial<CodeBlockProps>, "title">, LandingSaasHeading {
  /** Short selling points listed under the heading. */
  points?: React.ReactNode[];
  /** Panel beside the code showing what it produces. `null` removes it. */
  preview?: React.ReactNode;
}

export interface LandingSaasStep {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
}

export interface LandingSaasStepsProps
  extends Omit<React.ComponentProps<"ol">, "title">, LandingSaasHeading {
  items?: LandingSaasStep[];
}

export interface LandingSaasStatsProps extends Omit<StatBentoProps, "title">, LandingSaasHeading {
  items?: StatBentoTileProps[];
}

export interface LandingSaasTier extends Omit<PricingTierProps, "price"> {
  /** Already formatted, e.g. "$29". */
  monthlyPrice: React.ReactNode;
  /** Shown while the table is on annual billing. Falls back to `monthlyPrice`. */
  annualPrice?: React.ReactNode;
}

export interface LandingSaasPricingProps
  extends Omit<PricingTableProps, "title">, LandingSaasHeading {
  tiers?: LandingSaasTier[];
  /** Starting period when `period` is not controlled. */
  defaultPeriod?: PricingPeriod;
}

export interface LandingSaasTestimonialsProps
  extends Omit<TestimonialsProps, "title">, LandingSaasHeading {
  items?: TestimonialCardProps[];
}

export interface LandingSaasProps extends React.ComponentProps<"div"> {
  /** Product name, used in the default logo, copy, code sample and footer. */
  brand?: string;
  navbar?: LandingSaasSection<SiteNavbarProps>;
  hero?: LandingSaasSection<LandingSaasHeroProps>;
  logos?: LandingSaasSection<LandingSaasLogosProps>;
  features?: LandingSaasSection<LandingSaasFeaturesProps>;
  /** The code-and-preview section. */
  code?: LandingSaasSection<LandingSaasCodeProps>;
  /** The three-step "how it works" row. */
  steps?: LandingSaasSection<LandingSaasStepsProps>;
  stats?: LandingSaasSection<LandingSaasStatsProps>;
  pricing?: LandingSaasSection<LandingSaasPricingProps>;
  testimonials?: LandingSaasSection<LandingSaasTestimonialsProps>;
  faq?: LandingSaasSection<FaqProps>;
  cta?: LandingSaasSection<Partial<CtaBannerProps>>;
  footer?: LandingSaasSection<SiteFooterProps>;
  /** Text of the skip link that jumps past the navbar. */
  skipLinkLabel?: string;
}

/**
 * The anchor each section gets when its props carry no `id` of their own.
 * The default navbar and footer links point at these.
 */
export const LANDING_SAAS_SECTION_IDS = {
  hero: "hero",
  logos: "logos",
  features: "features",
  code: "developers",
  steps: "how-it-works",
  stats: "stats",
  pricing: "pricing",
  testimonials: "testimonials",
  faq: "faq",
  cta: "get-started",
} as const;

const MAIN_ID = "main-content";

/** Invented product used when no `brand` is given. */
const DEFAULT_BRAND = "Relayform";

function shown<T>(section: LandingSaasSection<T> | undefined): section is T | undefined {
  return section !== null && section !== false;
}

/* --------------------------------------------------------------- helpers */

function ActionButton({
  action,
  variant,
  size = "lg",
  className,
}: {
  action: LandingSaasAction;
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

function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: LandingSaasHeading & { id: string; align?: "center" | "start"; className?: string }) {
  if (!eyebrow && !title && !description) return null;

  return (
    <div
      data-slot="landing-saas-heading"
      className={cn(
        "flex max-w-2xl flex-col gap-4",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="text-eyebrow font-semibold uppercase text-primary">{eyebrow}</p>
      ) : null}
      {title ? (
        <h2 id={id} className="font-display text-h2 uppercase text-balance">
          {title}
        </h2>
      ) : null}
      {description ? (
        <p className="text-body-lg text-pretty text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

/** A titled, anchored band of the page. `id` lands here rather than on the block inside. */
function Section({
  id,
  slot,
  heading,
  className,
  children,
}: {
  id: string;
  slot: string;
  heading: LandingSaasHeading;
  className?: string;
  children: React.ReactNode;
}) {
  const headingId = React.useId();

  return (
    <section
      id={id}
      data-slot={slot}
      aria-labelledby={heading.title ? headingId : undefined}
      className={cn(
        "mx-auto w-full max-w-(--container-content) scroll-mt-(--header-h) px-(--gutter) py-(--section-y)",
        className,
      )}
    >
      <SectionHeading id={headingId} {...heading} className="mb-12" />
      {children}
    </section>
  );
}

function BrandLogo({ brand }: { brand: string }) {
  return (
    <a
      href="/"
      data-slot="landing-saas-logo"
      className={cn(
        "inline-flex items-center gap-2 font-display text-2xl tracking-wide",
        "rounded-control outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      <span aria-hidden="true" className="inline-block size-6 rounded-sm brand-surface" />
      {brand}
    </a>
  );
}

/* ---------------------------------------------------------- demo content */

/** A sample SDK call, built from the brand so that renaming the product renames its SDK too. */
function defaultCode(brand: string): string {
  const client = brand.replace(/[^A-Za-z0-9]/g, "") || "Client";
  const pkg = client.toLowerCase();

  return [
    `import { ${client} } from "@${pkg}/node";`,
    "",
    `const ${pkg} = new ${client}(process.env.${pkg.toUpperCase()}_SECRET_KEY);`,
    "",
    `const invoice = await ${pkg}.invoices.create({`,
    `  customer: "cus_4f9a2c",`,
    `  plan: "growth",`,
    `  amount: 4900,`,
    `  currency: "usd",`,
    "});",
    "",
    "console.log(invoice.status); // paid",
    "",
  ].join("\n");
}

/** Invented wordmarks for the logo strip. */
const DEFAULT_LOGOS: Array<{ name: string; icon: React.ReactNode }> = [
  { name: "Quillmere", icon: <Hexagon /> },
  { name: "Tidewell", icon: <Waves /> },
  { name: "Vantora", icon: <Triangle /> },
  { name: "Ferrowind", icon: <Orbit /> },
  { name: "Solenne", icon: <Leaf /> },
  { name: "Brackenly", icon: <Mountain /> },
];

function defaultFeatures(t: TranslateFn): FeatureCardProps[] {
  return [
    {
      icon: <Zap />,
      title: t("landingSaas.featureSpeedTitle"),
      description: t("landingSaas.featureSpeedDescription"),
    },
    {
      icon: <Webhook />,
      title: t("landingSaas.featureWebhooksTitle"),
      description: t("landingSaas.featureWebhooksDescription"),
    },
    {
      icon: <Globe />,
      title: t("landingSaas.featureGlobalTitle"),
      description: t("landingSaas.featureGlobalDescription"),
    },
    {
      icon: <ShieldCheck />,
      title: t("landingSaas.featureSecurityTitle"),
      description: t("landingSaas.featureSecurityDescription"),
    },
    {
      icon: <ChartColumn />,
      title: t("landingSaas.featureAnalyticsTitle"),
      description: t("landingSaas.featureAnalyticsDescription"),
    },
    {
      icon: <Blocks />,
      title: t("landingSaas.featureComposableTitle"),
      description: t("landingSaas.featureComposableDescription"),
    },
  ];
}

function defaultSteps(t: TranslateFn): LandingSaasStep[] {
  return [
    {
      icon: <UserPlus />,
      title: t("landingSaas.stepSignUpTitle"),
      description: t("landingSaas.stepSignUpDescription"),
    },
    {
      icon: <Plug />,
      title: t("landingSaas.stepConnectTitle"),
      description: t("landingSaas.stepConnectDescription"),
    },
    {
      icon: <Rocket />,
      title: t("landingSaas.stepLaunchTitle"),
      description: t("landingSaas.stepLaunchDescription"),
    },
  ];
}

function defaultStats(t: TranslateFn, locale: string): StatBentoTileProps[] {
  const percent = new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const compact = new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 });
  const milliseconds = new Intl.NumberFormat(locale, {
    style: "unit",
    unit: "millisecond",
    unitDisplay: "short",
    maximumFractionDigits: 0,
  });

  return [
    {
      size: "lg",
      featured: true,
      icon: <ShieldCheck />,
      value: <AnimatedNumber value={0.9999} format={(n) => percent.format(n)} />,
      label: t("landingSaas.statUptime"),
      description: t("landingSaas.statUptimeDescription"),
    },
    {
      size: "wide",
      icon: <Zap />,
      value: <AnimatedNumber value={12_000_000_000} format={(n) => compact.format(n)} />,
      label: t("landingSaas.statRequests"),
    },
    {
      icon: <Clock />,
      value: <AnimatedNumber value={38} format={(n) => milliseconds.format(n)} />,
      label: t("landingSaas.statLatency"),
    },
    {
      icon: <Rocket />,
      value: <AnimatedNumber value={4200} format={(n) => compact.format(n)} />,
      label: t("landingSaas.statTeams"),
    },
  ];
}

function defaultTiers(t: TranslateFn, locale: string): LandingSaasTier[] {
  const money = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const period = t("landingSaas.pricingPeriod");

  return [
    {
      name: t("landingSaas.tierStarter"),
      monthlyPrice: money.format(0),
      period,
      description: t("landingSaas.tierStarterDescription"),
      features: [
        t("landingSaas.featureProjects", { count: 3 }),
        t("landingSaas.featureRequests", { count: 100_000 }),
        t("landingSaas.featureCommunitySupport"),
      ],
      cta: (
        <Button asChild variant="outline">
          <a href="/sign-up">{t("landingSaas.ctaStartFree")}</a>
        </Button>
      ),
    },
    {
      name: t("landingSaas.tierGrowth"),
      monthlyPrice: money.format(29),
      annualPrice: money.format(23),
      period,
      description: t("landingSaas.tierGrowthDescription"),
      featured: true,
      badge: t("landingSaas.pricingPopular"),
      features: [
        t("landingSaas.featureProjects", { count: 25 }),
        t("landingSaas.featureRequests", { count: 5_000_000 }),
        t("landingSaas.featurePrioritySupport"),
        t("landingSaas.featureUsageAlerts"),
      ],
      cta: (
        <Button asChild variant="secondary">
          <a href="/sign-up">{t("landingSaas.ctaStartTrial")}</a>
        </Button>
      ),
    },
    {
      name: t("landingSaas.tierScale"),
      monthlyPrice: money.format(99),
      annualPrice: money.format(79),
      period,
      description: t("landingSaas.tierScaleDescription"),
      features: [
        t("landingSaas.featureUnlimitedProjects"),
        t("landingSaas.featureSso"),
        t("landingSaas.featureSla"),
        t("landingSaas.featureAuditLog"),
      ],
      cta: (
        <Button asChild variant="outline">
          <a href="/contact">{t("landingSaas.ctaContactSales")}</a>
        </Button>
      ),
    },
  ];
}

/** Invented people; names stay as written in every language. */
function defaultTestimonials(t: TranslateFn): TestimonialCardProps[] {
  return [
    {
      quote: t("landingSaas.quotePlatform"),
      name: "Nour Hassan",
      role: t("landingSaas.rolePlatform"),
      avatar: { fallback: "NH" },
    },
    {
      quote: t("landingSaas.quoteOnCall"),
      name: "Priya Raman",
      role: t("landingSaas.roleOnCall"),
      avatar: { fallback: "PR" },
    },
    {
      quote: t("landingSaas.quoteFinance"),
      name: "Omar Farouk",
      role: t("landingSaas.roleFinance"),
      avatar: { fallback: "OF" },
    },
  ];
}

function defaultFaq(t: TranslateFn): FaqItem[] {
  return [
    {
      value: "free",
      question: t("landingSaas.faqFreeQuestion"),
      answer: t("landingSaas.faqFreeAnswer"),
    },
    {
      value: "migrate",
      question: t("landingSaas.faqMigrateQuestion"),
      answer: t("landingSaas.faqMigrateAnswer"),
    },
    {
      value: "sdk",
      question: t("landingSaas.faqSdkQuestion"),
      answer: t("landingSaas.faqSdkAnswer"),
    },
    {
      value: "security",
      question: t("landingSaas.faqSecurityQuestion"),
      answer: t("landingSaas.faqSecurityAnswer"),
    },
  ];
}

/* -------------------------------------------------------------- sections */

/** Decorative dashboard drawn entirely from tokens, so it follows the brand and the colour mode. */
function ProductMock() {
  const bars = [34, 48, 41, 56, 52, 63, 58, 72, 66, 81, 77, 92];

  return (
    <div data-slot="landing-saas-mock" className="flex flex-col gap-4 bg-card p-4 sm:p-6">
      <div className="flex items-center gap-1.5">
        <span className="size-2.5 rounded-full bg-surface-3" />
        <span className="size-2.5 rounded-full bg-surface-3" />
        <span className="size-2.5 rounded-full bg-surface-3" />
        <span className="ms-3 h-2 w-24 rounded-full bg-surface-2" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((index) => (
          <div key={index} className="flex flex-col gap-2 rounded-md border bg-surface-1 p-3">
            <span className="h-1.5 w-1/2 rounded-full bg-muted-foreground/30" />
            <span
              className={cn(
                "h-3 w-3/4 rounded-full",
                index === 0 ? "bg-primary" : "bg-foreground/15",
              )}
            />
          </div>
        ))}
      </div>
      <div className="flex h-40 items-end gap-1.5 rounded-md border bg-surface-1 p-4 sm:h-48">
        {bars.map((height, index) => (
          <span
            key={index}
            className={cn(
              "flex-1 rounded-t-xs",
              index === bars.length - 1 ? "bg-primary" : "bg-primary/25",
            )}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="flex items-center gap-3 rounded-md border bg-surface-1 px-3 py-2"
          >
            <span className="size-6 shrink-0 rounded-full bg-surface-3" />
            <span className="h-2 flex-1 rounded-full bg-foreground/10" />
            <span
              className={cn(
                "h-4 w-12 rounded-badge",
                index === 1 ? "bg-warning/30" : "bg-success/30",
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function SaasNavbar({
  brand,
  sectionIds,
  navbar = {},
}: {
  brand: string;
  sectionIds: Partial<Record<"features" | "code" | "pricing" | "faq", string>>;
  navbar?: SiteNavbarProps;
}) {
  const { t } = useI18n();
  const { logo, links, actions, ...rest } = navbar;

  // A link to a hidden section would scroll nowhere, so it is left out.
  const defaultLinks: SiteNavbarLink[] = [
    { label: t("landingSaas.navFeatures"), id: sectionIds.features },
    { label: t("landingSaas.navDevelopers"), id: sectionIds.code },
    { label: t("landingSaas.navPricing"), id: sectionIds.pricing },
    { label: t("landingSaas.navFaq"), id: sectionIds.faq },
  ].flatMap(({ label, id }) => (id ? [{ label, href: `#${id}` }] : []));

  return (
    <SiteNavbar
      logo={logo ?? <BrandLogo brand={brand} />}
      links={links ?? defaultLinks}
      actions={
        actions ?? (
          <>
            <Button asChild variant="ghost" size="sm">
              <a href="/sign-in">{t("landingSaas.signIn")}</a>
            </Button>
            <Button asChild size="sm">
              <a href={sectionIds.pricing ? `#${sectionIds.pricing}` : "#"}>
                {t("landingSaas.getStarted")}
              </a>
            </Button>
          </>
        )
      }
      {...rest}
    />
  );
}

function SaasHero({
  brand,
  hero = {},
  pricingId,
  codeId,
}: {
  brand: string;
  hero?: LandingSaasHeroProps;
  pricingId?: string;
  codeId?: string;
}) {
  const { t } = useI18n();
  const {
    id = LANDING_SAAS_SECTION_IDS.hero,
    eyebrow,
    title,
    description,
    primaryAction,
    secondaryAction,
    media,
    variant = "split",
    decoration = "gradient",
    className,
    ...rest
  } = hero;

  const primary =
    primaryAction === undefined
      ? {
          label: (
            <>
              {t("landingSaas.heroPrimary")}
              <ArrowRight aria-hidden="true" className="rtl:-scale-x-100" />
            </>
          ),
          href: pricingId ? `#${pricingId}` : "#",
        }
      : primaryAction;
  const secondary =
    secondaryAction === undefined
      ? {
          label: (
            <>
              <BookOpen aria-hidden="true" />
              {t("landingSaas.heroSecondary")}
            </>
          ),
          href: codeId ? `#${codeId}` : "#",
        }
      : secondaryAction;

  return (
    <Hero
      id={id}
      variant={variant}
      decoration={decoration}
      className={cn("scroll-mt-(--header-h)", className)}
      {...rest}
    >
      {eyebrow === null ? null : (
        <HeroEyebrow>{eyebrow ?? t("landingSaas.heroEyebrow")}</HeroEyebrow>
      )}
      <HeroTitle>{title ?? t("landingSaas.heroTitle")}</HeroTitle>
      <HeroDescription>
        {description ?? t("landingSaas.heroDescription", { brand })}
      </HeroDescription>
      {primary || secondary ? (
        <HeroActions>
          {primary ? <ActionButton action={primary} /> : null}
          {secondary ? <ActionButton action={secondary} variant="outline" /> : null}
        </HeroActions>
      ) : null}
      {media === null ? null : (
        <HeroMedia aria-hidden={media === undefined ? true : undefined}>
          {media ?? <ProductMock />}
        </HeroMedia>
      )}
    </Hero>
  );
}

function SaasLogos({ logos = {} }: { logos?: LandingSaasLogosProps }) {
  const { t } = useI18n();
  const headingId = React.useId();
  const { id = LANDING_SAAS_SECTION_IDS.logos, title, items, label, ...rest } = logos;
  const heading = title ?? t("landingSaas.logosTitle");

  const nodes =
    items ??
    DEFAULT_LOGOS.map(({ name, icon }) => (
      <span
        key={name}
        className="inline-flex items-center gap-2 font-display text-2xl tracking-wide"
      >
        <span aria-hidden="true" className="flex h-6 items-center">
          {icon}
        </span>
        {name}
      </span>
    ));

  return (
    <section
      id={id}
      data-slot="landing-saas-logos"
      aria-labelledby={heading ? headingId : undefined}
      className="mx-auto w-full max-w-(--container-content) scroll-mt-(--header-h) px-(--gutter) py-12"
    >
      {heading ? (
        <h2 id={headingId} className="mb-8 text-center text-sm font-medium text-muted-foreground">
          {heading}
        </h2>
      ) : null}
      <LogoMarquee label={label ?? (typeof heading === "string" ? heading : undefined)} {...rest}>
        {nodes.map((node, index) => (
          <LogoMarqueeItem key={index}>{node}</LogoMarqueeItem>
        ))}
      </LogoMarquee>
    </section>
  );
}

function SaasFeatures({ features = {} }: { features?: LandingSaasFeaturesProps }) {
  const { t } = useI18n();
  const {
    id = LANDING_SAAS_SECTION_IDS.features,
    eyebrow,
    title,
    description,
    items,
    children,
    ...rest
  } = features;

  return (
    <Section
      id={id}
      slot="landing-saas-features"
      heading={{
        eyebrow: eyebrow ?? t("landingSaas.featuresEyebrow"),
        title: title ?? t("landingSaas.featuresTitle"),
        description: description ?? t("landingSaas.featuresDescription"),
      }}
    >
      <FeatureGrid {...rest}>
        {(items ?? defaultFeatures(t)).map((item, index) => (
          <FeatureCard key={index} {...item} />
        ))}
        {children}
      </FeatureGrid>
    </Section>
  );
}

function ResponsePreview({ brand }: { brand: string }) {
  const { t, locale } = useI18n();
  const amount = new Intl.NumberFormat(locale, { style: "currency", currency: "USD" }).format(49);

  const rows: Array<[string, React.ReactNode]> = [
    [t("landingSaas.previewCustomer"), <bdi key="customer">nour@example.com</bdi>],
    [t("landingSaas.previewPlan"), t("landingSaas.tierGrowth")],
    [
      t("landingSaas.previewAmount"),
      <span key="amount" className="tabular-nums">
        {amount}
      </span>,
    ],
  ];

  return (
    <div
      data-slot="landing-saas-preview"
      className="flex flex-col gap-4 rounded-card border bg-card p-5 text-card-foreground shadow-2"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <span aria-hidden="true" className="size-2 rounded-full bg-success" />
          {t("landingSaas.previewTitle")}
        </p>
        <Badge variant="success">
          <CircleCheck aria-hidden="true" />
          {t("landingSaas.previewStatus")}
        </Badge>
      </div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
        {rows.map(([term, value]) => (
          <React.Fragment key={term}>
            <dt className="text-muted-foreground">{term}</dt>
            <dd className="text-end font-medium">{value}</dd>
          </React.Fragment>
        ))}
      </dl>
      <p className="flex items-center gap-2 border-t pt-4 text-xs text-muted-foreground">
        <Clock aria-hidden="true" className="size-3.5" />
        {t("landingSaas.previewLatency", { ms: 84 })}
        <span className="ms-auto font-mono" aria-hidden="true">
          {brand.toLowerCase().replace(/[^a-z0-9]/g, "")}.invoices.create
        </span>
      </p>
    </div>
  );
}

function SaasCode({ brand, code: section = {} }: { brand: string; code?: LandingSaasCodeProps }) {
  const { t } = useI18n();
  const headingId = React.useId();
  const {
    id = LANDING_SAAS_SECTION_IDS.code,
    eyebrow,
    title,
    description,
    points,
    preview,
    code,
    label = "server.ts",
    className,
    ...rest
  } = section;

  const heading = {
    eyebrow: eyebrow ?? t("landingSaas.codeEyebrow"),
    title: title ?? t("landingSaas.codeTitle"),
    description: description ?? t("landingSaas.codeDescription"),
  };
  const list = points ?? [
    t("landingSaas.codePointIdempotent"),
    t("landingSaas.codePointSdks"),
    t("landingSaas.codePointTestMode"),
  ];

  return (
    <section
      id={id}
      data-slot="landing-saas-code"
      aria-labelledby={heading.title ? headingId : undefined}
      className="mx-auto w-full max-w-(--container-content) scroll-mt-(--header-h) px-(--gutter) py-(--section-y)"
    >
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="flex flex-col gap-8">
          <SectionHeading id={headingId} align="start" {...heading} />
          {list.length > 0 ? (
            <ul data-slot="landing-saas-code-points" className="flex flex-col gap-3">
              {list.map((point, index) => (
                <li key={index} className="flex items-start gap-3 text-body">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary"
                  >
                    <Check className="size-3.5" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="relative isolate flex min-w-0 flex-col gap-4">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-(--z-below) rounded-full bg-primary/10 blur-3xl"
          />
          <CodeBlock
            code={code ?? defaultCode(brand)}
            label={label}
            lineNumbers
            className={cn("shadow-2", className)}
            {...rest}
          />
          {preview === null ? null : (
            <div className="lg:-mt-10 lg:ms-12">{preview ?? <ResponsePreview brand={brand} />}</div>
          )}
        </div>
      </div>
    </section>
  );
}

function SaasSteps({ steps = {} }: { steps?: LandingSaasStepsProps }) {
  const { t, locale } = useI18n();
  const {
    id = LANDING_SAAS_SECTION_IDS.steps,
    eyebrow,
    title,
    description,
    items,
    className,
    ...rest
  } = steps;
  const number = new Intl.NumberFormat(locale);
  const list = items ?? defaultSteps(t);

  return (
    <Section
      id={id}
      slot="landing-saas-steps"
      heading={{
        eyebrow: eyebrow ?? t("landingSaas.stepsEyebrow"),
        title: title ?? t("landingSaas.stepsTitle"),
        description: description ?? t("landingSaas.stepsDescription"),
      }}
    >
      <ol
        data-slot="landing-saas-step-list"
        className={cn("grid gap-6 md:grid-cols-3", className)}
        {...rest}
      >
        {list.map((step, index) => (
          <li
            key={index}
            data-slot="landing-saas-step"
            className={cn(
              "relative flex flex-col gap-4 rounded-card border bg-card p-6 text-card-foreground shadow-1",
              // A short rule bridging the gap to the next card on wide screens.
              index < list.length - 1 &&
                "md:after:absolute md:after:top-11 md:after:start-full md:after:h-px md:after:w-6 md:after:bg-border md:after:content-['']",
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <span
                aria-hidden="true"
                className="flex size-10 items-center justify-center rounded-full brand-surface font-display text-h4"
              >
                {number.format(index + 1)}
              </span>
              {step.icon ? (
                <span aria-hidden="true" className="text-primary [&_svg]:size-5">
                  {step.icon}
                </span>
              ) : null}
            </div>
            <h3 className="text-h4 font-semibold">{step.title}</h3>
            {step.description ? (
              <p className="text-sm text-pretty text-muted-foreground">{step.description}</p>
            ) : null}
          </li>
        ))}
      </ol>
    </Section>
  );
}

function SaasStats({ stats = {} }: { stats?: LandingSaasStatsProps }) {
  const { t, locale } = useI18n();
  const {
    id = LANDING_SAAS_SECTION_IDS.stats,
    eyebrow,
    title,
    description,
    items,
    ...rest
  } = stats;

  return (
    <Section
      id={id}
      slot="landing-saas-stats"
      heading={{
        eyebrow: eyebrow ?? t("landingSaas.statsEyebrow"),
        title: title ?? t("landingSaas.statsTitle"),
        description,
      }}
    >
      <StatBento {...rest}>
        {(items ?? defaultStats(t, locale)).map((tile, index) => (
          <StatBentoTile key={index} {...tile} />
        ))}
      </StatBento>
    </Section>
  );
}

function SaasPricing({ pricing = {} }: { pricing?: LandingSaasPricingProps }) {
  const { t, locale } = useI18n();
  const {
    id = LANDING_SAAS_SECTION_IDS.pricing,
    eyebrow,
    title,
    description,
    tiers,
    period: periodProp,
    defaultPeriod = "monthly",
    onPeriodChange,
    annualNote,
    children,
    ...rest
  } = pricing;

  const [innerPeriod, setInnerPeriod] = React.useState<PricingPeriod>(defaultPeriod);
  const period = periodProp ?? innerPeriod;
  const handlePeriodChange = (next: PricingPeriod) => {
    setInnerPeriod(next);
    onPeriodChange?.(next);
  };

  return (
    <Section
      id={id}
      slot="landing-saas-pricing"
      heading={{
        eyebrow: eyebrow ?? t("landingSaas.navPricing"),
        title: title ?? t("landingSaas.pricingTitle"),
        description: description ?? t("landingSaas.pricingDescription"),
      }}
    >
      <PricingTable
        period={period}
        onPeriodChange={handlePeriodChange}
        annualNote={annualNote === undefined ? t("landingSaas.pricingAnnualNote") : annualNote}
        {...rest}
      >
        {(tiers ?? defaultTiers(t, locale)).map(({ monthlyPrice, annualPrice, ...tier }, index) => (
          <PricingTier
            key={index}
            price={period === "annual" ? (annualPrice ?? monthlyPrice) : monthlyPrice}
            {...tier}
          />
        ))}
        {children}
      </PricingTable>
    </Section>
  );
}

function SaasTestimonials({ testimonials = {} }: { testimonials?: LandingSaasTestimonialsProps }) {
  const { t } = useI18n();
  const {
    id = LANDING_SAAS_SECTION_IDS.testimonials,
    eyebrow,
    title,
    description,
    items,
    children,
    ...rest
  } = testimonials;

  return (
    <Section
      id={id}
      slot="landing-saas-testimonials"
      heading={{
        eyebrow: eyebrow ?? t("landingSaas.testimonialsEyebrow"),
        title: title ?? t("landingSaas.testimonialsTitle"),
        description,
      }}
    >
      <Testimonials {...rest}>
        {(items ?? defaultTestimonials(t)).map((item, index) => (
          <TestimonialCard key={index} {...item} />
        ))}
        {children}
      </Testimonials>
    </Section>
  );
}

function SaasFaq({ faq = {} }: { faq?: FaqProps }) {
  const { t } = useI18n();
  const {
    id = LANDING_SAAS_SECTION_IDS.faq,
    eyebrow,
    title,
    description,
    items,
    layout = "split",
    className,
    ...rest
  } = faq;

  return (
    <Faq
      id={id}
      layout={layout}
      eyebrow={eyebrow ?? t("landingSaas.navFaq")}
      title={title ?? t("landingSaas.faqTitle")}
      description={description ?? t("landingSaas.faqDescription")}
      items={items ?? defaultFaq(t)}
      className={cn("scroll-mt-(--header-h)", className)}
      {...rest}
    />
  );
}

function SaasCta({ cta = {}, pricingId }: { cta?: Partial<CtaBannerProps>; pricingId?: string }) {
  const { t } = useI18n();
  const {
    id = LANDING_SAAS_SECTION_IDS.cta,
    title,
    description,
    actions,
    className,
    ...rest
  } = cta;

  return (
    <div className="mx-auto w-full max-w-(--container-content) px-(--gutter) pb-(--section-y)">
      <CtaBanner
        id={id}
        title={title ?? t("landingSaas.ctaTitle")}
        description={description ?? t("landingSaas.ctaDescription")}
        actions={
          actions ?? (
            <>
              <Button asChild size="lg" variant="secondary">
                <a href={pricingId ? `#${pricingId}` : "#"}>
                  {t("landingSaas.getStarted")}
                  <ArrowRight aria-hidden="true" className="rtl:-scale-x-100" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="border border-current/30 hover:bg-brand-foreground/10 hover:text-current"
              >
                <a href="/contact">{t("landingSaas.ctaContactSales")}</a>
              </Button>
            </>
          )
        }
        className={cn("scroll-mt-(--header-h)", className)}
        {...rest}
      />
    </div>
  );
}

function SaasFooter({
  brand,
  footer = {},
  sectionIds,
}: {
  brand: string;
  footer?: SiteFooterProps;
  sectionIds: Partial<Record<"features" | "pricing", string>>;
}) {
  const { t } = useI18n();
  const { brand: brandNode, blurb, groups, legal, copyright, ...rest } = footer;
  const anchor = (sectionId: string | undefined) => (sectionId ? `#${sectionId}` : "#");

  return (
    <SiteFooter
      brand={brandNode ?? brand}
      blurb={blurb ?? t("landingSaas.footerBlurb", { brand })}
      groups={
        groups ?? [
          {
            title: t("landingSaas.footerProduct"),
            links: [
              { label: t("landingSaas.navFeatures"), href: anchor(sectionIds.features) },
              { label: t("landingSaas.navPricing"), href: anchor(sectionIds.pricing) },
              { label: t("landingSaas.footerChangelog"), href: "#" },
              { label: t("landingSaas.footerStatus"), href: "#" },
            ],
          },
          {
            title: t("landingSaas.navDevelopers"),
            links: [
              { label: t("landingSaas.footerDocs"), href: "#" },
              { label: t("landingSaas.footerApiReference"), href: "#" },
            ],
          },
          {
            title: t("landingSaas.footerCompany"),
            links: [
              { label: t("landingSaas.footerAbout"), href: "#" },
              { label: t("landingSaas.footerCareers"), href: "#" },
              { label: t("landingSaas.footerContact"), href: "#" },
            ],
          },
        ]
      }
      legal={
        legal ?? [
          { label: t("landingSaas.footerPrivacy"), href: "#" },
          { label: t("landingSaas.footerTerms"), href: "#" },
        ]
      }
      copyright={copyright ?? `© ${new Date().getFullYear()} ${brand}`}
      {...rest}
    />
  );
}

/* ------------------------------------------------------------------ page */

function sectionId<T extends { id?: string }>(
  section: LandingSaasSection<T> | undefined,
  fallback: string,
): string | undefined {
  if (!shown(section)) return undefined;
  return section?.id ?? fallback;
}

function LandingSaas({
  className,
  brand = DEFAULT_BRAND,
  navbar,
  hero,
  logos,
  features,
  code,
  steps,
  stats,
  pricing,
  testimonials,
  faq,
  cta,
  footer,
  skipLinkLabel,
  ...props
}: LandingSaasProps) {
  const { t } = useI18n();

  const ids = {
    features: sectionId(features, LANDING_SAAS_SECTION_IDS.features),
    code: sectionId(code, LANDING_SAAS_SECTION_IDS.code),
    pricing: sectionId(pricing, LANDING_SAAS_SECTION_IDS.pricing),
    faq: sectionId(faq, LANDING_SAAS_SECTION_IDS.faq),
  };

  return (
    <div
      data-slot="landing-saas"
      className={cn(
        "relative flex min-h-svh w-full flex-col overflow-x-clip bg-background text-foreground",
        className,
      )}
      {...props}
    >
      <a
        href={`#${MAIN_ID}`}
        data-slot="landing-saas-skip-link"
        className={cn(
          "sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-(--z-overlay)",
          "focus:rounded-control focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:shadow-2",
          "outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
      >
        {skipLinkLabel ?? t("landingSaas.skipToContent")}
      </a>

      {shown(navbar) ? <SaasNavbar brand={brand} sectionIds={ids} navbar={navbar} /> : null}

      <main
        id={MAIN_ID}
        tabIndex={-1}
        data-slot="landing-saas-main"
        className="flex-1 outline-none"
      >
        {shown(hero) ? (
          <SaasHero brand={brand} hero={hero} pricingId={ids.pricing} codeId={ids.code} />
        ) : null}
        {shown(logos) ? <SaasLogos logos={logos} /> : null}
        {shown(features) ? <SaasFeatures features={features} /> : null}
        {shown(code) ? <SaasCode brand={brand} code={code} /> : null}
        {shown(steps) ? <SaasSteps steps={steps} /> : null}
        {shown(stats) ? <SaasStats stats={stats} /> : null}
        {shown(pricing) ? <SaasPricing pricing={pricing} /> : null}
        {shown(testimonials) ? <SaasTestimonials testimonials={testimonials} /> : null}
        {shown(faq) ? <SaasFaq faq={faq} /> : null}
        {shown(cta) ? <SaasCta cta={cta} pricingId={ids.pricing} /> : null}
      </main>

      {shown(footer) ? <SaasFooter brand={brand} footer={footer} sectionIds={ids} /> : null}
    </div>
  );
}

export { LandingSaas };
