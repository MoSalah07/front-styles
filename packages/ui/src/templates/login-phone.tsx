"use client";

/** Two-step sign-in with a mobile number: a country dial-code picker and number field, then a one-time code with a masked destination, a resend countdown and a way back to change the number. */
import * as React from "react";
import { Smartphone } from "lucide-react";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "../components/input-otp";
import { Label } from "../components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/select";
import { cn } from "../lib/cn";
import { useI18n } from "../lib/i18n";
// Through ../templates rather than ./ on purpose: the registry build rewrites a
// bare sibling import to the ui folder, which is where a consumer's copy of a
// template would not be.
import { otpMaskDestination } from "../templates/otp-verify";

export type LoginPhoneStep = "phone" | "code";

export interface LoginPhoneCountry {
  /** ISO 3166-1 alpha-2 region code. Doubles as the Select value, so it must be unique in the list. */
  code: string;
  /** International dialling code, with or without the leading `+`. */
  dialCode: string;
  /** Display name. Left out, it comes from `Intl.DisplayNames` in the active locale. */
  name?: string;
  /** Optional glyph before the name, such as a flag emoji. */
  flag?: React.ReactNode;
}

/**
 * Safe as a module constant because it carries no words: the country names are
 * resolved per render from the active locale, so the list reads in Arabic under
 * an Arabic provider without a catalogue entry per country.
 */
const DEFAULT_COUNTRIES: LoginPhoneCountry[] = [
  { code: "EG", dialCode: "+20" },
  { code: "SA", dialCode: "+966" },
  { code: "AE", dialCode: "+971" },
  { code: "US", dialCode: "+1" },
  { code: "GB", dialCode: "+44" },
  { code: "FR", dialCode: "+33" },
  { code: "IN", dialCode: "+91" },
];

/** E.164 caps a full number, country code included, at fifteen digits. */
const E164_MAX_DIGITS = 15;
/** Shortest national number accepted. Light on purpose: the server has the real rules. */
const NATIONAL_MIN_DIGITS = 6;

type PhoneProblem = "required" | "invalid" | null;

/**
 * Reduces what the user typed to national digits: spaces, dashes, dots and
 * brackets are dropped, and so is a single leading trunk `0`, which Egypt, the
 * Gulf, the UK, France and India all write domestically but never after the
 * country code. Returns null when anything other than digits is left.
 */
function nationalDigits(value: string): string | null {
  const stripped = value.replace(/[\s().-]/g, "");
  if (!/^\d*$/.test(stripped)) return null;
  return stripped.replace(/^0/, "");
}

function dialDigits(dialCode: string): string {
  return dialCode.replace(/\D/g, "");
}

/**
 * Joins a dialling code and a nationally written number into E.164, the
 * `+<country><number>` form an SMS provider expects. Returns null when the
 * number is empty, contains letters, or is too short or long to be real.
 */
function toE164(dialCode: string, national: string): string | null {
  const digits = nationalDigits(national);
  const dial = dialDigits(dialCode);
  if (!digits || !dial) return null;
  if (digits.length < NATIONAL_MIN_DIGITS || dial.length + digits.length > E164_MAX_DIGITS) {
    return null;
  }
  return `+${dial}${digits}`;
}

function phoneProblem(dialCode: string, national: string): PhoneProblem {
  if (national.trim() === "") return "required";
  return toE164(dialCode, national) ? null : "invalid";
}

function withPlus(dialCode: string): string {
  return `+${dialDigits(dialCode)}`;
}

export interface LoginPhoneProps extends Omit<React.ComponentProps<"div">, "onSubmit" | "title"> {
  logo?: React.ReactNode;
  /** Small uppercase line above the phone-step title. */
  eyebrow?: React.ReactNode;
  /** Heading of the phone step. */
  title?: React.ReactNode;
  /** Sentence under the phone-step heading. */
  subtitle?: React.ReactNode;
  /** Dial codes offered in the picker. Defaults to Egypt, Saudi Arabia, the UAE, the US, the UK, France and India. */
  countries?: LoginPhoneCountry[];
  /** `code` of the country selected at first. Defaults to the first in `countries`. */
  defaultCountry?: string;
  /** Number prefilled in the field, written nationally. */
  defaultPhone?: string;
  /** Accessible name of the dial-code picker. */
  countryLabel?: string;
  phoneLabel?: string;
  phonePlaceholder?: string;
  requestCodeLabel?: string;
  /** Small uppercase line above the code-step title. */
  codeEyebrow?: React.ReactNode;
  /** Heading of the code step. */
  codeTitle?: React.ReactNode;
  /** Sentence before the masked number on the code step. */
  codeSubtitle?: React.ReactNode;
  /** Accessible name of the code field. */
  codeLabel?: string;
  verifyLabel?: string;
  changeNumberLabel?: string;
  resendPrompt?: React.ReactNode;
  resendLabel?: string;
  /** Number of digits in the code. Six by default. */
  codeLength?: number;
  /** Seconds the resend control stays disabled after a code is sent. */
  resendSeconds?: number;
  /** Controlled step. Leave it undefined and the template advances itself once a code is requested. */
  step?: LoginPhoneStep;
  /** Step shown first when uncontrolled. */
  defaultStep?: LoginPhoneStep;
  /** Fires whenever the template wants to change step, controlled or not. */
  onStepChange?: (step: LoginPhoneStep) => void;
  /** Blocks the active step and spins its submit button. */
  loading?: boolean;
  /** Failure on the phone step, such as an unsupported number. Announced as an alert. */
  phoneError?: React.ReactNode;
  /** Failure on the code step, such as a wrong or expired code. Announced as an alert. */
  codeError?: React.ReactNode;
  /** Other ways in, such as a link to sign in with email instead. Shown under a divider. */
  alternateActions?: React.ReactNode;
  /** Receives the full international number, e.g. `+201012345678`, once it passes validation. */
  onRequestCode?: (phone: string) => void;
  /** Fires as soon as the last digit is typed, and again if the button is pressed. */
  onVerify?: (code: string) => void;
  /** Called by the resend control with the same international number. */
  onResend?: (phone: string) => void;
}

function LoginPhone({
  className,
  logo,
  eyebrow: eyebrowProp,
  title: titleProp,
  subtitle: subtitleProp,
  countries = DEFAULT_COUNTRIES,
  defaultCountry,
  defaultPhone = "",
  countryLabel: countryLabelProp,
  phoneLabel: phoneLabelProp,
  phonePlaceholder: phonePlaceholderProp,
  requestCodeLabel: requestCodeLabelProp,
  codeEyebrow: codeEyebrowProp,
  codeTitle: codeTitleProp,
  codeSubtitle: codeSubtitleProp,
  codeLabel: codeLabelProp,
  verifyLabel: verifyLabelProp,
  changeNumberLabel: changeNumberLabelProp,
  resendPrompt: resendPromptProp,
  resendLabel: resendLabelProp,
  codeLength = 6,
  resendSeconds = 30,
  step: stepProp,
  defaultStep = "phone",
  onStepChange,
  loading = false,
  phoneError,
  codeError,
  alternateActions,
  onRequestCode,
  onVerify,
  onResend,
  ...props
}: LoginPhoneProps) {
  const { t, locale } = useI18n();
  const eyebrow = eyebrowProp ?? t("loginPhone.eyebrow");
  const title = titleProp ?? t("loginPhone.title");
  const subtitle = subtitleProp ?? t("loginPhone.subtitle");
  const countryLabel = countryLabelProp ?? t("loginPhone.countryLabel");
  const phoneLabel = phoneLabelProp ?? t("loginPhone.phoneLabel");
  const phonePlaceholder = phonePlaceholderProp ?? t("loginPhone.phonePlaceholder");
  const requestCodeLabel = requestCodeLabelProp ?? t("loginPhone.requestCode");
  const codeEyebrow = codeEyebrowProp ?? t("loginPhone.codeEyebrow");
  const codeTitle = codeTitleProp ?? t("loginPhone.codeTitle");
  const codeSubtitle = codeSubtitleProp ?? t("loginPhone.codeSubtitle");
  const codeLabel = codeLabelProp ?? t("loginPhone.codeLabel");
  const verifyLabel = verifyLabelProp ?? t("loginPhone.verify");
  const changeNumberLabel = changeNumberLabelProp ?? t("loginPhone.changeNumber");
  const resendPrompt = resendPromptProp ?? t("loginPhone.resendPrompt");
  const resendLabel = resendLabelProp ?? t("loginPhone.resend");

  const id = React.useId();
  const phoneId = `${id}-phone`;
  const countryNameId = `${id}-country-label`;
  const countryTriggerId = `${id}-country`;
  const phoneMessageId = `${id}-phone-message`;
  const phoneErrorId = `${id}-phone-error`;
  const codeSubtitleId = `${id}-code-subtitle`;
  const codeErrorId = `${id}-code-error`;

  const phoneRef = React.useRef<HTMLInputElement>(null);
  const codeRef = React.useRef<HTMLInputElement>(null);

  const [selfStep, setSelfStep] = React.useState<LoginPhoneStep>(defaultStep);
  const step = stepProp ?? selfStep;

  const [countryCode, setCountryCode] = React.useState(defaultCountry ?? countries[0]?.code ?? "");
  const [phone, setPhone] = React.useState(defaultPhone);
  const [attempted, setAttempted] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [remaining, setRemaining] = React.useState(step === "code" ? resendSeconds : 0);

  // Entering the code step, however it happens (a submit here, or the parent
  // flipping a controlled `step`), clears the old code and restarts the
  // countdown. Adjusted during render rather than in an effect, so the first
  // paint of the new step already shows the right state.
  const [countdownStep, setCountdownStep] = React.useState(step);
  if (countdownStep !== step) {
    setCountdownStep(step);
    if (step === "code") {
      setCode("");
      setRemaining(resendSeconds);
    }
  }

  // A chain of one-second timeouts rather than an interval: it stops itself at
  // zero, so a page left open never keeps a timer alive.
  React.useEffect(() => {
    if (step !== "code" || remaining <= 0) return;
    const timer = window.setTimeout(() => {
      setRemaining((current) => (current <= 1 ? 0 : current - 1));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [step, remaining]);

  // Focus follows the step, but only on a change: a ref of the last step seen
  // keeps the first mount (and StrictMode's double mount) from stealing focus.
  const previousStep = React.useRef(step);
  React.useEffect(() => {
    if (previousStep.current === step) return;
    previousStep.current = step;
    (step === "code" ? codeRef : phoneRef).current?.focus();
  }, [step]);

  const country = countries.find((item) => item.code === countryCode) ?? countries[0];
  const dialCode = country ? withPlus(country.dialCode) : "";

  const regionNames = React.useMemo(() => {
    try {
      return new Intl.DisplayNames([locale], { type: "region" });
    } catch {
      return null;
    }
  }, [locale]);

  const nameOf = (item: LoginPhoneCountry): string => {
    if (item.name) return item.name;
    try {
      return regionNames?.of(item.code) ?? item.code;
    } catch {
      return item.code;
    }
  };

  const problem = phoneProblem(dialCode, phone);
  const shownProblem = attempted ? problem : null;
  const problemMessage =
    shownProblem === "required"
      ? t("loginPhone.phoneRequired")
      : shownProblem === "invalid"
        ? t("loginPhone.phoneInvalid")
        : null;

  const fullNumber = toE164(dialCode, phone);
  const national = nationalDigits(phone) ?? "";
  const maskedNumber = national ? `${dialCode} ${otpMaskDestination(national)}` : "";

  const changeStep = (next: LoginPhoneStep) => {
    if (stepProp === undefined) setSelfStep(next);
    onStepChange?.(next);
  };

  const handlePhoneSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    setAttempted(true);
    if (!fullNumber) {
      phoneRef.current?.focus();
      return;
    }
    onRequestCode?.(fullNumber);
    changeStep("code");
  };

  const handleComplete = (value: string) => {
    if (loading) return;
    onVerify?.(value);
  };

  const handleCodeSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading || code.length !== codeLength) return;
    onVerify?.(code);
  };

  const handleResend = () => {
    if (remaining > 0 || loading || !fullNumber) return;
    setCode("");
    setRemaining(resendSeconds);
    onResend?.(fullNumber);
  };

  // An even count reads best as two halves with a separator between them; an
  // odd count stays in a single group. Same rule as OtpVerify.
  const groups = React.useMemo(() => {
    const indices = Array.from({ length: codeLength }, (_, index) => index);
    if (codeLength % 2 !== 0 || codeLength < 4) return [indices];
    return [indices.slice(0, codeLength / 2), indices.slice(codeLength / 2)];
  }, [codeLength]);

  const phoneDescribedBy =
    [shownProblem ? phoneMessageId : null, phoneError ? phoneErrorId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  const codeDescribedBy = [codeSubtitleId, codeError ? codeErrorId : null]
    .filter(Boolean)
    .join(" ");

  const linkClasses = cn(
    "rounded-xs font-medium text-primary underline-offset-4 hover:underline",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring",
    "disabled:pointer-events-none disabled:text-muted-foreground",
  );

  const errorClasses = cn(
    "rounded-input border border-destructive/40 bg-destructive/10 px-3 py-2",
    "text-sm font-medium text-destructive",
  );

  return (
    <div
      data-slot="login-phone"
      data-step={step}
      className={cn(
        "relative isolate flex min-h-svh w-full items-center justify-center overflow-hidden",
        "bg-background px-(--gutter) py-12",
        className,
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 end-[-8rem] z-(--z-below) size-[30rem] rounded-full bg-primary/15 blur-3xl"
      />

      <div className="flex w-full max-w-[400px] flex-col gap-8">
        {logo ? (
          <div data-slot="login-phone-logo" className="flex items-center gap-3">
            {logo}
          </div>
        ) : null}

        <span
          aria-hidden="true"
          className={cn(
            "flex size-12 items-center justify-center rounded-md",
            "border border-primary/30 bg-primary/10 text-primary",
            "[&_svg]:size-5",
          )}
        >
          <Smartphone />
        </span>

        {step === "phone" ? (
          <>
            <header data-slot="login-phone-header" className="flex flex-col gap-2">
              {eyebrow ? (
                <p
                  data-slot="login-phone-eyebrow"
                  className="text-eyebrow font-semibold text-primary uppercase"
                >
                  {eyebrow}
                </p>
              ) : null}
              <h1
                data-slot="login-phone-title"
                className="font-display text-h2 text-balance uppercase"
              >
                {title}
              </h1>
              {subtitle ? (
                <p className="text-sm text-pretty text-muted-foreground">{subtitle}</p>
              ) : null}
            </header>

            <form data-slot="login-phone-form" noValidate onSubmit={handlePhoneSubmit}>
              <div className="flex flex-col gap-5">
                {phoneError ? (
                  <p
                    id={phoneErrorId}
                    role="alert"
                    data-slot="login-phone-error"
                    className={errorClasses}
                  >
                    {phoneError}
                  </p>
                ) : null}

                <div className="grid gap-2">
                  <Label htmlFor={phoneId}>{phoneLabel}</Label>
                  <span id={countryNameId} className="sr-only">
                    {countryLabel}
                  </span>
                  {/* A number with its country code reads left to right in every
                      script, so the pair keeps that order inside RTL pages. */}
                  <div data-slot="login-phone-number" dir="ltr" className="flex gap-2">
                    <Select value={countryCode} disabled={loading} onValueChange={setCountryCode}>
                      <SelectTrigger
                        id={countryTriggerId}
                        data-slot="login-phone-country"
                        aria-labelledby={`${countryNameId} ${countryTriggerId}`}
                        className="w-auto shrink-0 tabular-nums"
                      >
                        <SelectValue>
                          {country?.flag ? <span aria-hidden="true">{country.flag}</span> : null}
                          {dialCode}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((item) => (
                          <SelectItem key={item.code} value={item.code}>
                            {item.flag ? <span aria-hidden="true">{item.flag}</span> : null}
                            <span>{nameOf(item)}</span>
                            <span dir="ltr" className="text-muted-foreground tabular-nums">
                              {withPlus(item.dialCode)}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Input
                      ref={phoneRef}
                      id={phoneId}
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel-national"
                      dir="ltr"
                      required
                      placeholder={phonePlaceholder}
                      value={phone}
                      disabled={loading}
                      aria-invalid={shownProblem || phoneError ? true : undefined}
                      aria-describedby={phoneDescribedBy}
                      className="min-w-0 flex-1 tabular-nums"
                      onChange={(event) => setPhone(event.target.value)}
                    />
                  </div>
                  {problemMessage ? (
                    <p
                      id={phoneMessageId}
                      data-slot="login-phone-message"
                      className="text-sm font-medium text-destructive"
                    >
                      {problemMessage}
                    </p>
                  ) : null}
                </div>

                <Button type="submit" size="lg" loading={loading} className="w-full">
                  {requestCodeLabel}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <>
            <header data-slot="login-phone-header" className="flex flex-col gap-2">
              {codeEyebrow ? (
                <p
                  data-slot="login-phone-eyebrow"
                  className="text-eyebrow font-semibold text-primary uppercase"
                >
                  {codeEyebrow}
                </p>
              ) : null}
              <h1
                data-slot="login-phone-title"
                className="font-display text-h2 text-balance uppercase"
              >
                {codeTitle}
              </h1>
              <p id={codeSubtitleId} className="text-sm text-pretty text-muted-foreground">
                {codeSubtitle}
                {maskedNumber ? (
                  <>
                    {" "}
                    <span
                      data-slot="login-phone-destination"
                      dir="ltr"
                      className="font-medium text-foreground tabular-nums"
                    >
                      {maskedNumber}
                    </span>
                  </>
                ) : null}
              </p>
              <button
                type="button"
                data-slot="login-phone-change-number"
                disabled={loading}
                onClick={() => changeStep("phone")}
                className={cn(linkClasses, "self-start text-sm")}
              >
                {changeNumberLabel}
              </button>
            </header>

            <form
              data-slot="login-phone-code-form"
              noValidate
              onSubmit={handleCodeSubmit}
              className="flex flex-col gap-5"
            >
              {codeError ? (
                <p
                  id={codeErrorId}
                  role="alert"
                  data-slot="login-phone-code-error"
                  className={errorClasses}
                >
                  {codeError}
                </p>
              ) : null}

              <InputOTP
                ref={codeRef}
                maxLength={codeLength}
                value={code}
                disabled={loading}
                aria-label={codeLabel}
                aria-invalid={codeError ? true : undefined}
                aria-describedby={codeDescribedBy}
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
                          aria-invalid={codeError ? true : undefined}
                          className="h-12 w-11 text-h4 font-semibold"
                        />
                      ))}
                    </InputOTPGroup>
                  </React.Fragment>
                ))}
              </InputOTP>

              <Button
                type="submit"
                size="lg"
                loading={loading}
                disabled={code.length !== codeLength}
                className="w-full"
              >
                {verifyLabel}
              </Button>
            </form>

            <div data-slot="login-phone-resend" className="flex flex-col gap-1 text-sm">
              <p className="text-muted-foreground">
                {resendPrompt}{" "}
                <button
                  type="button"
                  disabled={remaining > 0 || loading}
                  onClick={handleResend}
                  className={linkClasses}
                >
                  {resendLabel}
                </button>
              </p>
              {remaining > 0 ? (
                <p
                  data-slot="login-phone-countdown"
                  className="text-caption text-muted-foreground tabular-nums"
                >
                  {t("loginPhone.resendCountdown", { count: remaining })}
                </p>
              ) : null}
            </div>
          </>
        )}

        {alternateActions ? (
          <div data-slot="login-phone-alternate" className="flex flex-col gap-4">
            <div className="flex items-center gap-3" aria-hidden="true">
              <span className="h-px flex-1 bg-border" />
              <span className="text-caption text-muted-foreground uppercase">
                {t("loginPhone.or")}
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>
            <div className="flex flex-col items-stretch gap-3 text-center text-sm">
              {alternateActions}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export { LoginPhone, toE164 as loginPhoneToE164 };
