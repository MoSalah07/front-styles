"use client";

import { brands, tokens } from "@design-eg/tokens";
import { SettingsPage } from "@design-eg/ui";

export default function SettingsPageExample() {
  return (
    <SettingsPage
      title="Settings"
      description="Manage your profile, notifications and the look of the product."
      user={{ name: "Nour Hassan", email: "nour@acme.eg", initials: "NH" }}
      preferences={[
        {
          id: "deploys",
          label: "Deploy notifications",
          description: "Email me when a production deploy finishes.",
          defaultChecked: true,
        },
        {
          id: "digest",
          label: "Weekly digest",
          description: "A Monday summary of what the team shipped.",
        },
        {
          id: "beta",
          label: "Beta features",
          description: "Turn on features that are still being tested.",
          disabled: true,
        },
      ]}
      brands={brands.map((brand) => ({ value: brand, label: tokens.brands[brand].label }))}
      onProfileSubmit={(values) => console.info("profile", values)}
      onDangerConfirm={() => console.info("delete account")}
    />
  );
}
