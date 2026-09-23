import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { OtpVerify } from "./otp-verify";

describe("OtpVerify", () => {
  it("renders one slot per digit", () => {
    const { container } = render(<OtpVerify />);

    expect(container.querySelectorAll('[data-slot="input-otp-slot"]')).toHaveLength(6);
    expect(screen.getByRole("textbox", { name: "One-time code" })).toBeInTheDocument();
  });

  it("honours a custom length", () => {
    const { container } = render(<OtpVerify length={4} />);

    expect(container.querySelectorAll('[data-slot="input-otp-slot"]')).toHaveLength(4);
  });

  it("calls onComplete once every digit is entered", async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(<OtpVerify onComplete={onComplete} />);

    await user.type(screen.getByRole("textbox", { name: "One-time code" }), "123456");

    expect(onComplete).toHaveBeenCalledWith("123456");
  });
});
