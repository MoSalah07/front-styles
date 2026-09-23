import { Button, SiteNavbar } from "@design-eg/ui";

export default function SiteNavbarExample() {
  return (
    <SiteNavbar
      sticky={false}
      logo={<span className="font-display text-2xl tracking-wide">design-eg</span>}
      links={[
        { label: "Components", href: "/docs/button", active: true },
        { label: "Blocks", href: "/docs/hero" },
        { label: "Templates", href: "/docs/templates" },
        { label: "Pricing", href: "#" },
      ]}
      actions={
        <>
          <Button variant="ghost" size="sm">
            Sign in
          </Button>
          <Button size="sm">Get started</Button>
        </>
      }
    />
  );
}
