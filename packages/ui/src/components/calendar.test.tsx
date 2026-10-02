import * as React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { runAxe } from "../../test/setup";
import { I18nProvider } from "../lib/i18n";
import { getMessages } from "../lib/messages";
import { Calendar, type DateRange } from "./calendar";

// Fixed dates only: January 2026 starts on a Thursday and ends on a Saturday.
const JAN_2026 = new Date(2026, 0, 1);
const TODAY = new Date(2026, 0, 20);

function fullDate(date: Date, locale = "en") {
  return new Intl.DateTimeFormat(locale, { calendar: "gregory", dateStyle: "full" }).format(date);
}

function day(date: number, month = 0, year = 2026) {
  return screen.getByRole("button", { name: fullDate(new Date(year, month, date)) });
}

function cellOf(element: HTMLElement) {
  return element.closest('[role="gridcell"]');
}

/*
 * The keyboard tests track focus by the ISO date each day carries rather than
 * by role and name: computing accessible names for a whole grid on every
 * keystroke is what makes jsdom slow, and the names are covered above.
 */
function dayButton(iso: string) {
  const button = document.querySelector<HTMLElement>(
    `[data-slot="calendar-day"][data-day="${iso}"]:not([data-outside])`,
  );
  if (!button) throw new Error(`no day ${iso} in the grid`);
  return button;
}

function focusedDay() {
  return document.activeElement?.getAttribute("data-day");
}

describe("Calendar", { timeout: 20_000 }, () => {
  it("renders the month grid with the locale's weekday headers", () => {
    render(<Calendar defaultMonth={JAN_2026} today={TODAY} />);

    const grid = screen.getByRole("grid", { name: "January 2026" });
    const headers = within(grid).getAllByRole("columnheader");
    // English starts the week on Sunday.
    expect(headers.map((header) => header.textContent)).toEqual([
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
    ]);
    expect(headers[0]).toHaveAccessibleName("Sunday");
    expect(headers[0]).toHaveAttribute("abbr", "Sunday");
    // 28 December 2025 to 31 January 2026: five full weeks.
    expect(within(grid).getAllByRole("gridcell")).toHaveLength(35);
    expect(day(20)).toHaveAttribute("aria-current", "date");
    expect(day(28, 11, 2025)).toHaveAttribute("data-outside");
  });

  it("honours an explicit weekStartsOn", () => {
    render(<Calendar defaultMonth={JAN_2026} weekStartsOn={1} />);

    const headers = screen.getAllByRole("columnheader");
    expect(headers[0]).toHaveAccessibleName("Monday");
    expect(headers[6]).toHaveAccessibleName("Sunday");
    const firstCell = screen.getAllByRole("gridcell")[0]!;
    expect(within(firstCell).getByRole("button")).toHaveAccessibleName(
      fullDate(new Date(2025, 11, 29)),
    );
  });

  it("names the month buttons and moves between months", async () => {
    const user = userEvent.setup();
    const onMonthChange = vi.fn();
    render(<Calendar defaultMonth={JAN_2026} onMonthChange={onMonthChange} />);

    const previous = screen.getByRole("button", { name: "Previous month" });
    const next = screen.getByRole("button", { name: "Next month" });

    await user.click(next);
    expect(screen.getByRole("grid", { name: "February 2026" })).toBeInTheDocument();
    expect(onMonthChange).toHaveBeenLastCalledWith(new Date(2026, 1, 1));

    await user.click(previous);
    await user.click(previous);
    expect(screen.getByRole("grid", { name: "December 2025" })).toBeInTheDocument();
    expect(onMonthChange).toHaveBeenLastCalledWith(new Date(2025, 11, 1));
  });

  it("selects a day on click", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Calendar defaultMonth={JAN_2026} onSelect={onSelect} />);

    await user.click(day(15));

    expect(onSelect).toHaveBeenCalledWith(new Date(2026, 0, 15));
    expect(cellOf(day(15))).toHaveAttribute("aria-selected", "true");
    expect(day(15)).toHaveAttribute("data-selected");
    expect(cellOf(day(14))).not.toHaveAttribute("aria-selected");
  });

  it("moves focus by day and week with the arrows, Home and End", async () => {
    const user = userEvent.setup();
    render(<Calendar defaultMonth={JAN_2026} today={TODAY} />);

    // Previous, next, then the grid: today is the one tabbable day.
    await user.tab();
    await user.tab();
    await user.tab();
    expect(day(20)).toHaveFocus();
    expect(document.querySelectorAll('[data-slot="calendar-day"][tabindex="0"]')).toHaveLength(1);

    await user.keyboard("{ArrowRight}");
    expect(focusedDay()).toBe("2026-01-21");
    await user.keyboard("{ArrowDown}");
    expect(focusedDay()).toBe("2026-01-28");
    await user.keyboard("{ArrowLeft}");
    expect(focusedDay()).toBe("2026-01-27");
    await user.keyboard("{ArrowUp}");
    expect(focusedDay()).toBe("2026-01-20");
    await user.keyboard("{Home}");
    expect(focusedDay()).toBe("2026-01-18");
    await user.keyboard("{End}");
    expect(focusedDay()).toBe("2026-01-24");
    expect(document.activeElement).toHaveAttribute("tabindex", "0");
  });

  it("moves focus across month and year boundaries", async () => {
    const user = userEvent.setup();
    render(<Calendar defaultMonth={JAN_2026} />);

    dayButton("2026-01-31").focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("grid", { name: "February 2026" })).toBeInTheDocument();
    expect(focusedDay()).toBe("2026-02-01");
    expect(document.activeElement).toHaveAttribute("tabindex", "0");

    await user.keyboard("{PageUp}");
    expect(screen.getByRole("grid", { name: "January 2026" })).toBeInTheDocument();
    expect(focusedDay()).toBe("2026-01-01");

    await user.keyboard("{Shift>}{PageDown}{/Shift}");
    expect(screen.getByRole("grid", { name: "January 2027" })).toBeInTheDocument();
    expect(focusedDay()).toBe("2027-01-01");

    // A month jump from the 31st lands on the last day of a shorter month.
    dayButton("2027-01-31").focus();
    await user.keyboard("{PageDown}");
    expect(focusedDay()).toBe("2027-02-28");
  });

  it("follows the visual direction of the arrows in RTL", async () => {
    const user = userEvent.setup();
    render(
      <div dir="rtl">
        <Calendar defaultMonth={JAN_2026} />
      </div>,
    );

    dayButton("2026-01-20").focus();
    await user.keyboard("{ArrowLeft}");
    expect(focusedDay()).toBe("2026-01-21");
    await user.keyboard("{ArrowRight}{ArrowRight}");
    expect(focusedDay()).toBe("2026-01-19");
  });

  it("keeps disabled days and days outside min/max from being selected", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <Calendar
        defaultMonth={JAN_2026}
        min={new Date(2026, 0, 5)}
        max={new Date(2026, 0, 25)}
        disabled={(date) => date.getDay() === 0}
        onSelect={onSelect}
      />,
    );

    // 11 January 2026 is a Sunday.
    expect(day(11)).toHaveAttribute("aria-disabled", "true");
    await user.click(day(11));
    day(11).focus();
    await user.keyboard("{Enter}");
    expect(onSelect).not.toHaveBeenCalled();
    expect(cellOf(day(11))).not.toHaveAttribute("aria-selected");

    expect(day(4)).toHaveAttribute("aria-disabled", "true");
    expect(day(26)).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByRole("button", { name: "Previous month" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(screen.getByRole("button", { name: "Next month" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );

    // The keyboard stops at the bounds instead of wandering past them.
    day(6).focus();
    await user.keyboard("{ArrowUp}");
    expect(day(5)).toHaveFocus();

    await user.click(day(12));
    expect(onSelect).toHaveBeenCalledWith(new Date(2026, 0, 12));
  });

  it("selects a range from and to", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    function Controlled() {
      const [range, setRange] = React.useState<DateRange | undefined>();
      return (
        <Calendar
          mode="range"
          defaultMonth={JAN_2026}
          selected={range}
          onSelect={(next) => {
            setRange(next);
            onSelect(next);
          }}
        />
      );
    }

    render(<Controlled />);
    expect(screen.getByRole("grid")).toHaveAttribute("aria-multiselectable", "true");

    await user.click(day(5));
    expect(onSelect).toHaveBeenLastCalledWith({ from: new Date(2026, 0, 5), to: undefined });

    await user.click(day(10));
    expect(onSelect).toHaveBeenLastCalledWith({
      from: new Date(2026, 0, 5),
      to: new Date(2026, 0, 10),
    });

    expect(day(5)).toHaveAttribute("data-range-start");
    expect(day(5)).toHaveAttribute("data-selected");
    expect(day(7)).toHaveAttribute("data-range-middle");
    expect(cellOf(day(7))).toHaveAttribute("aria-selected", "true");
    expect(cellOf(day(7))).toHaveAttribute("data-range-middle");
    expect(day(10)).toHaveAttribute("data-range-end");
    expect(cellOf(day(11))).not.toHaveAttribute("aria-selected");

    // A third click starts over; picking an earlier end swaps the two.
    await user.click(day(20));
    expect(onSelect).toHaveBeenLastCalledWith({ from: new Date(2026, 0, 20), to: undefined });
    await user.click(day(12));
    expect(onSelect).toHaveBeenLastCalledWith({
      from: new Date(2026, 0, 12),
      to: new Date(2026, 0, 20),
    });
  });

  it("shows two months without duplicating the days between them", () => {
    render(<Calendar defaultMonth={JAN_2026} numberOfMonths={2} />);

    expect(screen.getByRole("grid", { name: "January 2026" })).toBeInTheDocument();
    expect(screen.getByRole("grid", { name: "February 2026" })).toBeInTheDocument();
    // getByRole throws if either appears twice.
    expect(day(31)).toBeInTheDocument();
    expect(day(1, 1)).toBeInTheDocument();
  });

  it("has no axe violations with a range across two months", async () => {
    render(
      <Calendar
        mode="range"
        numberOfMonths={2}
        defaultMonth={JAN_2026}
        today={TODAY}
        selected={{ from: new Date(2026, 0, 28), to: new Date(2026, 1, 3) }}
        disabled={(date) => date.getDay() === 0}
      />,
    );

    await expect(await runAxe()).toHaveNoViolations();
  });

  it("renders its labels in Arabic", () => {
    const messages = getMessages("ar");
    render(
      <I18nProvider locale="ar">
        <Calendar defaultMonth={JAN_2026} />
      </I18nProvider>,
    );

    expect(
      screen.getByRole("button", { name: messages["calendar.previousMonth"] as string }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "الشهر التالي" })).toBeInTheDocument();

    const caption = new Intl.DateTimeFormat("ar", {
      calendar: "gregory",
      month: "long",
      year: "numeric",
    }).format(JAN_2026);
    expect(screen.getByRole("grid", { name: caption })).toBeInTheDocument();

    // Arabic weeks start on Saturday; 3 January 2026 is one.
    const saturday = new Intl.DateTimeFormat("ar", { weekday: "long" }).format(
      new Date(2026, 0, 3),
    );
    expect(screen.getAllByRole("columnheader")[0]).toHaveAccessibleName(saturday);
    expect(
      screen.getByRole("button", { name: fullDate(new Date(2026, 0, 15), "ar") }),
    ).toBeInTheDocument();
  });
});
