import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Register, registerPasswordScore } from "./register";

describe("Register", { timeout: 20_000 }, () => {
  it("renders every field with a bound label", () => {
    render(<Register />);

    expect(screen.getByRole("heading", { name: "Create your account" })).toBeVisible();
    expect(screen.getByLabelText("Full name")).toHaveAttribute("autocomplete", "name");
    expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
    expect(screen.getByLabelText("Confirm password")).toHaveAttribute("type", "password");
    expect(
      screen.getByRole("checkbox", {
        name: "I agree to the terms of service and the privacy policy.",
      }),
    ).not.toBeChecked();
    expect(screen.getByRole("progressbar", { name: "Password strength" })).toBeInTheDocument();
  });

  it("keeps the submit button disabled until the terms are accepted", async () => {
    const user = userEvent.setup({ delay: null });
    render(<Register />);

    const submit = screen.getByRole("button", { name: "Create account" });
    expect(submit).toBeDisabled();

    await user.click(screen.getByRole("checkbox"));
    expect(submit).toBeEnabled();
  });

  it("scores the password as it is typed", async () => {
    const user = userEvent.setup({ delay: null });
    render(<Register />);

    const password = screen.getByLabelText("Password");
    expect(password).toHaveAccessibleDescription(
      "Use at least 8 characters, with a number and a symbol.",
    );

    await user.type(password, "short");
    expect(password).toHaveAccessibleDescription("Password strength: Too short");

    await user.clear(password);
    await user.type(password, "Correct-Horse-9");
    expect(password).toHaveAccessibleDescription("Password strength: Strong");
  });

  it("toggles both password fields from one labelled button", async () => {
    const user = userEvent.setup({ delay: null });
    render(<Register />);

    await user.click(screen.getByRole("button", { name: "Show password" }));

    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "text");
    expect(screen.getByLabelText("Confirm password")).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: "Hide password" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("blocks a mismatched confirmation and announces it", async () => {
    const user = userEvent.setup({ delay: null });
    const onSubmit = vi.fn();
    render(<Register onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Password"), "Correct-Horse-9");
    await user.type(screen.getByLabelText("Confirm password"), "Correct-Horse-8");
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent("The two passwords do not match.");
    expect(screen.getByLabelText("Confirm password")).toHaveAttribute("aria-invalid", "true");
  });

  it("submits the entered account details", async () => {
    const user = userEvent.setup({ delay: null });
    const onSubmit = vi.fn();
    render(<Register onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Full name"), "Nour Hassan");
    await user.type(screen.getByLabelText("Email"), "nour@example.com");
    await user.type(screen.getByLabelText("Password"), "Correct-Horse-9");
    await user.type(screen.getByLabelText("Confirm password"), "Correct-Horse-9");
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: "Nour Hassan",
      email: "nour@example.com",
      password: "Correct-Horse-9",
      acceptedTerms: true,
    });
  });

  it("announces a sign-up error and points the fields at it", () => {
    render(<Register error="That email already has an account." />);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("That email already has an account.");
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-describedby", alert.id);
  });
});

describe("registerPasswordScore", () => {
  it("grades by length and character variety", () => {
    expect(registerPasswordScore("")).toBe(0);
    expect(registerPasswordScore("abcdefg")).toBe(0);
    expect(registerPasswordScore("abcdefgh")).toBe(1);
    expect(registerPasswordScore("abcdefgh1")).toBe(2);
    expect(registerPasswordScore("Correct-Horse-9")).toBe(4);
  });
});
