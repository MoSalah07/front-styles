"use client";

import { InstallCommand } from "@design-eg/ui";

export default function InstallCommandExample() {
  return (
    <div className="space-y-4">
      <InstallCommand packageName={["@design-eg/ui", "@design-eg/tokens"]} label="install" />

      {/* A binary to run once: each tab gets its own runner — npx, pnpm dlx, yarn dlx, bunx. */}
      <InstallCommand command="@design-eg/cli add button" label="add a component" />

      <InstallCommand packageName="@design-eg/cli" dev managers={["pnpm", "bun"]} label="dev dep" />

      <p className="text-sm text-muted-foreground">
        The chosen package manager is remembered in localStorage, so a reader picks pnpm once and
        every snippet on the site follows.
      </p>
    </div>
  );
}
