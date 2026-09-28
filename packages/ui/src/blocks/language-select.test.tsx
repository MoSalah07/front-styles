import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageSelect } from "./language-select";
import { LOCALE_STORAGE_KEY } from "../hooks/use-locale";

/** The hook writes to `<html>`, so one test must not colour the next. */
beforeEach(() => {
  localStorage.clear();
  document.documentElement.lang = "en";
  document.documentElement.dir = "ltr";
});

describe("LanguageSelect", () => {
  it("renders a trigger naming the current language", () => {
    render(<LanguageSelect />);
    expect(screen.getByRole("button", { name: "Language: English" })).toBeInTheDocument();
  });

  it("lists every language in its own script", async () => {
    const user = userEvent.setup();
    render(<LanguageSelect />);

    await user.click(screen.getByRole("button", { name: /Language/ }));

    expect(await screen.findByRole("menu")).toBeInTheDocument();
    expect(screen.getByRole("menuitemradio", { name: /العربية/ })).toBeInTheDocument();
    expect(screen.getByRole("menuitemradio", { name: /English/ })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("switches the document language and direction", async () => {
    const user = userEvent.setup();
    const onLocaleChange = vi.fn();
    render(<LanguageSelect onLocaleChange={onLocaleChange} />);

    await user.click(screen.getByRole("button", { name: /Language/ }));
    await user.click(await screen.findByRole("menuitemradio", { name: /العربية/ }));

    expect(onLocaleChange).toHaveBeenCalledWith(expect.objectContaining({ code: "ar" }));
    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe("ar");
  });

  it("starts from the remembered language", () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, "ar");
    render(<LanguageSelect />);
    expect(screen.getByRole("button", { name: "Language: Arabic" })).toBeInTheDocument();
  });

  it("takes a custom list and derives the direction from the tag", async () => {
    const user = userEvent.setup();
    render(
      <LanguageSelect
        locales={[
          { code: "fr", nativeName: "Français", englishName: "French" },
          { code: "he", nativeName: "עברית", englishName: "Hebrew" },
        ]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Language: French" }));
    await user.click(await screen.findByRole("menuitemradio", { name: /עברית/ }));

    expect(document.documentElement.dir).toBe("rtl");
  });
});
