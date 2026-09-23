"use client";

import { Button, Toaster, toast } from "@design-eg/ui";

export default function SonnerExample() {
  return (
    <div className="flex flex-wrap gap-3">
      <Toaster />
      <Button variant="outline" onClick={() => toast("Deployment queued")}>
        Plain
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.success("Build 482 is live", { description: "Took 41 seconds." })}
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.error("Payment declined", {
            description: "Update the card on file to keep the workspace active.",
            action: { label: "Update", onClick: () => toast("Opening billing…") },
          })
        }
      >
        Error with an action
      </Button>
    </div>
  );
}
