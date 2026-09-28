"use client";

import { CodeBlock } from "@design-eg/ui";

const SNIPPET = `import { Button } from "@design-eg/ui";

export function Save() {
  return <Button>Save changes</Button>;
}`;

export default function CodeBlockExample() {
  return (
    <div className="space-y-4">
      <CodeBlock code={SNIPPET} label="save.tsx" />

      <CodeBlock code={SNIPPET} label="save.tsx" lineNumbers maxHeight="12rem" />

      {/* Without the header the copy button floats in, on hover or on focus. */}
      <CodeBlock code="pnpm add @design-eg/ui" hideHeader toast="Command copied" />
    </div>
  );
}
