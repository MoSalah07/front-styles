"use client";

import { NotFoundPage } from "@design-eg/ui";

export default function ErrorPagesExample() {
  return (
    <NotFoundPage
      homeHref="/"
      reference="req_01HQ7Z9K3R"
      onGoBack={() => console.info("go back")}
    />
  );
}
