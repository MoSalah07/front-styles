import { render, screen, within } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { runAxe } from "../../test/setup";
import { RegisterWizard } from "./register-wizard";

function currentStep() {
  const steps = within(screen.getByRole("navigation", { name: "Sign-up progress" })).getAllByRole(
    "listitem",
  );
  return steps.filter((step) => step.getAttribute("aria-current") === "step");
}

async function fillAccount(user: UserEvent) {
  await user.type(screen.getByLabelText("Work email"), "nour@example.com");
  await user.type(screen.getByLabelText("Password"), "Correct-Horse-9");
  await user.click(screen.getByRole("button", { name: "Continue" }));
}

async function fillProfile(user: UserEvent) {
  await user.type(screen.getByLabelText("Full name"), "Nour Hassan");
  await user.type(screen.getByLabelText(/Company/), "Cedar Studio");
  await user.click(screen.getByRole("combobox", { name: "Role" }));
  await user.click(await screen.findByRole("option", { name: "Design" }));
  await user.click(screen.getByRole("radio", { name: "2 to 10 people" }));
  await user.click(screen.getByRole("button", { name: "Continue" }));
}

// Each flow types through two or three steps; the default five seconds is
// tight on a loaded machine, and a timed-out flow keeps clicking into the next test.
describe("RegisterWizard", { timeout: 20_000 }, () => {
  it("renders a three-step stepper with the first step current", () => {
    render(<RegisterWizard />);

    const nav = screen.getByRole("navigation", { name: "Sign-up progress" });
    expect(within(nav).getAllByRole("listitem")).toHaveLength(3);
    expect(within(nav).getByText("Step 1 of 3")).toBeInTheDocument();
    expect(currentStep()).toHaveLength(1);
    expect(currentStep()[0]).toHaveTextContent("Account");
    expect(screen.getByRole("heading", { level: 2, name: "Set up your sign-in" })).toBeVisible();
  });

  it("blocks Next while the step is invalid and shows why", async () => {
    const user = userEvent.setup({ delay: null });
    render(<RegisterWizard />);

    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(screen.getByRole("heading", { name: "Set up your sign-in" })).toBeVisible();
    const email = screen.getByLabelText("Work email");
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email).toHaveAccessibleDescription("Enter your email address.");
    expect(email).toHaveFocus();
    expect(screen.getByText("Use at least 8 characters.")).toBeInTheDocument();

    await user.type(email, "not-an-email");
    expect(email).toHaveAccessibleDescription("Enter an email address like name@example.com.");
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(screen.getByRole("heading", { name: "Set up your sign-in" })).toBeVisible();
  });

  it("blocks the profile step until name, role and team size are given", async () => {
    const user = userEvent.setup({ delay: null });
    render(<RegisterWizard />);

    await fillAccount(user);
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(screen.getByRole("heading", { name: "Tell us about you" })).toBeVisible();
    expect(screen.getByText("Enter your full name.")).toBeInTheDocument();
    expect(screen.getByText("Choose the role closest to yours.")).toBeInTheDocument();
    expect(screen.getByText("Choose the size of your team.")).toBeInTheDocument();
    expect(screen.getByRole("radiogroup", { name: "Team size" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("progresses through the steps, moving focus and aria-current along", async () => {
    const user = userEvent.setup({ delay: null });
    const onSendCode = vi.fn();
    const onStepChange = vi.fn();
    render(<RegisterWizard onSendCode={onSendCode} onStepChange={onStepChange} />);

    await fillAccount(user);
    expect(screen.getByRole("heading", { name: "Tell us about you" })).toHaveFocus();
    expect(currentStep()[0]).toHaveTextContent("Profile");
    expect(screen.getByText("Step 2 of 3")).toBeInTheDocument();
    // A finished step says so to assistive technology, not only with a tick.
    expect(screen.getByText("Account").closest("li")).toHaveTextContent("Account (completed)");

    await fillProfile(user);
    expect(screen.getByRole("heading", { name: "Verify your email" })).toHaveFocus();
    expect(currentStep()[0]).toHaveTextContent("Verify");
    expect(onSendCode).toHaveBeenCalledWith("nour@example.com");
    expect(onStepChange.mock.calls.map(([step]) => step)).toEqual(["profile", "verify"]);

    const masked = screen.getByText("no***r@example.com");
    expect(masked).toHaveAttribute("dir", "ltr");
  });

  it("keeps the values already entered when going back", async () => {
    const user = userEvent.setup({ delay: null });
    render(<RegisterWizard />);

    await fillAccount(user);
    await user.type(screen.getByLabelText("Full name"), "Nour Hassan");
    await user.click(screen.getByRole("button", { name: "Back" }));

    expect(screen.getByRole("heading", { name: "Set up your sign-in" })).toHaveFocus();
    expect(currentStep()[0]).toHaveTextContent("Account");
    expect(screen.getByLabelText("Work email")).toHaveValue("nour@example.com");
    expect(screen.getByLabelText("Password")).toHaveValue("Correct-Horse-9");

    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(screen.getByLabelText("Full name")).toHaveValue("Nour Hassan");
  });

  it("hands onComplete everything that was entered, then shows the done state", async () => {
    const user = userEvent.setup({ delay: null });
    const onComplete = vi.fn();
    render(<RegisterWizard onComplete={onComplete} />);

    await fillAccount(user);
    await fillProfile(user);
    await user.type(screen.getByRole("textbox", { name: "Verification code" }), "123456");

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith({
      email: "nour@example.com",
      password: "Correct-Horse-9",
      name: "Nour Hassan",
      company: "Cedar Studio",
      role: "design",
      teamSize: "2-10",
      code: "123456",
    });

    expect(screen.getByRole("heading", { name: "You are all set" })).toHaveFocus();
    expect(screen.getByText(/Welcome aboard, Nour Hassan\./)).toBeInTheDocument();
    expect(currentStep()).toHaveLength(0);
    expect(screen.getByText("All steps complete")).toBeInTheDocument();
  });

  it("stays on the code step when onComplete rejects", async () => {
    const user = userEvent.setup({ delay: null });
    const onComplete = vi.fn(() => Promise.reject(new Error("wrong code")));
    render(<RegisterWizard onComplete={onComplete} />);

    await fillAccount(user);
    await fillProfile(user);
    await user.type(screen.getByRole("textbox", { name: "Verification code" }), "000000");

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(await screen.findByRole("button", { name: "Verify and finish" })).toBeEnabled();
    expect(screen.queryByRole("heading", { name: "You are all set" })).not.toBeInTheDocument();
  });

  it("has no axe violations on any step, errors included", async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = render(<RegisterWizard />);

    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(await runAxe(container)).toHaveNoViolations();

    await fillAccount(user);
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(await runAxe(container)).toHaveNoViolations();

    await fillProfile(user);
    expect(await runAxe(container)).toHaveNoViolations();

    await user.type(screen.getByRole("textbox", { name: "Verification code" }), "123456");
    expect(await runAxe(container)).toHaveNoViolations();
  });

  it("toggles password visibility from its labelled button", async () => {
    const user = userEvent.setup({ delay: null });
    render(<RegisterWizard />);

    const password = screen.getByLabelText("Password");
    await user.click(screen.getByRole("button", { name: "Show password" }));
    expect(password).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: "Hide password" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
