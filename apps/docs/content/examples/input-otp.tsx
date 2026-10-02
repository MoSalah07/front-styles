"use client";

import * as React from "react";
import { REGEXP_ONLY_DIGITS, REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot, Label } from "@design-eg/ui";

function Slots({ from, count, invalid }: { from: number; count: number; invalid?: boolean }) {
  return (
    <InputOTPGroup>
      {Array.from({ length: count }, (_, index) => (
        <InputOTPSlot key={index} index={from + index} aria-invalid={invalid || undefined} />
      ))}
    </InputOTPGroup>
  );
}

function Variant({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="grid content-start gap-3">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint}
    </section>
  );
}

export default function InputOtpExample() {
  const [code, setCode] = React.useState("");
  const [pin, setPin] = React.useState("");
  const [voucher, setVoucher] = React.useState("");
  const [wrong, setWrong] = React.useState("314159");

  return (
    <div className="grid w-full max-w-3xl gap-10 sm:grid-cols-2">
      <Variant
        id="otp-split"
        label="6-digit code"
        hint={
          <p className="text-xs text-muted-foreground" role="status">
            {code.length === 6 ? `Ready to verify ${code}.` : "Two groups of three read faster."}
          </p>
        }
      >
        <InputOTP id="otp-split" maxLength={6} value={code} onChange={setCode}>
          <Slots from={0} count={3} />
          <InputOTPSeparator />
          <Slots from={3} count={3} />
        </InputOTP>
      </Variant>

      <Variant
        id="otp-pin"
        label="4-digit PIN"
        hint={<p className="text-xs text-muted-foreground">Digits only: letters are ignored.</p>}
      >
        <InputOTP
          id="otp-pin"
          maxLength={4}
          pattern={REGEXP_ONLY_DIGITS}
          value={pin}
          onChange={setPin}
        >
          <Slots from={0} count={4} />
        </InputOTP>
      </Variant>

      <Variant
        id="otp-voucher"
        label="Alphanumeric voucher"
        hint={
          <p className="text-xs text-muted-foreground">
            Letters and digits, uppercased as they are typed.
          </p>
        }
      >
        <InputOTP
          id="otp-voucher"
          maxLength={6}
          inputMode="text"
          pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
          value={voucher}
          onChange={(value) => setVoucher(value.toUpperCase())}
        >
          <Slots from={0} count={3} />
          <InputOTPSeparator />
          <Slots from={3} count={3} />
        </InputOTP>
      </Variant>

      <Variant
        id="otp-invalid"
        label="Invalid"
        hint={
          <p id="otp-invalid-message" className="text-xs font-medium text-destructive">
            That code has expired. Request a new one.
          </p>
        }
      >
        <InputOTP
          id="otp-invalid"
          maxLength={6}
          value={wrong}
          aria-invalid
          aria-describedby="otp-invalid-message"
          onChange={setWrong}
        >
          <Slots from={0} count={3} invalid />
          <InputOTPSeparator />
          <Slots from={3} count={3} invalid />
        </InputOTP>
      </Variant>

      <Variant
        id="otp-disabled"
        label="Disabled"
        hint={<p className="text-xs text-muted-foreground">Locked while a code is checked.</p>}
      >
        <InputOTP id="otp-disabled" maxLength={6} value="482" disabled>
          <Slots from={0} count={3} />
          <InputOTPSeparator />
          <Slots from={3} count={3} />
        </InputOTP>
      </Variant>
    </div>
  );
}
