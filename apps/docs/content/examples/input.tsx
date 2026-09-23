import { Input, Label } from "@design-eg/ui";

export default function InputExample() {
  return (
    <div className="grid max-w-md gap-5">
      <div className="grid gap-2">
        <Label htmlFor="demo-email">Email</Label>
        <Input
          id="demo-email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          readOnly
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="demo-invalid">With an error</Label>
        <Input
          id="demo-invalid"
          aria-invalid
          defaultValue="not-an-email"
          aria-describedby="demo-invalid-msg"
          readOnly
        />
        <p id="demo-invalid-msg" className="text-xs text-destructive">
          Enter a valid email address.
        </p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="demo-disabled">Disabled</Label>
        <Input id="demo-disabled" defaultValue="Locked while syncing" disabled />
      </div>
    </div>
  );
}
