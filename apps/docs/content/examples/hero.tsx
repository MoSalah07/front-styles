import { ArrowRight, PlayCircle } from "lucide-react";
import {
  Badge,
  Button,
  Hero,
  HeroActions,
  HeroDescription,
  HeroEyebrow,
  HeroMedia,
  HeroTitle,
} from "@design-eg/ui";

export default function HeroExample() {
  return (
    <Hero variant="split" decoration="gradient">
      <HeroEyebrow>
        <Badge variant="soft">v0.1 · foundation release</Badge>
      </HeroEyebrow>
      <HeroTitle>Build interfaces that feel cinematic.</HeroTitle>
      <HeroDescription>
        Contrast-checked tokens, accessible Radix primitives and ready-made blocks — in one package
        that speaks Arabic as fluently as English.
      </HeroDescription>
      <HeroActions>
        <Button size="lg">
          Get started <ArrowRight />
        </Button>
        <Button size="lg" variant="outline">
          <PlayCircle /> Watch the tour
        </Button>
      </HeroActions>
      <HeroMedia>
        <div className="grid aspect-video place-items-center rounded-media border bg-surface-1 text-sm text-muted-foreground">
          Product screenshot
        </div>
      </HeroMedia>
    </Hero>
  );
}
