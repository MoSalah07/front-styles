"use client";

/** Searchable select built on Popover and Command: type to filter a long list, pick one value or several, and see multiple picks as removable badges. */
import * as React from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "../lib/cn";
import { useFormatters, useT } from "../lib/i18n";
import { Badge } from "./badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "./popover";

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
  /** Extra search terms that match the option without being shown, such as a code or an alias. */
  keywords?: string[];
}

interface ComboboxBaseProps extends Omit<
  React.ComponentProps<"button">,
  "value" | "defaultValue" | "onChange" | "children" | "type" | "role"
> {
  options: ComboboxOption[];
  /** Shown in the trigger while nothing is selected. */
  placeholder?: React.ReactNode;
  /** Placeholder of the search field inside the list. */
  searchPlaceholder?: string;
  /** Shown in the list when the search matches nothing. */
  emptyText?: React.ReactNode;
  /** With `multiple`, how many badges to show before collapsing to an "n selected" summary. */
  maxBadges?: number;
  /** Classes for the `role="combobox"` button. */
  triggerClassName?: string;
  /** Classes for the floating list surface. */
  contentClassName?: string;
  /** Called when the list opens or closes. */
  onOpenChange?: (open: boolean) => void;
}

export interface ComboboxSingleProps extends ComboboxBaseProps {
  multiple?: false;
  value?: string;
  defaultValue?: string;
  /** Receives the new value, or `""` when the selected option is picked again to clear it. */
  onValueChange?: (value: string) => void;
}

export interface ComboboxMultipleProps extends ComboboxBaseProps {
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}

export type ComboboxProps = ComboboxSingleProps | ComboboxMultipleProps;

function toArray(value: string | string[] | undefined): string[] {
  if (value === undefined || value === "") return [];
  return Array.isArray(value) ? value : [value];
}

/** The field box, kept class-for-class in step with SelectTrigger so the two sit side by side. */
const fieldBase = [
  "flex h-(--control-h-md) w-full items-center gap-2 rounded-input border border-input bg-transparent pe-2 text-sm text-foreground",
  "transition-[color,box-shadow,border-color] duration-(--duration-fast) ease-standard outline-none",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  "dark:bg-input/20",
];

function Combobox(props: ComboboxProps) {
  const {
    options,
    multiple = false,
    value: valueProp,
    defaultValue,
    onValueChange,
    placeholder: placeholderProp,
    searchPlaceholder: searchPlaceholderProp,
    emptyText: emptyTextProp,
    maxBadges = 2,
    className,
    triggerClassName,
    contentClassName,
    onOpenChange,
    onKeyDown,
    disabled,
    name,
    ...triggerProps
  } = props;

  const t = useT();
  const { list } = useFormatters();
  const placeholder = placeholderProp ?? t("combobox.placeholder");
  const searchPlaceholder = searchPlaceholderProp ?? t("combobox.searchPlaceholder");
  const emptyText = emptyTextProp ?? t("combobox.empty");

  const contentId = `${React.useId()}-content`;
  const controlRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpenState] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [uncontrolled, setUncontrolled] = React.useState<string[]>(() => toArray(defaultValue));
  const selected = valueProp !== undefined ? toArray(valueProp) : uncontrolled;

  const byValue = React.useMemo(
    () => new Map(options.map((option) => [option.value, option])),
    [options],
  );
  const labelOf = (value: string) => byValue.get(value)?.label ?? value;

  const setOpen = (next: boolean) => {
    setOpenState(next);
    // A reopened list starts from the full set rather than the last query.
    if (!next) setSearch("");
    onOpenChange?.(next);
  };

  const commit = (next: string[]) => {
    if (valueProp === undefined) setUncontrolled(next);
    if (multiple) (onValueChange as ((value: string[]) => void) | undefined)?.(next);
    else (onValueChange as ((value: string) => void) | undefined)?.(next[0] ?? "");
  };

  const toggle = (value: string) => {
    if (multiple) {
      commit(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
      return;
    }
    commit(selected[0] === value ? [] : [value]);
    setOpen(false);
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || open || disabled) return;
    // The arrow keys open a closed combobox, as they do a native select.
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
    }
  };

  const invalid = triggerProps["aria-invalid"] === true || triggerProps["aria-invalid"] === "true";
  const isEmpty = selected.length === 0;
  const collapsed = multiple && selected.length > maxBadges;
  const showBadges = multiple && !isEmpty && !collapsed;

  let valueText: React.ReactNode;
  if (isEmpty) valueText = placeholder;
  else if (!multiple) valueText = labelOf(selected[0] ?? "");
  else if (collapsed) valueText = t("combobox.selectedCount", { count: selected.length });
  // The badges carry the value visually; the button still needs it as text so
  // a screen reader announces what is selected, not just the field's name.
  else valueText = <span className="sr-only">{list.format(selected.map(labelOf))}</span>;

  const trigger = (
    <PopoverTrigger asChild>
      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        // Only while the popup exists, so the reference never dangles.
        aria-controls={open ? contentId : undefined}
        data-slot="combobox-trigger"
        data-placeholder={isEmpty ? "" : undefined}
        disabled={disabled}
        className={cn(
          multiple
            ? [
                "flex h-full min-w-0 flex-1 items-center gap-2 ps-1.5 text-start outline-none",
                "data-[placeholder]:text-muted-foreground disabled:cursor-not-allowed",
              ]
            : [
                fieldBase,
                "ps-3 text-start",
                "data-[placeholder]:text-muted-foreground",
                "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40",
                "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30",
                "disabled:cursor-not-allowed disabled:opacity-50",
              ],
          triggerClassName,
          !multiple && className,
        )}
        {...triggerProps}
        onKeyDown={handleTriggerKeyDown}
      >
        <span data-slot="combobox-value" className="min-w-0 flex-1 truncate">
          {valueText}
        </span>
        <ChevronDown aria-hidden="true" className="size-4 opacity-50" />
      </button>
    </PopoverTrigger>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {multiple ? (
        <PopoverAnchor asChild>
          <div
            ref={controlRef}
            data-slot="combobox-control"
            data-invalid={invalid || undefined}
            data-disabled={disabled || undefined}
            className={cn(
              fieldBase,
              "gap-1 overflow-hidden ps-1.5",
              "has-[[data-slot=combobox-trigger]:focus-visible]:border-ring has-[[data-slot=combobox-trigger]:focus-visible]:ring-2 has-[[data-slot=combobox-trigger]:focus-visible]:ring-ring/40",
              "data-[invalid]:border-destructive data-[invalid]:ring-2 data-[invalid]:ring-destructive/30",
              "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
              className,
            )}
          >
            {showBadges
              ? selected.map((value) => {
                  const label = labelOf(value);
                  return (
                    <Badge
                      key={value}
                      variant="secondary"
                      data-slot="combobox-badge"
                      className="min-w-0 max-w-32 shrink pe-0.5"
                    >
                      <span data-slot="combobox-badge-label" className="truncate">
                        {label}
                      </span>
                      <button
                        type="button"
                        data-slot="combobox-badge-remove"
                        aria-label={t("combobox.remove", { label })}
                        disabled={disabled}
                        onClick={() => commit(selected.filter((v) => v !== value))}
                        className={cn(
                          "inline-flex shrink-0 items-center justify-center rounded-badge p-0.5 opacity-70 outline-none",
                          "transition-[opacity,background-color] duration-(--duration-fast) ease-standard",
                          "hover:bg-foreground/10 hover:opacity-100",
                          "focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring",
                          "disabled:pointer-events-none",
                        )}
                      >
                        <X aria-hidden="true" className="size-3" />
                      </button>
                    </Badge>
                  );
                })
              : null}
            {trigger}
          </div>
        </PopoverAnchor>
      ) : (
        trigger
      )}

      {name
        ? (multiple ? selected : [selected[0] ?? ""]).map((value, index) => (
            <input
              key={`${index}-${value}`}
              type="hidden"
              data-slot="combobox-input"
              name={name}
              value={value}
            />
          ))
        : null}

      <PopoverContent
        id={contentId}
        data-slot="combobox-content"
        align="start"
        aria-label={triggerProps["aria-label"] ?? t("combobox.listLabel")}
        className={cn("w-(--radix-popover-trigger-width) min-w-48 p-0", contentClassName)}
        // Removing a badge while the list is open should not close the list.
        onInteractOutside={(event) => {
          if (controlRef.current?.contains(event.target as Node)) event.preventDefault();
        }}
      >
        <Command
          label={t("combobox.searchLabel")}
          // Start the keyboard cursor on the current choice, as a select does.
          defaultValue={multiple ? undefined : selected[0]}
        >
          <CommandInput placeholder={searchPlaceholder} value={search} onValueChange={setSearch} />
          <CommandList label={t("combobox.listLabel")} aria-multiselectable={multiple || undefined}>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selected.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    keywords={[option.label, ...(option.keywords ?? [])]}
                    disabled={option.disabled}
                    onSelect={() => toggle(option.value)}
                    // cmdk spends aria-selected on the keyboard cursor, so the
                    // chosen state is exposed as aria-checked instead.
                    aria-checked={isSelected}
                    data-checked={isSelected}
                    className="pe-8"
                  >
                    <span className="truncate">{option.label}</span>
                    <span className="absolute end-2 flex size-3.5 items-center justify-center">
                      <Check
                        aria-hidden="true"
                        className={cn("size-4", isSelected ? "opacity-100" : "opacity-0")}
                      />
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { Combobox };
