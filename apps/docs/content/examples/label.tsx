import { Input, Label, Switch } from "@design-eg/ui";

export default function LabelExample() {
  return (
    <div className="grid max-w-md gap-4">
      <div className="grid gap-2">
        <Label htmlFor="demo-workspace">Workspace name</Label>
        <Input id="demo-workspace" defaultValue="Acme" readOnly />
      </div>
      <div className="flex items-center justify-between rounded-control border p-3">
        <Label htmlFor="demo-public" className="cursor-pointer">
          Make this workspace public
        </Label>
        <Switch id="demo-public" />
      </div>
    </div>
  );
}
