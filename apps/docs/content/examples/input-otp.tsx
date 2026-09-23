"use client";

import * as React from "react";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot, Label } from "@design-eg/ui";

export default function InputOtpExample() {
  const [value, setValue] = React.useState("");

  return (
    <div className="space-y-3">
      <Label htmlFor="demo-otp">One-time code</Label>
      <InputOTP id="demo-otp" maxLength={6} value={value} onChange={setValue}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <p className="text-xs text-muted-foreground" role="status">
        {value.length === 6 ? `Ready to verify ${value}.` : "Enter the six digits we emailed you."}
      </p>
    </div>
  );
}
