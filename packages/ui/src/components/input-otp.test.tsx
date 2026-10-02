import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { REGEXP_ONLY_DIGITS, REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { describe, expect, it, vi } from "vitest";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "./input-otp";

/**
 * Spelled out rather than taken as `Partial<InputOTPProps>`: the real props are
 * a union of a `render` form and a `children` form, and a partial of that union
 * no longer fits either branch.
 */
interface CodeProps {
  maxLength?: number;
  pattern?: string;
  inputMode?: "numeric" | "text";
  disabled?: boolean;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
}

function Code({ maxLength = 6, ...props }: CodeProps) {
  return (
    <InputOTP maxLength={maxLength} aria-label="One-time code" {...props}>
      <InputOTPGroup>
        {Array.from({ length: maxLength / 2 }, (_, index) => (
          <InputOTPSlot key={index} index={index} />
        ))}
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        {Array.from({ length: maxLength / 2 }, (_, index) => (
          <InputOTPSlot key={index} index={index + maxLength / 2} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}

function slots(container: HTMLElement) {
  return Array.from(container.querySelectorAll('[data-slot="input-otp-slot"]'));
}

describe("InputOTP", () => {
  it("renders one slot per character and a named text field", () => {
    const { container } = render(<Code />);

    expect(slots(container)).toHaveLength(6);
    expect(screen.getByRole("textbox", { name: "One-time code" })).toHaveAttribute(
      "maxlength",
      "6",
    );
    expect(screen.getByRole("separator")).toHaveAttribute("data-slot", "input-otp-separator");
  });

  it("spreads typed characters across the slots and reports completion", async () => {
    const user = userEvent.setup({ delay: null });
    const onChange = vi.fn();
    const onComplete = vi.fn();
    const { container } = render(<Code onChange={onChange} onComplete={onComplete} />);

    await user.type(screen.getByRole("textbox", { name: "One-time code" }), "4821");
    expect(slots(container).map((slot) => slot.textContent)).toEqual(["4", "8", "2", "1", "", ""]);
    expect(onComplete).not.toHaveBeenCalled();

    await user.type(screen.getByRole("textbox", { name: "One-time code" }), "07");
    expect(onChange).toHaveBeenLastCalledWith("482107");
    expect(onComplete).toHaveBeenCalledWith("482107");
  });

  it("drops characters the pattern does not allow", async () => {
    const user = userEvent.setup({ delay: null });
    const onChange = vi.fn();
    render(<Code maxLength={4} pattern={REGEXP_ONLY_DIGITS} onChange={onChange} />);

    const field = screen.getByRole("textbox", { name: "One-time code" });
    await user.type(field, "1a2");

    expect(field).toHaveValue("12");
  });

  it("accepts letters and digits with the alphanumeric pattern", async () => {
    const user = userEvent.setup({ delay: null });
    const onComplete = vi.fn();
    render(<Code maxLength={4} pattern={REGEXP_ONLY_DIGITS_AND_CHARS} onComplete={onComplete} />);

    await user.type(screen.getByRole("textbox", { name: "One-time code" }), "A7K2");

    expect(onComplete).toHaveBeenCalledWith("A7K2");
  });

  it("marks the active slot while the field has focus", async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = render(<Code />);

    await user.click(screen.getByRole("textbox", { name: "One-time code" }));

    expect(slots(container)[0]).toHaveAttribute("data-active", "true");
  });

  it("ignores input while disabled", async () => {
    const user = userEvent.setup({ delay: null });
    const onChange = vi.fn();
    render(<Code disabled onChange={onChange} />);

    const field = screen.getByRole("textbox", { name: "One-time code" });
    expect(field).toBeDisabled();
    await user.type(field, "123");

    expect(onChange).not.toHaveBeenCalled();
  });

  it("merges a className onto each part", () => {
    const { container } = render(
      <InputOTP maxLength={2} aria-label="Code" containerClassName="custom-container">
        <InputOTPGroup className="custom-group">
          <InputOTPSlot index={0} className="custom-slot" />
          <InputOTPSlot index={1} />
        </InputOTPGroup>
      </InputOTP>,
    );

    expect(container.querySelector(".custom-container")).toBeInTheDocument();
    expect(container.querySelector('[data-slot="input-otp-group"]')).toHaveClass("custom-group");
    expect(slots(container)[0]).toHaveClass("custom-slot");
  });
});
