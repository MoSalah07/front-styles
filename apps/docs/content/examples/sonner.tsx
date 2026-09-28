"use client";

import { Button, notify, toast } from "@design-eg/ui";

// Mount <Toaster /> once, in your root layout. Every notify() call on the page
// then renders into it — this site does exactly that.
export default function SonnerExample() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="outline" onClick={() => notify("Deployment queued")}>
        Plain
      </Button>
      <Button
        variant="outline"
        onClick={() => notify.success("Build 482 is live", { description: "Took 41 seconds." })}
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          notify.error("Payment declined", {
            description: "Update the card on file to keep the workspace active.",
            action: { label: "Update", onClick: () => notify.info("Opening billing…") },
          })
        }
      >
        Error with an action
      </Button>
      <Button variant="outline" onClick={() => notify.warning("Storage is nearly full")}>
        Warning
      </Button>
      <Button variant="outline" onClick={() => notify.copied()}>
        Copy feedback
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          const id = notify.loading("Publishing the registry…");
          setTimeout(() => notify.success("Registry published", { id }), 1800);
        }}
      >
        Loading, then resolved
      </Button>
      <Button variant="outline" onClick={() => toast("A bare sonner toast")}>
        sonner’s own API
      </Button>
    </div>
  );
}
