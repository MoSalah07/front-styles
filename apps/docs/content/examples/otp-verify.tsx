"use client";

import { OtpVerify } from "@design-eg/ui";

export default function OtpVerifyExample() {
  return (
    <OtpVerify
      logo={<span className="font-display text-2xl tracking-wide">design-eg</span>}
      eyebrow="Two-factor"
      title="Enter your code"
      destination="nour.hassan@acme.eg"
      length={6}
      resendSeconds={30}
      backHref="#"
      onComplete={(code) => console.info("verify", code)}
      onResend={() => console.info("resend")}
    />
  );
}
