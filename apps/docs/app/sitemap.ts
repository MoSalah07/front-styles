import type { MetadataRoute } from "next";
import { DOCS_ROUTES } from "@/lib/registry";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: SITE.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...DOCS_ROUTES.map((route) => ({
      url: `${SITE.url}${route}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      // The two hubs outrank the individual item pages.
      priority: route === "/docs" || route === "/docs/templates" ? 0.9 : 0.7,
    })),
    { url: `${SITE.url}/llms.txt`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
  ];
}
