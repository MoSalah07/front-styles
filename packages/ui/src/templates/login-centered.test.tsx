import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LoginCentered } from "./login-centered";

describe("LoginCentered", { timeout: 20_000 }, () => {
  it("renders the heading and both fields with bound labels", () => {
    render(<LoginCentered />);

    expect(screen.getByRole("heading", { name: "Sign in" })).toBeVisible();
    expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
    expect(screen.getByRole("switch", { name: "Remember me" })).not.toBeChecked();
  });

  it("toggles password visibility and announces the new state", async () => {
    const user = userEvent.setup({ delay: null });
    render(<LoginCentered />);

    const toggle = screen.getByRole("button", { name: "Show password" });
    expect(toggle).toHaveAttribute("aria-pressed", "false");

    await user.click(toggle);

    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: "Hide password" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("calls onSubmit with the entered credentials and the remember choice", async () => {
    const user = userEvent.setup({ delay: null });
    const onSubmit = vi.fn();
    render(<LoginCentered onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Email"), "nour@example.com");
    await user.type(screen.getByLabelText("Password"), "correct horse");
    await user.click(screen.getByRole("switch", { name: "Remember me" }));
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      email: "nour@example.com",
      password: "correct horse",
      remember: true,
    });
  });

  it("renders forgot-password as a button or a link", async () => {
    const user = userEvent.setup({ delay: null });
    const onForgotPassword = vi.fn();
    const { rerender } = render(<LoginCentered onForgotPassword={onForgotPassword} />);

    await user.click(screen.getByRole("button", { name: "Forgot password?" }));
    expect(onForgotPassword).toHaveBeenCalledTimes(1);

    rerender(<LoginCentered forgotHref="/forgot" />);
    expect(screen.getByRole("link", { name: "Forgot password?" })).toHaveAttribute(
      "href",
      "/forgot",
    );
  });

  it("does not submit while loading", async () => {
    const user = userEvent.setup({ delay: null });
    const onSubmit = vi.fn();
    render(<LoginCentered loading onSubmit={onSubmit} />);

    const submit = screen.getByRole("button", { name: "Sign in" });
    expect(submit).toBeDisabled();
    expect(submit).toHaveAttribute("aria-busy", "true");
    await user.click(submit);

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("announces the error and points both fields at it", () => {
    render(<LoginCentered error="Those credentials did not match." />);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Those credentials did not match.");
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-describedby", alert.id);
    expect(screen.getByLabelText("Password")).toHaveAttribute("aria-describedby", alert.id);
  });
});
