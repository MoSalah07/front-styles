"use client";

import { LandingSaas } from "@design-eg/ui";

export default function LandingSaasExample() {
  return (
    <LandingSaas
      brand="Relayform"
      navbar={{ sticky: false }}
      pricing={{ onPeriodChange: (period) => console.info("billing period", period) }}
    />
  );
}
