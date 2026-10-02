import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { runAxe } from "../../test/setup";
import { I18nProvider } from "../lib/i18n";
import { ar } from "../lib/messages/ar";
import {
  AdminDashboard,
  type AdminDashboardActivity,
  type AdminDashboardOrder,
  type AdminDashboardProduct,
  type AdminDashboardStats,
} from "./admin-dashboard";

const stats: AdminDashboardStats = {
  revenue: { value: 128400, delta: 0.125 },
  orders: { value: 1204, delta: -0.031 },
  customers: { value: 842, delta: 0 },
  conversion: { value: 0.032, delta: 0.004 },
};

/** The KPI cards sit in a region named by a visually hidden heading. */
function kpiRegion(name = "Key metrics") {
  return screen.getByRole("region", { name });
}

describe("AdminDashboard", () => {
  it("renders a whole page from its sample data alone", () => {
    const { container } = render(<AdminDashboard />);

    expect(screen.getByRole("heading", { level: 1, name: "Overview" })).toBeInTheDocument();
    for (const name of [
      "Revenue over time",
      "Sales by channel",
      "Recent orders",
      "Top products",
      "Recent activity",
    ]) {
      expect(screen.getByRole("heading", { level: 2, name })).toBeInTheDocument();
    }
    expect(container.querySelectorAll('[data-slot="stat-card"]')).toHaveLength(4);
    expect(container.querySelectorAll('[data-slot="admin-dashboard-product"]')).toHaveLength(4);
  });

  it("renders the KPI labels and their formatted values", () => {
    render(<AdminDashboard stats={stats} />);
    const kpis = within(kpiRegion());

    expect(kpis.getByText("Revenue")).toBeInTheDocument();
    expect(kpis.getByText("$128,400")).toBeInTheDocument();
    expect(kpis.getByText("Orders")).toBeInTheDocument();
    expect(kpis.getByText("1,204")).toBeInTheDocument();
    expect(kpis.getByText("Customers")).toBeInTheDocument();
    expect(kpis.getByText("842")).toBeInTheDocument();
    expect(kpis.getByText("Conversion rate")).toBeInTheDocument();
    expect(kpis.getByText("3.2%")).toBeInTheDocument();

    // The trend follows the sign of the delta unless one is given.
    expect(kpis.getByText("+12.5%")).toHaveAttribute("data-trend", "up");
    expect(kpis.getByText("-3.1%")).toHaveAttribute("data-trend", "down");
    expect(kpis.getByText("0.0%")).toHaveAttribute("data-trend", "flat");
    expect(kpis.getAllByText("vs the previous 30 days")).toHaveLength(4);
  });

  it("lists the recent orders under their column headers", () => {
    render(<AdminDashboard />);

    for (const name of ["Order", "Customer", "Status", "Amount", "Date", "Actions"]) {
      expect(screen.getByRole("columnheader", { name })).toBeInTheDocument();
    }

    // Header row plus one page of five orders.
    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(6);

    const first = within(rows[1]!);
    expect(first.getByText("ORD-3218")).toBeInTheDocument();
    expect(first.getByText("Salma Farid")).toBeInTheDocument();
    expect(first.getByText("Paid")).toHaveAttribute("data-variant", "success");
    expect(first.getByText("$249.00")).toBeInTheDocument();
    expect(first.getByText("Sep 28, 2026").tagName).toBe("TIME");

    expect(within(rows[4]!).getByText("Failed")).toHaveAttribute("data-variant", "destructive");
  });

  it("maps every order status to its badge variant", () => {
    const base = { customer: { name: "Rami Khalil" }, amount: 10, date: "2026-09-01" };
    const orders: AdminDashboardOrder[] = [
      { ...base, id: "A-1", status: "paid" },
      { ...base, id: "A-2", status: "pending" },
      { ...base, id: "A-3", status: "refunded" },
      { ...base, id: "A-4", status: "failed" },
    ];
    render(<AdminDashboard orders={orders} />);

    expect(screen.getByText("Paid")).toHaveAttribute("data-variant", "success");
    expect(screen.getByText("Pending")).toHaveAttribute("data-variant", "warning");
    expect(screen.getByText("Refunded")).toHaveAttribute("data-variant", "info");
    expect(screen.getByText("Failed")).toHaveAttribute("data-variant", "destructive");
  });

  it("reports the action picked from an order's menu", async () => {
    const user = userEvent.setup();
    const onOrderAction = vi.fn();
    render(<AdminDashboard onOrderAction={onOrderAction} />);

    await user.click(screen.getByRole("button", { name: "Actions for order ORD-3218" }));
    await user.click(screen.getByRole("menuitem", { name: "View order" }));

    expect(onOrderAction).toHaveBeenCalledWith(
      "view",
      expect.objectContaining({ id: "ORD-3218", status: "paid" }),
    );
  });

  it("calls onRangeChange when another period is picked", async () => {
    const user = userEvent.setup();
    const onRangeChange = vi.fn();
    render(<AdminDashboard onRangeChange={onRangeChange} />);

    const range = within(screen.getByRole("radiogroup", { name: "Date range" }));
    expect(range.getByRole("radio", { name: "30 days" })).toHaveAttribute("aria-checked", "true");

    await user.click(range.getByRole("radio", { name: "7 days" }));

    expect(onRangeChange).toHaveBeenCalledWith("7d");
    expect(range.getByRole("radio", { name: "7 days" })).toHaveAttribute("aria-checked", "true");
    expect(within(kpiRegion()).getAllByText("vs the previous 7 days")).toHaveLength(4);
  });

  it("stays on a controlled range until the parent changes it", async () => {
    const user = userEvent.setup();
    const onRangeChange = vi.fn();
    render(<AdminDashboard range="90d" onRangeChange={onRangeChange} />);

    const range = within(screen.getByRole("radiogroup", { name: "Date range" }));
    await user.click(range.getByRole("radio", { name: "7 days" }));

    expect(onRangeChange).toHaveBeenCalledWith("7d");
    expect(range.getByRole("radio", { name: "90 days" })).toHaveAttribute("aria-checked", "true");
  });

  it("exports the period on screen", async () => {
    const user = userEvent.setup();
    const onExport = vi.fn();
    render(<AdminDashboard defaultRange="90d" onExport={onExport} />);

    await user.click(screen.getByRole("button", { name: "Export" }));

    expect(onExport).toHaveBeenCalledWith("90d");
  });

  it("gives the user menu an accessible name and passes sign-out through", async () => {
    const user = userEvent.setup();
    const onSignOut = vi.fn();
    render(
      <AdminDashboard
        user={{ name: "Mona Adel", email: "mona@example.com" }}
        onSignOut={onSignOut}
      />,
    );

    const trigger = screen.getByRole("button", { name: "Account menu for Mona Adel" });
    await user.click(trigger);
    expect(screen.getByRole("menuitem", { name: "Profile" })).toBeInTheDocument();

    await user.click(screen.getByRole("menuitem", { name: "Sign out" }));
    expect(onSignOut).toHaveBeenCalledTimes(1);
  });

  it("hides the user menu when user is null", () => {
    render(<AdminDashboard user={null} />);

    expect(screen.queryByRole("button", { name: /account menu/i })).not.toBeInTheDocument();
  });

  it("formats amounts in the currency it is given", () => {
    const orders: AdminDashboardOrder[] = [
      {
        id: "EU-1",
        customer: { name: "Rami Khalil" },
        status: "paid",
        amount: 49.5,
        date: "2026-09-01",
      },
    ];
    render(<AdminDashboard currency="EUR" orders={orders} stats={stats} />);

    expect(screen.getByText("€49.50")).toBeInTheDocument();
    expect(within(kpiRegion()).getByText("€128,400")).toBeInTheDocument();
  });

  it("renders top products as named progress bars and activity as a dated list", () => {
    const topProducts: AdminDashboardProduct[] = [
      { id: "a", name: "Oak shelf", units: 12, revenue: 2400 },
      { id: "b", name: "Wool rug", units: 1, revenue: 600 },
    ];
    const activity: AdminDashboardActivity[] = [
      { id: "1", message: "Payout sent.", date: "2026-09-28T09:05", tone: "success" },
      { id: "2", message: "Stock is low.", date: "2026-09-27T17:42", tone: "warning" },
    ];
    const { container } = render(<AdminDashboard topProducts={topProducts} activity={activity} />);

    const shelf = screen.getByRole("progressbar", { name: "Oak shelf" });
    expect(shelf).toHaveAttribute("aria-valuenow", "100");
    expect(shelf).toHaveAttribute("aria-valuetext", "$2,400");
    expect(screen.getByRole("progressbar", { name: "Wool rug" })).toHaveAttribute(
      "aria-valuenow",
      "25",
    );
    // The count picks the plural form.
    expect(screen.getByText("12 units sold")).toBeInTheDocument();
    expect(screen.getByText("1 unit sold")).toBeInTheDocument();

    const feed = container.querySelector('[data-slot="admin-dashboard-activity-list"]');
    expect(feed?.tagName).toBe("OL");
    const times = feed?.querySelectorAll("time") ?? [];
    expect(times).toHaveLength(2);
    expect(times[0]).toHaveAttribute("datetime");
    expect(within(feed as HTMLElement).getByText("Payout sent.")).toBeInTheDocument();
  });

  it("shows empty states for empty side lists", () => {
    render(<AdminDashboard topProducts={[]} activity={[]} />);

    expect(screen.getByText("No sales in this period yet.")).toBeInTheDocument();
    expect(screen.getByText("Nothing has happened yet.")).toBeInTheDocument();
  });

  it("renders in Arabic", () => {
    render(
      <I18nProvider locale="ar">
        <AdminDashboard />
      </I18nProvider>,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: ar["adminDashboard.title"] as string }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: ar["adminDashboard.columnCustomer"] as string }),
    ).toBeInTheDocument();

    const kpis = within(kpiRegion(ar["adminDashboard.metricsLabel"] as string));
    expect(kpis.getByText(ar["adminDashboard.kpiConversion"] as string)).toBeInTheDocument();
    // 30 falls in Arabic's "many" category, 7 in "few".
    expect(kpis.getAllByText("مقارنةً بـ30 يومًا سابقًا")).toHaveLength(4);
    expect(screen.getByRole("radio", { name: "7 أيام" })).toBeInTheDocument();
    expect(screen.getAllByText(ar["adminDashboard.statusPaid"] as string).length).toBeGreaterThan(
      0,
    );
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(<AdminDashboard />);

    expect(await runAxe(container)).toHaveNoViolations();
  });
});
