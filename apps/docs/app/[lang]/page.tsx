import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { GithubMark } from "@/components/icons";
import { Badge, Button, Separator, ThemeSelect } from "@design-eg/ui";
import { LanguageSwitch } from "@/components/language-switch";
import { getDictionary, getLocale } from "./dictionaries";
import { formatMessage } from "@design-eg/ui";
import { PlaygroundControls } from "@/components/playground-controls";
import { Showcase } from "@/components/showcase";
import { Swatches } from "@/components/swatches";
import { BLOCKS, COMPONENTS, TEMPLATES } from "@/lib/registry";
import { SITE } from "@/lib/site";

export default async function HomePage() {
  const locale = await getLocale();
  const { home, nav, playground, site } = await getDictionary();
  const FEATURES = [
    home.features.tokens,
    home.features.rtl,
    home.features.source,
    home.features.radix,
  ];
  const total = COMPONENTS.length + BLOCKS.length + TEMPLATES.length;
  // Registry paths are locale-free; the prefix goes on at render.
  const href = (path: string) => `/${locale}${path}`;

  const CATALOGUE = [
    {
      href: href("/docs"),
      label: home.catalogue.components.label,
      count: COMPONENTS.length,
      body: home.catalogue.components.body,
    },
    {
      href: href("/docs/hero"),
      label: home.catalogue.blocks.label,
      count: BLOCKS.length,
      body: home.catalogue.blocks.body,
    },
    {
      href: href("/docs/templates"),
      label: home.catalogue.templates.label,
      count: TEMPLATES.length,
      body: home.catalogue.templates.body,
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-(--z-sticky) border-b glass">
        <div className="mx-auto flex h-(--header-h) max-w-(--container-content) items-center gap-4 px-(--gutter)">
          <Link
            href={`/${locale}`}
            className="flex items-center rounded-control outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <BrandLogo className="h-7 w-auto" />
          </Link>
          <nav aria-label={nav.primary} className="ms-auto hidden items-center gap-1 sm:flex">
            <Button variant="ghost" size="sm" asChild>
              <Link href={href("/docs")}>{nav.docs}</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href={href("/docs/templates")}>{nav.templates}</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href="#tokens">{nav.tokens}</a>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href={SITE.github} rel="noopener">
                <GithubMark className="size-4" /> GitHub
              </a>
            </Button>
          </nav>
          <div className="ms-auto flex items-center gap-1 sm:ms-2">
            <LanguageSwitch variant="ghost" size="sm" />
            <ThemeSelect variant="ghost" size="sm" defaultTheme="dark" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-(--container-content) px-(--gutter)">
        <section className="relative overflow-hidden py-(--section-y)">
          <div className="dot-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(60%_60%_at_50%_0%,black,transparent)]" />
          <div className="max-w-3xl space-y-6">
            <Badge variant="soft">{home.badge}</Badge>
            <h1 className="font-display text-display uppercase">
              {/* The accent sits inside the sentence, and languages put it in
                  different places — so the copy marks the slot and the split
                  happens here rather than being hardcoded as three fragments. */}
              {home.headline.split("{accent}").flatMap((part, index) =>
                index === 0
                  ? [part]
                  : [
                      <span key="accent" className="text-primary">
                        {home.accent}
                      </span>,
                      part,
                    ],
              )}
            </h1>
            <p className="max-w-prose text-body-lg text-muted-foreground">{site.description}</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg" asChild>
                <Link href={href("/docs")}>
                  {home.browseDocs} <ArrowRight />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href={SITE.github} rel="noopener">
                  <GithubMark className="size-4" /> {home.starOnGithub}
                </a>
              </Button>
            </div>
            <pre className="inline-flex max-w-full items-center gap-3 overflow-x-auto rounded-control border bg-surface-1 px-4 py-3 font-mono text-sm">
              <Terminal className="size-4 shrink-0 text-muted-foreground" />
              <code>npx @design-eg/cli init &amp;&amp; npx @design-eg/cli add button card</code>
            </pre>
          </div>
        </section>

        <section className="grid gap-4 pb-(--section-y) sm:grid-cols-3">
          {CATALOGUE.map((entry) => (
            <Link
              key={entry.href}
              href={entry.href}
              className="group rounded-card border bg-card p-5 shadow-1 transition-colors duration-(--duration-fast) ease-standard hover:bg-surface-2"
            >
              <div className="flex items-baseline justify-between">
                <h2 className="text-h4 font-semibold">{entry.label}</h2>
                <span className="font-display text-h3 text-primary">{entry.count}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{entry.body}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium">
                {home.open} <ArrowRight className="size-4" />
              </span>
            </Link>
          ))}
        </section>

        <section className="grid gap-4 pb-(--section-y) sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <article key={f.title} className="rounded-card border bg-card p-5 shadow-1">
              <h2 className="text-h4 font-semibold">{f.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </article>
          ))}
        </section>

        <Separator />

        <div className="sticky top-(--header-h) z-(--z-raised) -mx-(--gutter) border-b glass px-(--gutter) py-3">
          <PlaygroundControls copy={playground} className="mx-auto max-w-(--container-content)" />
        </div>

        <div className="space-y-16 py-(--section-y)">
          <Showcase />
          <Swatches />
        </div>

        <section className="pb-(--section-y)">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-card border bg-card p-6 shadow-1">
            <div>
              <h2 className="text-h4 font-semibold">{home.sampleTitle}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatMessage(home.sampleBody, locale, { count: total })}
              </p>
            </div>
            <Button asChild>
              <Link href={href("/docs")}>
                {home.goToDocs} <ArrowRight />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-(--container-content) flex-wrap items-center justify-between gap-4 px-(--gutter) py-8 text-sm text-muted-foreground">
          <p>
            {SITE.name} · MIT License ·{" "}
            <a className="underline-offset-4 hover:underline" href={SITE.github} rel="noopener">
              {home.source}
            </a>
          </p>
          <p>
            <a className="underline-offset-4 hover:underline" href="/llms.txt">
              llms.txt
            </a>{" "}
            ·{" "}
            <a className="underline-offset-4 hover:underline" href="/r/registry.json">
              registry.json
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}
