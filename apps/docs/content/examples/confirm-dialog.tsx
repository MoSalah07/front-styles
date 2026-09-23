"use client";

import { Button, ConfirmDialog } from "@design-eg/ui";

export default function ConfirmDialogExample() {
  return (
    <ConfirmDialog
      title="Delete this deployment?"
      description="Traffic will fall back to the previous build. Logs are kept for 30 days."
      confirmLabel="Delete deployment"
      cancelLabel="Keep it"
      destructive
      trigger={<Button variant="destructive">Delete deployment</Button>}
      onConfirm={() => new Promise((resolve) => setTimeout(resolve, 900))}
      onError={(error) => console.error(error)}
    />
  );
}
