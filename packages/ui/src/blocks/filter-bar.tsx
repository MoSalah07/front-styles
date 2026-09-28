"use client";

/** Toolbar row for list views: a search field, dropdown filters, an action cluster and a row of dismissible chips showing what is currently applied. */
import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "../components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/select";
import { cn } from "../lib/cn";
import { useT } from "../lib/i18n";

export type FilterBarProps = React.ComponentProps<"div">;

function FilterBar({ className, ...props }: FilterBarProps) {
  return (
    <div
      data-slot="filter-bar"
      role="search"
      className={cn("flex w-full flex-wrap items-center gap-2", className)}
      {...props}
    />
  );
}

export interface FilterBarSearchProps extends Omit<React.ComponentProps<"input">, "onChange"> {
  /** Accessible name of the field. */
  label?: string;
  /** Called with the raw text on every keystroke. */
  onValueChange?: (value: string) => void;
  /** Escape hatch for callers that want the native event as well. */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

function FilterBarSearch({
  className,
  label: labelProp,
  placeholder: placeholderProp,
  onValueChange,
  onChange,
  ...props
}: FilterBarSearchProps) {
  const t = useT();
  const label = labelProp ?? t("filterBar.label");
  const placeholder = placeholderProp ?? t("filterBar.placeholder");

  return (
    <div data-slot="filter-bar-search" className={cn("relative w-full sm:w-64", className)}>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        type="search"
        aria-label={label}
        placeholder={placeholder}
        className="ps-9"
        onChange={(event) => {
          onChange?.(event);
          onValueChange?.(event.target.value);
        }}
        {...props}
      />
    </div>
  );
}

export interface FilterBarSelectOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface FilterBarSelectProps extends Omit<
  React.ComponentProps<typeof Select>,
  "children"
> {
  /** Accessible name of the trigger. */
  label: string;
  /** Choices offered by the dropdown. */
  options: readonly FilterBarSelectOption[];
  /** Text shown while nothing is picked. */
  placeholder?: string;
  /** Extra classes for the trigger. */
  className?: string;
  /** Width of the trigger. Defaults to a compact column. */
  triggerWidth?: string;
}

function FilterBarSelect({
  label,
  options,
  placeholder,
  className,
  triggerWidth = "w-full sm:w-44",
  ...props
}: FilterBarSelectProps) {
  return (
    <Select {...props}>
      <SelectTrigger
        data-slot="filter-bar-select"
        aria-label={label}
        className={cn(triggerWidth, className)}
      >
        <SelectValue placeholder={placeholder ?? label} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function FilterBarActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="filter-bar-actions"
      // `ms-auto` parks the cluster at the inline end in both directions.
      className={cn("ms-auto flex flex-wrap items-center gap-2", className)}
      {...props}
    />
  );
}

function FilterBarChips({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="filter-bar-chips"
      className={cn("flex w-full flex-wrap items-center gap-1.5", className)}
      {...props}
    />
  );
}

export interface FilterBarChipProps extends React.ComponentProps<"div"> {
  /** Name of the filter, e.g. "Status". */
  label: React.ReactNode;
  /** Value it is set to, e.g. "Active". */
  value?: React.ReactNode;
  /** Called when the chip's dismiss button is pressed. Omit it for a static chip. */
  onRemove?: () => void;
  /** Accessible name of the dismiss button. Defaults to "Remove <label> filter". */
  removeLabel?: string;
}

function FilterBarChip({
  className,
  label,
  value,
  onRemove,
  removeLabel,
  children,
  ...props
}: FilterBarChipProps) {
  const name = typeof label === "string" ? label : "filter";

  return (
    <div
      data-slot="filter-bar-chip"
      className={cn(
        "inline-flex items-center gap-1 rounded-badge border border-border bg-surface-2 py-0.5 ps-2.5 pe-1 text-xs",
        !onRemove && "pe-2.5",
        className,
      )}
      {...props}
    >
      <span className="text-muted-foreground">{label}</span>
      {value !== undefined ? <span className="font-medium text-foreground">{value}</span> : null}
      {children}
      {onRemove ? (
        <button
          type="button"
          data-slot="filter-bar-chip-remove"
          aria-label={removeLabel ?? `Remove ${name} filter`}
          onClick={onRemove}
          className={cn(
            "inline-flex size-4 shrink-0 items-center justify-center rounded-full text-muted-foreground",
            "transition-colors duration-(--duration-fast) ease-standard",
            "hover:bg-accent hover:text-accent-foreground",
            "outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        >
          <X aria-hidden="true" className="size-3" />
        </button>
      ) : null}
    </div>
  );
}

export {
  FilterBar,
  FilterBarSearch,
  FilterBarSelect,
  FilterBarActions,
  FilterBarChips,
  FilterBarChip,
};
