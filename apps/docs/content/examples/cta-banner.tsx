import { ArrowRight } from "lucide-react";
import { Button, CtaBanner } from "@design-eg/ui";

export default function CtaBannerExample() {
  return (
    <CtaBanner
      eyebrow="Ready when you are"
      title="Ship your next screen this afternoon."
      description="Install the package, pick a brand seed and start composing. Nothing to configure."
      align="center"
      actions={
        <>
          <Button size="lg">
            Get started <ArrowRight />
          </Button>
          <Button size="lg" variant="outline">
            Read the docs
          </Button>
        </>
      }
    />
  );
}
