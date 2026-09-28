"use client";

/** Password recovery page: an email field that, once sent, is replaced by a confirmation panel with a resend action. */
import * as React from "react";
import { ArrowLeft, MailCheck } from "lucide-react";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { cn } from "../lib/cn";
import { useT } from "../lib/i18n";

export interface ForgotPasswordProps extends Omit<
  React.ComponentProps<"div">,
  "onSubmit" | "title"
> {
  logo?: React.ReactNode;
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  emailLabel?: string;
  emailPlaceholder?: string;
  submitLabel?: string;
  /** Heading of the confirmation panel. */
  sentTitle?: React.ReactNode;
  /**
   * Body of the confirmation panel. Given a function it receives the address the
   * link went to, so the copy can name it.
   */
  sentDescription?: React.ReactNode | ((email: string) => React.ReactNode);
  resendLabel?: string;
  /** Text of the link back to sign-in. */
  backLabel?: string;
  backHref?: string;
  onBack?: () => void;
  /** Blocks the form and spins the submit button. */
  loading?: boolean;
  /** Request failure. Announced as an alert and wired to the field through `aria-describedby`. */
  error?: React.ReactNode;
  /** Controlled success state. Left undefined, the template flips itself on submit. */
  sent?: boolean;
  defaultEmail?: string;
  /** Receives the address to send the reset link to. */
  onSubmit?: (email: string) => void;
  /** Called by the resend button. Defaults to `onSubmit` with the same address. */
  onResend?: (email: string) => void;
}

function ForgotPassword({
  className,
  logo,
  eyebrow: eyebrowProp,
  title: titleProp,
  subtitle: subtitleProp,
  emailLabel: emailLabelProp,
  emailPlaceholder: emailPlaceholderProp,
  submitLabel: submitLabelProp,
  sentTitle: sentTitleProp,
  sentDescription,
  resendLabel: resendLabelProp,
  backLabel: backLabelProp,
  backHref,
  onBack,
  loading = false,
  error,
  sent,
  defaultEmail = "",
  onSubmit,
  onResend,
  ...props
}: ForgotPasswordProps) {
  const t = useT();
  const eyebrow = eyebrowProp ?? t("forgotPassword.eyebrow");
  const title = titleProp ?? t("forgotPassword.title");
  const subtitle = subtitleProp ?? t("forgotPassword.subtitle");
  const emailLabel = emailLabelProp ?? t("forgotPassword.emailLabel");
  const emailPlaceholder = emailPlaceholderProp ?? t("forgotPassword.emailPlaceholder");
  const submitLabel = submitLabelProp ?? t("forgotPassword.submit");
  const sentTitle = sentTitleProp ?? t("forgotPassword.sentTitle");
  const resendLabel = resendLabelProp ?? t("forgotPassword.resend");
  const backLabel = backLabelProp ?? t("forgotPassword.back");
  const id = React.useId();
  const emailId = `${id}-email`;
  const errorId = `${id}-error`;

  const [email, setEmail] = React.useState(defaultEmail);
  const [selfSent, setSelfSent] = React.useState(false);

  const isSent = sent ?? selfSent;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    onSubmit?.(email);
    if (sent === undefined) setSelfSent(true);
  };

  const description =
    typeof sentDescription === "function" ? sentDescription(email) : sentDescription;

  const backClasses = cn(
    "inline-flex items-center gap-2 rounded-xs text-sm font-medium text-muted-foreground",
    "underline-offset-4 hover:text-foreground hover:underline",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring",
  );

  return (
    <div
      data-slot="forgot-password"
      className={cn(
        "relative isolate flex min-h-svh w-full items-center justify-center overflow-hidden",
        "bg-background px-(--gutter) py-12",
        className,
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 start-[-8rem] z-(--z-below) size-[28rem] rounded-full bg-primary/15 blur-3xl"
      />

      <div className="flex w-full max-w-[400px] flex-col gap-8">
        {logo ? <div className="flex items-center gap-3">{logo}</div> : null}

        {isSent ? (
          <div
            data-slot="forgot-password-sent"
            role="status"
            aria-live="polite"
            className="flex flex-col gap-6"
          >
            <span
              aria-hidden="true"
              className={cn(
                "flex size-12 items-center justify-center rounded-md",
                "border border-success/30 bg-success/10 text-success",
                "[&_svg]:size-5",
              )}
            >
              <MailCheck />
            </span>

            <div className="flex flex-col gap-2">
              <h1
                data-slot="forgot-password-sent-title"
                className="font-display text-h2 text-balance uppercase"
              >
                {sentTitle}
              </h1>
              <p className="text-sm text-pretty text-muted-foreground">
                {description ?? (
                  <>
                    A reset link is on its way
                    {email ? (
                      <>
                        {" to "}
                        <span className="font-medium text-foreground">{email}</span>
                      </>
                    ) : null}
                    . It expires in 30 minutes.
                  </>
                )}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                data-slot="forgot-password-resend"
                type="button"
                variant="outline"
                size="lg"
                loading={loading}
                className="w-full"
                onClick={() => (onResend ?? onSubmit)?.(email)}
              >
                {resendLabel}
              </Button>

              {backHref ? (
                <a href={backHref} className={cn(backClasses, "justify-center")}>
                  <ArrowLeft aria-hidden="true" className="size-4 rtl:-scale-x-100" />
                  {backLabel}
                </a>
              ) : (
                <button
                  type="button"
                  onClick={onBack}
                  className={cn(backClasses, "justify-center")}
                >
                  <ArrowLeft aria-hidden="true" className="size-4 rtl:-scale-x-100" />
                  {backLabel}
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <header className="flex flex-col gap-2">
              {eyebrow ? (
                <p
                  data-slot="forgot-password-eyebrow"
                  className="text-eyebrow font-semibold text-primary uppercase"
                >
                  {eyebrow}
                </p>
              ) : null}
              <h1
                data-slot="forgot-password-title"
                className="font-display text-h2 text-balance uppercase"
              >
                {title}
              </h1>
              {subtitle ? (
                <p className="text-sm text-pretty text-muted-foreground">{subtitle}</p>
              ) : null}
            </header>

            <form data-slot="forgot-password-form" noValidate onSubmit={handleSubmit}>
              <div className="flex flex-col gap-5">
                {error ? (
                  <p
                    id={errorId}
                    role="alert"
                    data-slot="forgot-password-error"
                    className={cn(
                      "rounded-input border border-destructive/40 bg-destructive/10 px-3 py-2",
                      "text-sm font-medium text-destructive",
                    )}
                  >
                    {error}
                  </p>
                ) : null}

                <div className="grid gap-2">
                  <Label htmlFor={emailId}>{emailLabel}</Label>
                  <Input
                    id={emailId}
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    required
                    placeholder={emailPlaceholder}
                    value={email}
                    disabled={loading}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? errorId : undefined}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>

                <Button type="submit" size="lg" loading={loading} className="w-full">
                  {submitLabel}
                </Button>
              </div>
            </form>

            {backHref ? (
              <a href={backHref} className={backClasses}>
                <ArrowLeft aria-hidden="true" className="size-4 rtl:-scale-x-100" />
                {backLabel}
              </a>
            ) : (
              <button type="button" onClick={onBack} className={cn(backClasses, "self-start")}>
                <ArrowLeft aria-hidden="true" className="size-4 rtl:-scale-x-100" />
                {backLabel}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export { ForgotPassword };
