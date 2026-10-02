"use client";

import * as React from "react";
import { Combobox, Label, type ComboboxOption } from "@design-eg/ui";

const regions: ComboboxOption[] = [
  { value: "cai", label: "Cairo", keywords: ["Egypt", "CAI"] },
  { value: "dxb", label: "Dubai", keywords: ["UAE", "DXB"] },
  { value: "ruh", label: "Riyadh", keywords: ["Saudi Arabia", "RUH"] },
  { value: "ist", label: "Istanbul", keywords: ["Türkiye", "IST"] },
  { value: "fra", label: "Frankfurt", keywords: ["Germany", "FRA"] },
  { value: "cdg", label: "Paris", keywords: ["France", "CDG"] },
  { value: "bom", label: "Mumbai", keywords: ["India", "BOM"] },
  { value: "sin", label: "Singapore", keywords: ["SIN"] },
  { value: "waw", label: "Warsaw (at capacity)", disabled: true },
];

const labels: ComboboxOption[] = [
  { value: "bug", label: "Bug" },
  { value: "feature", label: "Feature" },
  { value: "docs", label: "Documentation", keywords: ["docs"] },
  { value: "design", label: "Design" },
  { value: "a11y", label: "Accessibility", keywords: ["a11y"] },
  { value: "i18n", label: "Localisation", keywords: ["i18n", "translation", "RTL"] },
  { value: "perf", label: "Performance", keywords: ["speed"] },
];

export default function ComboboxExample() {
  const [region, setRegion] = React.useState("cai");
  const [tags, setTags] = React.useState<string[]>(["bug", "a11y"]);

  return (
    <div className="grid w-full max-w-xs gap-6">
      <div className="grid gap-2">
        <Label htmlFor="demo-combobox-region">Deployment region</Label>
        <Combobox
          id="demo-combobox-region"
          options={regions}
          value={region}
          onValueChange={setRegion}
          placeholder="Pick a region"
          searchPlaceholder="Search city or airport code…"
        />
        <p className="text-xs text-muted-foreground">Selected: {region || "none"}</p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="demo-combobox-labels">Labels</Label>
        <Combobox
          id="demo-combobox-labels"
          multiple
          options={labels}
          value={tags}
          onValueChange={setTags}
          placeholder="Add labels"
        />
        <p className="text-xs text-muted-foreground">
          Selected: {tags.length ? tags.join(", ") : "none"}
        </p>
      </div>
    </div>
  );
}
