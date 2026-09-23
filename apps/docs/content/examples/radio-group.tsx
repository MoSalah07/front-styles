"use client";

import * as React from "react";
import { Label, RadioGroup, RadioGroupItem } from "@design-eg/ui";

const PLANS = [
  { value: "starter", label: "Starter", hint: "Up to 3 projects" },
  { value: "team", label: "Team", hint: "Unlimited projects and seats" },
  { value: "enterprise", label: "Enterprise", hint: "SSO, audit log, SLA" },
];

export default function RadioGroupExample() {
  const [plan, setPlan] = React.useState("team");

  return (
    <RadioGroup value={plan} onValueChange={setPlan} className="grid max-w-sm gap-3">
      {PLANS.map((option) => (
        <Label
          key={option.value}
          htmlFor={`plan-${option.value}`}
          className="flex cursor-pointer items-start gap-3 rounded-control border p-3 has-[[data-state=checked]]:border-primary"
        >
          <RadioGroupItem id={`plan-${option.value}`} value={option.value} className="mt-0.5" />
          <span className="grid gap-0.5">
            <span className="font-medium">{option.label}</span>
            <span className="text-xs text-muted-foreground">{option.hint}</span>
          </span>
        </Label>
      ))}
    </RadioGroup>
  );
}
