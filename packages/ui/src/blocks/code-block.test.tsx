import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CodeBlock } from "./code-block";

const writeText = vi.fn<(value: string) => Promise<void>>();
const CODE = "const answer = 42;\nexport { answer };";

beforeEach(() => {
  writeText.mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText },
    configurable: true,
    writable: true,
  });
});

describe("CodeBlock", () => {
  it("renders the code and its label", () => {
    render(<CodeBlock code={CODE} label="answer.ts" />);
    expect(screen.getByText("answer.ts")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy code" })).toBeInTheDocument();
  });

  it("copies the source verbatim", async () => {
    render(<CodeBlock code={CODE} toast={false} />);

    await userEvent.click(screen.getByRole("button", { name: "Copy code" }));

    expect(writeText).toHaveBeenCalledWith(CODE);
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Copied"));
  });

  it("keeps line numbers out of the clipboard", async () => {
    render(<CodeBlock code={CODE} lineNumbers toast={false} />);

    await userEvent.click(screen.getByRole("button", { name: "Copy code" }));

    expect(writeText).toHaveBeenCalledWith(CODE);
    expect(screen.getByText("2")).toHaveAttribute("aria-hidden", "true");
  });
});
