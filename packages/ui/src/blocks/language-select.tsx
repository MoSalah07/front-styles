"use client";

/** Language picker: a dropdown listing each language in its own script, which sets `lang` and `dir` on the document so the whole page — including RTL layout and the per-script font stack — follows the choice. */
import * as React from "react";
import { ChevronDown, Globe } from "lucide-react";
import { cn } from "../lib/cn";
import { useT } from "../lib/i18n";
import { Button } from "../components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../components/dropdown-menu";
import { directionOf, useLocale, type LocaleOption } from "../hooks/use-locale";

/** Button sizes for the two trigger shapes, so both stay on the control scale. */
const ICON_SIZE = { sm: "icon-sm", md: "icon", lg: "icon-lg" } as const;

export interface LanguageSelectProps extends Omit<React.ComponentProps<"button">, "children"> {
  /** The languages to offer, in list order. Defaults to the four the library ships. */
  locales?: readonly LocaleOption[];
  /** Controlled locale. Set this when the language lives in the URL, so the route wins over the stored preference. */
  locale?: string;
  /** Used for the server render and until the reader has chosen. Defaults to the first locale. */
  defaultLocale?: string;
  /** localStorage key holding the choice. Must match the pre-paint script's. */
  storageKey?: string;
  /** `select` reads as a form control; `icon` and `ghost` collapse to a square button for a header. */
  variant?: "select" | "icon" | "ghost";
  size?: "sm" | "md" | "lg";
  /** Logical edge the list lines up with, so it mirrors correctly in RTL. */
  align?: "start" | "center" | "end";
  /** What the trigger shows: the language's own name, or its tag for a tight header. */
  display?: "native" | "code";
  /** Names the control and heads the list. Defaults to the active catalogue. */
  label?: string;
  /** Called after `lang` and `dir` have been updated — wire your i18n framework here. */
  onLocaleChange?: (locale: LocaleOption) => void;
}

function LanguageSelect({
  className,
  locales,
  locale: controlledLocale,
  defaultLocale,
  storageKey,
  variant = "select",
  size = "md",
  align = "end",
  display = "native",
  label: labelProp,
  onLocaleChange,
  ...props
}: LanguageSelectProps) {
  const t = useT();
  const label = labelProp ?? t("languageSelect.label");
  const {
    locale,
    option,
    locales: list,
    setLocale,
  } = useLocale({
    locales,
    locale: controlledLocale,
    defaultLocale,
    storageKey,
  });
  const iconOnly = variant !== "select";

  function select(code: string) {
    const next = list.find((entry) => entry.code === code);
    if (!next) return;
    setLocale(code);
    onLocaleChange?.(next);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          data-slot="language-select"
          data-locale={locale}
          variant={variant === "ghost" ? "ghost" : "outline"}
          size={iconOnly ? ICON_SIZE[size] : size}
          // The visible label is only the language's name, so the accessible
          // name adds what it is the name *of* while still containing it.
          aria-label={`${label}: ${option.englishName ?? option.nativeName}`}
          className={cn("group", !iconOnly && "gap-2 font-medium", className)}
          {...props}
        >
          <Globe aria-hidden="true" className="size-4" />
          {iconOnly ? null : (
            <>
              {/* bdi keeps an Arabic name from reordering the row around it. */}
              <bdi lang={option.code} className="truncate">
                {display === "code" ? option.code.toUpperCase() : option.nativeName}
              </bdi>
              <ChevronDown
                aria-hidden="true"
                className={cn(
                  "-me-1 size-4 opacity-60",
                  "transition-transform duration-(--duration-fast) ease-standard",
                  "group-data-[state=open]:rotate-180",
                )}
              />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        data-slot="language-select-content"
        align={align}
        // Matching the trigger is what makes a menu read as a select; the floor
        // keeps the icon-only variants from opening a sliver of a list.
        className="min-w-[max(var(--radix-dropdown-menu-trigger-width),13rem)]"
      >
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={locale} onValueChange={select}>
          {list.map((entry) => (
            <DropdownMenuRadioItem key={entry.code} value={entry.code} className="gap-2">
              <span className="flex min-w-0 flex-col">
                {/* lang picks up the right font stack for the name itself. */}
                <bdi lang={entry.code} className="truncate">
                  {entry.nativeName}
                </bdi>
                {entry.englishName && entry.englishName !== entry.nativeName ? (
                  <span className="truncate text-xs text-muted-foreground">
                    {entry.englishName}
                  </span>
                ) : null}
              </span>
              <DropdownMenuShortcut className="uppercase tracking-normal">
                {entry.code}
                {directionOf(entry) === "rtl" ? " · RTL" : null}
              </DropdownMenuShortcut>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { LanguageSelect };
