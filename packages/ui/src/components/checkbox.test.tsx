import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from "./checkbox";

describe("Checkbox", () => {
  it("renders with its accessible name", () => {
    render(<Checkbox aria-label="Accept terms" />);
    expect(screen.getByRole("checkbox", { name: "Accept terms" })).toBeInTheDocument();
  });

  it("toggles on click", async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox aria-label="Subscribe" onCheckedChange={onCheckedChange} />);
    const checkbox = screen.getByRole("checkbox", { name: "Subscribe" });

    expect(checkbox).not.toBeChecked();
    await userEvent.click(checkbox);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(checkbox).toBeChecked();
  });

  it("respects disabled", async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox aria-label="Locked" disabled onCheckedChange={onCheckedChange} />);
    const checkbox = screen.getByRole("checkbox", { name: "Locked" });

    expect(checkbox).toBeDisabled();
    await userEvent.click(checkbox, { pointerEventsCheck: 0 });

    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(checkbox).not.toBeChecked();
  });
});
