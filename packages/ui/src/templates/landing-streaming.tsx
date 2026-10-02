"use client";

/** Cinematic, dark-first landing page for a video-streaming service: a full-bleed hero with email capture, carousel rows of poster tiles including a ranked top-ten row, alternating feature rows, an FAQ, a closing call to action and a footer. */
import * as React from "react";
import {
  ChevronRight,
  CircleAlert,
  Download,
  Laptop,
  Play,
  Smartphone,
  Smile,
  Sparkles,
  Tablet,
} from "lucide-react";
import { Button } from "../components/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/carousel";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { Faq, type FaqItem } from "../blocks/faq";
import { LanguageSelect } from "../blocks/language-select";
import { SiteFooter, type SiteFooterGroup, type SiteFooterLink } from "../blocks/site-footer";
import type { LocaleOption } from "../hooks/use-locale";
import { cn } from "../lib/cn";
import { useFormatters, useI18n, useT, type MessageKey, type TranslateFn } from "../lib/i18n";

export interface LandingStreamingTitle {
  /** Printed on the fallback tile, and the tile's accessible name. */
  title: string;
  /** Poster image. Without one the tile paints a token gradient with the title on it. */
  image?: string;
  /** Makes the tile a link. Without it the tile is a button that calls `onSelectTitle`. */
  href?: string;
}

export interface LandingStreamingRow {
  /** Row heading; also names the row's carousel region. */
  title: string;
  items: LandingStreamingTitle[];
  /** Draws a large rank numeral beside each tile, for a top-ten row. */
  ranked?: boolean;
}

export interface LandingStreamingFeature {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Illustration beside the text. Decorative, so it is hidden from assistive technology. */
  visual?: React.ReactNode;
}

export interface LandingStreamingProps extends Omit<React.ComponentProps<"div">, "title"> {
  /** Wordmark or logo in the top bar and the footer. Defaults to a text wordmark from the catalogue. */
  wordmark?: React.ReactNode;
  /** Where the default wordmark links. */
  homeHref?: string;
  /** Language control in the top bar. Defaults to a `LanguageSelect` bound to the active locale; pass `null` to remove it. */
  languageSelect?: React.ReactNode;
  /** Called when a language is picked from the default language control. Wire your router or i18n provider here. */
  onLocaleChange?: (locale: LocaleOption) => void;
  signInLabel?: string;
  /** Destination of the sign-in link. Omit it to get a button driving `onSignIn`. */
  signInHref?: string;
  onSignIn?: () => void;
  /** Hero background image. Without one, a token gradient over a wall of poster tiles stands in. */
  backgroundImage?: string;
  headline?: React.ReactNode;
  subline?: React.ReactNode;
  /** Line above each email form. */
  emailPrompt?: React.ReactNode;
  emailLabel?: string;
  /** Text of both submit buttons. */
  ctaLabel?: string;
  /** Heading above the second email form. */
  ctaTitle?: React.ReactNode;
  /** Receives a validated, trimmed email from either form. The template never navigates by itself. */
  onEmailSubmit?: (email: string) => void;
  /** Carousel rows of poster tiles. Defaults to neutral demo content from the catalogue. */
  rows?: LandingStreamingRow[];
  /** Called when a tile without an `href` is activated. */
  onSelectTitle?: (item: LandingStreamingTitle, row: LandingStreamingRow) => void;
  /** Feature rows, alternating text and visual on wide screens. */
  features?: LandingStreamingFeature[];
  faqTitle?: React.ReactNode;
  faqs?: FaqItem[];
  /** Footer link columns. */
  links?: SiteFooterGroup[];
  /** Links in the footer's bottom row. */
  legal?: SiteFooterLink[];
  footerBlurb?: React.ReactNode;
  /** Pins the page to the dark palette whatever the site's colour mode. On by default. */
  dark?: boolean;
}

/**
 * Tile backgrounds. Each mixes a brand or chart hue into the deepest neutrals,
 * so the fallback posters follow whichever brand is active and never read as
 * a fixed palette.
 */
const TILE_TONES = [
  "from-brand-600 via-brand-900 to-neutral-975",
  "from-chart-2 via-neutral-900 to-neutral-975",
  "from-brand-400 via-brand-800 to-neutral-975",
  "from-chart-3 via-neutral-900 to-neutral-975",
  "from-chart-4 via-neutral-900 to-neutral-975",
  "from-brand-700 via-neutral-900 to-neutral-975",
  "from-chart-5 via-neutral-900 to-neutral-975",
] as const;

/** The same title always gets the same tone, whichever row it appears in. */
function toneFor(title: string): string {
  let sum = 0;
  for (let index = 0; index < title.length; index += 1) sum += title.charCodeAt(index);
  return TILE_TONES[sum % TILE_TONES.length] ?? TILE_TONES[0];
}

const TITLE_KEYS = [
  "landingStreaming.title1",
  "landingStreaming.title2",
  "landingStreaming.title3",
  "landingStreaming.title4",
  "landingStreaming.title5",
  "landingStreaming.title6",
  "landingStreaming.title7",
  "landingStreaming.title8",
  "landingStreaming.title9",
  "landingStreaming.title10",
] as const satisfies readonly MessageKey[];

/**
 * Demo content, built from the catalogue rather than declared as constants: a
 * module-level array is evaluated once at import, before any provider exists,
 * so it could only ever hold one language.
 */
function defaultRowsFor(t: TranslateFn): LandingStreamingRow[] {
  const titles = (order: number[]) =>
    order.map((position) => ({ title: t(TITLE_KEYS[position - 1] ?? TITLE_KEYS[0]) }));

  return [
    { title: t("landingStreaming.rowTrending"), items: titles([3, 1, 6, 9, 2, 5, 10, 4]) },
    {
      title: t("landingStreaming.rowTop"),
      ranked: true,
      items: titles([2, 7, 1, 5, 9, 3, 8, 10, 4, 6]),
    },
  ];
}

function defaultFeaturesFor(t: TranslateFn): LandingStreamingFeature[] {
  return [
    {
      title: t("landingStreaming.featureTvTitle"),
      description: t("landingStreaming.featureTvDescription"),
      visual: <TvVisual />,
    },
    {
      title: t("landingStreaming.featureDownloadTitle"),
      description: t("landingStreaming.featureDownloadDescription"),
      visual: <DownloadVisual />,
    },
    {
      title: t("landingStreaming.featureEverywhereTitle"),
      description: t("landingStreaming.featureEverywhereDescription"),
      visual: <EverywhereVisual />,
    },
    {
      title: t("landingStreaming.featureKidsTitle"),
      description: t("landingStreaming.featureKidsDescription"),
      visual: <KidsVisual />,
    },
  ];
}

function defaultFaqsFor(t: TranslateFn): FaqItem[] {
  const pairs = [
    ["landingStreaming.faq1Question", "landingStreaming.faq1Answer"],
    ["landingStreaming.faq2Question", "landingStreaming.faq2Answer"],
    ["landingStreaming.faq3Question", "landingStreaming.faq3Answer"],
    ["landingStreaming.faq4Question", "landingStreaming.faq4Answer"],
    ["landingStreaming.faq5Question", "landingStreaming.faq5Answer"],
  ] as const satisfies readonly (readonly [MessageKey, MessageKey])[];

  return pairs.map(([question, answer], index) => ({
    value: `faq-${index + 1}`,
    question: t(question),
    answer: t(answer),
  }));
}

function defaultLinksFor(t: TranslateFn): SiteFooterGroup[] {
  return [
    {
      title: t("landingStreaming.footerHelp"),
      links: [
        { label: t("landingStreaming.linkHelpCentre"), href: "#" },
        { label: t("landingStreaming.linkAccount"), href: "#" },
        { label: t("landingStreaming.linkDevices"), href: "#" },
      ],
    },
    {
      title: t("landingStreaming.footerCompany"),
      links: [
        { label: t("landingStreaming.linkAbout"), href: "#" },
        { label: t("landingStreaming.linkCareers"), href: "#" },
        { label: t("landingStreaming.linkPress"), href: "#" },
      ],
    },
  ];
}

function defaultLegalFor(t: TranslateFn): SiteFooterLink[] {
  return [
    { label: t("landingStreaming.linkPrivacy"), href: "#" },
    { label: t("landingStreaming.linkTerms"), href: "#" },
    { label: t("landingStreaming.linkCookies"), href: "#" },
  ];
}

/* ------------------------------------------------------------ visuals ---- */

function VisualGlow() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-[15%] z-(--z-below) rounded-full bg-primary/25 blur-3xl"
    />
  );
}

function TvVisual() {
  return (
    <div className="relative isolate mx-auto w-full max-w-md">
      <VisualGlow />
      <div className="relative aspect-video overflow-hidden rounded-media border-4 border-neutral-800 bg-neutral-975 shadow-3">
        <div className={cn("absolute inset-0 bg-linear-to-br", TILE_TONES[0])} />
        <span className="absolute inset-0 m-auto flex size-16 items-center justify-center rounded-full bg-neutral-0/15 backdrop-blur-sm">
          <Play className="size-7 fill-neutral-50 text-neutral-50" />
        </span>
        <span className="absolute inset-x-6 bottom-5 h-1 overflow-hidden rounded-badge bg-neutral-0/20">
          <span className="block h-full w-2/5 bg-primary" />
        </span>
      </div>
      <div className="mx-auto h-3 w-1/4 rounded-b-md bg-neutral-800" />
    </div>
  );
}

function DownloadVisual() {
  return (
    <div className="relative isolate mx-auto flex w-full max-w-md justify-center pb-10">
      <VisualGlow />
      <div className="relative aspect-[9/16] w-40 overflow-hidden rounded-2xl border-4 border-neutral-800 bg-neutral-975 shadow-3 sm:w-48">
        <div className={cn("absolute inset-0 bg-linear-to-br", TILE_TONES[3])} />
      </div>
      <div className="absolute inset-x-6 bottom-0 flex items-center gap-3 rounded-card border bg-card p-3 text-card-foreground shadow-2 sm:inset-x-12">
        <span
          className={cn("aspect-[2/3] w-9 shrink-0 rounded-sm bg-linear-to-br", TILE_TONES[3])}
        />
        <span className="flex min-w-0 flex-1 flex-col gap-2">
          <span className="h-2 w-2/3 rounded-badge bg-muted-foreground/40" />
          <span className="h-1.5 overflow-hidden rounded-badge bg-muted">
            <span className="block h-full w-3/5 bg-primary" />
          </span>
        </span>
        <Download className="size-5 shrink-0 text-primary" />
      </div>
    </div>
  );
}

function EverywhereVisual() {
  return (
    <div className="relative isolate mx-auto flex w-full max-w-md items-end justify-center gap-3 text-foreground/80">
      <VisualGlow />
      <Laptop className="size-40 sm:size-48" strokeWidth={1} />
      <Tablet className="size-24 sm:size-28" strokeWidth={1} />
      <Smartphone className="size-16 sm:size-20" strokeWidth={1} />
    </div>
  );
}

function KidsVisual() {
  const tones = [TILE_TONES[1], TILE_TONES[4], TILE_TONES[2]];
  return (
    <div className="relative isolate mx-auto grid w-full max-w-md grid-cols-3 gap-4 p-4">
      <VisualGlow />
      {tones.map((tone, index) => (
        <span key={index} className="flex flex-col items-center gap-3">
          <span
            className={cn(
              "flex aspect-square w-full items-center justify-center rounded-card bg-linear-to-br shadow-2",
              tone,
            )}
          >
            <Smile className="size-1/2 text-neutral-50" strokeWidth={1.5} />
          </span>
          <span className="h-2 w-2/3 rounded-badge bg-muted-foreground/40" />
        </span>
      ))}
    </div>
  );
}

function FallbackVisual() {
  return (
    <div className="relative isolate mx-auto flex aspect-video w-full max-w-md items-center justify-center">
      <VisualGlow />
      <Sparkles className="size-20 text-primary" strokeWidth={1} />
    </div>
  );
}

/** Stand-in hero backdrop: a tilted wall of gradient posters. */
function PosterWall() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -inset-x-1/4 -top-1/4 grid -rotate-6 scale-110 grid-cols-6 gap-3 opacity-70 md:grid-cols-8">
        {Array.from({ length: 40 }, (_, index) => (
          <span
            key={index}
            className={cn(
              "aspect-[2/3] rounded-md bg-linear-to-br",
              TILE_TONES[(index * 5) % TILE_TONES.length],
            )}
          />
        ))}
      </div>
    </div>
  );
}

function HeroBackdrop({ image }: { image?: string }) {
  return (
    <div
      aria-hidden="true"
      data-slot="landing-streaming-backdrop"
      className="pointer-events-none absolute inset-0 z-(--z-below)"
    >
      {image ? <img src={image} alt="" className="size-full object-cover" /> : <PosterWall />}
      <div className="absolute inset-0 bg-background/65" />
      <div className="absolute inset-0 [background-image:radial-gradient(ellipse_at_center,transparent_0%,var(--background)_78%)]" />
      <div className="absolute inset-0 bg-linear-to-b from-background/90 via-transparent to-background" />
      <div className="absolute -top-48 start-1/2 size-[44rem] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl rtl:translate-x-1/2" />
    </div>
  );
}

/* ------------------------------------------------------- email capture ---- */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface EmailCaptureProps {
  prompt?: React.ReactNode;
  label: string;
  submitLabel: string;
  onSubmit?: (email: string) => void;
  className?: string;
}

function EmailCapture({ prompt, label, submitLabel, onSubmit, className }: EmailCaptureProps) {
  const t = useT();
  const id = React.useId();
  const inputId = `${id}-email`;
  const promptId = `${id}-prompt`;
  const errorId = `${id}-error`;
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const validate = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return t("landingStreaming.emailRequired");
    if (!EMAIL_PATTERN.test(trimmed)) return t("landingStreaming.emailInvalid");
    return null;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const problem = validate(email);
    setSubmitted(true);
    setError(problem);
    if (problem) {
      inputRef.current?.focus();
      return;
    }
    onSubmit?.(email.trim());
  };

  const describedBy = [prompt ? promptId : null, error ? errorId : null].filter(Boolean).join(" ");

  return (
    <form
      data-slot="landing-streaming-email"
      noValidate
      onSubmit={handleSubmit}
      className={cn("flex w-full flex-col gap-4", className)}
    >
      {prompt ? (
        <p id={promptId} className="text-body-lg text-pretty text-foreground/85">
          {prompt}
        </p>
      ) : null}

      <div className="flex w-full flex-col gap-3 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <Input
            ref={inputRef}
            id={inputId}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            // A single space keeps :placeholder-shown meaningful, which is what
            // floats the label out of the way once there is a value.
            placeholder=" "
            value={email}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy || undefined}
            onChange={(event) => {
              setEmail(event.target.value);
              if (submitted) setError(validate(event.target.value));
            }}
            className="peer h-(--control-h-lg) bg-background/60 px-4 pt-5 pb-1 text-body backdrop-blur-sm dark:bg-background/60"
          />
          <Label
            htmlFor={inputId}
            className={cn(
              "pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-body font-normal text-muted-foreground",
              "motion-safe:transition-[top,font-size,transform] motion-safe:duration-(--duration-fast) motion-safe:ease-standard",
              "peer-focus:top-1.5 peer-focus:translate-y-0 peer-focus:text-caption",
              "peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-caption",
            )}
          >
            {label}
          </Label>
        </div>

        <Button type="submit" size="lg" className="w-full px-6 text-body-lg sm:w-auto">
          {submitLabel}
          <ChevronRight aria-hidden="true" className="size-5 rtl:-scale-x-100" />
        </Button>
      </div>

      {error ? (
        <p
          id={errorId}
          role="alert"
          data-slot="landing-streaming-email-error"
          className="flex items-center gap-2 text-sm font-medium text-destructive"
        >
          <CircleAlert aria-hidden="true" className="size-4 shrink-0" />
          {error}
        </p>
      ) : null}
    </form>
  );
}

/* --------------------------------------------------------------- rows ---- */

interface PosterTileProps {
  item: LandingStreamingTitle;
  rank?: number;
  onSelect?: () => void;
}

function PosterTile({ item, rank, onSelect }: PosterTileProps) {
  const t = useT();
  const { number } = useFormatters();
  const label =
    rank === undefined
      ? item.title
      : t("landingStreaming.rankedTitle", { rank, title: item.title });

  const art = (
    <span
      data-slot="landing-streaming-poster"
      className="relative block aspect-[2/3] overflow-hidden rounded-media bg-neutral-900 shadow-2"
    >
      {item.image ? (
        <img
          src={item.image}
          alt=""
          loading="lazy"
          decoding="async"
          className="size-full object-cover"
        />
      ) : (
        <span
          className={cn("absolute inset-0 flex items-end bg-linear-to-br p-3", toneFor(item.title))}
        >
          <span className="font-display text-h4 text-balance text-neutral-50 uppercase">
            {item.title}
          </span>
        </span>
      )}
    </span>
  );

  const content =
    rank === undefined ? (
      art
    ) : (
      <span className="flex items-end">
        <span
          data-slot="landing-streaming-rank"
          className={cn(
            "-me-3 shrink-0 font-display leading-[0.8] text-background tabular-nums select-none",
            "text-[length:calc(var(--text-display)*1.6)]",
            "[-webkit-text-stroke:2px_var(--muted-foreground)] [paint-order:stroke_fill]",
          )}
        >
          {number.format(rank)}
        </span>
        <span className="relative min-w-0 flex-1">{art}</span>
      </span>
    );

  const classes = cn(
    "group/tile block w-full origin-bottom rounded-media text-start outline-none",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "motion-safe:transition-transform motion-safe:duration-(--duration-normal) motion-safe:ease-standard",
    "motion-safe:hover:scale-[1.04] motion-safe:focus-visible:scale-[1.04]",
  );

  // The visible title sits inside the tile, but the numeral and the poster art
  // are decorative, so the name is set explicitly and the art is hidden.
  const inner = <span aria-hidden="true">{content}</span>;

  return item.href ? (
    <a data-slot="landing-streaming-tile" href={item.href} aria-label={label} className={classes}>
      {inner}
    </a>
  ) : (
    <button
      data-slot="landing-streaming-tile"
      type="button"
      aria-label={label}
      onClick={onSelect}
      className={classes}
    >
      {inner}
    </button>
  );
}

interface TitleRowProps {
  row: LandingStreamingRow;
  onSelectTitle?: (item: LandingStreamingTitle, row: LandingStreamingRow) => void;
}

function TitleRow({ row, onSelectTitle }: TitleRowProps) {
  const t = useT();
  const headingId = `${React.useId()}-heading`;

  return (
    <div data-slot="landing-streaming-row" className="flex flex-col gap-2">
      <h2
        id={headingId}
        className="mx-auto w-full max-w-(--container-wide) px-(--gutter) font-display text-h3 uppercase"
      >
        {row.title}
      </h2>
      <Carousel aria-labelledby={headingId} slidesToScroll="auto" className="w-full">
        <CarouselContent className="ms-0 gap-2 px-(--gutter) py-4 scroll-px-(--gutter) md:gap-3">
          {row.items.map((item, index) => (
            <CarouselItem
              key={`${item.title}-${index}`}
              className={cn(
                "ps-0",
                row.ranked
                  ? "basis-3/5 sm:basis-2/5 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                  : "basis-2/5 sm:basis-1/4 md:basis-1/5 lg:basis-1/6 xl:basis-1/7",
              )}
            >
              <PosterTile
                item={item}
                rank={row.ranked ? index + 1 : undefined}
                onSelect={() => onSelectTitle?.(item, row)}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Hidden rather than dimmed at either end: over artwork, a half-faded
            control reads as a rendering glitch, not as a disabled one. */}
        <CarouselPrevious
          size="icon"
          aria-label={t("landingStreaming.previousTitles")}
          className="start-1 disabled:invisible md:start-3"
        />
        <CarouselNext
          size="icon"
          aria-label={t("landingStreaming.nextTitles")}
          className="end-1 disabled:invisible md:end-3"
        />
      </Carousel>
    </div>
  );
}

/* --------------------------------------------------------------- page ---- */

function LandingStreaming({
  className,
  wordmark: wordmarkProp,
  homeHref = "/",
  languageSelect: languageSelectProp,
  onLocaleChange,
  signInLabel: signInLabelProp,
  signInHref,
  onSignIn,
  backgroundImage,
  headline: headlineProp,
  subline: sublineProp,
  emailPrompt: emailPromptProp,
  emailLabel: emailLabelProp,
  ctaLabel: ctaLabelProp,
  ctaTitle: ctaTitleProp,
  onEmailSubmit,
  rows: rowsProp,
  onSelectTitle,
  features: featuresProp,
  faqTitle: faqTitleProp,
  faqs: faqsProp,
  links: linksProp,
  legal: legalProp,
  footerBlurb: footerBlurbProp,
  dark = true,
  ...props
}: LandingStreamingProps) {
  const { t, locale } = useI18n();
  const signInLabel = signInLabelProp ?? t("landingStreaming.signIn");
  const headline = headlineProp ?? t("landingStreaming.heroTitle");
  const subline = sublineProp ?? t("landingStreaming.heroSubtitle");
  const emailPrompt = emailPromptProp ?? t("landingStreaming.emailPrompt");
  const emailLabel = emailLabelProp ?? t("landingStreaming.emailLabel");
  const ctaLabel = ctaLabelProp ?? t("landingStreaming.getStarted");
  const ctaTitle = ctaTitleProp ?? t("landingStreaming.ctaTitle");
  const faqTitle = faqTitleProp ?? t("landingStreaming.faqTitle");
  const footerBlurb = footerBlurbProp ?? t("landingStreaming.footerBlurb");
  const rows = rowsProp ?? defaultRowsFor(t);
  const features = featuresProp ?? defaultFeaturesFor(t);
  const faqs = faqsProp ?? defaultFaqsFor(t);
  const links = linksProp ?? defaultLinksFor(t);
  const legal = legalProp ?? defaultLegalFor(t);
  const wordmarkText = t("landingStreaming.wordmark");

  const id = React.useId();
  const heroTitleId = `${id}-hero`;
  const ctaTitleId = `${id}-cta`;

  // Bound to the active catalogue's language, so the direction the picker
  // writes onto <html> always matches the words on the page.
  const languageSelect =
    languageSelectProp === undefined ? (
      <LanguageSelect
        size="sm"
        locale={locale.split(/[-_]/)[0]}
        onLocaleChange={onLocaleChange}
        className="bg-background/40 backdrop-blur-sm"
      />
    ) : (
      languageSelectProp
    );

  const wordmark = wordmarkProp ?? (
    <a
      href={homeHref}
      className={cn(
        "font-display text-3xl tracking-wide text-primary uppercase md:text-4xl",
        "rounded-control outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      {wordmarkText}
    </a>
  );

  return (
    <div
      data-slot="landing-streaming"
      data-theme={dark ? "dark" : undefined}
      className={cn("relative isolate min-h-svh w-full bg-background text-foreground", className)}
      {...props}
    >
      <header data-slot="landing-streaming-nav" className="absolute inset-x-0 top-0 z-(--z-raised)">
        <div className="mx-auto flex h-(--header-h) w-full max-w-(--container-wide) items-center gap-3 px-(--gutter) md:h-20">
          <div data-slot="landing-streaming-wordmark" className="me-auto flex items-center">
            {wordmark}
          </div>
          {languageSelect}
          {signInHref ? (
            <Button asChild size="sm">
              <a href={signInHref}>{signInLabel}</a>
            </Button>
          ) : (
            <Button type="button" size="sm" onClick={onSignIn}>
              {signInLabel}
            </Button>
          )}
        </div>
      </header>

      <main>
        <section
          data-slot="landing-streaming-hero"
          aria-labelledby={heroTitleId}
          className="relative isolate flex min-h-[min(100svh,52rem)] items-center overflow-hidden"
        >
          <HeroBackdrop image={backgroundImage} />
          <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-(--gutter) pt-32 pb-20 text-center">
            <h1
              id={heroTitleId}
              data-slot="landing-streaming-headline"
              className="font-display text-display text-balance uppercase"
            >
              {headline}
            </h1>
            {subline ? (
              <p className="max-w-2xl text-body-lg text-pretty text-foreground/85">{subline}</p>
            ) : null}
            <EmailCapture
              prompt={emailPrompt}
              label={emailLabel}
              submitLabel={ctaLabel}
              onSubmit={onEmailSubmit}
              className="mt-2 max-w-2xl"
            />
          </div>
        </section>

        {rows.length > 0 ? (
          <div
            data-slot="landing-streaming-rows"
            className="relative flex flex-col gap-8 pb-(--section-y)"
          >
            {rows.map((row, index) => (
              <TitleRow key={`${row.title}-${index}`} row={row} onSelectTitle={onSelectTitle} />
            ))}
          </div>
        ) : null}

        {features.map((feature, index) => (
          <div
            key={index}
            data-slot="landing-streaming-feature"
            className="border-t-8 border-surface-1"
          >
            <div className="mx-auto grid w-full max-w-(--container-content) items-center gap-10 px-(--gutter) py-(--section-y) lg:grid-cols-2 lg:gap-16">
              <div
                className={cn(
                  "flex flex-col gap-4 text-center lg:text-start",
                  index % 2 === 1 && "lg:order-2",
                )}
              >
                <h2 className="font-display text-h1 text-balance uppercase">{feature.title}</h2>
                {feature.description ? (
                  <p className="text-body-lg text-pretty text-muted-foreground">
                    {feature.description}
                  </p>
                ) : null}
              </div>
              <div data-slot="landing-streaming-feature-visual" aria-hidden="true">
                {feature.visual ?? <FallbackVisual />}
              </div>
            </div>
          </div>
        ))}

        {faqs.length > 0 ? (
          <div data-slot="landing-streaming-faq" className="border-t-8 border-surface-1">
            <Faq title={faqTitle} items={faqs} className="max-w-(--container-narrow)" />
          </div>
        ) : null}

        <section
          data-slot="landing-streaming-cta"
          aria-labelledby={ctaTitleId}
          className="border-t-8 border-surface-1"
        >
          <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-(--gutter) py-(--section-y) text-center">
            <h2 id={ctaTitleId} className="font-display text-h2 text-balance uppercase">
              {ctaTitle}
            </h2>
            <EmailCapture
              prompt={emailPrompt}
              label={emailLabel}
              submitLabel={ctaLabel}
              onSubmit={onEmailSubmit}
              className="max-w-2xl"
            />
          </div>
        </section>
      </main>

      <SiteFooter
        brand={wordmarkProp ?? <span className="text-primary uppercase">{wordmarkText}</span>}
        blurb={footerBlurb}
        groups={links}
        legal={legal}
        className="border-t-8 border-surface-1"
      />
    </div>
  );
}

export { LandingStreaming };
