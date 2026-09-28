import { ImageResponse } from "next/og";
import { OG_SIZE, OgCard, truncate } from "@/components/brand-logo";
import { getRegistryItem, installCommand, REGISTRY_ITEMS } from "@/lib/registry";
import { SITE } from "@/lib/site";
import { localeOf } from "@/lib/og-fonts";

/**
 * One share card per registry item, built from the same registry entry the
 * page itself renders, so a card can never disagree with the page it links to.
 *
 * Stays English in every locale, and deliberately so: the title is a component
 * name and the description is the item's own doc comment, neither of which is
 * translated. A card that mixed a Latin component name into a translated
 * sentence would also need a script font to render the half that is not code.
 */
export const alt = `A ${SITE.name} registry item`;
export const size = OG_SIZE;
export const contentType = "image/png";

/** Prerender a card for every item, matching the page's own static params. */
export function generateStaticParams() {
  return REGISTRY_ITEMS.map((item) => ({ slug: item.name }));
}

const KIND_LABEL = {
  foundation: "Foundation",
  component: "Component",
  block: "Block",
  template: "Template",
} as const;

export default async function ItemOpengraphImage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const locale = localeOf(lang);
  const item = getRegistryItem(slug);

  return new ImageResponse(
    <OgCard
      eyebrow={item ? KIND_LABEL[item.category] : "Registry"}
      title={item?.title ?? slug}
      description={truncate(
        item?.description || `${item?.title ?? slug} from the ${SITE.name} registry.`,
        165,
      )}
      footnote={`/${locale}/docs/${slug}`}
      meta={installCommand(slug)}
    />,
    { ...size },
  );
}
