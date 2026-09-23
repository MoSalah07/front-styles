"use client";

import * as React from "react";
import { Button, Label, Progress } from "@design-eg/ui";

export default function ProgressExample() {
  const [value, setValue] = React.useState(38);

  return (
    <div className="max-w-md space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <Label htmlFor="demo-progress">Uploading assets</Label>
          <span className="tabular-nums text-muted-foreground">{value}%</span>
        </div>
        <Progress id="demo-progress" value={value} />
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => setValue((v) => Math.max(0, v - 10))}>
          -10
        </Button>
        <Button size="sm" variant="outline" onClick={() => setValue((v) => Math.min(100, v + 10))}>
          +10
        </Button>
      </div>
    </div>
  );
}
