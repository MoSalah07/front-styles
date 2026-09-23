"use client";

import { Button, ErrorState } from "@design-eg/ui";

export default function ErrorStateExample() {
  return (
    <ErrorState
      title="We could not load your invoices"
      message="The billing service timed out after 10 seconds. Request id req_01HQ7Z9K3R."
      onRetry={() => console.info("retry")}
      action={
        <Button variant="ghost" asChild>
          <a href="#">Contact support</a>
        </Button>
      }
    />
  );
}
