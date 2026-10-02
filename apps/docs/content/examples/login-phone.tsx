"use client";

import * as React from "react";
import { LoginPhone } from "@design-eg/ui";

/** The demo accepts one code, so the wrong-code state is easy to see. */
const DEMO_CODE = "246810";

export default function LoginPhoneExample() {
  const [codeError, setCodeError] = React.useState<string>();

  return (
    <LoginPhone
      logo={<span className="font-display text-2xl tracking-wide">design-eg</span>}
      codeError={codeError}
      alternateActions={
        <a className="font-medium text-primary underline-offset-4 hover:underline" href="#">
          Sign in with email instead
        </a>
      }
      onRequestCode={() => setCodeError(undefined)}
      onStepChange={() => setCodeError(undefined)}
      onVerify={(code) =>
        setCodeError(
          code === DEMO_CODE
            ? undefined
            : `That code did not match. The demo code is ${DEMO_CODE}.`,
        )
      }
    />
  );
}
