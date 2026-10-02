import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ForgotPassword } from "./forgot-password";

describe("ForgotPassword", { timeout: 20_000 }, () => {
  it("renders the heading and a labelled email field", () => {
    render(<ForgotPassword />);

    expect(screen.getByRole("heading", { name: "Forgot your password?" })).toBeVisible();
    expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
    expect(screen.getByRole("button", { name: "Send reset link" })).toBeInTheDocument();
  });

  it("sends the address and swaps to the confirmation panel", async () => {
    const user = userEvent.setup({ delay: null });
    const onSubmit = vi.fn();
    render(<ForgotPassword onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Email"), "nour@example.com");
    await user.click(screen.getByRole("button", { name: "Send reset link" }));

    expect(onSubmit).toHaveBeenCalledWith("nour@example.com");
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Check your inbox" })).toBeVisible();
    expect(screen.getByText("nour@example.com")).toBeInTheDocument();
    expect(screen.queryByLabelText("Email")).not.toBeInTheDocument();
  });

  it("resends to the same address", async () => {
    const user = userEvent.setup({ delay: null });
    const onResend = vi.fn();
    render(<ForgotPassword defaultEmail="nour@example.com" onResend={onResend} />);

    await user.click(screen.getByRole("button", { name: "Send reset link" }));
    await user.click(screen.getByRole("button", { name: "Resend the link" }));

    expect(onResend).toHaveBeenCalledWith("nour@example.com");
  });

  it("follows a controlled sent state instead of flipping itself", async () => {
    const user = userEvent.setup({ delay: null });
    const onSubmit = vi.fn();
    const { rerender } = render(<ForgotPassword sent={false} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Email"), "nour@example.com");
    await user.click(screen.getByRole("button", { name: "Send reset link" }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();

    rerender(
      <ForgotPassword sent onSubmit={onSubmit} sentDescription={(email) => `Sent to ${email}.`} />,
    );
    expect(screen.getByText("Sent to nour@example.com.")).toBeInTheDocument();
  });

  it("renders the way back as a button or a link", async () => {
    const user = userEvent.setup({ delay: null });
    const onBack = vi.fn();
    const { rerender } = render(<ForgotPassword onBack={onBack} />);

    await user.click(screen.getByRole("button", { name: "Back to sign in" }));
    expect(onBack).toHaveBeenCalledTimes(1);

    rerender(<ForgotPassword backHref="/login" />);
    expect(screen.getByRole("link", { name: "Back to sign in" })).toHaveAttribute("href", "/login");
  });

  it("announces a request error and points the field at it", () => {
    render(<ForgotPassword error="No account uses that address." />);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("No account uses that address.");
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-describedby", alert.id);
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
  });
});
