import { Check } from "lucide-react";
import { Badge } from "@design-eg/ui";

export default function BadgeExample() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="soft">Soft</Badge>
      <Badge variant="success">
        <Check /> Paid
      </Badge>
      <Badge variant="warning">Pending</Badge>
      <Badge variant="destructive">Failed</Badge>
      <Badge variant="info">Beta</Badge>
    </div>
  );
}
