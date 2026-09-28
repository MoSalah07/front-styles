import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { InstallCommand } from "./install-command";

const writeText = vi.fn<(value: string) => Promise<void>>();

beforeEach(() => {
  writeText.mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText },
    configurable: true,
    writable: true,
  });
  window.localStorage.clear();
});

describe("InstallCommand", () => {
  it("renders one tab per package manager and the npm command first", () => {
    render(<InstallCommand packageName="@design-eg/ui" storageKey={false} />);

    expect(screen.getByRole("tablist", { name: "Package manager" })).toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(4);
    expect(screen.getByRole("tabpanel")).toHaveTextContent("npm install @design-eg/ui");
  });

  it("rewrites the command for the selected manager", async () => {
    render(<InstallCommand packageName="@design-eg/ui" dev storageKey={false} />);

    await userEvent.click(screen.getByRole("tab", { name: "pnpm" }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent("pnpm add -D @design-eg/ui");

    await userEvent.click(screen.getByRole("tab", { name: "bun" }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent("bun add -d @design-eg/ui");
  });

  it("uses the exec form for a one-off command", async () => {
    render(<InstallCommand command="@design-eg/cli add button" storageKey={false} />);

    expect(screen.getByRole("tabpanel")).toHaveTextContent("npx @design-eg/cli add button");
    await userEvent.click(screen.getByRole("tab", { name: "yarn" }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent("yarn dlx @design-eg/cli add button");
  });

  it("copies the command of the visible tab", async () => {
    render(<InstallCommand packageName="@design-eg/ui" storageKey={false} toast={false} />);

    await userEvent.click(screen.getByRole("tab", { name: "pnpm" }));
    await userEvent.click(screen.getByRole("button", { name: "Copy install command" }));

    expect(writeText).toHaveBeenCalledWith("pnpm add @design-eg/ui");
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Copied"));
  });

  it("remembers the chosen manager", async () => {
    const { unmount } = render(<InstallCommand packageName="@design-eg/ui" storageKey="pm-test" />);

    await userEvent.click(screen.getByRole("tab", { name: "yarn" }));
    expect(window.localStorage.getItem("pm-test")).toBe("yarn");
    unmount();

    render(<InstallCommand packageName="@design-eg/ui" storageKey="pm-test" />);
    await waitFor(() =>
      expect(screen.getByRole("tabpanel")).toHaveTextContent("yarn add @design-eg/ui"),
    );
  });

  it("honours a per-manager override", () => {
    render(
      <InstallCommand
        packageName="@design-eg/ui"
        commands={{ npm: "npm i @design-eg/ui --legacy-peer-deps" }}
        storageKey={false}
      />,
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent(
      "npm i @design-eg/ui --legacy-peer-deps",
    );
  });
});
