import { SITE } from "@/lib/site";

/**
 * JSON-LD blocks for the docs pages. The root layout already describes the
 * project as `SoftwareSourceCode`; these add the per-page `TechArticle` and the
 * `BreadcrumbList` that puts each item under Home → Docs.
 */

type Schema = Record<string, unknown>;

function JsonLd({ schema }: { schema: Schema }) {
  return (
    <script
      type="application/ld+json"
      // The payload is built here from typed props, never from user input, and
      // `<` is escaped so a description can never close the script tag early.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
    />
  );
}

export interface Crumb {
  name: string;
  /** Site-relative path, e.g. `/docs/button`. */
  path: string;
}

export function BreadcrumbJsonLd({ trail }: { trail: Crumb[] }) {
  return (
    <JsonLd
      schema={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: trail.map((crumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: crumb.name,
          item: `${SITE.url}${crumb.path}`,
        })),
      }}
    />
  );
}

export interface TechArticleJsonLdProps {
  headline: string;
  description: string;
  /** Site-relative path of the page the article describes. */
  path: string;
  /** The bucket the item belongs to, e.g. `Component`. */
  section?: string;
  /** npm packages and registry items the reader will also need. */
  dependencies?: string[];
  /** BCP 47 tag of the page this article describes. */
  locale: string;
}

export function TechArticleJsonLd({
  headline,
  description,
  path,
  section,
  dependencies,
  locale,
}: TechArticleJsonLdProps) {
  const url = `${SITE.url}${path}`;

  return (
    <JsonLd
      schema={{
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline,
        description,
        url,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        inLanguage: locale,
        ...(section ? { articleSection: section } : {}),
        ...(dependencies?.length ? { dependencies: dependencies.join(", ") } : {}),
        proficiencyLevel: "Beginner",
        isAccessibleForFree: true,
        license: "https://opensource.org/licenses/MIT",
        isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
        author: { "@type": "Organization", name: SITE.name, url: SITE.url },
        publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
      }}
    />
  );
}
