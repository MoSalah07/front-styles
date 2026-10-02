import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { runAxe } from "../../test/setup";
import { I18nProvider } from "../lib/i18n";
import { ar } from "../lib/messages/ar";
import { en } from "../lib/messages/en";
import { LandingStreaming } from "./landing-streaming";

describe("LandingStreaming", () => {
  it("renders the landmarks and a heading for every section", () => {
    render(<LandingStreaming />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { level: 1, name: en["landingStreaming.heroTitle"] }),
    ).toBeInTheDocument();
    for (const key of [
      "landingStreaming.rowTrending",
      "landingStreaming.rowTop",
      "landingStreaming.featureTvTitle",
      "landingStreaming.featureDownloadTitle",
      "landingStreaming.featureEverywhereTitle",
      "landingStreaming.featureKidsTitle",
      "landingStreaming.faqTitle",
      "landingStreaming.ctaTitle",
    ] as const) {
      expect(screen.getByRole("heading", { level: 2, name: en[key] })).toBeInTheDocument();
    }

    expect(screen.getByRole("button", { name: en["landingStreaming.signIn"] })).toBeInTheDocument();
  });

  it("labels each carousel row by its heading, and names every tile", () => {
    render(<LandingStreaming />);

    const trending = screen.getByRole("region", { name: en["landingStreaming.rowTrending"] });
    expect(trending).toHaveAttribute("aria-roledescription", "carousel");
    expect(within(trending).getAllByRole("group", { name: /of 8$/ })).toHaveLength(8);
    expect(
      within(trending).getByRole("button", { name: en["landingStreaming.title3"] }),
    ).toBeInTheDocument();
    expect(
      within(trending).getByRole("button", { name: en["landingStreaming.nextTitles"] }),
    ).toBeInTheDocument();

    const top = screen.getByRole("region", { name: en["landingStreaming.rowTop"] });
    expect(within(top).getAllByRole("group", { name: /of 10$/ })).toHaveLength(10);
    expect(
      within(top).getByRole("button", { name: `Number 1: ${en["landingStreaming.title2"]}` }),
    ).toBeInTheDocument();
  });

  it("uses custom rows, links tiles with an href and reports selections", async () => {
    const user = userEvent.setup();
    const onSelectTitle = vi.fn();
    const rows = [
      {
        title: "Late night picks",
        items: [{ title: "Harbour Lights", href: "/title/harbour-lights" }, { title: "Fogline" }],
      },
    ];
    render(<LandingStreaming rows={rows} onSelectTitle={onSelectTitle} />);

    const row = screen.getByRole("region", { name: "Late night picks" });
    expect(within(row).getByRole("link", { name: "Harbour Lights" })).toHaveAttribute(
      "href",
      "/title/harbour-lights",
    );

    await user.click(within(row).getByRole("button", { name: "Fogline" }));
    expect(onSelectTitle).toHaveBeenCalledWith(rows[0]!.items[1], rows[0]);
  });

  it("submits the email from the hero form", async () => {
    const user = userEvent.setup();
    const onEmailSubmit = vi.fn();
    render(<LandingStreaming onEmailSubmit={onEmailSubmit} />);

    const [heroField] = screen.getAllByLabelText(en["landingStreaming.emailLabel"]);
    const [heroSubmit] = screen.getAllByRole("button", {
      name: en["landingStreaming.getStarted"],
    });

    await user.type(heroField!, "  nour@example.com ");
    await user.click(heroSubmit!);

    expect(onEmailSubmit).toHaveBeenCalledTimes(1);
    expect(onEmailSubmit).toHaveBeenCalledWith("nour@example.com");
  });

  it("blocks an invalid email and explains why", async () => {
    const user = userEvent.setup();
    const onEmailSubmit = vi.fn();
    render(<LandingStreaming onEmailSubmit={onEmailSubmit} />);

    const fields = screen.getAllByLabelText(en["landingStreaming.emailLabel"]);
    const submits = screen.getAllByRole("button", { name: en["landingStreaming.getStarted"] });
    const field = fields[1]!;

    await user.click(submits[1]!);
    let alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent(en["landingStreaming.emailRequired"]);
    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(field.getAttribute("aria-describedby")).toContain(alert.id);
    expect(field).toHaveFocus();

    await user.type(field, "not-an-email");
    alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent(en["landingStreaming.emailInvalid"]);

    await user.type(field, "@example.com");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    await user.click(submits[1]!);

    expect(onEmailSubmit).toHaveBeenCalledWith("not-an-email@example.com");
  });

  it("renders the FAQ from the catalogue", async () => {
    const user = userEvent.setup();
    render(<LandingStreaming />);

    const faq = screen.getByRole("region", { name: en["landingStreaming.faqTitle"] });
    await user.click(
      within(faq).getByRole("button", { name: en["landingStreaming.faq4Question"] }),
    );
    expect(within(faq).getByText(en["landingStreaming.faq4Answer"])).toBeVisible();
  });

  it("links sign-in when given an href, and pins the dark palette by default", () => {
    const { container, rerender } = render(<LandingStreaming signInHref="/login" />);

    expect(screen.getByRole("link", { name: en["landingStreaming.signIn"] })).toHaveAttribute(
      "href",
      "/login",
    );
    expect(container.firstElementChild).toHaveAttribute("data-theme", "dark");

    rerender(<LandingStreaming dark={false} />);
    expect(container.firstElementChild).not.toHaveAttribute("data-theme");
  });

  it("has no axe violations", async () => {
    render(<LandingStreaming />);
    expect(await runAxe()).toHaveNoViolations();
  });

  it("renders in Arabic", () => {
    render(
      <I18nProvider locale="ar">
        <LandingStreaming />
      </I18nProvider>,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: ar["landingStreaming.heroTitle"] as string }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: ar["landingStreaming.getStarted"] as string }),
    ).toHaveLength(2);
    expect(screen.getAllByLabelText(ar["landingStreaming.emailLabel"] as string)).toHaveLength(2);

    const trending = screen.getByRole("region", {
      name: ar["landingStreaming.rowTrending"] as string,
    });
    expect(trending).toHaveAttribute(
      "aria-roledescription",
      ar["carousel.roleDescription"] as string,
    );
    expect(within(trending).getByRole("group", { name: "1 من 8" })).toBeInTheDocument();
    expect(
      within(trending).getByRole("button", { name: ar["landingStreaming.title3"] as string }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("region", { name: ar["landingStreaming.faqTitle"] as string }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: ar["landingStreaming.featureKidsTitle"] as string }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: ar["landingStreaming.linkPrivacy"] as string }),
    ).toBeInTheDocument();
  });
});
