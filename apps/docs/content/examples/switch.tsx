"use client";

import * as React from "react";
import { Label, Switch } from "@design-eg/ui";

export default function SwitchExample() {
  const [notify, setNotify] = React.useState(true);

  return (
    <div className="grid max-w-sm gap-3">
      <div className="flex items-center justify-between rounded-control border p-3">
        <Label htmlFor="demo-notify" className="cursor-pointer">
          Email me about deploys
        </Label>
        <Switch id="demo-notify" checked={notify} onCheckedChange={setNotify} />
      </div>
      <div className="flex items-center justify-between rounded-control border p-3 opacity-60">
        <Label htmlFor="demo-sms">SMS alerts (needs a phone number)</Label>
        <Switch id="demo-sms" disabled />
      </div>
      <p className="text-xs text-muted-foreground">Deploy emails are {notify ? "on" : "off"}.</p>
    </div>
  );
}
