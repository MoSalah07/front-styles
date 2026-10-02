"use client";

/** Month-grid date surface for a single day or a range, captioned and labelled in the active locale through Intl, with the WAI-ARIA date-grid keyboard model. */
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../lib/cn";
import { useI18n } from "../lib/i18n";

/* ------------------------------------------------------------ date helpers
 * Every date is rebuilt from its calendar parts with `new Date(y, m, d)`, and
 * arithmetic happens on those parts, never by adding milliseconds. A day is
 * not always 24 hours long across a daylight-saving change, but the Date
 * constructor normalises "day 32 of January" correctly in every time zone.
 * ------------------------------------------------------------------------ */

type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addDays(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

/** Keeps the day of the month, clamped to the target month: 31 January plus one month is 28 February. */
function addMonths(date: Date, amount: number): Date {
  const lastDay = new Date(date.getFullYear(), date.getMonth() + amount + 1, 0).getDate();
  return new Date(date.getFullYear(), date.getMonth() + amount, Math.min(date.getDate(), lastDay));
}

function startOfWeek(date: Date, weekStartsOn: Weekday): Date {
  return addDays(date, -((date.getDay() - weekStartsOn + 7) % 7));
}

/** A sortable yyyymmdd number, so every comparison ignores the time of day. */
function dayKey(date: Date): number {
  return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
}

function monthKey(date: Date): number {
  return date.getFullYear() * 12 + date.getMonth();
}

function isSameDay(a: Date | undefined, b: Date | undefined): boolean {
  return a !== undefined && b !== undefined && dayKey(a) === dayKey(b);
}

function clampDay(date: Date, min: Date | undefined, max: Date | undefined): Date {
  if (min && dayKey(date) < dayKey(min)) return startOfDay(min);
  if (max && dayKey(date) > dayKey(max)) return startOfDay(max);
  return startOfDay(date);
}

function toISODate(date: Date): string {
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fromISODate(value: string | undefined): Date | undefined {
  const match = value ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(value) : null;
  if (!match) return undefined;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

/** The weeks that cover `month`, each a run of seven days starting on `weekStartsOn`. */
function weeksOf(month: Date, weekStartsOn: Weekday): Date[][] {
  const last = dayKey(new Date(month.getFullYear(), month.getMonth() + 1, 0));
  const weeks: Date[][] = [];
  let start = startOfWeek(month, weekStartsOn);
  while (dayKey(start) <= last) {
    const weekStart = start;
    weeks.push(Array.from({ length: 7 }, (_, index) => addDays(weekStart, index)));
    start = addDays(start, 7);
  }
  return weeks;
}

/** Clicking a day extends an open range, or starts a new one once both ends are set. */
function nextRange(current: DateRange | undefined, date: Date): DateRange {
  const from = current?.from;
  if (!from || current.to) return { from: date, to: undefined };
  if (dayKey(date) < dayKey(from)) return { from: date, to: startOfDay(from) };
  return { from: startOfDay(from), to: date };
}

/* ------------------------------------------------------------------ locale */

/**
 * CLDR's first-day-of-week territories, for engines that do not expose
 * `Intl.Locale` week info yet. Everything else starts on Monday.
 */
const SATURDAY_FIRST = new Set("AE AF BH DJ DZ EG IQ IR JO KW LY OM QA SD SY".split(" "));
const SUNDAY_FIRST = new Set(
  "AG AS BD BR BS BT BW BZ CA CN CO DM DO ET GT GU HK HN ID IL IN JM JP KE KH KR LA MH MM MO MT MX MZ NI NP PA PE PH PK PR PT PY SA SG SV TH TT TW UM US VE VI WS YE ZA ZW".split(
    " ",
  ),
);

interface WeekInfo {
  firstDay: number;
}

/** `getWeekInfo()` is the standard spelling; some engines shipped the earlier `weekInfo` getter. */
type LocaleWithWeekInfo = Intl.Locale & { getWeekInfo?: () => WeekInfo; weekInfo?: WeekInfo };

function localeWeekStart(locale: string): Weekday {
  try {
    const intlLocale = new Intl.Locale(locale) as LocaleWithWeekInfo;
    const info = intlLocale.getWeekInfo?.() ?? intlLocale.weekInfo;
    // CLDR numbers the days 1 (Monday) to 7 (Sunday); Date#getDay uses 0 for Sunday.
    if (info && info.firstDay >= 1 && info.firstDay <= 7) return (info.firstDay % 7) as Weekday;
    const region = intlLocale.maximize().region ?? "";
    if (SATURDAY_FIRST.has(region)) return 6;
    if (SUNDAY_FIRST.has(region)) return 0;
    return 1;
  } catch {
    return 0;
  }
}

/**
 * Every visible string, from Intl in the active locale. The Gregorian calendar
 * is pinned because the grid is Gregorian: a tag such as `ar-SA` defaults to
 * the Hijri calendar and would caption a Gregorian month with a Hijri name.
 * The numbering system still follows the locale.
 */
function useCalendarFormatters(locale: string) {
  return React.useMemo(() => {
    const calendar = "gregory";
    return {
      caption: new Intl.DateTimeFormat(locale, { calendar, month: "long", year: "numeric" }),
      weekdayShort: new Intl.DateTimeFormat(locale, { calendar, weekday: "short" }),
      weekdayLong: new Intl.DateTimeFormat(locale, { calendar, weekday: "long" }),
      dayNumber: new Intl.DateTimeFormat(locale, { calendar, day: "numeric" }),
      dayLabel: new Intl.DateTimeFormat(locale, { calendar, dateStyle: "full" }),
    };
  }, [locale]);
}

const subscribeToNothing = () => () => {};

/**
 * Today's date on the client, and nothing on the server or while hydrating. A
 * prerendered page is built on one day and read on another, so a today marker
 * drawn on the server would disagree with the client's first render.
 */
function useTodayISO(): string | undefined {
  return React.useSyncExternalStore(
    subscribeToNothing,
    () => toISODate(new Date()),
    () => undefined,
  );
}

/** The nearest `dir` attribute wins, since that is what the logical properties mirror against. */
function readDirection(element: Element | null, fallback: "ltr" | "rtl"): "ltr" | "rtl" {
  const dir = element?.closest("[dir]")?.getAttribute("dir");
  return dir === "rtl" || dir === "ltr" ? dir : fallback;
}

/* ------------------------------------------------------------------- props */

export interface DateRange {
  from?: Date;
  to?: Date;
}

interface CalendarBaseProps extends Omit<
  React.ComponentProps<"div">,
  "onSelect" | "defaultValue" | "children"
> {
  /** The first month shown, when the caller owns navigation. Any day inside it will do. */
  month?: Date;
  /** The first month shown initially. Defaults to the selection, then to today. */
  defaultMonth?: Date;
  /** Fires with the first day of the new first month. */
  onMonthChange?: (month: Date) => void;
  /** Months shown side by side on wide screens, stacked on narrow ones. */
  numberOfMonths?: 1 | 2;
  /** Earliest selectable day. */
  min?: Date;
  /** Latest selectable day. */
  max?: Date;
  /** Marks days as unavailable. They stay focusable, so the keyboard can cross them, but cannot be selected. */
  disabled?: (date: Date) => boolean;
  /** 0 for Sunday through 6 for Saturday. Defaults to the active locale's convention. */
  weekStartsOn?: Weekday;
  /** Fills the leading and trailing cells with the neighbouring months' days. */
  showOutsideDays?: boolean;
  /**
   * The day that carries the today marker. Defaults to the client's date, which
   * appears after hydration; pass a fixed date to render it on the server too.
   */
  today?: Date;
  previousMonthLabel?: string;
  nextMonthLabel?: string;
}

export interface CalendarSingleProps extends CalendarBaseProps {
  mode?: "single";
  /** Controlled selection. Passing the prop at all, even as undefined, makes the calendar controlled. */
  selected?: Date | undefined;
  defaultSelected?: Date;
  onSelect?: (date: Date | undefined) => void;
}

export interface CalendarRangeProps extends CalendarBaseProps {
  mode: "range";
  /** Controlled selection. Passing the prop at all, even as undefined, makes the calendar controlled. */
  selected?: DateRange | undefined;
  defaultSelected?: DateRange;
  onSelect?: (range: DateRange) => void;
}

export type CalendarProps = CalendarSingleProps | CalendarRangeProps;

/* ------------------------------------------------------------------ styles */

const navButtonClass = cn(
  "inline-flex size-(--control-h-sm) items-center justify-center rounded-control text-muted-foreground",
  "outline-none motion-safe:transition-colors duration-(--duration-fast) ease-standard",
  "hover:bg-accent hover:text-accent-foreground",
  "focus-visible:ring-2 focus-visible:ring-ring",
  "aria-disabled:pointer-events-none aria-disabled:opacity-50",
  "[&_svg]:size-4 [&_svg]:shrink-0",
);

// The band behind a range lives on the cell, so it runs unbroken between days;
// the ends round off on their outer side only.
const cellClass = cn(
  "p-0 text-center",
  "data-[range-middle]:bg-accent",
  "data-[range-start]:rounded-s-control data-[range-start]:bg-accent",
  "data-[range-end]:rounded-e-control data-[range-end]:bg-accent",
);

const dayClass = cn(
  "relative flex size-(--calendar-cell) items-center justify-center rounded-control text-sm tabular-nums text-foreground",
  "outline-none motion-safe:transition-colors duration-(--duration-fast) ease-standard",
  "hover:bg-accent hover:text-accent-foreground",
  "focus-visible:z-(--z-raised) focus-visible:ring-2 focus-visible:ring-ring",
  "data-[today]:font-semibold",
  "data-[today]:after:pointer-events-none data-[today]:after:absolute data-[today]:after:inset-x-0 data-[today]:after:bottom-1",
  "data-[today]:after:mx-auto data-[today]:after:size-1 data-[today]:after:rounded-full data-[today]:after:bg-primary",
  "not-data-[selected]:data-[outside]:text-muted-foreground",
  "data-[range-middle]:rounded-none data-[range-middle]:text-accent-foreground",
  "data-[selected]:bg-primary data-[selected]:text-primary-foreground",
  "data-[selected]:hover:bg-primary-hover data-[selected]:hover:text-primary-foreground",
  "data-[today]:data-[selected]:after:bg-primary-foreground",
  "aria-disabled:pointer-events-none aria-disabled:opacity-50",
);

/* --------------------------------------------------------------- component */

function Calendar(props: CalendarProps) {
  const {
    ref,
    mode = "single",
    selected: selectedProp,
    defaultSelected,
    onSelect,
    month: monthProp,
    defaultMonth,
    onMonthChange,
    numberOfMonths = 1,
    min,
    max,
    disabled,
    weekStartsOn: weekStartsOnProp,
    showOutsideDays = true,
    today: todayProp,
    previousMonthLabel,
    nextMonthLabel,
    className,
    ...rest
  } = props;

  const { locale, t, dir: localeDir } = useI18n();
  const formatters = useCalendarFormatters(locale);
  const weekStartsOn = React.useMemo(
    () => weekStartsOnProp ?? localeWeekStart(locale),
    [weekStartsOnProp, locale],
  );
  const id = React.useId();
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const setRootRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const todayISO = useTodayISO();
  const today = todayProp ? startOfDay(todayProp) : fromISODate(todayISO);
  const isRange = mode === "range";

  // Selection. Controlled as soon as the prop is present, so a caller can clear
  // it by passing undefined rather than having the calendar hold on to it.
  const selectionControlled = "selected" in props;
  const [internalSelected, setInternalSelected] = React.useState(defaultSelected);
  const selection = selectionControlled ? selectedProp : internalSelected;
  const single = isRange ? undefined : (selection as Date | undefined);
  const range = isRange ? (selection as DateRange | undefined) : undefined;

  const isDisabled = (date: Date): boolean =>
    (min !== undefined && dayKey(date) < dayKey(min)) ||
    (max !== undefined && dayKey(date) > dayKey(max)) ||
    (disabled?.(date) ?? false);

  // Navigation.
  const [internalMonth, setInternalMonth] = React.useState(() =>
    startOfMonth(defaultMonth ?? single ?? range?.from ?? clampDay(today ?? new Date(), min, max)),
  );
  const firstMonth = startOfMonth(monthProp ?? internalMonth);
  const lastMonth = addMonths(firstMonth, numberOfMonths - 1);
  const months = Array.from({ length: numberOfMonths }, (_, index) => addMonths(firstMonth, index));
  const previousDisabled = min !== undefined && monthKey(firstMonth) <= monthKey(min);
  const nextDisabled = max !== undefined && monthKey(lastMonth) >= monthKey(max);

  function changeMonth(next: Date) {
    const normalized = startOfMonth(next);
    if (monthKey(normalized) === monthKey(firstMonth)) return;
    if (monthProp === undefined) setInternalMonth(normalized);
    onMonthChange?.(normalized);
  }

  // Roving tabindex: exactly one day in the grid is tabbable at a time.
  const [focusedDate, setFocusedDate] = React.useState<Date>();
  const pendingFocus = React.useRef(false);
  const isVisible = (date: Date) =>
    monthKey(date) >= monthKey(firstMonth) && monthKey(date) <= monthKey(lastMonth);

  function resolveTabbable(): Date {
    if (focusedDate && isVisible(focusedDate)) return focusedDate;
    for (const candidate of [single, range?.from, range?.to, today]) {
      if (candidate && isVisible(candidate) && !isDisabled(candidate)) return candidate;
    }
    for (let day = firstMonth; isVisible(day); day = addDays(day, 1)) {
      if (!isDisabled(day)) return day;
    }
    return firstMonth;
  }
  const tabbableKey = dayKey(resolveTabbable());

  React.useEffect(() => {
    if (!pendingFocus.current) return;
    pendingFocus.current = false;
    rootRef.current
      ?.querySelector<HTMLElement>('[data-slot="calendar-day"][tabindex="0"]')
      ?.focus();
  });

  function moveFocus(target: Date) {
    const next = clampDay(target, min, max);
    setFocusedDate(next);
    if (monthKey(next) < monthKey(firstMonth)) changeMonth(next);
    else if (monthKey(next) > monthKey(lastMonth)) {
      changeMonth(addMonths(startOfMonth(next), -(numberOfMonths - 1)));
    }
    pendingFocus.current = true;
  }

  function stepMonth(amount: number) {
    if (amount < 0 ? previousDisabled : nextDisabled) return;
    changeMonth(addMonths(firstMonth, amount));
    // Keep the day of the month, as the grid pattern expects, so tabbing back
    // into the grid lands on the same date one month over.
    if (focusedDate) setFocusedDate(clampDay(addMonths(focusedDate, amount), min, max));
  }

  function selectDate(date: Date) {
    if (isDisabled(date)) return;
    if (isRange) {
      const next = nextRange(range, date);
      if (!selectionControlled) setInternalSelected(next);
      (onSelect as ((range: DateRange) => void) | undefined)?.(next);
    } else {
      if (!selectionControlled) setInternalSelected(date);
      (onSelect as ((date: Date | undefined) => void) | undefined)?.(date);
    }
  }

  function handleGridKeyDown(event: React.KeyboardEvent<HTMLTableElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const current = fromISODate((event.target as HTMLElement).dataset.day);
    if (!current) return;
    // Left and right follow the screen, which in a mirrored grid is the
    // opposite of the calendar's own order.
    const forward = readDirection(event.currentTarget, localeDir) === "rtl" ? -1 : 1;

    let next: Date;
    switch (event.key) {
      case "ArrowRight":
        next = addDays(current, forward);
        break;
      case "ArrowLeft":
        next = addDays(current, -forward);
        break;
      case "ArrowDown":
        next = addDays(current, 7);
        break;
      case "ArrowUp":
        next = addDays(current, -7);
        break;
      case "Home":
        next = startOfWeek(current, weekStartsOn);
        break;
      case "End":
        next = addDays(startOfWeek(current, weekStartsOn), 6);
        break;
      case "PageUp":
        next = addMonths(current, event.shiftKey ? -12 : -1);
        break;
      case "PageDown":
        next = addMonths(current, event.shiftKey ? 12 : 1);
        break;
      default:
        return;
    }
    event.preventDefault();
    moveFocus(next);
  }

  // 4 January 2026 was a Sunday, so day n of that week is weekday n.
  const weekdays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(2026, 0, 4 + ((weekStartsOn + index) % 7));
    return {
      short: formatters.weekdayShort.format(date),
      long: formatters.weekdayLong.format(date),
    };
  });

  function renderDay(date: Date, month: Date, monthIndex: number) {
    const key = dayKey(date);
    const outside = monthKey(date) !== monthKey(month);
    // An outside day that a neighbouring visible month also shows would be a
    // duplicate cell, so only the outer edges of the visible span get them.
    const hidden =
      outside &&
      (!showOutsideDays ||
        (key < dayKey(month) ? monthIndex > 0 : monthIndex < numberOfMonths - 1));

    if (hidden) return <td key={key} role="gridcell" data-slot="calendar-cell" data-outside="" />;

    const dayDisabled = isDisabled(date);
    const isToday = isSameDay(date, today);
    const from = range?.from;
    const to = range?.to;
    const complete = from !== undefined && to !== undefined;
    const rangeStart = isSameDay(date, from);
    const rangeEnd = isSameDay(date, to);
    const inRange = complete && key >= dayKey(from) && key <= dayKey(to);
    const rangeMiddle = inRange && !rangeStart && !rangeEnd;
    const filled = isSameDay(date, single) || rangeStart || rangeEnd;
    const band = complete && !isSameDay(from, to);

    return (
      <td
        key={key}
        role="gridcell"
        aria-selected={filled || inRange || undefined}
        data-slot="calendar-cell"
        data-range-start={(band && rangeStart) || undefined}
        data-range-end={(band && rangeEnd) || undefined}
        data-range-middle={rangeMiddle || undefined}
        className={cellClass}
      >
        <button
          type="button"
          tabIndex={!outside && key === tabbableKey ? 0 : -1}
          data-slot="calendar-day"
          data-day={toISODate(date)}
          data-today={isToday || undefined}
          data-selected={filled || undefined}
          data-range-start={rangeStart || undefined}
          data-range-end={rangeEnd || undefined}
          data-range-middle={rangeMiddle || undefined}
          data-outside={outside || undefined}
          aria-label={formatters.dayLabel.format(date)}
          aria-disabled={dayDisabled || undefined}
          aria-current={isToday ? "date" : undefined}
          onClick={() => {
            if (dayDisabled) return;
            if (!outside) setFocusedDate(date);
            selectDate(date);
          }}
          className={dayClass}
        >
          {formatters.dayNumber.format(date)}
        </button>
      </td>
    );
  }

  return (
    <div
      ref={setRootRef}
      data-slot="calendar"
      data-mode={mode}
      className={cn(
        "relative w-fit p-3 text-sm text-foreground [--calendar-cell:var(--control-h-md)]",
        className,
      )}
      {...rest}
    >
      <div
        data-slot="calendar-nav"
        className="absolute inset-x-3 top-3 flex h-(--calendar-cell) items-center justify-between"
      >
        <button
          type="button"
          data-slot="calendar-previous"
          aria-label={previousMonthLabel ?? t("calendar.previousMonth")}
          aria-disabled={previousDisabled || undefined}
          onClick={() => stepMonth(-1)}
          className={navButtonClass}
        >
          {/* Points towards the start of the line, which is the right in RTL. */}
          <ChevronLeft aria-hidden="true" className="rtl:rotate-180" />
        </button>
        <button
          type="button"
          data-slot="calendar-next"
          aria-label={nextMonthLabel ?? t("calendar.nextMonth")}
          aria-disabled={nextDisabled || undefined}
          onClick={() => stepMonth(1)}
          className={navButtonClass}
        >
          <ChevronRight aria-hidden="true" className="rtl:rotate-180" />
        </button>
      </div>

      <div data-slot="calendar-months" className="flex flex-col gap-6 sm:flex-row">
        {months.map((month, monthIndex) => {
          const captionId = `${id}-caption-${monthIndex}`;
          return (
            <div key={monthKey(month)} data-slot="calendar-month" className="flex flex-col gap-2">
              <div
                data-slot="calendar-caption"
                className="flex h-(--calendar-cell) items-center justify-center px-(--calendar-cell)"
              >
                <span id={captionId} aria-live="polite" className="font-semibold">
                  {formatters.caption.format(month)}
                </span>
              </div>
              <table
                role="grid"
                aria-labelledby={captionId}
                aria-multiselectable={isRange || undefined}
                data-slot="calendar-grid"
                className="border-separate border-spacing-0"
                onKeyDown={handleGridKeyDown}
              >
                <thead data-slot="calendar-head">
                  <tr data-slot="calendar-weekdays">
                    {weekdays.map((weekday) => (
                      <th
                        key={weekday.long}
                        scope="col"
                        abbr={weekday.long}
                        aria-label={weekday.long}
                        data-slot="calendar-weekday"
                        className="w-(--calendar-cell) pb-1 text-xs font-normal text-muted-foreground"
                      >
                        {weekday.short}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody data-slot="calendar-body">
                  {weeksOf(month, weekStartsOn).map((week, weekIndex) => (
                    <tr key={weekIndex} data-slot="calendar-week">
                      {week.map((date) => renderDay(date, month, monthIndex))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { Calendar };
