"use client";

import { Register } from "@design-eg/ui";

export default function RegisterExample() {
  return (
    <Register
      logo={<span className="font-display text-2xl tracking-wide">design-eg</span>}
      eyebrow="Get started"
      title="Create your account"
      subtitle="Fourteen days of the Team plan, no card required."
      termsLabel={
        <>
          I agree to the{" "}
          <a className="underline underline-offset-4" href="#">
            terms
          </a>{" "}
          and the{" "}
          <a className="underline underline-offset-4" href="#">
            privacy policy
          </a>
          .
        </>
      }
      footer={
        <>
          Already have an account?{" "}
          <a className="underline underline-offset-4" href="#">
            Sign in
          </a>
        </>
      }
      onSubmit={(values) => console.info("register", values)}
    />
  );
}
