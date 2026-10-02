"use client";

/** Three-step sign-up wizard: account details with a password strength meter, a short profile, and an emailed one-time code, tracked by a numbered stepper and finished by a done state. */
import * as React from "react";
import { Check, CircleCheck, Eye, EyeOff } from "lucide-react";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "../components/input-otp";
import { Label } from "../components/label";
import { Progress } from "../components/progress";
import { RadioGroup, RadioGroupItem } from "../components/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/select";
import { cn } from "../lib/cn";
import { useFormatters, useT, type MessageKey, type TranslateFn } from "../lib/i18n";
// Through ../templates rather than ./ on purpose: the registry build rewrites a
// bare sibling import to the ui folder, which is where a consumer's copy of a
// template would not be.
import { otpMaskDestination } from "../templates/otp-verify";
import { registerPasswordScore, type RegisterPasswordScore } from "../templates/register";

export interface RegisterWizardValues {
  email: string;
  password: string;
  name: string;
  /** Optional; an empty string when left blank. */
  company: string;
  /** `value` of the chosen role option. */
  role: string;
  /** `value` of the chosen team-size option. */
  teamSize: string;
  /** The one-time code typed on the last step. */
  code: string;
}

export interface RegisterWizardOption {
  value: string;
  label: string;
}

/** The three form steps, then the terminal done state. */
export type RegisterWizardStep = "account" | "profile" | "verify" | "done";

type FormStep = Exclude<RegisterWizardStep, "done">;
type FieldName = keyof RegisterWizardValues;
type FieldErrors = Partial<Record<FieldName, string>>;

const FORM_STEPS: readonly FormStep[] = ["account", "profile", "verify"];

const STEP_TITLE_KEYS = {
  account: "registerWizard.accountStep",
  profile: "registerWizard.profileStep",
  verify: "registerWizard.verifyStep",
} as const satisfies Record<FormStep, MessageKey>;

/** The strength words are shared with Register, so both pages describe a password the same way. */
const STRENGTH_KEYS = {
  0: "register.strength0",
  1: "register.strength1",
  2: "register.strength2",
  3: "register.strength3",
  4: "register.strength4",
} as const satisfies Record<RegisterPasswordScore, MessageKey>;

const strengthTone: Record<RegisterPasswordScore, string> = {
  0: "[&_[data-slot=progress-indicator]]:bg-muted-foreground",
  1: "[&_[data-slot=progress-indicator]]:bg-destructive",
  2: "[&_[data-slot=progress-indicator]]:bg-warning",
  3: "[&_[data-slot=progress-indicator]]:bg-info",
  4: "[&_[data-slot=progress-indicator]]:bg-success",
};

const strengthTextTone: Record<RegisterPasswordScore, string> = {
  0: "text-muted-foreground",
  1: "text-destructive",
  2: "text-warning",
  3: "text-info",
  4: "text-success",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN = 8;

/** Built per render from the catalogue, so the options follow the active language. */
function defaultRolesFor(t: TranslateFn): RegisterWizardOption[] {
  return [
    { value: "engineering", label: t("registerWizard.roleEngineering") },
    { value: "design", label: t("registerWizard.roleDesign") },
    { value: "product", label: t("registerWizard.roleProduct") },
    { value: "marketing", label: t("registerWizard.roleMarketing") },
    { value: "leadership", label: t("registerWizard.roleLeadership") },
    { value: "other", label: t("registerWizard.roleOther") },
  ];
}

function defaultTeamSizesFor(t: TranslateFn): RegisterWizardOption[] {
  return [
    { value: "1", label: t("registerWizard.teamSolo") },
    { value: "2-10", label: t("registerWizard.teamSmall") },
    { value: "11-50", label: t("registerWizard.teamMedium") },
    { value: "51-200", label: t("registerWizard.teamLarge") },
    { value: "201+", label: t("registerWizard.teamEnterprise") },
  ];
}

/** Field order per step, which is also the order focus visits the first invalid one. */
function validate(
  step: FormStep,
  values: RegisterWizardValues,
  codeLength: number,
  t: TranslateFn,
): FieldErrors {
  const errors: FieldErrors = {};

  if (step === "account") {
    const email = values.email.trim();
    if (!email) errors.email = t("registerWizard.emailRequired");
    else if (!EMAIL_RE.test(email)) errors.email = t("registerWizard.emailInvalid");
    if (values.password.length < PASSWORD_MIN) {
      errors.password = t("registerWizard.passwordTooShort");
    }
  }

  if (step === "profile") {
    if (!values.name.trim()) errors.name = t("registerWizard.nameRequired");
    if (!values.role) errors.role = t("registerWizard.roleRequired");
    if (!values.teamSize) errors.teamSize = t("registerWizard.teamSizeRequired");
  }

  if (step === "verify" && values.code.length !== codeLength) {
    errors.code = t("registerWizard.codeRequired");
  }

  return errors;
}

function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as { then?: unknown }).then === "function"
  );
}

const EMPTY_VALUES: RegisterWizardValues = {
  email: "",
  password: "",
  name: "",
  company: "",
  role: "",
  teamSize: "",
  code: "",
};

export interface RegisterWizardProps extends Omit<
  React.ComponentProps<"div">,
  "onSubmit" | "title" | "defaultValue"
> {
  logo?: React.ReactNode;
  eyebrow?: React.ReactNode;
  /** Page heading above the stepper. */
  title?: React.ReactNode;
  /** Options of the role Select. */
  roles?: RegisterWizardOption[];
  /** Options of the team-size radio group. */
  teamSizes?: RegisterWizardOption[];
  /** Values the fields start with. The code is never prefilled. */
  defaultValues?: Partial<Omit<RegisterWizardValues, "code">>;
  /** Number of digits in the emailed code. Six by default. */
  codeLength?: number;
  /** Seconds the resend control stays disabled after a code is sent. */
  resendSeconds?: number;
  /** Blocks the active step and spins its primary button. */
  loading?: boolean;
  /** Failure on the active step, such as an address already in use or a wrong code. Announced as an alert. */
  error?: React.ReactNode;
  /** Shown under the done message, typically a link into the product. */
  doneAction?: React.ReactNode;
  /** Line under the wizard, typically a link to sign in. */
  footer?: React.ReactNode;
  /** Fires with the new step after every move, including the final one to `done`. */
  onStepChange?: (step: RegisterWizardStep) => void;
  /** Asks the caller to email a code. Fires on leaving the profile step and on every resend. */
  onSendCode?: (email: string) => void;
  /**
   * Receives everything entered once the code is complete. Return a promise to
   * hold the done state until it settles: a rejection keeps the user on the
   * code step, where `error` can explain why.
   */
  onComplete?: (values: RegisterWizardValues) => void | PromiseLike<unknown>;
}

function RegisterWizard({
  className,
  logo,
  eyebrow: eyebrowProp,
  title: titleProp,
  roles: rolesProp,
  teamSizes: teamSizesProp,
  defaultValues,
  codeLength = 6,
  resendSeconds = 30,
  loading = false,
  error,
  doneAction,
  footer,
  onStepChange,
  onSendCode,
  onComplete,
  ...props
}: RegisterWizardProps) {
  const t = useT();
  const { number } = useFormatters();
  const eyebrow = eyebrowProp ?? t("registerWizard.eyebrow");
  const title = titleProp ?? t("registerWizard.title");
  const roles = rolesProp ?? defaultRolesFor(t);
  const teamSizes = teamSizesProp ?? defaultTeamSizesFor(t);

  const id = React.useId();
  const fieldId = (name: FieldName) => `${id}-${name}`;
  const messageId = (name: FieldName) => `${id}-${name}-message`;
  const errorId = `${id}-error`;
  const strengthId = `${id}-strength`;
  const teamLabelId = `${id}-team-label`;
  const verifyDescriptionId = `${id}-verify-description`;

  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const codeRef = React.useRef<HTMLInputElement>(null);

  const [step, setStep] = React.useState<RegisterWizardStep>("account");
  const [values, setValues] = React.useState<RegisterWizardValues>(() => ({
    ...EMPTY_VALUES,
    ...defaultValues,
    code: "",
  }));
  const [attempted, setAttempted] = React.useState<Partial<Record<FormStep, boolean>>>({});
  const [revealed, setRevealed] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [remaining, setRemaining] = React.useState(0);

  const busy = loading || pending;

  // Arriving on the code step clears any old code and restarts the countdown.
  // Adjusted during render, so the first paint of the step is already right.
  const [countdownStep, setCountdownStep] = React.useState(step);
  if (countdownStep !== step) {
    setCountdownStep(step);
    if (step === "verify") {
      setValues((current) => ({ ...current, code: "" }));
      setRemaining(resendSeconds);
    }
  }

  React.useEffect(() => {
    if (step !== "verify" || remaining <= 0) return;
    const timer = window.setTimeout(() => {
      setRemaining((current) => (current <= 1 ? 0 : current - 1));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [step, remaining]);

  // Focus lands on the new step's heading, so a screen reader announces where
  // the user now is. A ref of the last step seen keeps the first mount, and
  // StrictMode's double mount, from moving focus.
  const previousStep = React.useRef(step);
  React.useEffect(() => {
    if (previousStep.current === step) return;
    previousStep.current = step;
    headingRef.current?.focus();
  }, [step]);

  const formStep: FormStep | null = step === "done" ? null : step;
  const stepIndex = step === "done" ? FORM_STEPS.length : FORM_STEPS.indexOf(step);
  const errors = formStep ? validate(formStep, values, codeLength, t) : {};
  const shown: FieldErrors = formStep && attempted[formStep] ? errors : {};

  const setField = <K extends FieldName>(name: K, value: RegisterWizardValues[K]) => {
    setValues((current) => ({ ...current, [name]: value }));
  };

  const goTo = (next: RegisterWizardStep) => {
    setStep(next);
    onStepChange?.(next);
  };

  const finish = (code: string) => {
    if (busy) return;
    const result = onComplete?.({ ...values, code });
    if (!isPromiseLike(result)) {
      goTo("done");
      return;
    }
    setPending(true);
    result.then(
      () => {
        setPending(false);
        goTo("done");
      },
      () => setPending(false),
    );
  };

  const focusField = (name: FieldName) => {
    if (name === "code") {
      codeRef.current?.focus();
      return;
    }
    if (name === "teamSize") {
      // Roving focus: the group takes focus through its checked item, or its first.
      const group = document.getElementById(fieldId("teamSize"));
      group?.querySelector<HTMLElement>('[role="radio"]')?.focus();
      return;
    }
    document.getElementById(fieldId(name))?.focus();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy || !formStep) return;

    const invalid = Object.keys(errors) as FieldName[];
    if (invalid.length > 0) {
      setAttempted((current) => ({ ...current, [formStep]: true }));
      focusField(invalid[0]!);
      return;
    }

    if (formStep === "account") goTo("profile");
    else if (formStep === "profile") {
      onSendCode?.(values.email.trim());
      goTo("verify");
    } else finish(values.code);
  };

  const handleBack = () => {
    if (busy || stepIndex <= 0 || !formStep) return;
    goTo(FORM_STEPS[stepIndex - 1]!);
  };

  const handleResend = () => {
    if (remaining > 0 || busy) return;
    setField("code", "");
    setRemaining(resendSeconds);
    onSendCode?.(values.email.trim());
  };

  const describedBy = (name: FieldName, ...extra: (string | false | undefined)[]) =>
    [...extra, shown[name] ? messageId(name) : undefined, error ? errorId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  const fieldMessage = (name: FieldName) =>
    shown[name] ? (
      <p
        id={messageId(name)}
        data-slot="register-wizard-message"
        className="text-sm font-medium text-destructive"
      >
        {shown[name]}
      </p>
    ) : null;

  const score = registerPasswordScore(values.password);

  const groups = React.useMemo(() => {
    const indices = Array.from({ length: codeLength }, (_, index) => index);
    if (codeLength % 2 !== 0 || codeLength < 4) return [indices];
    return [indices.slice(0, codeLength / 2), indices.slice(codeLength / 2)];
  }, [codeLength]);

  const headingClasses = cn(
    "rounded-xs font-display text-h3 text-balance uppercase",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring",
  );

  const stepHeading = formStep
    ? {
        account: t("registerWizard.accountTitle"),
        profile: t("registerWizard.profileTitle"),
        verify: t("registerWizard.verifyTitle"),
      }[formStep]
    : null;

  const stepDescription = formStep
    ? {
        account: t("registerWizard.accountDescription"),
        profile: t("registerWizard.profileDescription"),
        verify: t("registerWizard.verifyDescription"),
      }[formStep]
    : null;

  return (
    <div
      data-slot="register-wizard"
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
        className="pointer-events-none absolute -top-40 start-[-8rem] z-(--z-below) size-[30rem] rounded-full bg-primary/15 blur-3xl"
      />

      <div className="flex w-full max-w-[480px] flex-col gap-8">
        <header data-slot="register-wizard-header" className="flex flex-col gap-2">
          {logo ? <div className="mb-2 flex items-center gap-3">{logo}</div> : null}
          {eyebrow ? (
            <p
              data-slot="register-wizard-eyebrow"
              className="text-eyebrow font-semibold text-primary uppercase"
            >
              {eyebrow}
            </p>
          ) : null}
          <h1
            data-slot="register-wizard-title"
            className="font-display text-h2 text-balance uppercase"
          >
            {title}
          </h1>
        </header>

        <nav data-slot="register-wizard-steps" aria-label={t("registerWizard.progressLabel")}>
          <p data-slot="register-wizard-step-status" className="sr-only">
            {formStep
              ? t("registerWizard.stepStatus", {
                  current: stepIndex + 1,
                  total: FORM_STEPS.length,
                })
              : t("registerWizard.stepsDone")}
          </p>
          <ol className="flex items-start gap-2">
            {FORM_STEPS.map((key, index) => {
              const state =
                index < stepIndex ? "complete" : index === stepIndex ? "current" : "upcoming";
              return (
                <li
                  key={key}
                  data-slot="register-wizard-step"
                  data-state={state}
                  aria-current={state === "current" ? "step" : undefined}
                  className="group flex flex-1 flex-col gap-2"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "h-1 w-full rounded-full bg-muted",
                      "motion-safe:transition-colors motion-safe:duration-(--duration-fast)",
                      "group-data-[state=complete]:bg-primary group-data-[state=current]:bg-primary",
                    )}
                  />
                  <span className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex size-6 shrink-0 items-center justify-center rounded-full border text-caption font-semibold tabular-nums",
                        "border-border text-muted-foreground",
                        "group-data-[state=current]:border-primary group-data-[state=current]:text-primary",
                        "group-data-[state=complete]:border-primary group-data-[state=complete]:bg-primary group-data-[state=complete]:text-primary-foreground",
                      )}
                    >
                      {state === "complete" ? (
                        <Check className="size-3.5" />
                      ) : (
                        number.format(index + 1)
                      )}
                    </span>
                    <span
                      className={cn(
                        "text-sm font-medium text-muted-foreground",
                        "group-data-[state=current]:text-foreground",
                      )}
                    >
                      {t(STEP_TITLE_KEYS[key])}
                    </span>
                    {state === "complete" ? (
                      <span className="sr-only">{` ${t("registerWizard.stepComplete")}`}</span>
                    ) : null}
                  </span>
                </li>
              );
            })}
          </ol>
        </nav>

        {formStep ? (
          <form
            data-slot="register-wizard-form"
            data-step={formStep}
            noValidate
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-1.5">
              <h2
                ref={headingRef}
                tabIndex={-1}
                data-slot="register-wizard-step-title"
                className={headingClasses}
              >
                {stepHeading}
              </h2>
              <p
                id={formStep === "verify" ? verifyDescriptionId : undefined}
                className="text-sm text-pretty text-muted-foreground"
              >
                {stepDescription}
                {formStep === "verify" && values.email ? (
                  <>
                    {" "}
                    <span
                      data-slot="register-wizard-destination"
                      dir="ltr"
                      className="font-medium text-foreground"
                    >
                      {otpMaskDestination(values.email.trim())}
                    </span>
                  </>
                ) : null}
              </p>
            </div>

            {error ? (
              <p
                id={errorId}
                role="alert"
                data-slot="register-wizard-error"
                className={cn(
                  "rounded-input border border-destructive/40 bg-destructive/10 px-3 py-2",
                  "text-sm font-medium text-destructive",
                )}
              >
                {error}
              </p>
            ) : null}

            {formStep === "account" ? (
              <div className="flex flex-col gap-5">
                <div className="grid gap-2">
                  <Label htmlFor={fieldId("email")}>{t("registerWizard.emailLabel")}</Label>
                  <Input
                    id={fieldId("email")}
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    dir="ltr"
                    required
                    placeholder={t("registerWizard.emailPlaceholder")}
                    value={values.email}
                    disabled={busy}
                    aria-invalid={shown.email ? true : undefined}
                    aria-describedby={describedBy("email")}
                    onChange={(event) => setField("email", event.target.value)}
                  />
                  {fieldMessage("email")}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor={fieldId("password")}>{t("registerWizard.passwordLabel")}</Label>
                  <div className="relative">
                    <Input
                      id={fieldId("password")}
                      name="password"
                      type={revealed ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={values.password}
                      disabled={busy}
                      aria-invalid={shown.password ? true : undefined}
                      aria-describedby={describedBy("password", strengthId)}
                      className="pe-11"
                      onChange={(event) => setField("password", event.target.value)}
                    />
                    <Button
                      data-slot="register-wizard-reveal"
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={busy}
                      aria-label={
                        revealed ? t("register.hidePassword") : t("register.showPassword")
                      }
                      aria-pressed={revealed}
                      aria-controls={fieldId("password")}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => setRevealed((current) => !current)}
                      className="absolute inset-y-0 end-1 my-auto text-muted-foreground hover:text-foreground"
                    >
                      {revealed ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                    </Button>
                  </div>
                  {fieldMessage("password")}

                  <div data-slot="register-wizard-strength" className="grid gap-1.5">
                    <Progress
                      value={(score / 4) * 100}
                      aria-label={t("register.strengthLabel")}
                      className={cn("h-1.5", strengthTone[score])}
                    />
                    <p
                      id={strengthId}
                      aria-live="polite"
                      className={cn("text-caption font-medium", strengthTextTone[score])}
                    >
                      {values.password.length === 0
                        ? t("register.strengthHint")
                        : t("register.strengthValue", { strength: t(STRENGTH_KEYS[score]) })}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {formStep === "profile" ? (
              <div className="flex flex-col gap-5">
                <div className="grid gap-2">
                  <Label htmlFor={fieldId("name")}>{t("registerWizard.nameLabel")}</Label>
                  <Input
                    id={fieldId("name")}
                    name="name"
                    autoComplete="name"
                    required
                    placeholder={t("registerWizard.namePlaceholder")}
                    value={values.name}
                    disabled={busy}
                    aria-invalid={shown.name ? true : undefined}
                    aria-describedby={describedBy("name")}
                    onChange={(event) => setField("name", event.target.value)}
                  />
                  {fieldMessage("name")}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor={fieldId("company")}>
                    {t("registerWizard.companyLabel")}{" "}
                    <span className="font-normal text-muted-foreground">
                      {t("registerWizard.optional")}
                    </span>
                  </Label>
                  <Input
                    id={fieldId("company")}
                    name="company"
                    autoComplete="organization"
                    value={values.company}
                    disabled={busy}
                    aria-describedby={describedBy("company")}
                    onChange={(event) => setField("company", event.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor={fieldId("role")}>{t("registerWizard.roleLabel")}</Label>
                  <Select
                    name="role"
                    // An empty string is Radix's "nothing chosen": it shows the
                    // placeholder and keeps the Select controlled throughout.
                    value={values.role}
                    disabled={busy}
                    onValueChange={(value) => setField("role", value)}
                  >
                    <SelectTrigger
                      id={fieldId("role")}
                      data-slot="register-wizard-role"
                      aria-invalid={shown.role ? true : undefined}
                      aria-describedby={describedBy("role")}
                    >
                      <SelectValue placeholder={t("registerWizard.rolePlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldMessage("role")}
                </div>

                <div className="grid gap-3">
                  <span id={teamLabelId} className="text-sm leading-none font-medium">
                    {t("registerWizard.teamSizeLabel")}
                  </span>
                  <RadioGroup
                    id={fieldId("teamSize")}
                    name="teamSize"
                    value={values.teamSize}
                    disabled={busy}
                    aria-labelledby={teamLabelId}
                    aria-invalid={shown.teamSize ? true : undefined}
                    aria-describedby={describedBy("teamSize")}
                    className="grid-cols-1 gap-2 sm:grid-cols-2"
                    onValueChange={(value) => setField("teamSize", value)}
                  >
                    {teamSizes.map((option) => {
                      const optionId = `${fieldId("teamSize")}-${option.value}`;
                      return (
                        <div
                          key={option.value}
                          data-slot="register-wizard-team-option"
                          className={cn(
                            "flex items-center gap-3 rounded-input border border-input px-3 py-2.5",
                            "has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5",
                          )}
                        >
                          <RadioGroupItem
                            id={optionId}
                            value={option.value}
                            aria-invalid={shown.teamSize ? true : undefined}
                          />
                          <Label htmlFor={optionId} className="flex-1 font-normal">
                            {option.label}
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                  {fieldMessage("teamSize")}
                </div>
              </div>
            ) : null}

            {formStep === "verify" ? (
              <div className="flex flex-col items-center gap-4">
                <InputOTP
                  ref={codeRef}
                  maxLength={codeLength}
                  value={values.code}
                  disabled={busy}
                  aria-label={t("registerWizard.codeLabel")}
                  aria-invalid={shown.code || error ? true : undefined}
                  aria-describedby={describedBy("code", verifyDescriptionId)}
                  containerClassName="justify-center"
                  onChange={(value) => setField("code", value)}
                  onComplete={finish}
                >
                  {groups.map((indices, groupIndex) => (
                    <React.Fragment key={groupIndex}>
                      {groupIndex > 0 ? <InputOTPSeparator /> : null}
                      <InputOTPGroup>
                        {indices.map((index) => (
                          <InputOTPSlot
                            key={index}
                            index={index}
                            aria-invalid={shown.code || error ? true : undefined}
                            className="h-12 w-11 text-h4 font-semibold"
                          />
                        ))}
                      </InputOTPGroup>
                    </React.Fragment>
                  ))}
                </InputOTP>
                {fieldMessage("code")}

                <div data-slot="register-wizard-resend" className="text-center text-sm">
                  <p className="text-muted-foreground">
                    {t("registerWizard.resendPrompt")}{" "}
                    <button
                      type="button"
                      disabled={remaining > 0 || busy}
                      onClick={handleResend}
                      className={cn(
                        "rounded-xs font-medium text-primary underline-offset-4 hover:underline",
                        "outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        "disabled:pointer-events-none disabled:text-muted-foreground",
                      )}
                    >
                      {t("registerWizard.resend")}
                    </button>
                  </p>
                  {remaining > 0 ? (
                    <p
                      data-slot="register-wizard-countdown"
                      className="text-caption text-muted-foreground tabular-nums"
                    >
                      {t("registerWizard.resendCountdown", { count: remaining })}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}

            <div data-slot="register-wizard-actions" className="flex items-center gap-3">
              {stepIndex > 0 ? (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  disabled={busy}
                  onClick={handleBack}
                >
                  {t("registerWizard.back")}
                </Button>
              ) : null}
              <Button type="submit" size="lg" loading={busy} className="ms-auto flex-1">
                {formStep === "verify" ? t("registerWizard.finish") : t("registerWizard.next")}
              </Button>
            </div>
          </form>
        ) : (
          <section
            data-slot="register-wizard-done"
            aria-labelledby={`${id}-done-title`}
            className="flex flex-col items-center gap-4 text-center"
          >
            <span
              aria-hidden="true"
              className={cn(
                "flex size-12 items-center justify-center rounded-md",
                "border border-success/30 bg-success/10 text-success",
                "[&_svg]:size-5",
                "motion-safe:animate-scale-in",
              )}
            >
              <CircleCheck />
            </span>
            <h2
              ref={headingRef}
              id={`${id}-done-title`}
              tabIndex={-1}
              data-slot="register-wizard-done-title"
              className={headingClasses}
            >
              {t("registerWizard.doneTitle")}
            </h2>
            <p className="text-sm text-pretty text-muted-foreground">
              {t("registerWizard.doneDescription", { name: values.name.trim() })}
            </p>
            {doneAction ? (
              <div className="flex flex-col items-center gap-3">{doneAction}</div>
            ) : null}
          </section>
        )}

        {footer ? (
          <p
            data-slot="register-wizard-footer"
            className="text-center text-sm text-pretty text-muted-foreground"
          >
            {footer}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export { RegisterWizard };
