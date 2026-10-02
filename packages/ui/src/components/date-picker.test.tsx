import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { runAxe } from "../../test/setup";
import { I18nProvider } from "../lib/i18n";
import { getMessages } from "../lib/messages";
import { DatePicker } from "./date-picker";
import { Label } from "./label";

// Fixed dates only, never "today".
const JAN_2026 = new Date(2026, 0, 1);

function fullDate(date: Date, locale = "en") {
  return new Intl.DateTimeFormat(locale, { calendar: "gregory", dateStyle: "full" }).format(date);
}

function mediumDate(date: Date, locale = "en") {
  return new Intl.DateTimeFormat(locale, { calendar: "gregory", dateStyle: "medium" }).format(date);
}

function hiddenInput(container: HTMLElement, name: string) {
  return container.querySelector<HTMLInputElement>(`input[type="hidden"][name="${name}"]`);
}

describe("DatePicker", { timeout: 20_000 }, () => {
  it("takes its name from a Label and opens a labelled calendar dialog", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Label htmlFor="start">Start date</Label>
        <DatePicker id="start" defaultMonth={JAN_2026} />
      </>,
    );

    const trigger = screen.getByRole("button", { name: "Start date" });
    expect(trigger).toHaveTextContent("Pick a date");
    expect(trigger).toHaveAttribute("data-placeholder");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(trigger);

    const dialog = await screen.findByRole("dialog", { name: "Choose a date" });
    expect(within(dialog).getByRole("grid", { name: "January 2026" })).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    // Focus goes into the grid, not onto the month buttons.
    expect(document.activeElement).toHaveAttribute("data-slot", "calendar-day");
  });

  it("has no axe violations while open", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Label htmlFor="start">Start date</Label>
        <DatePicker id="start" defaultValue={new Date(2026, 0, 15)} />
      </>,
    );

    await user.click(screen.getByRole("button", { name: "Start date" }));
    await screen.findByRole("dialog");
    await expect(await runAxe()).toHaveNoViolations();
  });

  it("picks a date, shows it formatted and posts it as ISO", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(
      <>
        <Label htmlFor="start">Start date</Label>
        <DatePicker id="start" name="start" defaultMonth={JAN_2026} onValueChange={onValueChange} />
      </>,
    );

    expect(hiddenInput(container, "start")).toHaveValue("");

    const trigger = screen.getByRole("button", { name: "Start date" });
    await user.click(trigger);
    await user.click(await screen.findByRole("button", { name: fullDate(new Date(2026, 0, 15)) }));

    expect(onValueChange).toHaveBeenCalledWith(new Date(2026, 0, 15));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveTextContent(mediumDate(new Date(2026, 0, 15)));
    expect(trigger).not.toHaveAttribute("data-placeholder");
    expect(trigger).toHaveAccessibleName("Start date");
    expect(trigger).toHaveAccessibleDescription(mediumDate(new Date(2026, 0, 15)));
    expect(trigger).toHaveFocus();
    expect(hiddenInput(container, "start")).toHaveValue("2026-01-15");
  });

  it("can be driven entirely from the keyboard", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <DatePicker aria-label="Due date" name="due" defaultValue={new Date(2026, 0, 15)} />,
    );

    await user.tab();
    expect(screen.getByRole("button", { name: "Due date" })).toHaveFocus();
    await user.keyboard("{Enter}");

    // The selected day takes focus when the calendar opens on its month.
    const selected = await screen.findByRole("button", { name: fullDate(new Date(2026, 0, 15)) });
    expect(selected).toHaveFocus();

    await user.keyboard("{ArrowRight}{Enter}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(hiddenInput(container, "due")).toHaveValue("2026-01-16");
  });

  it("respects min, max and disabledDates", async () => {
    const user = userEvent.setup();
    render(
      <DatePicker
        aria-label="Delivery"
        defaultMonth={JAN_2026}
        min={new Date(2026, 0, 5)}
        max={new Date(2026, 0, 25)}
        disabledDates={(date) => date.getDay() === 0}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Delivery" }));
    await screen.findByRole("dialog");
    expect(screen.getByRole("button", { name: fullDate(new Date(2026, 0, 4)) })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(screen.getByRole("button", { name: fullDate(new Date(2026, 0, 11)) })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("stays open for a range until both ends are picked", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(
      <>
        <Label htmlFor="stay">Stay</Label>
        <DatePicker
          id="stay"
          mode="range"
          name="stay"
          defaultMonth={JAN_2026}
          onValueChange={onValueChange}
        />
      </>,
    );

    const trigger = screen.getByRole("button", { name: "Stay" });
    expect(trigger).toHaveTextContent("Pick a date range");
    await user.click(trigger);

    const dialog = await screen.findByRole("dialog", { name: "Choose a date range" });
    expect(within(dialog).getAllByRole("grid")).toHaveLength(2);

    await user.click(screen.getByRole("button", { name: fullDate(new Date(2026, 0, 5)) }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(trigger).toHaveTextContent(`${mediumDate(new Date(2026, 0, 5))} –`);
    expect(hiddenInput(container, "stay")).toHaveValue("");

    await user.click(screen.getByRole("button", { name: fullDate(new Date(2026, 1, 3)) }));
    expect(onValueChange).toHaveBeenLastCalledWith({
      from: new Date(2026, 0, 5),
      to: new Date(2026, 1, 3),
    });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    const expected = new Intl.DateTimeFormat("en", {
      calendar: "gregory",
      dateStyle: "medium",
    }).formatRange(new Date(2026, 0, 5), new Date(2026, 1, 3));
    // Compared raw: formatRange puts thin spaces around the dash, which
    // toHaveTextContent would normalise on one side only.
    expect(trigger.textContent).toBe(expected);
    expect(hiddenInput(container, "stay")).toHaveValue("2026-01-05/2026-02-03");
  });

  it("disables the trigger and the hidden input together", () => {
    const { container } = render(
      <DatePicker aria-label="Locked" name="locked" disabled defaultValue={JAN_2026} />,
    );

    expect(screen.getByRole("button", { name: "Locked" })).toBeDisabled();
    expect(hiddenInput(container, "locked")).toBeDisabled();
    expect(hiddenInput(container, "locked")).toHaveValue("2026-01-01");
  });

  it("renders its defaults in Arabic", async () => {
    const user = userEvent.setup();
    const messages = getMessages("ar");
    render(
      <I18nProvider locale="ar">
        <DatePicker aria-label="تاريخ البدء" defaultMonth={JAN_2026} />
      </I18nProvider>,
    );

    const trigger = screen.getByRole("button", { name: "تاريخ البدء" });
    expect(trigger).toHaveTextContent(messages["datePicker.placeholder"] as string);

    await user.click(trigger);
    expect(
      await screen.findByRole("dialog", { name: messages["datePicker.dialogLabel"] as string }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "الشهر السابق" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: fullDate(new Date(2026, 0, 15), "ar") }));
    expect(trigger).toHaveTextContent(mediumDate(new Date(2026, 0, 15), "ar"));
  });
});
