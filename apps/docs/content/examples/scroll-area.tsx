import { ScrollArea, Separator } from "@design-eg/ui";

const TAGS = Array.from({ length: 40 }, (_, i) => `v1.2.0-beta.${40 - i}`);

export default function ScrollAreaExample() {
  return (
    <ScrollArea className="h-64 w-64 rounded-card border">
      <div className="p-4">
        <h4 className="mb-3 text-sm font-medium">Tags</h4>
        {TAGS.map((tag) => (
          <div key={tag}>
            <div className="py-1.5 font-mono text-sm">{tag}</div>
            <Separator />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
