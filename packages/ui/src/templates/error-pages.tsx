"use client";

/** Full-page error screens: a 404 and a 500, both built on one shared layout with an oversized display code, a message and recovery actions. */
import * as React from "react";
import { ArrowLeft, House, RotateCw } from "lucide-react";
import { Button } from "../components/button";
import { cn } from "../lib/cn";
import { useT } from "../lib/i18n";

export interface ErrorPageProps extends Omit<React.ComponentProps<"div">, "title"> {
  /** Oversized display code, such as `404`. */
  code?: React.ReactNode;
  /** Small uppercase line above the heading. */
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Text of the primary action. */
  homeLabel?: string;
  /** Destination of the primary action. Defaults to the site root. */
  homeHref?: string;
  onGoHome?: () => void;
  /** Text of the back action. Pass `showBack={false}` to drop it. */
  backLabel?: string;
  onGoBack?: () => void;
  showBack?: boolean;
  /** Retry action. Rendered only when `onRetry` is given. */
  retryLabel?: string;
  onRetry?: () => void;
  /** Reference shown under the actions, such as a request id. */
  reference?: React.ReactNode;
  /** Extra content under the actions. */
  children?: React.ReactNode;
}

/** Shared chrome for the error screens: layered backdrop, display code, copy and actions. */
function ErrorPageLayout({
  className,
  code,
  eyebrow,
  title,
  description,
  homeLabel: homeLabelProp,
  homeHref = "/",
  onGoHome,
  backLabel: backLabelProp,
  onGoBack,
  showBack = true,
  retryLabel: retryLabelProp,
  onRetry,
  reference,
  children,
  ...props
}: ErrorPageProps) {
  const t = useT();
  const homeLabel = homeLabelProp ?? t("errorPages.home");
  const backLabel = backLabelProp ?? t("errorPages.back");
  const retryLabel = retryLabelProp ?? t("errorPages.retry");

  return (
    <div
      data-slot="error-page"
      className={cn(
        "relative isolate flex min-h-svh w-full flex-col items-center justify-center overflow-hidden",
        "bg-background px-(--gutter) py-16 text-center",
        className,
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 z-(--z-below)",
          "[background-image:linear-gradient(to_right,color-mix(in_oklab,var(--foreground)_6%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--foreground)_6%,transparent)_1px,transparent_1px)]",
          "[background-size:64px_64px]",
          "[mask-image:radial-gradient(65%_55%_at_50%_45%,black,transparent)]",
        )}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute start-1/2 top-1/3 z-(--z-below) size-[34rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl rtl:translate-x-1/2"
      />

      <div className="flex max-w-xl flex-col items-center gap-6">
        {code ? (
          <p
            data-slot="error-page-code"
            className={cn(
              "font-display text-[clamp(6rem,22vw,13rem)] leading-none font-bold tracking-tighter",
              "bg-linear-to-b from-foreground to-foreground/25 bg-clip-text text-transparent",
              "tabular-nums select-none",
            )}
          >
            {code}
          </p>
        ) : null}

        {eyebrow ? (
          <p
            data-slot="error-page-eyebrow"
            className="text-eyebrow font-semibold text-primary uppercase"
          >
            {eyebrow}
          </p>
        ) : null}

        <h1 data-slot="error-page-title" className="font-display text-h2 text-balance uppercase">
          {title}
        </h1>

        {description ? (
          <p className="max-w-prose text-body-lg text-pretty text-muted-foreground">
            {description}
          </p>
        ) : null}

        <div
          data-slot="error-page-actions"
          className="mt-2 flex flex-wrap items-center justify-center gap-3"
        >
          {onRetry ? (
            <Button size="lg" onClick={onRetry}>
              <RotateCw aria-hidden="true" />
              {retryLabel}
            </Button>
          ) : null}

          {/* Slot takes exactly one child, so the link and the plain button are
              two separate branches rather than a conditional inside one. */}
          {onGoHome ? (
            <Button variant={onRetry ? "outline" : "default"} size="lg" onClick={onGoHome}>
              <House aria-hidden="true" />
              {homeLabel}
            </Button>
          ) : (
            <Button asChild variant={onRetry ? "outline" : "default"} size="lg">
              <a href={homeHref}>
                <House aria-hidden="true" />
                {homeLabel}
              </a>
            </Button>
          )}

          {showBack ? (
            <Button
              variant="ghost"
              size="lg"
              onClick={() => {
                if (onGoBack) {
                  onGoBack();
                  return;
                }
                if (typeof window !== "undefined") window.history.back();
              }}
            >
              <ArrowLeft aria-hidden="true" className="rtl:-scale-x-100" />
              {backLabel}
            </Button>
          ) : null}
        </div>

        {reference ? (
          <p data-slot="error-page-reference" className="text-caption text-muted-foreground">
            {reference}
          </p>
        ) : null}

        {children}
      </div>
    </div>
  );
}

/** Page shown when a route does not resolve. */
function NotFoundPage({
  code = "404",
  eyebrow: eyebrowProp,
  title: titleProp,
  description: descriptionProp,
  ...props
}: ErrorPageProps) {
  const t = useT();
  const eyebrow = eyebrowProp ?? t("errorPages.notFoundEyebrow");
  const title = titleProp ?? t("errorPages.notFoundTitle");
  const description = descriptionProp ?? t("errorPages.notFoundDescription");

  return (
    <ErrorPageLayout
      data-slot="not-found-page"
      code={code}
      eyebrow={eyebrow}
      title={title}
      description={description}
      {...props}
    />
  );
}

/** Page shown when the server fails, with a retry action alongside the usual escapes. */
function ServerErrorPage({
  code = "500",
  eyebrow: eyebrowProp,
  title: titleProp,
  description: descriptionProp,
  onRetry,
  ...props
}: ErrorPageProps) {
  const t = useT();
  const eyebrow = eyebrowProp ?? t("errorPages.serverErrorEyebrow");
  const title = titleProp ?? t("errorPages.serverErrorTitle");
  const description = descriptionProp ?? t("errorPages.serverErrorDescription");

  return (
    <ErrorPageLayout
      data-slot="server-error-page"
      code={code}
      eyebrow={eyebrow}
      title={title}
      description={description}
      onRetry={onRetry ?? (() => window.location.reload())}
      {...props}
    />
  );
}

export { NotFoundPage, ServerErrorPage, ErrorPageLayout };
