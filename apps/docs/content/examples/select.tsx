"use client";

import * as React from "react";
import {
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@design-eg/ui";

export default function SelectExample() {
  const [region, setRegion] = React.useState("cai");

  return (
    <div className="grid max-w-xs gap-2">
      <Label htmlFor="demo-region">Deployment region</Label>
      <Select value={region} onValueChange={setRegion}>
        <SelectTrigger id="demo-region">
          <SelectValue placeholder="Pick a region" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Middle East</SelectLabel>
            <SelectItem value="cai">Cairo</SelectItem>
            <SelectItem value="dxb">Dubai</SelectItem>
            <SelectItem value="ruh">Riyadh</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Europe</SelectLabel>
            <SelectItem value="fra">Frankfurt</SelectItem>
            <SelectItem value="lhr">London</SelectItem>
            <SelectItem value="waw" disabled>
              Warsaw (at capacity)
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">Selected: {region}</p>
    </div>
  );
}
