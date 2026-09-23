"use client";

/** Single-column sign-in page: one centred card floating over a softly patterned, glowing backdrop. */
import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../components/button";
import { Card, CardContent, CardFooter, CardHeader } from "../components/card";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { Switch } from "../components/switch";
import { cn } from "../lib/cn";

export interface LoginCenteredValues {
  email: string;
  password: string;
  remember: boolean;
}

export interface LoginCenteredProps extends Omit<
  React.ComponentProps<"div">,
  "onSubmit" | "title"
> {
  /** Mark or wordmark above the heading. */
  logo?: React.ReactNode;
  /** Small uppercase line above the title. */
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  emailLabel?: string;
  emailPlaceholder?: string;
  passwordLabel?: string;
  passwordPlaceholder?: string;
  rememberLabel?: string;
  forgotLabel?: string;
  /** Destination of the forgot-password link. Omit it to get a button driving `onForgotPassword`. */
  forgotHref?: string;
  onForgotPassword?: () => void;
  submitLabel?: string;
  /** Blocks the form and spins the submit button. */
  loading?: boolean;
  /** Sign-in failure. Announced as an alert and wired to both fields through `aria-describedby`. */
  error?: React.ReactNode;
  /** Social or SSO buttons, shown under a divider. */
  social?: React.ReactNode;
  /** Line under the card, typically a link to sign up. */
  footer?: React.ReactNode;
  defaultEmail?: string;
  defaultRemember?: boolean;
  onSubmit?: (values: LoginCenteredValues) => void;
}

function LoginCentered({
  className,
  logo,
  eyebrow = "Welcome back",
  title = "Sign in",
  subtitle = "Use your work email to continue.",
  emailLabel = "Email",
  emailPlaceholder = "you@example.com",
  passwordLabel = "Password",
  passwordPlaceholder = "Your password",
  rememberLabel = "Remember me",
  forgotLabel = "Forgot password?",
  forgotHref,
  onForgotPassword,
  submitLabel = "Sign in",
  loading = false,
  error,
  social,
  footer,
  defaultEmail = "",
  defaultRemember = false,
  onSubmit,
  ...props
}: LoginCenteredProps) {
  const id = React.useId();
  const emailId = `${id}-email`;
  const passwordId = `${id}-password`;
  const errorId = `${id}-error`;

  const [email, setEmail] = React.useState(defaultEmail);
  const [password, setPassword] = React.useState("");
  const [remember, setRemember] = React.useState(defaultRemember);
  const [revealed, setRevealed] = React.useState(false);

  const describedBy = error ? errorId : undefined;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    onSubmit?.({ email, password, remember });
  };

  const forgotClasses = cn(
    "rounded-xs text-sm font-medium text-primary underline-offset-4 hover:underline",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring",
  );

  return (
    <div
      data-slot="login-centered"
      className={cn(
        "relative isolate flex min-h-svh w-full items-center justify-center overflow-hidden",
        "bg-background px-(--gutter) py-12",
        className,
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 z-(--z-below)",
          "[background-image:linear-gradient(to_right,color-mix(in_oklab,var(--foreground)_6%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--foreground)_6%,transparent)_1px,transparent_1px)]",
          "[background-size:48px_48px]",
          "[mask-image:radial-gradient(70%_60%_at_50%_40%,black,transparent)]",
        )}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 start-1/2 z-(--z-below) size-[32rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl rtl:translate-x-1/2"
      />

      <div className="flex w-full max-w-[400px] flex-col gap-6">
        <Card data-slot="login-centered-card" className="gap-6 shadow-3">
          <CardHeader className="gap-3">
            {logo ? (
              <div data-slot="login-centered-logo" className="mb-2 flex items-center gap-3">
                {logo}
              </div>
            ) : null}
            {eyebrow ? (
              <p
                data-slot="login-centered-eyebrow"
                className="text-eyebrow font-semibold text-primary uppercase"
              >
                {eyebrow}
              </p>
            ) : null}
            <h1
              data-slot="login-centered-title"
              className="font-display text-h3 text-balance uppercase"
            >
              {title}
            </h1>
            {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
          </CardHeader>

          <CardContent>
            <form data-slot="login-centered-form" noValidate onSubmit={handleSubmit}>
              <div className="flex flex-col gap-5">
                {error ? (
                  <p
                    id={errorId}
                    role="alert"
                    data-slot="login-centered-error"
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
                    aria-describedby={describedBy}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <Label htmlFor={passwordId}>{passwordLabel}</Label>
                    {forgotHref ? (
                      <a
                        data-slot="login-centered-forgot"
                        href={forgotHref}
                        className={forgotClasses}
                      >
                        {forgotLabel}
                      </a>
                    ) : (
                      <button
                        data-slot="login-centered-forgot"
                        type="button"
                        onClick={onForgotPassword}
                        className={forgotClasses}
                      >
                        {forgotLabel}
                      </button>
                    )}
                  </div>

                  <div className="relative">
                    <Input
                      id={passwordId}
                      name="password"
                      type={revealed ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      placeholder={passwordPlaceholder}
                      value={password}
                      disabled={loading}
                      aria-invalid={error ? true : undefined}
                      aria-describedby={describedBy}
                      className="pe-11"
                      onChange={(event) => setPassword(event.target.value)}
                    />
                    <Button
                      data-slot="login-centered-reveal"
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
                </div>

                <div className="flex items-center gap-3">
                  <Switch
                    id={`${id}-remember`}
                    checked={remember}
                    disabled={loading}
                    onCheckedChange={setRemember}
                  />
                  <Label htmlFor={`${id}-remember`} className="font-normal">
                    {rememberLabel}
                  </Label>
                </div>

                <Button type="submit" size="lg" loading={loading} className="w-full">
                  {submitLabel}
                </Button>

                {social ? (
                  <div data-slot="login-centered-social" className="flex flex-col gap-4">
                    <div className="flex items-center gap-3" aria-hidden="true">
                      <span className="h-px flex-1 bg-border" />
                      <span className="text-caption text-muted-foreground uppercase">or</span>
                      <span className="h-px flex-1 bg-border" />
                    </div>
                    {social}
                  </div>
                ) : null}
              </div>
            </form>
          </CardContent>

          {footer ? (
            <CardFooter
              data-slot="login-centered-footer"
              className="justify-center text-sm text-pretty text-muted-foreground"
            >
              {footer}
            </CardFooter>
          ) : null}
        </Card>
      </div>
    </div>
  );
}

export { LoginCentered };
