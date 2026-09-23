import { Globe, MessageCircle } from "lucide-react";
import { SiteFooter } from "@design-eg/ui";

export default function SiteFooterExample() {
  return (
    <SiteFooter
      brand={<span className="font-display text-2xl tracking-wide">design-eg</span>}
      blurb="A cinematic, RTL-first React design system. Tokens, primitives, blocks and page templates."
      groups={[
        {
          title: "Product",
          links: [
            { label: "Components", href: "/docs/button" },
            { label: "Blocks", href: "/docs/hero" },
            { label: "Templates", href: "/docs/templates" },
          ],
        },
        {
          title: "Resources",
          links: [
            { label: "Registry", href: "/r/registry.json" },
            { label: "llms.txt", href: "/llms.txt" },
          ],
        },
      ]}
      social={[
        { label: "Website", href: "#", icon: <Globe className="size-4" />, external: true },
        {
          label: "Community",
          href: "#",
          icon: <MessageCircle className="size-4" />,
          external: true,
        },
      ]}
      legal={[
        { label: "Privacy", href: "#" },
        { label: "Terms", href: "#" },
      ]}
      copyright="© 2026 design-eg. MIT licensed."
    />
  );
}
