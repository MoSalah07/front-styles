import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CopyButton } from "./copy-button";

const writeText = vi.fn<(value: string) => Promise<void>>();

beforeEach(() => {
  writeText.mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText },
    configurable: true,
    writable: true,
  });
});

describe("CopyButton", () => {
  it("renders an icon-only button that names itself", () => {
    render(<CopyButton value="npm install @design-eg/ui" />);
    expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
  });

  it("takes its accessible name from the visible label when it has one", () => {
    render(<CopyButton value="token">Copy token</CopyButton>);
    expect(screen.getByRole("button", { name: "Copy token" })).toBeInTheDocument();
  });

  it("writes the value to the clipboard and reports success", async () => {
    const onCopy = vi.fn();
    render(
      <CopyButton value="npm install @design-eg/ui" copyLabel="Copy command" onCopy={onCopy} />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Copy command" }));

    expect(writeText).toHaveBeenCalledWith("npm install @design-eg/ui");
    expect(onCopy).toHaveBeenCalledWith("npm install @design-eg/ui");
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Copied"));
    expect(screen.getByRole("button", { name: "Copy command" })).toHaveAttribute(
      "data-copied",
      "true",
    );
  });

  it("swaps the visible label while the copy is fresh", async () => {
    render(
      <CopyButton value="token" copiedLabel="Copied!">
        Copy token
      </CopyButton>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Copy token" }));
    await waitFor(() => expect(screen.getByRole("button")).toHaveTextContent("Copied!"));
  });

  it("resolves a function value at click time", async () => {
    let clicks = 0;
    render(<CopyButton value={() => `call-${++clicks}`} />);

    await userEvent.click(screen.getByRole("button", { name: "Copy" }));
    expect(writeText).toHaveBeenLastCalledWith("call-1");

    await userEvent.click(screen.getByRole("button", { name: "Copy" }));
    expect(writeText).toHaveBeenLastCalledWith("call-2");
  });

  it("reports a refused clipboard instead of claiming success", async () => {
    writeText.mockRejectedValue(new Error("denied"));
    const onCopyError = vi.fn();
    render(<CopyButton value="token" onCopyError={onCopyError} />);

    await userEvent.click(screen.getByRole("button", { name: "Copy" }));

    await waitFor(() => expect(onCopyError).toHaveBeenCalled());
    expect(screen.getByRole("button", { name: "Copy" })).not.toHaveAttribute("data-copied");
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });
});
