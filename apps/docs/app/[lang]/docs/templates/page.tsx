import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@design-eg/ui";
import { Preview } from "@/components/preview";
import { BreadcrumbJsonLd } from "@/components/structured-data";
import { getExample } from "@/content/examples";
import { installCommand, TEMPLATES } from "@/lib/registry";
import { SITE } from "@/lib/site";
import { languageAlternates } from "@/lib/locales";
import { getDictionary, getLocale } from "../../dictionaries";
import { formatMessage } from "@design-eg/ui";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { templatesPage } = await getDictionary();
  return {
    title: templatesPage.title,
    description: formatMessage(templatesPage.intro, locale, { count: TEMPLATES.length }),
    alternates: {
      canonical: `/${locale}/docs/templates`,
      languages: languageAlternates("/docs/templates"),
      types: { "text/markdown": "/docs/templates.md" },
    },
  };
}

export default async function TemplateGalleryPage() {
  const locale = await getLocale();
  const href = (path: string) => `/${locale}${path}`;
  const { templatesPage, docsHub } = await getDictionary();

  return (
    <div className="space-y-12">
      <BreadcrumbJsonLd
        trail={[
          { name: SITE.name, path: `/${locale}` },
          { name: docsHub.title, path: href("/docs") },
          { name: templatesPage.title, path: href("/docs/templates") },
        ]}
      />

      <header className="max-w-3xl space-y-3">
        <h1 className="text-h2 font-semibold">{templatesPage.title}</h1>
        <p className="text-body-lg text-muted-foreground">
          {formatMessage(templatesPage.intro, locale, { count: TEMPLATES.length })}
        </p>
      </header>

      <div className="space-y-16">
        {TEMPLATES.map((item) => {
          const Example = getExample(item.name);
          return (
            <section key={item.name} id={item.name} className="scroll-mt-40 space-y-4">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="max-w-prose space-y-1">
                  <h2 className="text-h3 font-semibold">
                    <Link href={href(item.href)} className="underline-offset-4 hover:underline">
                      {item.title}
                    </Link>
                  </h2>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <code className="hidden rounded-control border bg-surface-1 px-2 py-1 font-mono text-xs text-muted-foreground sm:inline">
                    {installCommand(item.name)}
                  </code>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={href(item.href)}>
                      {templatesPage.open} <ArrowRight />
                    </Link>
                  </Button>
                </div>
              </div>

              {Example ? (
                <Preview variant="viewport">
                  <Example />
                </Preview>
              ) : (
                <div className="rounded-card border border-dashed p-10 text-center text-sm text-muted-foreground">
                  Preview coming soon. Install it with{" "}
                  <code className="font-mono">{installCommand(item.name)}</code>.
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
