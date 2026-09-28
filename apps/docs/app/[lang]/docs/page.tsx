import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge, Button, InstallCommand, Separator } from "@design-eg/ui";
import { CodeBlock } from "@/components/code-block";
import { BreadcrumbJsonLd } from "@/components/structured-data";
import { BLOCKS, COMPONENTS, NAV_GROUPS, REGISTRY_ITEMS, TEMPLATES } from "@/lib/registry";
import { SITE } from "@/lib/site";
import { languageAlternates } from "@/lib/locales";
import { getDictionary, getLocale } from "../dictionaries";
import { formatMessage } from "@design-eg/ui";

// A function rather than a constant, because the canonical URL carries the
// locale and only the request knows which one.
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { docsHub } = await getDictionary();
  return {
    title: docsHub.title,
    description: formatMessage(docsHub.intro, locale, {
      components: COMPONENTS.length,
      blocks: BLOCKS.length,
      templates: TEMPLATES.length,
    }),
    alternates: {
      canonical: `/${locale}/docs`,
      languages: languageAlternates("/docs"),
      types: { "text/markdown": "/docs.md" },
    },
  };
}

const STYLES = `@import "tailwindcss";
@import "@design-eg/ui/styles.css";`;

/** The same catalogue, in the formats a crawler or an assistant would rather read. */
const MACHINE_READABLE = [
  { key: "projectMap", href: "/llms.txt" },
  { key: "fullApi", href: "/llms-full.txt" },
  { key: "pageAsMarkdown", href: "/docs.md" },
  { key: "itemAsMarkdown", href: "/docs/button.md" },
  { key: "registryIndex", href: "/r/registry.json" },
  { key: "oneItem", href: "/r/button.json" },
] as const;

export default async function DocsIndexPage() {
  const locale = await getLocale();
  const href = (path: string) => `/${locale}${path}`;
  const { docsHub, groups, templatesPage } = await getDictionary();

  return (
    <div className="max-w-3xl space-y-12">
      <BreadcrumbJsonLd
        trail={[
          { name: SITE.name, path: `/${locale}` },
          { name: docsHub.title, path: href("/docs") },
        ]}
      />

      <header className="space-y-4">
        <Badge variant="soft">
          {formatMessage(docsHub.badge, locale, { count: REGISTRY_ITEMS.length })}
        </Badge>
        <h1 className="text-h2 font-semibold">{docsHub.title}</h1>
        <p className="max-w-prose text-body-lg text-muted-foreground">
          {formatMessage(docsHub.intro, locale, {
            components: COMPONENTS.length,
            blocks: BLOCKS.length,
            templates: TEMPLATES.length,
          })}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href={href("/docs/button")}>
              {docsHub.startWithButton} <ArrowRight />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={href("/docs/templates")}>{templatesPage.title}</Link>
          </Button>
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="text-h4 font-semibold">{docsHub.install}</h2>
        <InstallCommand packageName={["@design-eg/ui", "@design-eg/tokens"]} label="install" />
        <p className="text-sm text-muted-foreground">{docsHub.installCopy}</p>
        <InstallCommand command="@design-eg/cli init" label="init" />
        <InstallCommand command="@design-eg/cli add button card dialog" label="add" />
        <p className="text-sm text-muted-foreground">{docsHub.installStyles}</p>
        <CodeBlock label="globals.css" code={STYLES} />
      </section>

      <Separator />

      <section className="space-y-8">
        <h2 className="text-h4 font-semibold">{docsHub.everything}</h2>
        {NAV_GROUPS.map((group) => (
          <div key={group.id} className="space-y-3">
            <h3 className="text-eyebrow font-semibold text-muted-foreground uppercase">
              {groups[group.label as keyof typeof groups] ?? group.label}
              <span className="ms-2 font-normal opacity-60">{group.items.length}</span>
            </h3>
            <ul className="grid gap-2 sm:grid-cols-2">
              {group.items.map((item) => (
                <li key={item.name}>
                  <Link
                    href={href(item.href)}
                    className="flex items-center justify-between gap-2 rounded-control border bg-card px-3 py-2 text-sm transition-colors duration-(--duration-fast) ease-standard hover:bg-surface-2"
                  >
                    <span className="truncate font-medium">{item.title}</span>
                    <code className="shrink-0 font-mono text-xs text-muted-foreground">
                      {item.name}
                    </code>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <Separator />

      <section className="space-y-3">
        <h2 className="text-h4 font-semibold">{docsHub.forMachines}</h2>
        <p className="max-w-prose text-sm text-muted-foreground">{docsHub.forMachinesIntro}</p>
        <ul className="grid gap-2 text-sm sm:grid-cols-2">
          {MACHINE_READABLE.map((entry) => (
            <li key={entry.href}>
              <a
                className="flex items-center justify-between gap-2 rounded-control border bg-card px-3 py-2 transition-colors duration-(--duration-fast) ease-standard hover:bg-surface-2"
                href={entry.href}
              >
                <span className="truncate">{docsHub.machineLinks[entry.key]}</span>
                <code className="shrink-0 font-mono text-xs text-muted-foreground">
                  {entry.href}
                </code>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
