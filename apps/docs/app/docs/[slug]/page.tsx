import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Separator } from "@design-eg/ui";
import { CodeBlock } from "@/components/code-block";
import { Preview } from "@/components/preview";
import { getExample } from "@/content/examples";
import { getItemNotes } from "@/lib/anatomy";
import { getExampleSource } from "@/lib/example-source";
import { getRegistryItem, installCommand, REGISTRY_ITEMS } from "@/lib/registry";
import { SITE } from "@/lib/site";

/** Prerender one page per registry item, and refuse anything outside that set. */
export function generateStaticParams() {
  return REGISTRY_ITEMS.map((item) => ({ slug: item.name }));
}

export const dynamicParams = false;

const KIND_LABEL = {
  foundation: "Foundation",
  component: "Component",
  block: "Block",
  template: "Template",
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getRegistryItem(slug);
  if (!item) return {};

  const description = item.description || `${item.title} from the ${SITE.name} registry.`;
  return {
    title: item.title,
    description,
    alternates: { canonical: `/docs/${item.name}` },
    openGraph: {
      type: "article",
      title: `${item.title} · ${SITE.name}`,
      description,
      url: `${SITE.url}/docs/${item.name}`,
    },
    twitter: { card: "summary_large_image", title: `${item.title} · ${SITE.name}`, description },
  };
}

export default async function DocsItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getRegistryItem(slug);
  if (!item) notFound();

  const Example = getExample(item.name);
  const source = getExampleSource(item.name);
  const notes = getItemNotes(item.name);
  const usesViewport = item.category === "template";
  // The barrel exports the parts by name, so prefer the documented anatomy over
  // a guess derived from the title.
  const exportName = notes?.anatomy?.[0] ?? item.title.replace(/\s+/g, "");

  return (
    <article className="max-w-3xl space-y-10">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="soft">{KIND_LABEL[item.category]}</Badge>
          <code className="font-mono text-xs text-muted-foreground">{item.file || item.name}</code>
        </div>
        <h1 className="text-h2 font-semibold">{item.title}</h1>
        {item.description ? (
          <p className="max-w-prose text-body-lg text-muted-foreground">{item.description}</p>
        ) : null}
      </header>

      <section className="space-y-3">
        <h2 className="text-h4 font-semibold">Installation</h2>
        <CodeBlock label="bash" code={installCommand(item.name)} />
        <p className="text-sm text-muted-foreground">
          Or import it from the package:{" "}
          <code className="font-mono text-xs">
            import {"{"} {exportName} {"}"} from &quot;@design-eg/ui&quot;
          </code>
        </p>
      </section>

      {Example ? (
        <section className="space-y-4">
          <h2 className="text-h4 font-semibold">Example</h2>
          <Preview variant={usesViewport ? "viewport" : "stage"}>
            <Example />
          </Preview>
          {source ? <CodeBlock label={`${item.name}.tsx`} code={source} /> : null}
        </section>
      ) : (
        <section className="space-y-3">
          <h2 className="text-h4 font-semibold">Example</h2>
          <p className="rounded-card border border-dashed p-6 text-sm text-muted-foreground">
            No live demo for this item yet. Install it with the command above, then compose it the
            way the description explains — the props are typed, so your editor will guide you.
          </p>
        </section>
      )}

      {notes?.anatomy?.length ? (
        <section className="space-y-3">
          <h2 className="text-h4 font-semibold">Anatomy</h2>
          <ul className="flex flex-wrap gap-2">
            {notes.anatomy.map((part) => (
              <li
                key={part}
                className="rounded-badge border bg-surface-1 px-2 py-1 font-mono text-xs"
              >
                {part}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {notes?.props?.length ? (
        <section className="space-y-3">
          <h2 className="text-h4 font-semibold">Props</h2>
          <div className="overflow-x-auto rounded-card border">
            <table className="w-full text-start text-sm">
              <thead className="bg-surface-2 text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-2 text-start font-medium">
                    Prop
                  </th>
                  <th scope="col" className="px-4 py-2 text-start font-medium">
                    Type
                  </th>
                  <th scope="col" className="px-4 py-2 text-start font-medium">
                    Default
                  </th>
                  <th scope="col" className="px-4 py-2 text-start font-medium">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {notes.props.map((prop) => (
                  <tr key={prop.name} className="border-t align-top">
                    <td className="px-4 py-2 font-mono text-xs whitespace-nowrap">{prop.name}</td>
                    <td className="px-4 py-2 font-mono text-xs text-muted-foreground">
                      {prop.type}
                    </td>
                    <td className="px-4 py-2 font-mono text-xs text-muted-foreground">
                      {prop.defaultValue ?? "—"}
                    </td>
                    <td className="px-4 py-2">{prop.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {notes.notes?.length ? (
            <ul className="list-disc space-y-1 ps-5 text-sm text-muted-foreground">
              {notes.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : notes?.notes?.length ? (
        <section className="space-y-3">
          <h2 className="text-h4 font-semibold">Notes</h2>
          <ul className="list-disc space-y-1 ps-5 text-sm text-muted-foreground">
            {notes.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <Separator />

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <h2 className="text-h4 font-semibold">npm dependencies</h2>
          {item.dependencies.length ? (
            <ul className="flex flex-wrap gap-2">
              {item.dependencies.map((dep) => (
                <li
                  key={dep}
                  className="rounded-badge border bg-surface-1 px-2 py-1 font-mono text-xs"
                >
                  {dep}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">None beyond React.</p>
          )}
        </div>
        <div className="space-y-2">
          <h2 className="text-h4 font-semibold">Registry dependencies</h2>
          {item.registryDependencies.length ? (
            <ul className="flex flex-wrap gap-2">
              {item.registryDependencies.map((dep) => {
                const target = getRegistryItem(dep);
                return (
                  <li key={dep}>
                    {target ? (
                      <Link
                        href={target.href}
                        className="rounded-badge border bg-surface-1 px-2 py-1 font-mono text-xs hover:bg-surface-2"
                      >
                        {dep}
                      </Link>
                    ) : (
                      <span className="rounded-badge border bg-surface-1 px-2 py-1 font-mono text-xs">
                        {dep}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Standalone.</p>
          )}
        </div>
      </section>

      <p className="text-sm text-muted-foreground">
        Registry entry:{" "}
        <a className="underline underline-offset-4" href={`/r/${item.name}.json`}>
          /r/{item.name}.json
        </a>
      </p>
    </article>
  );
}
