"use client";

import * as React from "react";
import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, Underline } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@design-eg/ui";

export default function ToggleGroupExample() {
  const [align, setAlign] = React.useState("start");

  return (
    <div className="space-y-4">
      <ToggleGroup type="multiple" variant="outline" defaultValue={["bold"]}>
        <ToggleGroupItem value="bold" aria-label="Bold">
          <Bold />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic">
          <Italic />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Underline">
          <Underline />
        </ToggleGroupItem>
      </ToggleGroup>

      <ToggleGroup
        type="single"
        value={align}
        onValueChange={(next) => next && setAlign(next)}
        aria-label="Text alignment"
      >
        <ToggleGroupItem value="start" aria-label="Align start">
          <AlignLeft />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Align center">
          <AlignCenter />
        </ToggleGroupItem>
        <ToggleGroupItem value="end" aria-label="Align end">
          <AlignRight />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
