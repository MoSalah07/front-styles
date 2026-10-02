import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { I18nProvider } from "../lib/i18n";
import { ar } from "../lib/messages/ar";
import { LandingSaas } from "./landing-saas";

// A whole page per test: role queries over a tree this size are slow in jsdom.
describe("LandingSaas", { timeout: 20_000 }, () => {
  it("renders a complete page with landmarks and one heading per section", () => {
    const { container } = render(<LandingSaas />);

    // jsdom's role mapping also counts the <header> inside each pricing tier
    // article, so pick the page header out rather than asserting a single one.
    const main = screen.getByRole("main");
    const banner = screen.getAllByRole("banner").find((el) => el.dataset.slot === "site-navbar");
    expect(banner).toBeDefined();
    expect(main).not.toContainElement(banner ?? null);
    expect(screen.getByRole("contentinfo")).not.toBe(main);
    expect(screen.getByRole("link", { name: "Skip to content" })).toHaveAttribute(
      "href",
      "#main-content",
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Ship billing in an afternoon, not a quarter.",
      }),
    ).toBeInTheDocument();
    // One role query for the lot: a name query per heading walks this whole
    // page each time, which is slow enough under jsdom to hit the timeout.
    const sectionHeadings = screen
      .getAllByRole("heading", { level: 2 })
      .map((heading) => heading.textContent);
    expect(sectionHeadings).toEqual(
      expect.arrayContaining([
        "Trusted by product teams at",
        "Everything you need to charge for software",
        "A few lines of code. A whole billing stack.",
        "Live in three steps",
        "Built to carry real traffic",
        "Simple pricing that grows with you",
        "Loved by engineering and finance alike",
        "Questions, answered",
        "Start building today",
      ]),
    );

    for (const id of [
      "hero",
      "logos",
      "features",
      "developers",
      "how-it-works",
      "pricing",
      "faq",
    ]) {
      expect(container.querySelector(`#${id}`), id).not.toBeNull();
    }

    // The named sections are regions labelled by their own heading.
    const steps = screen.getByRole("region", { name: "Live in three steps" });
    expect(steps).toHaveAttribute("id", "how-it-works");
    expect(within(steps).getAllByRole("listitem")).toHaveLength(3);
  });

  it("points the navbar at the in-page anchors", () => {
    render(<LandingSaas navbar={{ sticky: false }} />);
    const nav = screen.getByRole("navigation", { name: "Primary" });

    expect(within(nav).getByRole("link", { name: "Features" })).toHaveAttribute(
      "href",
      "#features",
    );
    expect(within(nav).getByRole("link", { name: "Pricing" })).toHaveAttribute("href", "#pricing");
    expect(within(nav).getByRole("link", { name: "FAQ" })).toHaveAttribute("href", "#faq");
  });

  it("hides a section passed as null or false, along with its nav link", () => {
    const { container } = render(<LandingSaas pricing={null} testimonials={false} />);

    expect(container.querySelector("#pricing")).toBeNull();
    expect(
      screen.queryByRole("heading", { name: "Simple pricing that grows with you" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Loved by engineering and finance alike" }),
    ).not.toBeInTheDocument();
    const nav = screen.getByRole("navigation", { name: "Primary" });
    expect(within(nav).queryByRole("link", { name: "Pricing" })).not.toBeInTheDocument();
    // Everything else is still there.
    expect(screen.getByRole("heading", { name: "Live in three steps" })).toBeInTheDocument();
  });

  it("passes content through to each block", () => {
    render(
      <LandingSaas
        brand="Northloom"
        hero={{ title: "Custom headline", primaryAction: null, secondaryAction: null, media: null }}
        steps={{
          id: "process",
          title: "Our process",
          items: [{ title: "One" }, { title: "Two" }],
        }}
        faq={{ items: [{ question: "Custom question?", answer: "Custom answer." }] }}
      />,
    );

    expect(screen.getByRole("heading", { level: 1, name: "Custom headline" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Our process" })).toHaveAttribute("id", "process");
    expect(screen.getByRole("heading", { level: 3, name: "Two" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Custom question?" })).toBeInTheDocument();
    // The brand reaches the default copy and the generated code sample.
    expect(screen.getByText(/Northloom gives you one API/)).toBeInTheDocument();
    expect(screen.getByText(/@northloom\/node/)).toBeInTheDocument();
  });

  it("switches the pricing to annual billing", async () => {
    const user = userEvent.setup();
    const onPeriodChange = vi.fn();
    render(<LandingSaas pricing={{ onPeriodChange }} />);

    const growth = screen.getByRole("article", { name: "Growth" });
    expect(within(growth).getByText("$29")).toBeInTheDocument();

    await user.click(screen.getByRole("switch", { name: "Bill annually" }));

    expect(onPeriodChange).toHaveBeenCalledWith("annual");
    expect(within(growth).getByText("$23")).toBeInTheDocument();
  });

  it("renders in Arabic under a provider", () => {
    render(
      <I18nProvider locale="ar">
        <LandingSaas />
      </I18nProvider>,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: ar["landingSaas.heroTitle"] as string }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: ar["landingSaas.pricingTitle"] as string }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: ar["landingSaas.skipToContent"] as string }),
    ).toBeInTheDocument();
    expect(screen.getByText(ar["landingSaas.featureSpeedTitle"] as string)).toBeInTheDocument();
    // Plural forms: three projects is the Arabic "few" category.
    expect(screen.getByText("3 مشاريع")).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: ar["landingSaas.getStarted"] as string }).length,
    ).toBeGreaterThan(0);
  });
});
