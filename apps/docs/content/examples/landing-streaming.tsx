"use client";

import { LandingStreaming } from "@design-eg/ui";

export default function LandingStreamingExample() {
  // No images: every poster and the hero backdrop use the token gradients, so
  // the page follows whichever brand and language the docs are showing.
  return (
    <LandingStreaming
      signInHref="#"
      onEmailSubmit={(email) => console.info("get started", email)}
      onSelectTitle={(item, row) => console.info("open", item.title, "from", row.title)}
    />
  );
}
