import { ImageResponse } from "next/og";
import { formatMessage } from "@design-eg/ui";
import { OG_SIZE, OgCard } from "@/components/brand-logo";
import { localeOf, ogFonts, ogTypography } from "@/lib/og-fonts";
import { TEMPLATES } from "@/lib/registry";
import { dictionaryFor } from "../../dictionaries";

/** The card for the template gallery. The locale comes from `params`. */
export const size = OG_SIZE;
export const contentType = "image/png";

type Params = { params: Promise<{ lang: string }> };

export async function generateImageMetadata({ params }: Params) {
  const { og } = await dictionaryFor((await params).lang);
  return [{ id: "templates", alt: og.templatesAlt, size, contentType }];
}

export default async function TemplatesOpengraphImage({ params }: Params) {
  const locale = localeOf((await params).lang);
  const { templatesPage, og } = await dictionaryFor(locale);
  const type = ogTypography(locale);

  return new ImageResponse(
    <OgCard
      eyebrow={templatesPage.title}
      title={og.templatesTitle}
      description={og.templatesDescription}
      footnote={`/${locale}/docs/templates`}
      meta={formatMessage(og.templatesMeta, locale, { count: TEMPLATES.length })}
      dir={type.dir}
      fontFamily={type.fontFamily}
      eyebrowTracking={type.eyebrowTracking}
      titleTracking={type.titleTracking}
      uppercase={type.uppercase}
    />,
    { ...size, fonts: ogFonts(locale) },
  );
}
