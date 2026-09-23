"use client";

import { ForgotPassword } from "@design-eg/ui";

export default function ForgotPasswordExample() {
  return (
    <ForgotPassword
      logo={<span className="font-display text-2xl tracking-wide">design-eg</span>}
      eyebrow="Account recovery"
      title="Reset your password"
      subtitle="We will send a one-time link to the address on file."
      backHref="#"
      sentDescription={(email) => `The link is on its way to ${email}. It expires in 15 minutes.`}
      onSubmit={(email) => console.info("reset", email)}
    />
  );
}
