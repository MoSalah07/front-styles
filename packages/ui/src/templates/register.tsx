"use client";

/** Account creation page with name, email, a password field scored by a live strength meter, a confirmation field and a terms checkbox. */
import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../components/button";
import { Checkbox } from "../components/checkbox";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { Progress } from "../components/progress";
import { cn } from "../lib/cn";

export interface RegisterValues {
  name: string;
  email: string;
  password: string;
  acceptedTerms: boolean;
}

/** Score from 0 (empty) to 4 (strong), derived from length and character variety. */
export type RegisterPasswordScore = 0 | 1 | 2 | 3 | 4;

const strengthLabels: Record<RegisterPasswordScore, string> = {
  0: "Too short",
  1: "Weak",
  2: "Fair",
  3: "Good",
  4: "Strong",
};

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

/**
 * Cheap, dependency-free strength heuristic: one point for a usable length, one
 * for a long password, and one each for mixed case, digits and symbols, capped
 * at four. It is a hint for the user, never a substitute for server-side rules.
 */
function scorePassword(value: string): RegisterPasswordScore {
  if (value.length < 8) return 0;

  let score = 1;
  if (value.length >= 12) score += 1;

  let classes = 0;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) classes += 1;
  if (/\d/.test(value)) classes += 1;
  if (/[^A-Za-z0-9]/.test(value)) classes += 1;

  score += classes >= 3 ? 2 : classes >= 1 ? 1 : 0;

  return Math.min(4, score) as RegisterPasswordScore;
}

export interface RegisterProps extends Omit<React.ComponentProps<"div">, "onSubmit" | "title"> {
  logo?: React.ReactNode;
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  nameLabel?: string;
  namePlaceholder?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  passwordLabel?: string;
  confirmLabel?: string;
  /** Body of the terms checkbox label. Pass links as nodes. */
  termsLabel?: React.ReactNode;
  submitLabel?: string;
  /** Message shown when the two password fields differ. */
  mismatchMessage?: string;
  /** Blocks the form and spins the submit button. */
  loading?: boolean;
  /** Sign-up failure. Announced as an alert and wired to the fields through `aria-describedby`. */
  error?: React.ReactNode;
  /** Line under the form, typically a link to sign in. */
  footer?: React.ReactNode;
  /** Receives the entered account details once the fields agree and the terms are accepted. */
  onSubmit?: (values: RegisterValues) => void;
}

function Register({
  className,
  logo,
  eyebrow = "Get started",
  title = "Create your account",
  subtitle = "It takes less than a minute.",
  nameLabel = "Full name",
  namePlaceholder = "Nour Hassan",
  emailLabel = "Email",
  emailPlaceholder = "you@example.com",
  passwordLabel = "Password",
  confirmLabel = "Confirm password",
  termsLabel = "I agree to the terms of service and the privacy policy.",
  submitLabel = "Create account",
  mismatchMessage = "The two passwords do not match.",
  loading = false,
  error,
  footer,
  onSubmit,
  ...props
}: RegisterProps) {
  const id = React.useId();
  const nameId = `${id}-name`;
  const emailId = `${id}-email`;
  const passwordId = `${id}-password`;
  const confirmId = `${id}-confirm`;
  const termsId = `${id}-terms`;
  const errorId = `${id}-error`;
  const strengthId = `${id}-strength`;
  const mismatchId = `${id}-mismatch`;

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [accepted, setAccepted] = React.useState(false);
  const [revealed, setRevealed] = React.useState(false);
  const [touchedConfirm, setTouchedConfirm] = React.useState(false);

  const score = scorePassword(password);
  const mismatch = touchedConfirm && confirm.length > 0 && confirm !== password;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    setTouchedConfirm(true);
    if (confirm !== password) return;
    onSubmit?.({ name, email, password, acceptedTerms: accepted });
  };

  return (
    <div
      data-slot="register"
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

      <div className="flex w-full max-w-[440px] flex-col gap-8">
        <header className="flex flex-col gap-2">
          {logo ? <div className="mb-2 flex items-center gap-3">{logo}</div> : null}
          {eyebrow ? (
            <p
              data-slot="register-eyebrow"
              className="text-eyebrow font-semibold text-primary uppercase"
            >
              {eyebrow}
            </p>
          ) : null}
          <h1 data-slot="register-title" className="font-display text-h2 text-balance uppercase">
            {title}
          </h1>
          {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
        </header>

        <form data-slot="register-form" noValidate onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5">
            {error ? (
              <p
                id={errorId}
                role="alert"
                data-slot="register-error"
                className={cn(
                  "rounded-input border border-destructive/40 bg-destructive/10 px-3 py-2",
                  "text-sm font-medium text-destructive",
                )}
              >
                {error}
              </p>
            ) : null}

            <div className="grid gap-2">
              <Label htmlFor={nameId}>{nameLabel}</Label>
              <Input
                id={nameId}
                name="name"
                autoComplete="name"
                required
                placeholder={namePlaceholder}
                value={name}
                disabled={loading}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorId : undefined}
                onChange={(event) => setName(event.target.value)}
              />
            </div>

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

            <div className="grid gap-2">
              <Label htmlFor={passwordId}>{passwordLabel}</Label>
              <div className="relative">
                <Input
                  id={passwordId}
                  name="password"
                  type={revealed ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  disabled={loading}
                  aria-describedby={strengthId}
                  className="pe-11"
                  onChange={(event) => setPassword(event.target.value)}
                />
                <Button
                  data-slot="register-reveal"
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={loading}
                  aria-label={revealed ? "Hide password" : "Show password"}
                  aria-pressed={revealed}
                  aria-controls={passwordId}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => setRevealed((current) => !current)}
                  className="absolute inset-y-0 end-1 my-auto text-muted-foreground hover:text-foreground"
                >
                  {revealed ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                </Button>
              </div>

              <div data-slot="register-strength" className="grid gap-1.5">
                <Progress
                  value={(score / 4) * 100}
                  aria-label="Password strength"
                  className={cn("h-1.5", strengthTone[score])}
                />
                <p
                  id={strengthId}
                  aria-live="polite"
                  className={cn("text-caption font-medium", strengthTextTone[score])}
                >
                  {password.length === 0
                    ? "Use at least 8 characters, with a number and a symbol."
                    : `Password strength: ${strengthLabels[score]}`}
                </p>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor={confirmId}>{confirmLabel}</Label>
              <Input
                id={confirmId}
                name="confirmPassword"
                type={revealed ? "text" : "password"}
                autoComplete="new-password"
                required
                value={confirm}
                disabled={loading}
                aria-invalid={mismatch || undefined}
                aria-describedby={mismatch ? mismatchId : undefined}
                onBlur={() => setTouchedConfirm(true)}
                onChange={(event) => setConfirm(event.target.value)}
              />
              {mismatch ? (
                <p
                  id={mismatchId}
                  role="alert"
                  data-slot="register-mismatch"
                  className="text-sm font-medium text-destructive"
                >
                  {mismatchMessage}
                </p>
              ) : null}
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id={termsId}
                name="terms"
                required
                checked={accepted}
                disabled={loading}
                className="mt-0.5"
                onCheckedChange={(checked) => setAccepted(checked === true)}
              />
              <Label htmlFor={termsId} className="text-sm leading-snug font-normal text-pretty">
                {termsLabel}
              </Label>
            </div>

            <Button
              type="submit"
              size="lg"
              loading={loading}
              disabled={!accepted}
              className="w-full"
            >
              {submitLabel}
            </Button>
          </div>
        </form>

        {footer ? (
          <p
            data-slot="register-footer"
            className="text-center text-sm text-pretty text-muted-foreground"
          >
            {footer}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export { Register, scorePassword as registerPasswordScore };
