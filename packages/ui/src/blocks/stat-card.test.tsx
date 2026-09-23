import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatCard, StatCardGrid } from "./stat-card";

describe("StatCard", () => {
  it("renders its label and value", () => {
    render(<StatCard label="Monthly revenue" value="EGP 128,400" />);

    expect(screen.getByText("Monthly revenue")).toBeInTheDocument();
    expect(screen.getByText("EGP 128,400")).toBeInTheDocument();
  });

  it("colours an up trend with the success token", () => {
    render(
      <StatCard
        label="Orders"
        value="1,204"
        delta="+12.5%"
        trend="up"
        comparison="vs last month"
      />,
    );

    const delta = screen.getByText("+12.5%");
    expect(delta).toHaveAttribute("data-trend", "up");
    expect(delta).toHaveClass("text-success");
    expect(screen.getByText("vs last month")).toBeInTheDocument();
  });

  it("colours a down trend with the destructive token", () => {
    render(<StatCard label="Churn" value="2.1%" delta="-0.4%" trend="down" />);

    expect(screen.getByText("-0.4%")).toHaveClass("text-destructive");
  });

  it("swaps the value for a skeleton while loading", () => {
    const { container } = render(<StatCard label="Orders" value="1,204" loading />);

    expect(screen.queryByText("1,204")).not.toBeInTheDocument();
    expect(container.querySelector('[data-slot="stat-card-value-skeleton"]')).toBeInTheDocument();
  });

  it("lays tiles out in a grid", () => {
    const { container } = render(
      <StatCardGrid>
        <StatCard label="A" value="1" />
        <StatCard label="B" value="2" />
      </StatCardGrid>,
    );

    const grid = container.querySelector('[data-slot="stat-card-grid"]');
    expect(grid).toHaveClass("grid");
    expect(container.querySelectorAll('[data-slot="stat-card"]')).toHaveLength(2);
  });
});
