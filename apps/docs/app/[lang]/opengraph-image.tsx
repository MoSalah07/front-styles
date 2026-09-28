import { ImageResponse } from "next/og";
import { formatMessage } from "@design-eg/ui";
import { OG_SIZE, OgCard, truncate } from "@/components/brand-logo";
import { localeOf, ogFonts, ogTypography } from "@/lib/og-fonts";
import { BLOCKS, COMPONENTS, TEMPLATES } from "@/lib/registry";
import { SITE } from "@/lib/site";
import { dictionaryFor } from "./dictionaries";

/**
 * The default share card, used by every route that does not ship its own.
 *
 * The locale comes from `params`, not from `next/root-params`: a metadata image
 * is compiled to a Route Handler, and root params do not resolve inside one.
 *
 * No font is fetched over the network — the two script faces are vendored under
 * `assets/fonts`, because satori has no fallback chain and would otherwise draw
 * Arabic and Devanagari as empty boxes.
 */
export const size = OG_SIZE;
export const contentType = "image/png";

type Params = { params: Promise<{ lang: string }> };

export async function generateImageMetadata({ params }: Params) {
  const { og } = await dictionaryFor((await params).lang);
  // `alt` is page text rather than pixels, so it is translated either way.
  return [{ id: "default", alt: og.homeAlt, size, contentType }];
}

export default async function OpengraphImage({ params }: Params) {
  const locale = localeOf((await params).lang);
  const { site, og } = await dictionaryFor(locale);
  const type = ogTypography(locale);

  return new ImageResponse(
    <OgCard
      eyebrow={og.openSource}
      title={site.tagline}
      description={truncate(site.description, 145)}
      footnote={new URL(SITE.url).host}
      meta={formatMessage(og.catalogueMeta, locale, {
        components: COMPONENTS.length,
        blocks: BLOCKS.length,
        templates: TEMPLATES.length,
      })}
      dir={type.dir}
      fontFamily={type.fontFamily}
      eyebrowTracking={type.eyebrowTracking}
      titleTracking={type.titleTracking}
      uppercase={type.uppercase}
    />,
    { ...size, fonts: ogFonts(locale) },
  );
}
