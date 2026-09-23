import { Label, Textarea } from "@design-eg/ui";

export default function TextareaExample() {
  return (
    <div className="grid max-w-md gap-2">
      <Label htmlFor="demo-notes">Release notes</Label>
      <Textarea
        id="demo-notes"
        rows={4}
        placeholder="What changed in this release?"
        aria-describedby="demo-notes-hint"
        readOnly
      />
      <p id="demo-notes-hint" className="text-xs text-muted-foreground">
        Markdown is supported. The field grows with the density setting.
      </p>
    </div>
  );
}
