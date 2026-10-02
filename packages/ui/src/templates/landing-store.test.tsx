import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { I18nProvider } from "../lib/i18n";
import { ar } from "../lib/messages/ar";
import { LandingStore, type LandingStoreProduct } from "./landing-store";

const PRODUCTS: LandingStoreProduct[] = [
  { id: "mug", title: "Speckled mug", price: 18 },
  { id: "lamp", title: "Brass lamp", price: 80, compareAtPrice: 100 },
];

// A whole page per test: role queries over a tree this size are slow in jsdom.
describe("LandingStore", { timeout: 20_000 }, () => {
  it("renders the page landmarks, the hero heading and the demo sections", () => {
    const { container } = render(<LandingStore />);

    const main = screen.getByRole("main");
    expect(screen.getByRole("search", { name: "Search products" })).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).not.toBe(main);
    expect(
      screen.getByRole("heading", { level: 1, name: "Slow mornings, well made." }),
    ).toBeInTheDocument();

    const sectionHeadings = screen
      .getAllByRole("heading", { level: 2 })
      .map((heading) => heading.textContent);
    expect(sectionHeadings).toEqual(
      expect.arrayContaining([
        "Shop by category",
        "Featured products",
        "Deals of the week",
        "Why shop with us",
        "Letters from the workshop",
      ]),
    );
    for (const id of ["hero", "categories", "featured", "deals", "why-us", "newsletter"]) {
      expect(container.querySelector(`#${id}`), id).not.toBeNull();
    }
    // No image URLs anywhere: every product and tile falls back to a token surface.
    expect(container.querySelector("img")).toBeNull();
  });

  it("names the cart button with the item count", () => {
    const { rerender } = render(<LandingStore cartCount={3} />);
    expect(screen.getByRole("button", { name: "Cart, 3 items" })).toBeInTheDocument();

    rerender(<LandingStore cartCount={1} />);
    expect(screen.getByRole("button", { name: "Cart, 1 item" })).toBeInTheDocument();
  });

  it("calls back when a product card adds to the cart, and counts it", async () => {
    const user = userEvent.setup();
    const onAddToCart = vi.fn();
    render(
      <LandingStore
        defaultCartCount={2}
        featured={{ products: PRODUCTS }}
        deals={false}
        onAddToCart={onAddToCart}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Add to cart: Brass lamp" }));

    expect(onAddToCart).toHaveBeenCalledTimes(1);
    expect(onAddToCart).toHaveBeenCalledWith(expect.objectContaining({ id: "lamp" }));
    expect(screen.getByRole("button", { name: "Cart, 3 items" })).toBeInTheDocument();
    expect(screen.getByText("Brass lamp added to your cart")).toBeInTheDocument();
  });

  it("works out a sale badge from the two prices", () => {
    render(<LandingStore featured={{ products: PRODUCTS }} deals={null} />);
    const featured = screen.getByRole("region", { name: "Featured products" });

    expect(within(featured).getByText("-20%")).toBeInTheDocument();
  });

  it("submits the newsletter form with the entered address", async () => {
    const user = userEvent.setup();
    const onSubscribe = vi.fn();
    render(<LandingStore newsletter={{ onSubscribe }} />);

    const field = screen.getByLabelText("Email address");
    const submit = screen.getByRole("button", { name: "Subscribe" });

    await user.type(field, "not-an-address");
    await user.click(submit);
    expect(onSubscribe).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid email address.");
    expect(field).toHaveAttribute("aria-invalid", "true");

    await user.clear(field);
    await user.type(field, "  sam@example.com ");
    await user.click(submit);
    expect(onSubscribe).toHaveBeenCalledWith("sam@example.com");
    expect(
      screen.getByText("You are on the list. Check your inbox to confirm."),
    ).toBeInTheDocument();
    expect(field).toHaveValue("");
  });

  it("hides a section passed as null or false", () => {
    const { container } = render(<LandingStore deals={null} newsletter={false} header={false} />);

    expect(container.querySelector("#deals")).toBeNull();
    expect(container.querySelector("#newsletter")).toBeNull();
    expect(screen.queryByRole("search")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Featured products" }),
    ).toBeInTheDocument();
  });

  it("renders in Arabic under a provider", () => {
    render(
      <I18nProvider locale="ar">
        <LandingStore cartCount={3} />
      </I18nProvider>,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: ar["landingStore.heroTitle"] as string }),
    ).toBeInTheDocument();
    // Three is the Arabic "few" category.
    expect(screen.getByRole("button", { name: "السلة، 3 منتجات" })).toBeInTheDocument();
    expect(
      screen.getByRole("search", { name: ar["landingStore.searchLabel"] as string }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: `${ar["productCard.addToCart"] as string}: ${ar["landingStore.productMug"] as string}`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: ar["landingStore.newsletterSubmit"] as string }),
    ).toBeInTheDocument();
  });
});
