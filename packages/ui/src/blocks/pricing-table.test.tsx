import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PricingTable, PricingTier, type PricingPeriod } from "./pricing-table";

const TIERS = [
  { name: "Starter", price: "$0", features: ["One project", "Community support"] },
  {
    name: "Studio",
    price: "$29",
    features: ["Ten projects", "Priority support"],
    featured: true,
    badge: "Most popular",
  },
  { name: "Scale", price: "$99", features: ["Unlimited projects", "Dedicated support"] },
];

function Example({
  period = "monthly",
  onPeriodChange,
}: {
  period?: PricingPeriod;
  onPeriodChange?: (period: PricingPeriod) => void;
}) {
  return (
    <PricingTable period={period} onPeriodChange={onPeriodChange} annualNote="Save 20%">
      {TIERS.map((tier) => (
        <PricingTier
          key={tier.name}
          name={tier.name}
          price={tier.price}
          period="/month"
          description={`The ${tier.name} plan`}
          features={tier.features}
          featured={tier.featured}
          badge={tier.badge}
          cta={<button type="button">Choose {tier.name}</button>}
        />
      ))}
    </PricingTable>
  );
}

describe("PricingTable", () => {
  it("renders every tier with its name, price and features", () => {
    render(<Example />);

    expect(screen.getAllByRole("article")).toHaveLength(3);
    for (const tier of TIERS) {
      const article = screen.getByRole("article", { name: tier.name });
      expect(article).toBeInTheDocument();
      expect(article).toHaveTextContent(tier.price);
      for (const feature of tier.features) {
        expect(article).toHaveTextContent(feature);
      }
    }
  });

  it("gives each tier a call to action", () => {
    render(<Example />);
    expect(screen.getByRole("button", { name: "Choose Studio" })).toBeInTheDocument();
  });

  it("marks only the featured tier and puts it on the brand surface", () => {
    render(<Example />);

    const featured = screen.getByRole("article", { name: "Studio" });
    expect(featured).toHaveAttribute("data-featured", "true");
    expect(featured).toHaveClass("brand-surface");
    expect(featured).toHaveTextContent("Most popular");

    expect(screen.getByRole("article", { name: "Starter" })).not.toHaveAttribute("data-featured");
    expect(screen.getByRole("article", { name: "Scale" })).not.toHaveAttribute("data-featured");
  });

  it("reflects the period prop on the switch rather than owning it", () => {
    const { rerender } = render(<Example period="monthly" />);
    const toggle = screen.getByRole("switch", { name: "Bill annually" });
    expect(toggle).toHaveAttribute("data-state", "unchecked");

    rerender(<Example period="annual" />);
    expect(screen.getByRole("switch", { name: "Bill annually" })).toHaveAttribute(
      "data-state",
      "checked",
    );
  });

  it("calls the toggle handler with the next period", async () => {
    const onPeriodChange = vi.fn();
    render(<Example period="monthly" onPeriodChange={onPeriodChange} />);

    await userEvent.click(screen.getByRole("switch", { name: "Bill annually" }));
    expect(onPeriodChange).toHaveBeenCalledTimes(1);
    expect(onPeriodChange).toHaveBeenCalledWith("annual");
  });

  it("calls the toggle handler back to monthly when it is already annual", async () => {
    const onPeriodChange = vi.fn();
    render(<Example period="annual" onPeriodChange={onPeriodChange} />);

    await userEvent.click(screen.getByRole("switch", { name: "Bill annually" }));
    expect(onPeriodChange).toHaveBeenCalledWith("monthly");
  });
});
