import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("renders a button with its label", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("calls onClick", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Go" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("applies variant and size classes", () => {
    render(
      <Button variant="outline" size="lg">
        Outline
      </Button>,
    );
    const el = screen.getByRole("button", { name: "Outline" });
    expect(el).toHaveAttribute("data-variant", "outline");
    expect(el.className).toContain("border-input");
    expect(el.className).toContain("h-(--control-h-lg)");
  });

  it("renders as the child element with asChild", () => {
    render(
      <Button asChild>
        <a href="/docs">Docs</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Docs" });
    expect(link).toHaveAttribute("href", "/docs");
    expect(link).toHaveAttribute("data-slot", "button");
  });

  it("is disabled and busy while loading", () => {
    render(<Button loading>Saving</Button>);
    const el = screen.getByRole("button", { name: "Saving" });
    expect(el).toBeDisabled();
    expect(el).toHaveAttribute("aria-busy", "true");
  });
});
