/**
 * The design-eg identity: the mark, the wordmark, and the social-card shell the
 * `opengraph-image` routes share.
 *
 * The mark is a single crimson tile whose counters knock a bold `E` out of it,
 * so it survives being shrunk to a 16px favicon and still holds up at 512px.
 * The wordmark is monoline geometric capitals drawn as stroked centrelines —
 * no font file, no external asset, so it renders identically everywhere.
 *
 * The logo paints with `currentColor`, which is what lets one component serve
 * the light theme, the dark theme and a print stylesheet without a second copy.
 * `apps/docs/public/logo.svg` and `logo-mark.svg` mirror this geometry for use
 * outside the app (README, GitHub social preview, press).
 */
import { OgRtlText } from "./og-text";
import * as React from "react";
import { cn } from "@design-eg/ui/cn";

/* ── geometry ───────────────────────────────────────────────────────────── */

/** The mark's own coordinate space. */
export const BRAND_MARK_VIEWBOX = "0 0 32 32";

/** The `E` counter, centred in the 32×32 tile. Also used as a knockout. */
export const BRAND_COUNTER_PATH =
  "M8.5 7.5 H23.5 V11.5 H12.5 V14 H19.5 V18 H12.5 V20.5 H23.5 V24.5 H8.5 Z";

/** Rounded tile plus the counter, as one even-odd path so the `E` is a hole. */
export const BRAND_MARK_PATH =
  "M7 0 H25 A7 7 0 0 1 32 7 V25 A7 7 0 0 1 25 32 H7 A7 7 0 0 1 0 25 V7 A7 7 0 0 1 7 0 Z " +
  BRAND_COUNTER_PATH;

/** The wordmark's own coordinate space: the mark, a 14u gap, then the letters. */
export const BRAND_LOGO_VIEWBOX = "0 0 197 32";

/** Where the letters start, measured from the start edge of the mark. */
const WORDMARK_X = 46;

/** Monoline capitals on a 17u centreline cap height, stroked at 5u. */
const WORDMARK_GLYPHS: readonly { readonly x: number; readonly d: string }[] = [
  { x: 0, d: "M2.5 24.5 V7.5 H7 A5.5 5.5 0 0 1 12.5 13 V19 A5.5 5.5 0 0 1 7 24.5 Z" },
  { x: 20, d: "M2.5 5 V27 M2.5 7.5 H13 M2.5 16 H11 M2.5 24.5 H13" },
  {
    x: 38,
    d:
      "M10.5 11.4 C10.5 8.9 8.7 7.5 6.5 7.5 C4.3 7.5 2.5 9.1 2.5 11.2 " +
      "C2.5 15.6 10.5 14.9 10.5 19.9 C10.5 22.8 8.7 24.5 6.5 24.5 C4.3 24.5 2.5 23.1 2.5 20.9",
  },
  { x: 56, d: "M2.5 5 V27" },
  {
    x: 66,
    d:
      "M12.5 12.5 A5 5 0 0 0 7.5 7.5 A5 5 0 0 0 2.5 12.5 V19.5 " +
      "A5 5 0 0 0 7.5 24.5 A5 5 0 0 0 12.5 19.5 V17 H8.5",
  },
  { x: 86, d: "M2.5 27 V5 L10.5 27 V5" },
  { x: 104, d: "M0 16 H9" },
  { x: 118, d: "M2.5 5 V27 M2.5 7.5 H13 M2.5 16 H11 M2.5 24.5 H13" },
  {
    x: 136,
    d:
      "M12.5 12.5 A5 5 0 0 0 7.5 7.5 A5 5 0 0 0 2.5 12.5 V19.5 " +
      "A5 5 0 0 0 7.5 24.5 A5 5 0 0 0 12.5 19.5 V17 H8.5",
  },
];

/* ── components ─────────────────────────────────────────────────────────── */

export type BrandMarkProps = React.ComponentProps<"svg"> & {
  /** Accessible name. Omit it when a wordmark or link text already names the logo. */
  label?: string;
};

/** The mark on its own: one crimson tile with the `E` knocked out of it. */
function BrandMark({ className, label, ...props }: BrandMarkProps) {
  return (
    <svg
      data-slot="brand-mark"
      viewBox={BRAND_MARK_VIEWBOX}
      width={32}
      height={32}
      fill="none"
      role={label ? "img" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      focusable="false"
      className={cn("size-8", className)}
      {...props}
    >
      <path fill="currentColor" fillRule="evenodd" d={BRAND_MARK_PATH} />
    </svg>
  );
}

export type BrandLogoProps = React.ComponentProps<"svg"> & {
  /** Accessible name. Set it to `undefined` when the parent link already names it. */
  label?: string;
};

/**
 * The full lockup: the mark in `--primary`, the wordmark in the inherited text
 * colour, so it reads on any surface in either theme.
 */
function BrandLogo({ className, label = "design-eg", ...props }: BrandLogoProps) {
  return (
    <svg
      data-slot="brand-logo"
      viewBox={BRAND_LOGO_VIEWBOX}
      width={197}
      height={32}
      fill="none"
      role={label ? "img" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      focusable="false"
      className={cn("h-6 w-auto", className)}
      {...props}
    >
      <path className="text-primary" fill="currentColor" fillRule="evenodd" d={BRAND_MARK_PATH} />
      <g
        transform={`translate(${WORDMARK_X} 0)`}
        stroke="currentColor"
        strokeWidth={5}
        strokeLinecap="butt"
        strokeLinejoin="miter"
      >
        {WORDMARK_GLYPHS.map((glyph) => (
          <path key={glyph.x} transform={`translate(${glyph.x} 0)`} d={glyph.d} />
        ))}
      </g>
    </svg>
  );
}

export { BrandLogo, BrandMark };

/* ── social cards ───────────────────────────────────────────────────────── */

/**
 * The dark palette, spelled out. `next/og` rasterises through satori, which
 * reads inline styles only — it never sees Tailwind or a CSS variable — so the
 * card mirrors the values `packages/tokens` compiles for `.dark[data-brand="crimson"]`.
 */
export const OG_COLORS = {
  background: "#141414", // --background
  foreground: "#fafafa", // --foreground
  muted: "#b3b3b3", // --muted-foreground
  dim: "#808080", // --neutral-500
  primary: "#e50914", // --primary / --brand
  primaryLight: "#f13a33", // --primary-hover
  primaryDark: "#ad000a", // --primary-active
  border: "rgba(255, 255, 255, 0.1)", // --border
} as const;

/** Every share card is 1200×630, the size both Open Graph and X read. */
export const OG_SIZE = { width: 1200, height: 630 } as const;

/** Cut a description to a card-sized sentence, on a word boundary, once. */
export function truncate(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const space = cut.lastIndexOf(" ");
  const kept = space > max * 0.6 ? cut.slice(0, space) : cut;
  return `${kept.replace(/[\s.,;:–—-]+$/, "")}…`;
}

/**
 * The mark again, rebuilt out of boxes: satori lays out flexbox, not SVG paths,
 * so the tile is a rounded box and the `E` is a spine plus three arms spaced by
 * `space-between` — which lands on exactly the same 32-unit grid as the path.
 */
function OgMark({
  size,
  tile = OG_COLORS.primary,
  counter = OG_COLORS.background,
}: {
  size: number;
  tile?: string;
  counter?: string;
}) {
  const u = size / 32;
  return (
    <div
      style={{
        display: "flex",
        width: size,
        height: size,
        borderRadius: 7 * u,
        background: tile,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ display: "flex", width: 15 * u, height: 17 * u }}>
        <div style={{ width: 4 * u, height: 17 * u, background: counter }} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: 11 * u,
            height: 17 * u,
          }}
        >
          <div style={{ width: 11 * u, height: 4 * u, background: counter }} />
          <div style={{ width: 7 * u, height: 4 * u, background: counter }} />
          <div style={{ width: 11 * u, height: 4 * u, background: counter }} />
        </div>
      </div>
    </div>
  );
}

export interface OgCardProps {
  /** Small crimson label above the title: the item's kind, or the section. */
  eyebrow: string;
  title: string;
  description?: string;
  /** Start of the footer rule — usually the canonical path. */
  footnote?: string;
  /** End of the footer rule — a count, a package name, a call to action. */
  meta?: string;
  /** Writing direction of the copy. Mirrors the whole composition. */
  dir?: "ltr" | "rtl";
  /** Vendored face for a non-Latin script; omit for satori's built-in Geist. */
  fontFamily?: string;
  /** Eyebrow tracking. Zero for joined or shirorekha scripts. */
  eyebrowTracking?: number;
  /** Headline tracking. Negative tightens Latin; zero leaves the rest alone. */
  titleTracking?: number;
  /** Upper-case the eyebrow. Only Latin has a case to change. */
  uppercase?: boolean;
}

/**
 * The shared card composition. The title sizes itself off its length, so a
 * one-word primitive and a full sentence both fill the same optical block.
 *
 * `next/og` ships one weight of Geist, so hierarchy here comes from size,
 * colour and letter-spacing rather than from a bold cut that does not exist.
 */
/**
 * One block of card copy. In RTL it goes through OgRtlText, because satori
 * does no bidi of its own; in LTR it is a plain div, which is all it needs.
 */
function OgLine({
  rtl,
  style,
  wordGap,
  children,
}: {
  rtl: boolean;
  style: React.CSSProperties;
  wordGap?: number;
  children: string;
}) {
  if (!rtl) return <div style={{ display: "flex", ...style }}>{children}</div>;
  return (
    <OgRtlText style={style as Record<string, unknown>} wordGap={wordGap}>
      {children}
    </OgRtlText>
  );
}

function OgCard({
  eyebrow,
  title,
  description,
  footnote,
  meta,
  dir = "ltr",
  fontFamily,
  eyebrowTracking = 8,
  titleTracking = -2,
  uppercase = true,
}: OgCardProps) {
  const titleSize = title.length > 30 ? 62 : title.length > 20 ? 76 : title.length > 12 ? 90 : 104;
  // satori has no `dir`, so the mirror is flexbox: rows reverse and the
  // physical margins swap sides.
  const rtl = dir === "rtl";
  const row = rtl ? ("row-reverse" as const) : ("row" as const);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: OG_SIZE.width,
        height: OG_SIZE.height,
        background: OG_COLORS.background,
        color: OG_COLORS.foreground,
        ...(fontFamily ? { fontFamily } : {}),
        textAlign: rtl ? ("right" as const) : ("left" as const),
        // Cinematic wash: crimson bleeding out of the start corner, like the
        // site hero. It lives on the card itself rather than on an absolutely
        // positioned blob, which satori clips into a visible hard edge.
        backgroundImage:
          "linear-gradient(126deg, rgba(229, 9, 20, 0.34) 0%, rgba(229, 9, 20, 0.1) 26%, rgba(229, 9, 20, 0.02) 44%, rgba(229, 9, 20, 0) 60%)",
      }}
    >
      <div
        style={{
          display: "flex",
          width: OG_SIZE.width,
          height: 10,
          backgroundImage: `linear-gradient(90deg, ${OG_COLORS.primaryDark} 0%, ${OG_COLORS.primary} 40%, ${OG_COLORS.primaryLight} 100%)`,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
          padding: "56px 72px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: row,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: row, alignItems: "center" }}>
            <OgMark size={64} />
            <div
              style={{
                display: "flex",
                ...(rtl ? { marginRight: 22 } : { marginLeft: 22 }),
                fontSize: 34,
                letterSpacing: 6,
                color: OG_COLORS.foreground,
              }}
            >
              DESIGN-EG
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 24, letterSpacing: 1, color: OG_COLORS.dim }}>
            React · Radix · Tailwind v4
          </div>
        </div>

        {/* The margins are a floor under `space-between`: a two-line title plus
            a two-line description must never crowd the header or the rule. */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: 36, marginBottom: 36 }}>
          <div style={{ display: "flex", flexDirection: row, alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                width: 48,
                height: 6,
                ...(rtl ? { marginLeft: 18 } : { marginRight: 18 }),
                background: OG_COLORS.primary,
              }}
            />
            <OgLine
              rtl={rtl}
              wordGap={10}
              style={{
                fontSize: 26,
                letterSpacing: eyebrowTracking,
                color: OG_COLORS.primaryLight,
              }}
            >
              {uppercase ? eyebrow.toUpperCase() : eyebrow}
            </OgLine>
          </div>
          <OgLine
            rtl={rtl}
            // The gap scales with the type: a 100px headline needs a wider
            // word space than a 26px eyebrow to read as the same rhythm.
            wordGap={Math.round(titleSize * 0.2)}
            style={{
              marginTop: 22,
              fontSize: titleSize,
              lineHeight: 1.04,
              letterSpacing: titleTracking,
              color: OG_COLORS.foreground,
            }}
          >
            {title}
          </OgLine>
          {description ? (
            <OgLine
              rtl={rtl}
              wordGap={9}
              style={{
                marginTop: 24,
                maxWidth: 960,
                fontSize: 30,
                lineHeight: 1.35,
                color: OG_COLORS.muted,
              }}
            >
              {description}
            </OgLine>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: row,
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 26,
            borderTop: `2px solid ${OG_COLORS.border}`,
          }}
        >
          {/* The path is a URL: it reads left-to-right in every language. */}
          <div style={{ display: "flex", fontSize: 26, color: OG_COLORS.dim }}>
            {footnote ?? ""}
          </div>
          <OgLine rtl={rtl} wordGap={9} style={{ fontSize: 26, color: OG_COLORS.dim }}>
            {meta ?? ""}
          </OgLine>
        </div>
      </div>
    </div>
  );
}

export { OgCard, OgMark };
