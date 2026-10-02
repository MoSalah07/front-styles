import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { I18nProvider } from "../lib/i18n";
import { ar } from "../lib/messages/ar";
import { fr } from "../lib/messages/fr";
import { hi } from "../lib/messages/hi";
import { ForgotPassword } from "./forgot-password";
import { LoginPhone } from "./login-phone";
import { LoginSplit } from "./login-split";
import { NotFoundPage } from "./error-pages";
import { OtpVerify } from "./otp-verify";
import { Register } from "./register";
import { RegisterWizard } from "./register-wizard";

/**
 * The templates are where a half-wired catalogue shows up: they carry most of
 * the library's prose, and any string still hardcoded would render English in
 * the middle of an Arabic page. These check the rendered output rather than the
 * catalogue, so a missing `t()` call fails here even though the key exists.
 */
describe("templates under a provider", () => {
  it("renders the split sign-in in Arabic", () => {
    render(
      <I18nProvider locale="ar">
        <LoginSplit />
      </I18nProvider>,
    );

    expect(screen.getByRole("button", { name: ar["login.submit"] as string })).toBeInTheDocument();
    expect(screen.getByLabelText(ar["login.emailLabel"] as string)).toBeInTheDocument();
    expect(screen.getByText(ar["login.brandTitle"] as string)).toBeInTheDocument();
    // The brand panel points come from a helper, not a module constant.
    expect(screen.getByText(ar["login.pointShipTitle"] as string)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: ar["login.showPassword"] as string }),
    ).toBeInTheDocument();
  });

  it("renders the sign-in in French and Hindi from the same component", () => {
    const { unmount } = render(
      <I18nProvider locale="fr">
        <LoginSplit />
      </I18nProvider>,
    );
    expect(screen.getByRole("button", { name: fr["login.submit"] as string })).toBeInTheDocument();
    unmount();

    render(
      <I18nProvider locale="hi">
        <LoginSplit />
      </I18nProvider>,
    );
    expect(screen.getByRole("button", { name: hi["login.submit"] as string })).toBeInTheDocument();
  });

  it("renders account recovery in Arabic", () => {
    render(
      <I18nProvider locale="ar">
        <ForgotPassword />
      </I18nProvider>,
    );
    expect(
      screen.getByRole("heading", { name: ar["forgotPassword.title"] as string }),
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: ar["forgotPassword.submit"] as string }),
    ).toBeInTheDocument();
  });

  it("renders the one-time code page in Arabic", () => {
    render(
      <I18nProvider locale="ar">
        <OtpVerify destination="nour@example.com" />
      </I18nProvider>,
    );
    expect(screen.getByRole("heading", { name: ar["otp.title"] as string })).toBeVisible();
    expect(screen.getByRole("button", { name: ar["otp.submit"] as string })).toBeInTheDocument();
  });

  it("renders the register strength hint in Arabic", () => {
    render(
      <I18nProvider locale="ar">
        <Register />
      </I18nProvider>,
    );
    expect(screen.getByText(ar["register.strengthHint"] as string)).toBeInTheDocument();
  });

  it("renders the phone sign-in in Arabic, keeping the number left to right", () => {
    render(
      <I18nProvider locale="ar">
        <LoginPhone />
      </I18nProvider>,
    );
    expect(screen.getByRole("heading", { name: ar["loginPhone.title"] as string })).toBeVisible();
    expect(screen.getByLabelText(ar["loginPhone.phoneLabel"] as string)).toHaveAttribute(
      "dir",
      "ltr",
    );
    expect(
      screen.getByRole("combobox", { name: new RegExp(ar["loginPhone.countryLabel"] as string) }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: ar["loginPhone.requestCode"] as string }),
    ).toBeInTheDocument();
  });

  it("renders the register wizard in Arabic", () => {
    render(
      <I18nProvider locale="ar">
        <RegisterWizard />
      </I18nProvider>,
    );
    expect(
      screen.getByRole("navigation", { name: ar["registerWizard.progressLabel"] as string }),
    ).toBeInTheDocument();
    expect(screen.getByText("الخطوة 1 من 3")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: ar["registerWizard.accountTitle"] as string }),
    ).toBeVisible();
    expect(screen.getByLabelText(ar["registerWizard.emailLabel"] as string)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: ar["registerWizard.next"] as string }),
    ).toBeInTheDocument();
    // The strength meter shares Register's wording.
    expect(screen.getByText(ar["register.strengthHint"] as string)).toBeInTheDocument();
  });

  it("renders the 404 page in Arabic", () => {
    render(
      <I18nProvider locale="ar">
        <NotFoundPage />
      </I18nProvider>,
    );
    expect(screen.getByText(ar["errorPages.notFoundTitle"] as string)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: ar["errorPages.home"] as string })).toBeInTheDocument();
  });

  it("still lets an explicit prop win over the catalogue", () => {
    render(
      <I18nProvider locale="ar">
        <LoginSplit submitLabel="Entrar" />
      </I18nProvider>,
    );
    expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
  });
});
