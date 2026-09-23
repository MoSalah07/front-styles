import { Separator } from "@design-eg/ui";

export default function SeparatorExample() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium">Radix Primitives</h3>
        <p className="text-sm text-muted-foreground">An open-source UI component library.</p>
      </div>
      <Separator />
      <div className="flex h-5 items-center gap-4 text-sm">
        <span>Blog</span>
        <Separator orientation="vertical" />
        <span>Docs</span>
        <Separator orientation="vertical" />
        <span>Source</span>
      </div>
    </div>
  );
}
