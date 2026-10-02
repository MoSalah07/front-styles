"use client";

/** Date field that opens a calendar in a popover, with an input-styled trigger showing the value in the reader's locale, single or range selection, and a hidden ISO input so it posts with a plain form. */
import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { cn } from "../lib/cn";
import { useI18n } from "../lib/i18n";
import { Button } from "./button";
import { Calendar, type CalendarProps, type DateRange } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

/** yyyy-mm-dd from the local calendar parts, so a UTC offset can never move the day. */
function toISODate(date: Date): string {
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

interface DatePickerBaseProps extends Omit<
  React.ComponentProps<"button">,
  "value" | "defaultValue" | "onChange" | "type" | "children" | "name"
> {
  /** Shown while there is no value. Defaults to the catalogue's wording for the mode. */
  placeholder?: string;
  /** Earliest selectable day. */
  min?: Date;
  /** Latest selectable day. */
  max?: Date;
  /** Marks individual days as unavailable. */
  disabledDates?: (date: Date) => boolean;
  /**
   * Renders a hidden input with this name, holding the value as `yyyy-mm-dd`,
   * or as the ISO 8601 interval `yyyy-mm-dd/yyyy-mm-dd` for a range. A range
   * with only one end picked posts an empty string.
   */
  name?: string;
  /** The month the calendar opens on when there is no value yet. */
  defaultMonth?: Date;
  /** Months shown in the popover. One for a single date, two for a range. */
  numberOfMonths?: 1 | 2;
  /** 0 for Sunday through 6 for Saturday. Defaults to the active locale's convention. */
  weekStartsOn?: CalendarProps["weekStartsOn"];
}

export interface DatePickerSingleProps extends DatePickerBaseProps {
  mode?: "single";
  /** Controlled value. Passing the prop at all, even as undefined, makes the picker controlled. */
  value?: Date | undefined;
  defaultValue?: Date;
  onValueChange?: (value: Date | undefined) => void;
}

export interface DatePickerRangeProps extends DatePickerBaseProps {
  mode: "range";
  /** Controlled value. Passing the prop at all, even as undefined, makes the picker controlled. */
  value?: DateRange | undefined;
  defaultValue?: DateRange;
  onValueChange?: (value: DateRange) => void;
}

export type DatePickerProps = DatePickerSingleProps | DatePickerRangeProps;

// Button's outline variant, pulled over to the field look SelectTrigger and
// Input share: field radius, start-aligned regular-weight text, no press scale.
const triggerClass = cn(
  "w-full justify-start gap-2 rounded-input px-3 text-start font-normal text-foreground",
  "hover:bg-transparent hover:text-foreground dark:bg-input/20 dark:hover:bg-input/20",
  "focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-offset-0",
  "aria-invalid:border-destructive aria-invalid:ring-destructive/30",
  "data-[placeholder]:text-muted-foreground",
  "motion-safe:active:scale-100",
);

function DatePicker(props: DatePickerProps) {
  const {
    mode = "single",
    value: valueProp,
    defaultValue,
    onValueChange,
    placeholder,
    disabled,
    min,
    max,
    disabledDates,
    name,
    defaultMonth,
    numberOfMonths,
    weekStartsOn,
    className,
    "aria-describedby": ariaDescribedBy,
    ...rest
  } = props;

  const { locale, t } = useI18n();
  const valueId = React.useId();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);

  const controlled = "value" in props;
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const value = controlled ? valueProp : internalValue;
  const isRange = mode === "range";
  const single = isRange ? undefined : (value as Date | undefined);
  const range = isRange ? (value as DateRange | undefined) : undefined;

  // Pinned to the Gregorian calendar to match the grid; see Calendar.
  const format = React.useMemo(
    () => new Intl.DateTimeFormat(locale, { calendar: "gregory", dateStyle: "medium" }),
    [locale],
  );

  let text: string | undefined;
  let hiddenValue = "";
  if (range?.from && range.to) {
    const [start, end] =
      range.from.getTime() <= range.to.getTime() ? [range.from, range.to] : [range.to, range.from];
    // formatRange collapses what the two ends share, e.g. "Jan 5 – 10, 2026".
    text = format.formatRange(start, end);
    hiddenValue = `${toISODate(start)}/${toISODate(end)}`;
  } else if (range?.from) {
    text = `${format.format(range.from)} –`;
  } else if (single) {
    text = format.format(single);
    hiddenValue = toISODate(single);
  }

  function commit(next: Date | DateRange | undefined) {
    if (!controlled) setInternalValue(next);
    (onValueChange as ((next: Date | DateRange | undefined) => void) | undefined)?.(next);
  }

  // The grid, not the month buttons, takes focus on open: the selected day,
  // else today, else the first available day, as the APG dialog pattern asks.
  function focusDay(event: Event) {
    event.preventDefault();
    contentRef.current
      ?.querySelector<HTMLElement>('[data-slot="calendar-day"][tabindex="0"]')
      ?.focus({ preventScroll: true });
  }

  const shared = { min, max, disabled: disabledDates, defaultMonth, weekStartsOn };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            data-slot="date-picker-trigger"
            data-placeholder={text === undefined ? "" : undefined}
            disabled={disabled}
            // The name comes from the Label or aria-label; the value rides along
            // as the description so it is still announced.
            aria-describedby={[valueId, ariaDescribedBy].filter(Boolean).join(" ")}
            className={cn(triggerClass, className)}
            {...rest}
          >
            <CalendarIcon aria-hidden="true" className="text-muted-foreground" />
            <span id={valueId} data-slot="date-picker-value" className="min-w-0 truncate">
              {text ??
                placeholder ??
                t(isRange ? "datePicker.rangePlaceholder" : "datePicker.placeholder")}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          ref={contentRef}
          data-slot="date-picker-content"
          align="start"
          aria-label={t(isRange ? "datePicker.rangeDialogLabel" : "datePicker.dialogLabel")}
          className="w-auto p-0"
          onOpenAutoFocus={focusDay}
        >
          {isRange ? (
            <Calendar
              mode="range"
              selected={range}
              numberOfMonths={numberOfMonths ?? 2}
              onSelect={(next) => {
                commit(next);
                // Stay open until both ends are picked.
                if (next.from && next.to) setOpen(false);
              }}
              {...shared}
            />
          ) : (
            <Calendar
              mode="single"
              selected={single}
              numberOfMonths={numberOfMonths ?? 1}
              onSelect={(next) => {
                commit(next);
                if (next) setOpen(false);
              }}
              {...shared}
            />
          )}
        </PopoverContent>
      </Popover>
      {name ? (
        <input
          type="hidden"
          data-slot="date-picker-input"
          name={name}
          value={hiddenValue}
          disabled={disabled}
        />
      ) : null}
    </>
  );
}

export { DatePicker };
