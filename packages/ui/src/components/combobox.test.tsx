import * as React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { runAxe } from "../../test/setup";
import { I18nProvider } from "../lib/i18n";
import { ar } from "../lib/messages/ar";
import {
  Combobox,
  type ComboboxMultipleProps,
  type ComboboxOption,
  type ComboboxSingleProps,
} from "./combobox";
import { Label } from "./label";

const cities: ComboboxOption[] = [
  { value: "cai", label: "Cairo" },
  { value: "alx", label: "Alexandria", keywords: ["Iskandariya"] },
  { value: "lux", label: "Luxor" },
  { value: "asw", label: "Aswan", disabled: true },
];

type LabelledProps = Omit<ComboboxSingleProps, "options"> | Omit<ComboboxMultipleProps, "options">;

function Labelled(props: LabelledProps) {
  return (
    <div>
      <Label htmlFor="city">City</Label>
      <Combobox id="city" options={cities} {...props} />
    </div>
  );
}

describe("Combobox", () => {
  it("renders a closed combobox named by its label, showing the placeholder", () => {
    render(<Labelled />);
    const trigger = screen.getByRole("combobox", { name: "City" });
    expect(trigger.tagName).toBe("BUTTON");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveTextContent("Select an option");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("takes its name from aria-label when there is no label", () => {
    render(<Combobox aria-label="Region" options={cities} />);
    expect(screen.getByRole("combobox", { name: "Region" })).toBeInTheDocument();
  });

  it("opens a searchable list with every option", async () => {
    const user = userEvent.setup();
    render(<Labelled />);
    const trigger = screen.getByRole("combobox", { name: "City" });

    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    const listbox = await screen.findByRole("listbox", { name: "Options" });
    expect(within(listbox).getAllByRole("option")).toHaveLength(4);
    const search = screen.getByRole("combobox", { name: "Search options" });
    expect(search).toHaveFocus();
    expect(search).toHaveAttribute("placeholder", "Search…");
    expect(trigger).toHaveAttribute(
      "aria-controls",
      screen.getByRole("dialog", { name: "Options" }).id,
    );
  });

  it("opens from the keyboard with the arrow keys", async () => {
    const user = userEvent.setup();
    render(<Labelled />);
    screen.getByRole("combobox", { name: "City" }).focus();

    await user.keyboard("{ArrowDown}");

    expect(await screen.findByRole("listbox")).toBeInTheDocument();
  });

  it("filters as the user types, by label and by keyword", async () => {
    const user = userEvent.setup();
    render(<Labelled />);
    await user.click(screen.getByRole("combobox", { name: "City" }));

    await user.keyboard("lux");
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["Luxor"]);

    await user.clear(screen.getByRole("combobox", { name: "Search options" }));
    await user.keyboard("iskan");
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["Alexandria"]);

    await user.keyboard("zzz");
    expect(screen.queryAllByRole("option")).toHaveLength(0);
    expect(screen.getByText("No results found.")).toBeInTheDocument();
  });

  it("selects one value with Enter, closes, and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Labelled onValueChange={onValueChange} />);
    const trigger = screen.getByRole("combobox", { name: "City" });

    await user.click(trigger);
    await user.keyboard("luxor{Enter}");

    expect(onValueChange).toHaveBeenCalledWith("lux");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(trigger).toHaveTextContent("Luxor");
    expect(trigger).toHaveFocus();

    // Reopening marks the choice and has cleared the old query.
    await user.click(trigger);
    expect(screen.getAllByRole("option")).toHaveLength(4);
    expect(screen.getByRole("option", { name: "Luxor" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("option", { name: "Cairo" })).toHaveAttribute("aria-checked", "false");
  });

  it("selects by click, and clears when the chosen option is picked again", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Labelled defaultValue="cai" onValueChange={onValueChange} />);
    const trigger = screen.getByRole("combobox", { name: "City" });
    expect(trigger).toHaveTextContent("Cairo");

    await user.click(trigger);
    await user.click(screen.getByRole("option", { name: "Cairo" }));

    expect(onValueChange).toHaveBeenLastCalledWith("");
    expect(trigger).toHaveTextContent("Select an option");
  });

  it("does not select a disabled option", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Labelled onValueChange={onValueChange} />);

    await user.click(screen.getByRole("combobox", { name: "City" }));
    const aswan = screen.getByRole("option", { name: "Aswan" });
    expect(aswan).toHaveAttribute("aria-disabled", "true");
    await user.click(aswan);

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("follows a controlled value", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = React.useState("alx");
      return (
        <>
          <Combobox aria-label="City" options={cities} value={value} onValueChange={setValue} />
          <output>{value || "none"}</output>
        </>
      );
    }
    render(<Controlled />);
    expect(screen.getByRole("combobox", { name: "City" })).toHaveTextContent("Alexandria");

    await user.click(screen.getByRole("combobox", { name: "City" }));
    await user.click(screen.getByRole("option", { name: "Cairo" }));

    expect(screen.getByRole("status")).toHaveTextContent("cai");
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<Labelled />);
    const trigger = screen.getByRole("combobox", { name: "City" });

    await user.click(trigger);
    expect(await screen.findByRole("listbox")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });

  it("selects several values in multiple mode and keeps the list open", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Labelled multiple onValueChange={onValueChange} />);
    const trigger = screen.getByRole("combobox", { name: "City" });

    await user.click(trigger);
    expect(screen.getByRole("listbox")).toHaveAttribute("aria-multiselectable", "true");
    await user.click(screen.getByRole("option", { name: "Cairo" }));
    await user.click(screen.getByRole("option", { name: "Luxor" }));

    expect(onValueChange).toHaveBeenLastCalledWith(["cai", "lux"]);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Cairo" })).toHaveAttribute("aria-checked", "true");

    // Each pick is a badge with its own remove button; the trigger still
    // carries the whole value as text for assistive technology.
    expect(screen.getByRole("button", { name: "Remove Cairo" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remove Luxor" })).toBeInTheDocument();
    expect(trigger).toHaveTextContent("Cairo and Luxor");

    // Picking a selected option again removes it.
    await user.click(screen.getByRole("option", { name: "Cairo" }));
    expect(onValueChange).toHaveBeenLastCalledWith(["lux"]);
  });

  it("removes a selection from its badge", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Labelled multiple defaultValue={["cai", "alx"]} onValueChange={onValueChange} />);

    await user.click(screen.getByRole("button", { name: "Remove Cairo" }));

    expect(onValueChange).toHaveBeenLastCalledWith(["alx"]);
    expect(screen.queryByRole("button", { name: "Remove Cairo" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remove Alexandria" })).toBeInTheDocument();
  });

  it("collapses to an 'n selected' summary past maxBadges", () => {
    render(<Labelled multiple defaultValue={["cai", "alx", "lux"]} />);
    expect(screen.queryByRole("button", { name: /^Remove/ })).not.toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "City" })).toHaveTextContent("3 selected");
  });

  it("submits its value through hidden inputs when named", () => {
    const { container } = render(
      <form>
        <Combobox
          aria-label="Cities"
          name="cities"
          multiple
          options={cities}
          defaultValue={["cai", "lux"]}
        />
      </form>,
    );
    const form = container.querySelector("form")!;
    expect(new FormData(form).getAll("cities")).toEqual(["cai", "lux"]);
  });

  it("styles the invalid state and blocks a disabled trigger", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Labelled aria-invalid />);
    expect(screen.getByRole("combobox", { name: "City" })).toHaveAttribute("aria-invalid", "true");

    rerender(<Labelled disabled />);
    const trigger = screen.getByRole("combobox", { name: "City" });
    expect(trigger).toBeDisabled();
    await user.click(trigger);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("renders its default strings in Arabic, with the plural summary", async () => {
    const user = userEvent.setup();
    render(
      <I18nProvider locale="ar">
        <Combobox aria-label="المدينة" options={cities} />
        <Combobox
          aria-label="المدن"
          multiple
          options={[...cities, { value: "giz", label: "Giza" }]}
          defaultValue={["cai", "alx", "lux", "giz"]}
        />
        <Combobox aria-label="مدينتان" multiple options={cities} defaultValue={["cai", "lux"]} />
      </I18nProvider>,
    );

    const single = screen.getByRole("combobox", { name: "المدينة" });
    expect(single).toHaveTextContent(ar["combobox.placeholder"] as string);
    // 4 falls in Arabic's "few" category: the counted noun takes its plural form.
    expect(screen.getByRole("combobox", { name: "المدن" })).toHaveTextContent("حُدِّدت 4 عناصر");
    expect(screen.getByRole("button", { name: "إزالة Cairo" })).toBeInTheDocument();

    await user.click(single);
    expect(
      screen.getByRole("combobox", { name: ar["combobox.searchLabel"] as string }),
    ).toHaveAttribute("placeholder", ar["combobox.searchPlaceholder"] as string);
    expect(
      screen.getByRole("listbox", { name: ar["combobox.listLabel"] as string }),
    ).toBeInTheDocument();

    await user.keyboard("zzz");
    expect(screen.getByText(ar["combobox.empty"] as string)).toBeInTheDocument();
  });

  it("has no axe violations, closed or open", async () => {
    const user = userEvent.setup();
    render(<Labelled multiple defaultValue={["cai"]} />);
    expect(await runAxe()).toHaveNoViolations();

    await user.click(screen.getByRole("combobox", { name: "City" }));
    expect(await runAxe()).toHaveNoViolations();
  });
});
