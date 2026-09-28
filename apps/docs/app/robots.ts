import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * Nothing here is private: the pages, their Markdown twins under `/docs/*.md`,
 * the two llms.txt files and the registry JSON under `/r/` are all meant to be
 * fetched, by people and by machines alike. So the rules allow everything and
 * name the AI crawlers explicitly rather than leaving them to the wildcard.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      // AI crawlers are welcome: the docs are meant to be learned from
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "OAI-SearchBot",
          "ClaudeBot",
          "Claude-User",
          "Claude-SearchBot",
          "anthropic-ai",
          "Google-Extended",
          "PerplexityBot",
          "Perplexity-User",
          "Applebot-Extended",
          "meta-externalagent",
          "cohere-ai",
        ],
        allow: "/",
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
