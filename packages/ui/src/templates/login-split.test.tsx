import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LoginSplit } from "./login-split";

describe("LoginSplit", () => {
  it("renders the email and password fields with bound labels", () => {
    render(<LoginSplit />);

    expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
  });

  it("toggles password visibility and announces the new state", async () => {
    const user = userEvent.setup();
    render(<LoginSplit />);

    const password = screen.getByLabelText("Password");
    const toggle = screen.getByRole("button", { name: "Show password" });
    expect(toggle).toHaveAttribute("aria-pressed", "false");

    await user.click(toggle);

    expect(password).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: "Hide password" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await user.click(screen.getByRole("button", { name: "Hide password" }));

    expect(password).toHaveAttribute("type", "password");
  });

  it("calls onSubmit with the entered values", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<LoginSplit onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Email"), "nour@example.com");
    await user.type(screen.getByLabelText("Password"), "correct horse");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      email: "nour@example.com",
      password: "correct horse",
      remember: false,
    });
  });

  it("announces the error and points both fields at it", () => {
    render(<LoginSplit error="Those credentials did not match." />);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Those credentials did not match.");

    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-describedby", alert.id);
    expect(screen.getByLabelText("Password")).toHaveAttribute("aria-describedby", alert.id);
  });
});
