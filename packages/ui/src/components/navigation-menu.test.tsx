import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { runAxe } from "../../test/setup";
import { I18nProvider } from "../lib/i18n";
import { ar } from "../lib/messages/ar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./navigation-menu";

function Example(props: React.ComponentProps<typeof NavigationMenu>) {
  return (
    <NavigationMenu {...props}>
      <NavigationMenuList>
        <NavigationMenuItem value="products">
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul>
              <li>
                <NavigationMenuLink href="/analytics">Analytics</NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="/billing">Billing</NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem value="resources">
          <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink href="/guides">Guides</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/pricing" active className={navigationMenuTriggerStyle()}>
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuIndicator />
      </NavigationMenuList>
    </NavigationMenu>
  );
}

describe("NavigationMenu", () => {
  it("renders a named navigation landmark with its triggers and links", () => {
    render(<Example />);

    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
    const products = screen.getByRole("button", { name: "Products" });
    expect(products).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("button", { name: "Resources" })).toBeInTheDocument();

    const pricing = screen.getByRole("link", { name: "Pricing" });
    expect(pricing).toHaveAttribute("href", "/pricing");
    expect(pricing).toHaveAttribute("aria-current", "page");
    expect(pricing).toHaveAttribute("data-slot", "navigation-menu-link");

    // Panel links are not rendered until their trigger opens.
    expect(screen.queryByRole("link", { name: "Analytics" })).not.toBeInTheDocument();
  });

  it("takes a caller's label over the default", () => {
    render(<Example aria-label="Site" />);
    expect(screen.getByRole("navigation", { name: "Site" })).toBeInTheDocument();
  });

  it("opens a trigger's content on click, inside the shared viewport", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const products = screen.getByRole("button", { name: "Products" });

    await user.click(products);

    expect(products).toHaveAttribute("aria-expanded", "true");
    expect(products).toHaveAttribute("data-state", "open");
    const analytics = await screen.findByRole("link", { name: "Analytics" });
    expect(screen.getByRole("link", { name: "Billing" })).toHaveAttribute("href", "/billing");

    const content = analytics.closest("[data-slot=navigation-menu-content]");
    expect(content).toHaveAttribute("aria-labelledby", products.id);
    expect(products).toHaveAttribute("aria-controls", content?.id);
    expect(content?.closest("[data-slot=navigation-menu-viewport]")).not.toBeNull();

    // A second click on the same trigger closes it again.
    await user.click(products);
    expect(products).toHaveAttribute("aria-expanded", "false");
  });

  it("opens from the keyboard and moves focus into the panel", async () => {
    const user = userEvent.setup();
    render(<Example />);

    await user.tab();
    const products = screen.getByRole("button", { name: "Products" });
    expect(products).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(products).toHaveAttribute("aria-expanded", "true");
    expect(await screen.findByRole("link", { name: "Analytics" })).toBeInTheDocument();

    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("link", { name: "Analytics" })).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(products).toHaveAttribute("aria-expanded", "false");
    expect(products).toHaveFocus();
  });

  it("moves between triggers with the arrow keys", async () => {
    const user = userEvent.setup();
    render(<Example />);

    await user.tab();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "Resources" })).toHaveFocus();
  });

  it("marks the panel entering from the end when moving to a later trigger", async () => {
    const user = userEvent.setup();
    render(<Example />);

    await user.click(screen.getByRole("button", { name: "Products" }));
    // Once a panel is open, pointing at another trigger switches to it (a
    // click there would toggle the hover-opened panel shut again).
    await user.hover(screen.getByRole("button", { name: "Resources" }));

    const guides = await screen.findByRole("link", { name: "Guides" });
    expect(guides.closest("[data-slot=navigation-menu-content]")).toHaveAttribute(
      "data-motion",
      "from-end",
    );
  });

  it("follows an RTL page: mirrored layout, arrow keys and panel motion", async () => {
    const user = userEvent.setup();
    render(
      <div dir="rtl">
        <Example />
      </div>,
    );

    // Radix alone would stamp dir="ltr" here and undo the page's direction.
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveAttribute("dir", "rtl");

    await user.tab();
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("button", { name: "Resources" })).toHaveFocus();

    // The later trigger sits to the left under RTL, so its panel comes in
    // from the left-hand (physical start) side.
    await user.click(screen.getByRole("button", { name: "Products" }));
    await user.hover(screen.getByRole("button", { name: "Resources" }));
    const guides = await screen.findByRole("link", { name: "Guides" });
    expect(guides.closest("[data-slot=navigation-menu-content]")).toHaveAttribute(
      "data-motion",
      "from-start",
    );
  });

  it("lets each panel float under its trigger without a viewport", async () => {
    const user = userEvent.setup();
    const { container } = render(<Example viewport={false} />);
    expect(container.querySelector("[data-slot=navigation-menu-viewport]")).toBeNull();

    await user.click(screen.getByRole("button", { name: "Products" }));

    const content = (await screen.findByRole("link", { name: "Analytics" })).closest(
      "[data-slot=navigation-menu-content]",
    );
    expect(content).toHaveAttribute("data-state", "open");
    expect(content?.className).toContain("bg-popover");
  });

  it("names the landmark in Arabic under an Arabic provider", () => {
    render(
      <I18nProvider locale="ar">
        <Example />
      </I18nProvider>,
    );
    expect(
      screen.getByRole("navigation", { name: ar["navigationMenu.label"] as string }),
    ).toBeInTheDocument();
  });

  it("has no axe violations, closed or open", async () => {
    const user = userEvent.setup();
    render(<Example />);
    expect(await runAxe()).toHaveNoViolations();

    await user.click(screen.getByRole("button", { name: "Products" }));
    await screen.findByRole("link", { name: "Analytics" });
    // While a panel is open Radix renders a focus proxy after the trigger: an
    // aria-hidden, tabbable span that forwards Tab into the panel. Like the
    // focus guards the shared setup already excludes, it is internal to the
    // primitive and never holds focus, so that one rule is off for this scan.
    expect(
      await runAxe(undefined, { rules: { "aria-hidden-focus": { enabled: false } } }),
    ).toHaveNoViolations();
  });
});
