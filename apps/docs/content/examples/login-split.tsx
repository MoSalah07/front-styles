"use client";

import { Gauge, Languages, ShieldCheck } from "lucide-react";
import { Button, LoginSplit } from "@design-eg/ui";

export default function LoginSplitExample() {
  return (
    <LoginSplit
      logo={<span className="font-display text-2xl tracking-wide">design-eg</span>}
      brandTitle="Ship the whole product, not just the buttons."
      brandDescription="Tokens, primitives, blocks and page templates that already agree with each other."
      points={[
        {
          icon: <ShieldCheck className="size-4" />,
          title: "Accessible by default",
          description: "Radix keyboard and ARIA behaviour under every control.",
        },
        {
          icon: <Languages className="size-4" />,
          title: "RTL-first",
          description: "Logical properties everywhere, plus a tuned Arabic stack.",
        },
        {
          icon: <Gauge className="size-4" />,
          title: "Token-driven",
          description: "One JSON seed compiles into every brand and both modes.",
        },
      ]}
      eyebrow="Welcome back"
      title="Sign in"
      subtitle="Use the account your team invited."
      forgotHref="#"
      social={
        <>
          <Button variant="outline" className="w-full">
            Continue with Google
          </Button>
          <Button variant="outline" className="w-full">
            Continue with GitHub
          </Button>
        </>
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
