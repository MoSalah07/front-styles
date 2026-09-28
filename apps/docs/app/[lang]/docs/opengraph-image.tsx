import { ImageResponse } from "next/og";
import { formatMessage } from "@design-eg/ui";
import { OG_SIZE, OgCard } from "@/components/brand-logo";
import { localeOf, ogFonts, ogTypography } from "@/lib/og-fonts";
import { BLOCKS, COMPONENTS, REGISTRY_ITEMS, TEMPLATES } from "@/lib/registry";
import { dictionaryFor } from "../dictionaries";

/**
 * The card for the documentation hub and anything under it without its own.
 * The locale comes from `params`; see the root card for why.
 */
export const size = OG_SIZE;
export const contentType = "image/png";

type Params = { params: Promise<{ lang: string }> };

export async function generateImageMetadata({ params }: Params) {
  const { og } = await dictionaryFor((await params).lang);
  return [{ id: "docs", alt: og.docsAlt, size, contentType }];
}

export default async function DocsOpengraphImage({ params }: Params) {
  const locale = localeOf((await params).lang);
  const { docsHub, og, nav } = await dictionaryFor(locale);
  const type = ogTypography(locale);

  return new ImageResponse(
    <OgCard
      eyebrow={docsHub.title}
      title={og.docsTitle}
      description={formatMessage(og.docsDescription, locale, {
        components: COMPONENTS.length,
        blocks: BLOCKS.length,
        templates: TEMPLATES.length,
      })}
      footnote={`/${locale}/docs`}
      meta={formatMessage(nav.itemCount, locale, { count: REGISTRY_ITEMS.length })}
      dir={type.dir}
      fontFamily={type.fontFamily}
      eyebrowTracking={type.eyebrowTracking}
      titleTracking={type.titleTracking}
      uppercase={type.uppercase}
    />,
    { ...size, fonts: ogFonts(locale) },
  );
}
