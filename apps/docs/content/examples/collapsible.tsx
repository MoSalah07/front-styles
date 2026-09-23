"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import { Button, Collapsible, CollapsibleContent, CollapsibleTrigger } from "@design-eg/ui";

const REPOS = ["@design-eg/ui", "@design-eg/tokens", "@design-eg/cli"];

export default function CollapsibleExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="max-w-sm space-y-2">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-semibold">Packages published today</h3>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="Toggle the package list">
            <ChevronsUpDown />
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-control border px-4 py-2 font-mono text-sm">{REPOS[0]}</div>
      <CollapsibleContent className="space-y-2">
        {REPOS.slice(1).map((repo) => (
          <div key={repo} className="rounded-control border px-4 py-2 font-mono text-sm">
            {repo}
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
