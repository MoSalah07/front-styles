"use client";

import * as React from "react";
import { Checkbox, Label } from "@design-eg/ui";

const SCOPES = [
  { id: "read", label: "Read repositories" },
  { id: "write", label: "Write repositories" },
  { id: "admin", label: "Administer the organisation" },
];

export default function CheckboxExample() {
  const [checked, setChecked] = React.useState<string[]>(["read"]);

  const all = checked.length === SCOPES.length;
  const some = checked.length > 0 && !all;

  return (
    <div className="grid max-w-sm gap-3">
      <div className="flex items-center gap-3 border-b pb-3">
        <Checkbox
          id="scope-all"
          checked={all ? true : some ? "indeterminate" : false}
          onCheckedChange={(next) => setChecked(next === true ? SCOPES.map((s) => s.id) : [])}
        />
        <Label htmlFor="scope-all" className="cursor-pointer font-medium">
          All scopes
        </Label>
      </div>
      {SCOPES.map((scope) => (
        <div key={scope.id} className="flex items-center gap-3">
          <Checkbox
            id={`scope-${scope.id}`}
            checked={checked.includes(scope.id)}
            onCheckedChange={(next) =>
              setChecked((prev) =>
                next === true ? [...prev, scope.id] : prev.filter((id) => id !== scope.id),
              )
            }
          />
          <Label htmlFor={`scope-${scope.id}`} className="cursor-pointer">
            {scope.label}
          </Label>
        </div>
      ))}
      <div className="flex items-center gap-3 opacity-60">
        <Checkbox id="scope-billing" disabled />
        <Label htmlFor="scope-billing">Billing (owner only)</Label>
      </div>
    </div>
  );
}
