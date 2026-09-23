import { Bold, Italic, Underline } from "lucide-react";
import { Toggle } from "@design-eg/ui";

export default function ToggleExample() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Toggle aria-label="Bold" defaultPressed>
        <Bold />
      </Toggle>
      <Toggle aria-label="Italic" variant="outline">
        <Italic />
      </Toggle>
      <Toggle aria-label="Underline" variant="outline" size="lg">
        <Underline />
      </Toggle>
      <Toggle aria-label="Strikethrough" disabled>
        <span className="line-through">S</span>
      </Toggle>
    </div>
  );
}
