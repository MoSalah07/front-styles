"use client";

import { Link2 } from "lucide-react";
import { CopyButton, notify, Separator } from "@design-eg/ui";

const TOKEN = "sk_live_51H8xQ2KpR4tVwZ";

export default function CopyButtonExample() {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <CopyButton value={TOKEN} copyLabel="Copy API key" />
        <CopyButton value={TOKEN} variant="outline">
          Copy key
        </CopyButton>
        <CopyButton
          value="https://design-eg.vercel.app/docs/copy-button"
          variant="secondary"
          icon={<Link2 className="size-4" />}
        >
          Copy link
        </CopyButton>
      </div>

      <Separator />

      <div className="flex flex-wrap items-center gap-3">
        {/* Wire onCopy to the toaster for feedback that survives a moved cursor. */}
        <CopyButton
          value={TOKEN}
          variant="outline"
          onCopy={() => notify.copied("API key copied", { description: "Paste it into your .env" })}
        >
          Copy with a toast
        </CopyButton>
        <CopyButton
          value={TOKEN}
          variant="outline"
          copiedLabel="Saved"
          timeout={5000}
          onCopyError={() => notify.error("The browser blocked the clipboard")}
        >
          Longer success window
        </CopyButton>
      </div>

      <p className="text-sm text-muted-foreground">
        The value can also be a function, which runs at click time — useful when the text is
        generated from whatever is on screen right now.
      </p>
    </div>
  );
}
