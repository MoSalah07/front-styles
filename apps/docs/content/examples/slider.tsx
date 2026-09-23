"use client";

import * as React from "react";
import { Label, Slider } from "@design-eg/ui";

export default function SliderExample() {
  const [volume, setVolume] = React.useState([60]);
  const [range, setRange] = React.useState([200, 800]);

  return (
    <div className="max-w-md space-y-8">
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <Label htmlFor="demo-volume">Volume</Label>
          <span className="tabular-nums text-muted-foreground">{volume[0]}</span>
        </div>
        <Slider id="demo-volume" value={volume} onValueChange={setVolume} max={100} step={1} />
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <Label htmlFor="demo-price">Price range</Label>
          <span className="tabular-nums text-muted-foreground">
            {range[0]} – {range[1]}
          </span>
        </div>
        <Slider
          id="demo-price"
          value={range}
          onValueChange={setRange}
          min={0}
          max={1000}
          step={50}
        />
      </div>
    </div>
  );
}
