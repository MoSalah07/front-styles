"use client";

import { Button, RegisterWizard } from "@design-eg/ui";

export default function RegisterWizardExample() {
  return (
    <RegisterWizard
      logo={<span className="font-display text-2xl tracking-wide">design-eg</span>}
      defaultValues={{ email: "nour@example.com" }}
      doneAction={
        <Button asChild>
          <a href="#">Open your workspace</a>
        </Button>
      }
      footer={
        <>
          Already have an account?{" "}
          <a className="underline underline-offset-4" href="#">
            Sign in
          </a>
        </>
      }
    />
  );
}
