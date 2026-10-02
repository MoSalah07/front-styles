import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { I18nProvider } from "../lib/i18n";
import { ar } from "../lib/messages/ar";
import { ProductCard } from "./product-card";

function currency(locale: string, value: number, code = "USD") {
  return new Intl.NumberFormat(locale, { style: "currency", currency: code }).format(value);
}

describe("ProductCard", () => {
  it("renders the title as a link with named controls", () => {
    render(
      <ProductCard
        title="Linen throw"
        href="/products/linen-throw"
        price={96}
        rating={4.5}
        reviewCount={120}
        badge="New"
      />,
    );

    expect(screen.getByRole("link", { name: "Linen throw" })).toHaveAttribute(
      "href",
      "/products/linen-throw",
    );
    expect(screen.getByRole("heading", { level: 3, name: "Linen throw" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "4.5 out of 5, 120 reviews" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add to cart: Linen throw" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Save Linen throw to wishlist" }),
    ).toBeInTheDocument();
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("uses the singular for a single review and drops the count when there is none", () => {
    const { rerender } = render(<ProductCard title="Mug" price={20} rating={5} reviewCount={1} />);
    expect(screen.getByRole("img", { name: "5 out of 5, 1 review" })).toBeInTheDocument();

    rerender(<ProductCard title="Mug" price={20} rating={3} />);
    expect(screen.getByRole("img", { name: "3 out of 5" })).toBeInTheDocument();
  });

  it("formats the price and the compare-at price in English", () => {
    const { container } = render(
      <ProductCard title="Walnut desk lamp" price={149} compareAtPrice={179} />,
    );

    const current = container.querySelector('[data-slot="product-card-current-price"]');
    const compare = container.querySelector('[data-slot="product-card-compare-price"]');
    expect(current?.textContent).toBe("$149.00");
    expect(compare?.tagName).toBe("S");
    expect(compare?.textContent).toContain("$179.00");
    // A strikethrough is invisible to a screen reader, so the two prices are named.
    expect(screen.getByText("Original price")).toHaveClass("sr-only");
  });

  it("hides the compare-at price when it is not higher than the price", () => {
    const { container } = render(<ProductCard title="Mug" price={20} compareAtPrice={20} />);
    expect(container.querySelector('[data-slot="product-card-compare-price"]')).toBeNull();
  });

  it("formats prices in Arabic under a provider", () => {
    const { container } = render(
      <I18nProvider locale="ar">
        <ProductCard title="مصباح" price={149} compareAtPrice={179} currency="EUR" />
      </I18nProvider>,
    );

    const current = container.querySelector('[data-slot="product-card-current-price"]');
    const compare = container.querySelector('[data-slot="product-card-compare-price"]');
    expect(current?.textContent).toBe(currency("ar", 149, "EUR"));
    expect(current?.textContent).not.toBe(currency("en", 149, "EUR"));
    expect(compare?.textContent).toContain(currency("ar", 179, "EUR"));
    expect(
      screen.getByRole("button", { name: `${ar["productCard.addToCart"] as string}: مصباح` }),
    ).toBeInTheDocument();
  });

  it("flips aria-pressed on the wishlist toggle and reports the new state", async () => {
    const user = userEvent.setup();
    const onWishlistChange = vi.fn();
    render(<ProductCard title="Linen throw" price={96} onWishlistChange={onWishlistChange} />);

    const toggle = screen.getByRole("button", { name: "Save Linen throw to wishlist" });
    expect(toggle).toHaveAttribute("aria-pressed", "false");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(onWishlistChange).toHaveBeenLastCalledWith(true);

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    expect(onWishlistChange).toHaveBeenLastCalledWith(false);
  });

  it("fires the add-to-cart callback", async () => {
    const user = userEvent.setup();
    const onAddToCart = vi.fn();
    render(<ProductCard title="Linen throw" price={96} onAddToCart={onAddToCart} />);

    await user.click(screen.getByRole("button", { name: "Add to cart: Linen throw" }));
    expect(onAddToCart).toHaveBeenCalledTimes(1);
  });

  it("describes a custom add-to-cart label with the product name", () => {
    render(<ProductCard title="Linen throw" price={96} addToCartLabel="Buy now" />);
    expect(screen.getByRole("button", { name: "Buy now" })).toHaveAccessibleDescription(
      "Linen throw",
    );
  });

  it("falls back to a token surface when the image fails", () => {
    const { container } = render(
      <ProductCard
        title="Linen throw"
        price={96}
        image={{ src: "/missing.jpg", alt: "A folded linen throw" }}
      />,
    );

    const img = screen.getByRole("img", { name: "A folded linen throw" });
    expect(img.tagName).toBe("IMG");
    fireEvent.error(img);

    expect(container.querySelector('[data-slot="product-card-image"]')).toBeNull();
    expect(screen.getByRole("img", { name: "A folded linen throw" })).toHaveAttribute(
      "data-slot",
      "product-card-fallback",
    );
  });
});
