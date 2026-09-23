"use client";

/** One-time-password field whose characters are split across individually styled slots. */
import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { cn } from "../lib/cn";

// Geometry mirrors lucide's `minus`. Inlined because `lucide-react` is not a
// dependency of this package.
function MinusIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M5 12h14" />
    </svg>
  );
}

export type InputOTPProps = React.ComponentProps<typeof OTPInput>;

function InputOTP({ className, containerClassName, ...props }: InputOTPProps) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "flex items-center gap-2 has-[:disabled]:opacity-50",
        containerClassName,
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  );
}

export type InputOTPGroupProps = React.ComponentProps<"div">;

function InputOTPGroup({ className, ...props }: InputOTPGroupProps) {
  return (
    <div data-slot="input-otp-group" className={cn("flex items-center", className)} {...props} />
  );
}

export type InputOTPSlotProps = React.ComponentProps<"div"> & {
  /** Position of this slot inside the OTP value. */
  index: number;
};

function InputOTPSlot({ index, className, ...props }: InputOTPSlotProps) {
  const context = React.useContext(OTPInputContext);
  const slot = context?.slots?.[index];
  const char = slot?.char ?? null;
  const placeholderChar = slot?.placeholderChar ?? null;
  const hasFakeCaret = slot?.hasFakeCaret ?? false;
  const isActive = slot?.isActive ?? false;

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive || undefined}
      className={cn(
        "relative flex h-(--control-h-md) w-9 items-center justify-center border-y border-e border-input text-sm text-foreground",
        "transition-[color,box-shadow,border-color] duration-(--duration-fast) ease-standard outline-none",
        "first:rounded-s-input first:border-s last:rounded-e-input",
        "data-[active]:z-(--z-raised) data-[active]:border-ring data-[active]:ring-2 data-[active]:ring-ring/40",
        "aria-invalid:border-destructive data-[active]:aria-invalid:border-destructive data-[active]:aria-invalid:ring-destructive/30",
        "dark:bg-input/20",
        className,
      )}
      {...props}
    >
      {char ?? placeholderChar}
      {hasFakeCaret ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px bg-foreground motion-safe:animate-pulse" />
        </div>
      ) : null}
    </div>
  );
}

export type InputOTPSeparatorProps = React.ComponentProps<"div">;

function InputOTPSeparator({ className, ...props }: InputOTPSeparatorProps) {
  return (
    <div
      data-slot="input-otp-separator"
      role="separator"
      className={cn("flex items-center text-muted-foreground", className)}
      {...props}
    >
      <MinusIcon className="size-4" />
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot };
