import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeSelect } from "./theme-select";
import { THEME_STORAGE_KEY } from "../hooks/use-theme";

/** Both the hook and the component read `<html>`, so it has to start clean. */
beforeEach(() => {
  localStorage.clear();
  const root = document.documentElement;
  root.className = "";
  root.removeAttribute("data-theme");
  root.removeAttribute("data-theme-choice");
  root.style.colorScheme = "";
});

describe("ThemeSelect", () => {
  it("renders a trigger naming the current mode", () => {
    render(<ThemeSelect />);
    expect(screen.getByRole("button", { name: "Theme: System" })).toBeInTheDocument();
  });

  it("opens the three modes as a single radio group", async () => {
    const user = userEvent.setup();
    render(<ThemeSelect />);

    await user.click(screen.getByRole("button", { name: /Theme/ }));

    expect(await screen.findByRole("menu")).toBeInTheDocument();
    expect(screen.getAllByRole("menuitemradio")).toHaveLength(3);
    expect(screen.getByRole("menuitemradio", { name: /System/ })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("applies and remembers the chosen mode", async () => {
    const user = userEvent.setup();
    const onThemeChange = vi.fn();
    render(<ThemeSelect onThemeChange={onThemeChange} />);

    await user.click(screen.getByRole("button", { name: /Theme/ }));
    await user.click(await screen.findByRole("menuitemradio", { name: "Dark" }));

    expect(onThemeChange).toHaveBeenCalledWith("dark");
    expect(document.documentElement).toHaveClass("dark");
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    expect(screen.getByRole("button", { name: "Theme: Dark" })).toBeInTheDocument();
  });

  it("starts from the remembered mode", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "light");
    render(<ThemeSelect />);
    expect(screen.getByRole("button", { name: "Theme: Light" })).toBeInTheDocument();
  });

  it("keeps an accessible name when it collapses to an icon", () => {
    render(<ThemeSelect variant="icon" />);
    const trigger = screen.getByRole("button", { name: "Theme: System" });
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveTextContent("");
  });

  it("translates every visible string", async () => {
    const user = userEvent.setup();
    render(
      <ThemeSelect labels={{ trigger: "المظهر", light: "فاتح", dark: "داكن", system: "النظام" }} />,
    );

    await user.click(screen.getByRole("button", { name: "المظهر: النظام" }));
    expect(await screen.findByRole("menuitemradio", { name: "فاتح" })).toBeInTheDocument();
  });
});
