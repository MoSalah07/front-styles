import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";
import { GithubMark } from "@/components/icons";
import { Badge, Button, Separator } from "@design-eg/ui";
import { PlaygroundControls } from "@/components/playground-controls";
import { Showcase } from "@/components/showcase";
import { Swatches } from "@/components/swatches";
import { BLOCKS, COMPONENTS, TEMPLATES } from "@/lib/registry";
import { SITE } from "@/lib/site";

const FEATURES = [
  {
    title: "Tokens compiled from one seed",
    body: "A brand is a JSON file. The compiler derives OKLCH ramps, semantic roles for light and dark, and fails the build below WCAG AA.",
  },
  {
    title: "RTL and Arabic first",
    body: "Logical properties everywhere, a dedicated Arabic font stack and tuned line-height. Flip dir and nothing breaks.",
  },
  {
    title: "Own the source",
    body: "Install from npm or copy components with the CLI. Every item is a shadcn-compatible registry entry.",
  },
  {
    title: "Radix under the hood",
    body: "Keyboard navigation, focus management and ARIA come from Radix primitives. Styling comes from tokens.",
  },
];

export default function HomePage() {
  const CATALOGUE = [
    {
      href: "/docs",
      label: "Components",
      count: COMPONENTS.length,
      body: "Buttons, fields, overlays, navigation and feedback primitives built on Radix.",
    },
    {
      href: "/docs/hero",
      label: "Blocks",
      count: BLOCKS.length,
      body: "Composite sections: heroes, pricing tables, data tables, stat grids, filter bars.",
    },
    {
      href: "/docs/templates",
      label: "Page templates",
      count: TEMPLATES.length,
      body: "Whole screens: sign-in, sign-up, OTP, settings, a dashboard shell and error pages.",
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-(--z-sticky) border-b glass">
        <div className="mx-auto flex h-(--header-h) max-w-(--container-content) items-center gap-4 px-(--gutter)">
          <Link href="/" className="flex items-center gap-2 font-display text-2xl tracking-wide">
            <span className="inline-block size-6 rounded-sm bg-primary" aria-hidden="true" />
            {SITE.name}
          </Link>
          <nav aria-label="Primary" className="ms-auto hidden items-center gap-1 sm:flex">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/docs">Docs</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/docs/templates">Templates</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href="#tokens">Tokens</a>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href={SITE.github} rel="noopener">
                <GithubMark className="size-4" /> GitHub
              </a>
            </Button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-(--container-content) px-(--gutter)">
        <section className="relative overflow-hidden py-(--section-y)">
          <div className="dot-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(60%_60%_at_50%_0%,black,transparent)]" />
          <div className="max-w-3xl space-y-6">
            <Badge variant="soft">v0.1 · foundation release</Badge>
            <h1 className="font-display text-display uppercase">
              Build interfaces that feel <span className="text-primary">cinematic</span>.
            </h1>
            <p className="max-w-prose text-body-lg text-muted-foreground">{SITE.description}</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg" asChild>
                <Link href="/docs">
                  Browse the docs <ArrowRight />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href={SITE.github} rel="noopener">
                  <GithubMark className="size-4" /> Star on GitHub
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
                Open <ArrowRight className="size-4" />
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
          <PlaygroundControls className="mx-auto max-w-(--container-content)" />
        </div>

        <div className="space-y-16 py-(--section-y)">
          <Showcase />
          <Swatches />
        </div>

        <section className="pb-(--section-y)">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-card border bg-card p-6 shadow-1">
            <div>
              <h2 className="text-h4 font-semibold">This is a sample of the library.</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Every one of the {COMPONENTS.length + BLOCKS.length + TEMPLATES.length} items has
                its own page, with a live preview, the source and its dependency list.
              </p>
            </div>
            <Button asChild>
              <Link href="/docs">
                Go to the docs <ArrowRight />
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
              Source
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
