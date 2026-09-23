import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@design-eg/ui";
import { Preview } from "@/components/preview";
import { getExample } from "@/content/examples";
import { installCommand, TEMPLATES } from "@/lib/registry";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Template gallery",
  description: `The ${TEMPLATES.length} whole-page templates in ${SITE.name}: sign-in, sign-up, password reset, OTP verification, a dashboard shell, a settings page and the error screens.`,
  alternates: { canonical: "/docs/templates" },
};

export default function TemplateGalleryPage() {
  return (
    <div className="space-y-12">
      <header className="max-w-3xl space-y-3">
        <h1 className="text-h2 font-semibold">Template gallery</h1>
        <p className="text-body-lg text-muted-foreground">
          {TEMPLATES.length} whole pages, each composed only from primitives and blocks in this
          registry. They are fully controlled: they render and validate, and hand the values back to
          you rather than navigating by themselves.
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
                    <Link href={item.href} className="underline-offset-4 hover:underline">
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
                    <Link href={item.href}>
                      Open <ArrowRight />
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
