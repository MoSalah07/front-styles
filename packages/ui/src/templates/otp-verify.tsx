"use client";

/** One-time-code verification page: split OTP slots, a masked destination line, an auto-submit on completion and a resend link gated by a countdown. */
import * as React from "react";
import { ArrowLeft, KeyRound } from "lucide-react";
import { Button } from "../components/button";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "../components/input-otp";
import { cn } from "../lib/cn";
import { useT } from "../lib/i18n";

/**
 * Hides most of an email local part or a phone number, keeping just enough for
 * the user to recognise which of their addresses the code went to.
 */
function maskDestination(value: string): string {
  const at = value.indexOf("@");

  if (at > 0) {
    const local = value.slice(0, at);
    const domain = value.slice(at);
    if (local.length <= 2) return `${local.slice(0, 1)}***${domain}`;
    return `${local.slice(0, 2)}${"*".repeat(Math.max(3, local.length - 3))}${local.slice(-1)}${domain}`;
  }

  const digits = value.replace(/\s+/g, "");
  if (digits.length <= 4) return digits;
  return `${"*".repeat(digits.length - 4)}${digits.slice(-4)}`;
}

export interface OtpVerifyProps extends Omit<React.ComponentProps<"div">, "onSubmit" | "title"> {
  logo?: React.ReactNode;
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  /** Sentence above the masked destination. */
  subtitle?: React.ReactNode;
  /** Address or number the code was sent to. Masked before it is shown. */
  destination?: string;
  /** Overrides the built-in masking entirely. */
  maskedDestination?: string;
  /** Number of digits. Six by default; a separator is drawn at the midpoint of an even count. */
  length?: number;
  /** Accessible name of the code field. */
  fieldLabel?: string;
  submitLabel?: string;
  /** Prompt before the resend control. */
  resendPrompt?: React.ReactNode;
  resendLabel?: string;
  /** Seconds the resend control stays disabled, counted down internally. */
  resendSeconds?: number;
  backLabel?: string;
  backHref?: string;
  onBack?: () => void;
  /** Blocks the field and spins the submit button. */
  loading?: boolean;
  /** Verification failure. Announced as an alert and wired to the field through `aria-describedby`. */
  error?: React.ReactNode;
  /** Fires as soon as the last digit is typed, and again if the button is pressed. */
  onComplete?: (code: string) => void;
  /** Restarts the countdown and asks the caller for a fresh code. */
  onResend?: () => void;
}

function OtpVerify({
  className,
  logo,
  eyebrow: eyebrowProp,
  title: titleProp,
  subtitle: subtitleProp,
  destination,
  maskedDestination,
  length = 6,
  fieldLabel: fieldLabelProp,
  submitLabel: submitLabelProp,
  resendPrompt: resendPromptProp,
  resendLabel: resendLabelProp,
  resendSeconds = 30,
  backLabel: backLabelProp,
  backHref,
  onBack,
  loading = false,
  error,
  onComplete,
  onResend,
  ...props
}: OtpVerifyProps) {
  const t = useT();
  const eyebrow = eyebrowProp ?? t("otp.eyebrow");
  const title = titleProp ?? t("otp.title");
  const subtitle = subtitleProp ?? t("otp.subtitle");
  const fieldLabel = fieldLabelProp ?? t("otp.fieldLabel");
  const submitLabel = submitLabelProp ?? t("otp.submit");
  const resendPrompt = resendPromptProp ?? t("otp.resendPrompt");
  const resendLabel = resendLabelProp ?? t("otp.resend");
  const backLabel = backLabelProp ?? t("otp.back");
  const id = React.useId();
  const errorId = `${id}-error`;

  const [code, setCode] = React.useState("");
  const [remaining, setRemaining] = React.useState(resendSeconds);

  // A chain of one-second timeouts rather than an interval: it stops itself at
  // zero, so a page left open never keeps a timer alive.
  React.useEffect(() => {
    if (remaining <= 0) return;
    const timer = window.setTimeout(() => {
      setRemaining((current) => (current <= 1 ? 0 : current - 1));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [remaining]);

  const handleComplete = React.useCallback(
    (value: string) => {
      if (loading) return;
      onComplete?.(value);
    },
    [loading, onComplete],
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading || code.length !== length) return;
    onComplete?.(code);
  };

  const handleResend = () => {
    if (remaining > 0) return;
    setCode("");
    setRemaining(resendSeconds);
    onResend?.();
  };

  const shown = maskedDestination ?? (destination ? maskDestination(destination) : undefined);

  // An even count reads best as two halves with a separator between them; an
  // odd count stays in a single group.
  const groups = React.useMemo(() => {
    const indices = Array.from({ length }, (_, index) => index);
    if (length % 2 !== 0 || length < 4) return [indices];
    return [indices.slice(0, length / 2), indices.slice(length / 2)];
  }, [length]);

  const backClasses = cn(
    "inline-flex items-center gap-2 rounded-xs text-sm font-medium text-muted-foreground",
    "underline-offset-4 hover:text-foreground hover:underline",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring",
  );

  return (
    <div
      data-slot="otp-verify"
      className={cn(
        "relative isolate flex min-h-svh w-full items-center justify-center overflow-hidden",
        "bg-background px-(--gutter) py-12",
        className,
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 start-1/2 z-(--z-below) size-[30rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl rtl:translate-x-1/2"
      />

      <div className="flex w-full max-w-[420px] flex-col items-center gap-8 text-center">
        {logo ? <div className="flex items-center gap-3">{logo}</div> : null}

        <span
          aria-hidden="true"
          className={cn(
            "flex size-12 items-center justify-center rounded-md",
            "border border-primary/30 bg-primary/10 text-primary",
            "[&_svg]:size-5",
          )}
        >
          <KeyRound />
        </span>

        <header className="flex flex-col gap-2">
          {eyebrow ? (
            <p
              data-slot="otp-verify-eyebrow"
              className="text-eyebrow font-semibold text-primary uppercase"
            >
              {eyebrow}
            </p>
          ) : null}
          <h1 data-slot="otp-verify-title" className="font-display text-h2 text-balance uppercase">
            {title}
          </h1>
          <p className="text-sm text-pretty text-muted-foreground">
            {subtitle}
            {shown ? (
              <>
                {" "}
                <span data-slot="otp-verify-destination" className="font-medium text-foreground">
                  {shown}
                </span>
              </>
            ) : null}
          </p>
        </header>

        <form
          data-slot="otp-verify-form"
          noValidate
          onSubmit={handleSubmit}
          className="flex w-full flex-col items-center gap-5"
        >
          <InputOTP
            maxLength={length}
            value={code}
            disabled={loading}
            aria-label={fieldLabel}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            containerClassName="justify-center"
            onChange={setCode}
            onComplete={handleComplete}
          >
            {groups.map((indices, groupIndex) => (
              <React.Fragment key={groupIndex}>
                {groupIndex > 0 ? <InputOTPSeparator /> : null}
                <InputOTPGroup>
                  {indices.map((index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      aria-invalid={error ? true : undefined}
                      className="h-12 w-11 text-h4 font-semibold"
                    />
                  ))}
                </InputOTPGroup>
              </React.Fragment>
            ))}
          </InputOTP>

          {error ? (
            <p
              id={errorId}
              role="alert"
              data-slot="otp-verify-error"
              className="text-sm font-medium text-destructive"
            >
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            size="lg"
            loading={loading}
            disabled={code.length !== length}
            className="w-full"
          >
            {submitLabel}
          </Button>
        </form>

        <p data-slot="otp-verify-resend" className="text-sm text-muted-foreground">
          {resendPrompt}{" "}
          <button
            type="button"
            disabled={remaining > 0 || loading}
            onClick={handleResend}
            className={cn(
              "rounded-xs font-medium text-primary underline-offset-4 hover:underline",
              "outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "disabled:pointer-events-none disabled:text-muted-foreground",
            )}
          >
            {resendLabel}
          </button>
          {remaining > 0 ? (
            <span aria-live="polite" className="ms-1 tabular-nums">
              {t("otp.resendCountdown", { seconds: remaining })}
            </span>
          ) : null}
        </p>

        {backHref ? (
          <a href={backHref} className={backClasses}>
            <ArrowLeft aria-hidden="true" className="size-4 rtl:-scale-x-100" />
            {backLabel}
          </a>
        ) : (
          <button type="button" onClick={onBack} className={backClasses}>
            <ArrowLeft aria-hidden="true" className="size-4 rtl:-scale-x-100" />
            {backLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export { OtpVerify, maskDestination as otpMaskDestination };
