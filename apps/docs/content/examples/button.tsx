import { ArrowRight, Bell, Plus, Trash2 } from "lucide-react";
import { Button, Separator } from "@design-eg/ui";

export default function ButtonExample() {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Button>
          Continue <ArrowRight />
        </Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
        <Button variant="destructive">
          <Trash2 /> Delete
        </Button>
      </div>

      <Separator />

      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
        <Button size="icon" aria-label="Add item">
          <Plus />
        </Button>
        <Button size="icon-sm" variant="outline" aria-label="Notifications">
          <Bell />
        </Button>
        <Button loading>Saving</Button>
        <Button disabled>Disabled</Button>
        <Button asChild variant="outline">
          <a href="/docs">Rendered as a link</a>
        </Button>
      </div>
    </div>
  );
}
