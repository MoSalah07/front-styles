import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge, Button, Separator } from "@design-eg/ui";
import { CodeBlock } from "@/components/code-block";
import { BLOCKS, COMPONENTS, NAV_GROUPS, REGISTRY_ITEMS, TEMPLATES } from "@/lib/registry";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Documentation",
  description: `Every component, block and page template in ${SITE.name}: ${COMPONENTS.length} primitives, ${BLOCKS.length} blocks and ${TEMPLATES.length} templates, each with a live preview and an install command.`,
  alternates: { canonical: "/docs" },
};

const INSTALL = `pnpm add @design-eg/ui @design-eg/tokens

# or copy the source into your project
npx @design-eg/cli init
npx @design-eg/cli add button card dialog`;

const STYLES = `@import "tailwindcss";
@import "@design-eg/ui/styles.css";`;

export default function DocsIndexPage() {
  return (
    <div className="max-w-3xl space-y-12">
      <header className="space-y-4">
        <Badge variant="soft">{REGISTRY_ITEMS.length} registry items</Badge>
        <h1 className="text-h2 font-semibold">Documentation</h1>
        <p className="max-w-prose text-body-lg text-muted-foreground">
          {COMPONENTS.length} primitives, {BLOCKS.length} composite blocks and {TEMPLATES.length}{" "}
          page templates. Every page previews in whichever theme, brand, direction and density you
          pick in the bar above, because the controls live in the shell rather than in the demo.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/docs/button">
              Start with Button <ArrowRight />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/docs/templates">Template gallery</Link>
          </Button>
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="text-h4 font-semibold">Install</h2>
        <CodeBlock label="bash" code={INSTALL} />
        <p className="text-sm text-muted-foreground">
          Then import the stylesheet once, after Tailwind:
        </p>
        <CodeBlock label="globals.css" code={STYLES} />
      </section>

      <Separator />

      <section className="space-y-8">
        <h2 className="text-h4 font-semibold">Everything in the registry</h2>
        {NAV_GROUPS.map((group) => (
          <div key={group.id} className="space-y-3">
            <h3 className="text-eyebrow font-semibold text-muted-foreground uppercase">
              {group.label}
              <span className="ms-2 font-normal opacity-60">{group.items.length}</span>
            </h3>
            <ul className="grid gap-2 sm:grid-cols-2">
              {group.items.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
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
    </div>
  );
}
