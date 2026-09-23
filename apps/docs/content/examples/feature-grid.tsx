import { Accessibility, Languages, Palette, Terminal } from "lucide-react";
import { FeatureCard, FeatureGrid } from "@design-eg/ui";

export default function FeatureGridExample() {
  return (
    <FeatureGrid>
      <FeatureCard
        icon={<Palette />}
        title="Tokens from one seed"
        description="A brand is a JSON file. The compiler derives OKLCH ramps and semantic roles for both modes."
      />
      <FeatureCard
        icon={<Languages />}
        title="RTL and Arabic first"
        description="Logical properties everywhere, a dedicated Arabic stack and tuned line-height."
      />
      <FeatureCard
        icon={<Accessibility />}
        title="Accessible by default"
        description="Radix primitives handle focus, keyboard and ARIA; tokens handle contrast."
      />
      <FeatureCard
        icon={<Terminal />}
        title="Own the source"
        description="Install from npm, or copy any item into your repo with the CLI."
        link={{ href: "/docs", label: "Browse the registry" }}
      />
    </FeatureGrid>
  );
}
