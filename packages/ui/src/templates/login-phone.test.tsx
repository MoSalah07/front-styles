import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { I18nProvider } from "../lib/i18n";
import { ar } from "../lib/messages/ar";
import { runAxe } from "../../test/setup";
import { LoginPhone, loginPhoneToE164 } from "./login-phone";

async function requestCode(number = "010 1234 5678") {
  const user = userEvent.setup({ delay: null });
  await user.type(screen.getByLabelText("Mobile number"), number);
  await user.click(screen.getByRole("button", { name: "Send code" }));
  return user;
}

describe("LoginPhone", { timeout: 20_000 }, () => {
  it("renders the number field as an LTR telephone input with a labelled country picker", () => {
    render(<LoginPhone />);

    const field = screen.getByLabelText("Mobile number");
    expect(field).toHaveAttribute("type", "tel");
    expect(field).toHaveAttribute("inputmode", "tel");
    expect(field).toHaveAttribute("autocomplete", "tel-national");
    expect(field).toHaveAttribute("dir", "ltr");
    expect(screen.getByRole("combobox", { name: /Country code/ })).toHaveTextContent("+20");
    expect(screen.getByRole("heading", { name: "Sign in with your phone" })).toBeVisible();
  });

  it("passes the full international number when a code is requested", async () => {
    const onRequestCode = vi.fn();
    render(<LoginPhone onRequestCode={onRequestCode} />);

    await requestCode("010 1234 5678");

    // The trunk zero is dropped and the formatting stripped.
    expect(onRequestCode).toHaveBeenCalledWith("+201012345678");
  });

  it("uses the dial code of the country picked from the list", async () => {
    const user = userEvent.setup({ delay: null });
    const onRequestCode = vi.fn();
    render(<LoginPhone onRequestCode={onRequestCode} />);

    await user.click(screen.getByRole("combobox", { name: /Country code/ }));
    await user.click(await screen.findByRole("option", { name: /United Arab Emirates/ }));
    expect(screen.getByRole("combobox", { name: /Country code/ })).toHaveTextContent("+971");

    await user.type(screen.getByLabelText("Mobile number"), "50 123 4567");
    await user.click(screen.getByRole("button", { name: "Send code" }));

    expect(onRequestCode).toHaveBeenCalledWith("+971501234567");
  });

  it("blocks an empty or malformed number and explains why", async () => {
    const user = userEvent.setup({ delay: null });
    const onRequestCode = vi.fn();
    render(<LoginPhone onRequestCode={onRequestCode} />);

    await user.click(screen.getByRole("button", { name: "Send code" }));
    const field = screen.getByLabelText("Mobile number");
    expect(screen.getByText("Enter your mobile number.")).toBeInTheDocument();
    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(field).toHaveFocus();

    await user.type(field, "12ab");
    expect(screen.getByText("Enter a valid mobile number, using digits only.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Send code" }));

    expect(onRequestCode).not.toHaveBeenCalled();
  });

  it("shows the number masked, left to right, on the code step", async () => {
    render(<LoginPhone />);

    await requestCode("1012345678");

    expect(screen.getByRole("heading", { name: "Enter the code" })).toBeVisible();
    const masked = screen.getByText("+20 ******5678");
    expect(masked).toHaveAttribute("dir", "ltr");
    // The code field is described by the line naming where the code went.
    const code = screen.getByRole("textbox", { name: "One-time code" });
    expect(code).toHaveAccessibleDescription(/\+20 \*{6}5678/);
    expect(code).toHaveFocus();
  });

  it("calls onVerify once the code is complete", async () => {
    const onVerify = vi.fn();
    render(<LoginPhone onVerify={onVerify} />);

    const user = await requestCode();
    await user.type(screen.getByRole("textbox", { name: "One-time code" }), "123456");

    expect(onVerify).toHaveBeenCalledWith("123456");
  });

  it("goes back to the number step, keeping the number, from the change-number control", async () => {
    const onStepChange = vi.fn();
    render(<LoginPhone onStepChange={onStepChange} />);

    const user = await requestCode("1012345678");
    await user.click(screen.getByRole("button", { name: "Change number" }));

    expect(onStepChange).toHaveBeenLastCalledWith("phone");
    const field = screen.getByLabelText("Mobile number");
    expect(field).toHaveValue("1012345678");
    expect(field).toHaveFocus();
  });

  it("waits for the parent when the step is controlled", async () => {
    const onStepChange = vi.fn();
    const { rerender } = render(<LoginPhone step="phone" onStepChange={onStepChange} />);

    await requestCode();

    expect(onStepChange).toHaveBeenCalledWith("code");
    expect(screen.getByLabelText("Mobile number")).toBeInTheDocument();

    rerender(<LoginPhone step="code" onStepChange={onStepChange} />);
    expect(screen.getByRole("textbox", { name: "One-time code" })).toBeInTheDocument();
  });

  it("announces each step's error from its own prop", () => {
    const { rerender } = render(<LoginPhone phoneError="That number cannot receive texts." />);
    expect(screen.getByRole("alert")).toHaveTextContent("That number cannot receive texts.");
    expect(screen.getByLabelText("Mobile number")).toHaveAccessibleDescription(
      "That number cannot receive texts.",
    );

    rerender(<LoginPhone step="code" codeError="That code has expired." />);
    expect(screen.getByRole("alert")).toHaveTextContent("That code has expired.");
  });

  it("holds the resend control until the countdown ends, then resends to the same number", async () => {
    const onResend = vi.fn();
    render(<LoginPhone resendSeconds={1} onResend={onResend} />);

    const user = await requestCode("1012345678");
    const resend = screen.getByRole("button", { name: "Send a new code" });
    expect(resend).toBeDisabled();
    expect(screen.getByText("You can ask for a new code in 1 second.")).toBeInTheDocument();

    await waitFor(() => expect(resend).toBeEnabled(), { timeout: 2500 });
    await user.click(resend);

    expect(onResend).toHaveBeenCalledWith("+201012345678");
  });

  it("has no axe violations on either step", async () => {
    const { container } = render(
      <LoginPhone alternateActions={<a href="/login">Sign in with email instead</a>} />,
    );
    expect(await runAxe(container)).toHaveNoViolations();

    await requestCode();
    expect(await runAxe(container)).toHaveNoViolations();
  });

  it("renders the alternate actions slot", () => {
    render(<LoginPhone alternateActions={<a href="/login">Sign in with email instead</a>} />);

    expect(screen.getByRole("link", { name: "Sign in with email instead" })).toBeInTheDocument();
  });

  it("renders in Arabic with the number still left to right", async () => {
    render(
      <I18nProvider locale="ar">
        <LoginPhone />
      </I18nProvider>,
    );

    expect(screen.getByRole("heading", { name: ar["loginPhone.title"] as string })).toBeVisible();
    const field = screen.getByLabelText(ar["loginPhone.phoneLabel"] as string);
    expect(field).toHaveAttribute("dir", "ltr");

    const user = userEvent.setup({ delay: null });
    await user.type(field, "1012345678");
    await user.click(screen.getByRole("button", { name: ar["loginPhone.requestCode"] as string }));

    expect(
      screen.getByRole("heading", { name: ar["loginPhone.codeTitle"] as string }),
    ).toBeVisible();
    expect(screen.getByText("+20 ******5678")).toHaveAttribute("dir", "ltr");
    // 30 falls in Arabic's "many" category (11–99): the singular accusative.
    expect(screen.getByText("يمكنك طلب رمز جديد بعد 30 ثانيةً.")).toBeInTheDocument();
  });
});

describe("loginPhoneToE164", () => {
  it("joins a dial code and a national number", () => {
    expect(loginPhoneToE164("+44", "07700 900123")).toBe("+447700900123");
    expect(loginPhoneToE164("1", "(415) 555-0100")).toBe("+14155550100");
  });

  it("rejects letters, short numbers and anything past fifteen digits", () => {
    expect(loginPhoneToE164("+20", "10abc")).toBeNull();
    expect(loginPhoneToE164("+20", "123")).toBeNull();
    expect(loginPhoneToE164("+966", "1234567890123")).toBeNull();
  });
});
