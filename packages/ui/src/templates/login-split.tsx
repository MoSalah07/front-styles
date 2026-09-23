"use client";

/** Two-column sign-in page: a cinematic brand panel on the inline start and a fully controlled email and password form on the inline end. */
import * as React from "react";
import { Eye, EyeOff, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { Switch } from "../components/switch";
import { cn } from "../lib/cn";

export interface LoginSplitValues {
  email: string;
  password: string;
  remember: boolean;
}

export interface LoginSplitPoint {
  /** Glyph shown in the tile at the inline start of the row. */
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
}

const defaultPoints: LoginSplitPoint[] = [
  {
    icon: <Zap aria-hidden="true" />,
    title: "Ship in minutes",
    description: "Tokens, primitives and blocks that already agree with each other.",
  },
  {
    icon: <ShieldCheck aria-hidden="true" />,
    title: "Accessible by default",
    description: "Every control is keyboard reachable and correctly labelled.",
  },
  {
    icon: <Sparkles aria-hidden="true" />,
    title: "RTL and dark native",
    description: "Arabic and English, light and dark, from one source of truth.",
  },
];

export interface LoginSplitProps extends Omit<React.ComponentProps<"div">, "onSubmit" | "title"> {
  /** Mark or wordmark rendered above the brand headline, and above the form below `lg`. */
  logo?: React.ReactNode;
  /** Headline of the brand panel. */
  brandTitle?: React.ReactNode;
  /** Supporting line under the brand headline. */
  brandDescription?: React.ReactNode;
  /** Capability rows listed in the brand panel. Ignored when `brandPanel` is given. */
  points?: LoginSplitPoint[];
  /** Replaces the whole default brand-panel body, keeping the layered background. */
  brandPanel?: React.ReactNode;
  /** Small uppercase line above the form title. */
  eyebrow?: React.ReactNode;
  /** Form heading. */
  title?: React.ReactNode;
  /** Sentence under the form heading. */
  subtitle?: React.ReactNode;
  emailLabel?: string;
  emailPlaceholder?: string;
  passwordLabel?: string;
  passwordPlaceholder?: string;
  rememberLabel?: string;
  /** Text of the forgot-password control. */
  forgotLabel?: string;
  /** Destination of the forgot-password link. Omit it to get a button driving `onForgotPassword`. */
  forgotHref?: string;
  /** Called when the forgot-password button is activated. */
  onForgotPassword?: () => void;
  submitLabel?: string;
  /** Blocks the form and spins the submit button. */
  loading?: boolean;
  /** Sign-in failure. Announced as an alert and wired to both fields through `aria-describedby`. */
  error?: React.ReactNode;
  /** Social or SSO buttons, shown under a divider. */
  social?: React.ReactNode;
  /** Line under the form, typically a link to sign up. */
  footer?: React.ReactNode;
  defaultEmail?: string;
  defaultRemember?: boolean;
  /** Receives the entered credentials. The template never navigates by itself. */
  onSubmit?: (values: LoginSplitValues) => void;
}

function LoginSplit({
  className,
  logo,
  brandTitle = "Sign in to the control room.",
  brandDescription = "One design system for every surface you ship.",
  points = defaultPoints,
  brandPanel,
  eyebrow = "Welcome back",
  title = "Sign in",
  subtitle = "Enter your credentials to continue.",
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
}: LoginSplitProps) {
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
      data-slot="login-split"
      className={cn("grid min-h-svh w-full lg:grid-cols-[1.1fr_1fr]", className)}
      {...props}
    >
      {/* First in DOM order, so the grid places it on the inline start in both
          reading directions without any positioning. */}
      <section
        data-slot="login-split-brand"
        aria-label="About this product"
        className={cn(
          "relative isolate hidden flex-col justify-between gap-12 overflow-hidden p-10 lg:flex xl:p-14",
          "bg-neutral-975 text-neutral-50",
        )}
      >
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 -z-10",
            "[background-image:linear-gradient(135deg_in_oklab,color-mix(in_oklab,var(--brand)_45%,var(--neutral-1000))_0%,var(--neutral-1000)_55%,color-mix(in_oklab,var(--brand)_16%,var(--neutral-1000))_100%)]",
          )}
        />
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 -z-10",
            "[background-image:linear-gradient(to_right,color-mix(in_oklab,var(--neutral-0)_8%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--neutral-0)_8%,transparent)_1px,transparent_1px)]",
            "[background-size:56px_56px]",
            "[mask-image:radial-gradient(90%_70%_at_50%_10%,black,transparent)]",
          )}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 start-[-6rem] -z-10 size-[28rem] rounded-full bg-brand-600/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 end-[-4rem] -z-10 size-[24rem] rounded-full bg-brand-400/20 blur-3xl"
        />

        {brandPanel ?? (
          <>
            <div data-slot="login-split-brand-logo" className="flex items-center gap-3">
              {logo}
            </div>

            <div className="flex max-w-xl flex-col gap-6">
              <h2
                data-slot="login-split-brand-title"
                className="font-display text-h1 text-balance uppercase"
              >
                {brandTitle}
              </h2>
              {brandDescription ? (
                <p className="max-w-prose text-body-lg text-pretty text-neutral-300">
                  {brandDescription}
                </p>
              ) : null}

              <ul data-slot="login-split-brand-points" className="mt-4 flex flex-col gap-5">
                {points.map((point, index) => (
                  <li key={index} className="flex items-start gap-4">
                    {point.icon ? (
                      <span
                        aria-hidden="true"
                        className={cn(
                          "flex size-9 shrink-0 items-center justify-center rounded-md",
                          "border border-neutral-0/15 bg-neutral-0/5 text-primary",
                          "[&_svg]:size-4 [&_svg]:shrink-0",
                        )}
                      >
                        {point.icon}
                      </span>
                    ) : null}
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="text-sm font-semibold">{point.title}</span>
                      {point.description ? (
                        <span className="text-sm text-neutral-400">{point.description}</span>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div aria-hidden="true" className="h-px w-24 bg-primary" />
          </>
        )}
      </section>

      <section
        data-slot="login-split-form-panel"
        className="flex items-center justify-center bg-background px-(--gutter) py-12"
      >
        <div className="flex w-full max-w-[400px] flex-col gap-8">
          {logo ? (
            <div data-slot="login-split-form-logo" className="flex items-center gap-3 lg:hidden">
              {logo}
            </div>
          ) : null}

          <header className="flex flex-col gap-2">
            {eyebrow ? (
              <p
                data-slot="login-split-eyebrow"
                className="text-eyebrow font-semibold text-primary uppercase"
              >
                {eyebrow}
              </p>
            ) : null}
            <h1
              data-slot="login-split-title"
              className="font-display text-h2 text-balance uppercase"
            >
              {title}
            </h1>
            {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
          </header>

          <form data-slot="login-split-form" noValidate onSubmit={handleSubmit}>
            <div className="flex flex-col gap-5">
              {error ? (
                <p
                  id={errorId}
                  role="alert"
                  data-slot="login-split-error"
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
                    <a data-slot="login-split-forgot" href={forgotHref} className={forgotClasses}>
                      {forgotLabel}
                    </a>
                  ) : (
                    <button
                      data-slot="login-split-forgot"
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
                    data-slot="login-split-reveal"
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    disabled={loading}
                    aria-label={revealed ? "Hide password" : "Show password"}
                    aria-pressed={revealed}
                    aria-controls={passwordId}
                    // Keep the caret where it was: the default mousedown blurs
                    // the field before the click lands.
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
                <div data-slot="login-split-social" className="flex flex-col gap-4">
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

          {footer ? (
            <p
              data-slot="login-split-footer"
              className="text-center text-sm text-pretty text-muted-foreground"
            >
              {footer}
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}

export { LoginSplit };
