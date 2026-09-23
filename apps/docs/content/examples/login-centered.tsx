"use client";

import { Button, LoginCentered } from "@design-eg/ui";

export default function LoginCenteredExample() {
  return (
    <LoginCentered
      logo={<span className="font-display text-2xl tracking-wide">design-eg</span>}
      eyebrow="Welcome back"
      title="Sign in to your workspace"
      subtitle="We will email you a receipt for every new device."
      forgotHref="#"
      social={
        <Button variant="outline" className="w-full">
          Continue with Google
        </Button>
      }
      footer={
        <>
          No account yet?{" "}
          <a className="underline underline-offset-4" href="#">
            Create one
          </a>
        </>
      }
      onSubmit={(values) => console.info("sign in", values)}
    />
  );
}
