"use client";

import * as React from "react";
import { Badge, Button, PricingTable, PricingTier, type PricingPeriod } from "@design-eg/ui";

const TIERS = [
  {
    name: "Starter",
    monthly: "$0",
    annual: "$0",
    description: "For a side project that is still finding its shape.",
    features: ["1 project", "Community support", "Shared runners"],
    cta: "Start free",
  },
  {
    name: "Team",
    monthly: "$18",
    annual: "$15",
    description: "For a product team shipping every week.",
    features: ["Unlimited projects", "Priority support", "SSO via Google", "Audit log"],
    cta: "Start the trial",
    featured: true,
  },
  {
    name: "Enterprise",
    monthly: "$49",
    annual: "$41",
    description: "For organisations with procurement and an SLA.",
    features: ["Everything in Team", "SAML SSO", "99.9% uptime SLA", "Dedicated support"],
    cta: "Talk to sales",
  },
];

export default function PricingTableExample() {
  const [period, setPeriod] = React.useState<PricingPeriod>("monthly");

  return (
    <PricingTable
      period={period}
      onPeriodChange={setPeriod}
      columns={3}
      annualNote={<Badge variant="soft">Save 17%</Badge>}
    >
      {TIERS.map((tier) => (
        <PricingTier
          key={tier.name}
          name={tier.name}
          price={period === "monthly" ? tier.monthly : tier.annual}
          period="/ seat / month"
          description={tier.description}
          features={tier.features}
          featured={tier.featured}
          badge={tier.featured ? "Most popular" : undefined}
          cta={<Button variant={tier.featured ? "default" : "outline"}>{tier.cta}</Button>}
        />
      ))}
    </PricingTable>
  );
}
