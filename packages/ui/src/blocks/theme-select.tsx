"use client";

/** Colour-mode picker: a dropdown listing light, dark and system, with the active mode on the trigger and the choice written straight to the document root. */
import * as React from "react";
import { ChevronDown, Monitor, Moon, Sun } from "lucide-react";
import { cn } from "../lib/cn";
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
import { THEMES, useTheme, type Theme } from "../hooks/use-theme";

const ICONS: Record<Theme, React.ComponentType<{ className?: string }>> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

/** Button sizes for the two trigger shapes, so both stay on the control scale. */
const ICON_SIZE = { sm: "icon-sm", md: "icon", lg: "icon-lg" } as const;

export interface ThemeSelectLabels {
  /** Names the control and heads the list. */
  trigger: string;
  light: string;
  dark: string;
  system: string;
}

const DEFAULT_LABELS: ThemeSelectLabels = {
  trigger: "Theme",
  light: "Light",
  dark: "Dark",
  system: "System",
};

export interface ThemeSelectProps extends Omit<React.ComponentProps<"button">, "children"> {
  /** `select` reads as a form control; `icon` and `ghost` collapse to a square button for a header. */
  variant?: "select" | "icon" | "ghost";
  size?: "sm" | "md" | "lg";
  /** Logical edge the list lines up with, so it mirrors correctly in RTL. */
  align?: "start" | "center" | "end";
  /** Every visible string, for an app that runs in another language. */
  labels?: Partial<ThemeSelectLabels>;
  /** Mode used for the server render and until the reader has chosen. */
  defaultTheme?: Theme;
  /** localStorage key holding the choice. Must match the pre-paint script's. */
  storageKey?: string;
  /** Called after the document has been updated. */
  onThemeChange?: (theme: Theme) => void;
}

function ThemeSelect({
  className,
  variant = "select",
  size = "md",
  align = "end",
  labels,
  defaultTheme,
  storageKey,
  onThemeChange,
  ...props
}: ThemeSelectProps) {
  const { theme, resolvedTheme, setTheme, mounted } = useTheme({ defaultTheme, storageKey });
  const text = { ...DEFAULT_LABELS, ...labels };
  const iconOnly = variant !== "select";
  const Icon = ICONS[theme];

  function select(value: string) {
    const next = value as Theme;
    setTheme(next);
    onThemeChange?.(next);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          data-slot="theme-select"
          data-theme-choice={theme}
          variant={variant === "ghost" ? "ghost" : "outline"}
          size={iconOnly ? ICON_SIZE[size] : size}
          // The visible label is only the mode's name, so the accessible name
          // adds what it is the name *of* while still containing it.
          aria-label={`${text.trigger}: ${text[theme]}`}
          className={cn("group", !iconOnly && "gap-2 font-medium", className)}
          {...props}
        >
          {/* Keyed so swapping modes replays the entrance rather than cutting. */}
          <Icon
            key={theme}
            aria-hidden="true"
            className={cn("size-4", mounted && "motion-safe:animate-scale-in")}
          />
          {iconOnly ? null : (
            <>
              <span className="truncate">{text[theme]}</span>
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
        data-slot="theme-select-content"
        align={align}
        // Matching the trigger is what makes a menu read as a select; the floor
        // keeps the icon-only variants from opening a sliver of a list.
        className="min-w-[max(var(--radix-dropdown-menu-trigger-width),11rem)]"
      >
        <DropdownMenuLabel>{text.trigger}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={theme} onValueChange={select}>
          {THEMES.map((value) => {
            const RowIcon = ICONS[value];
            return (
              <DropdownMenuRadioItem key={value} value={value} className="gap-2">
                <RowIcon aria-hidden="true" className="size-4 text-muted-foreground" />
                {text[value]}
                {value === "system" ? (
                  // Says what "system" currently means, so the row is not a guess.
                  <DropdownMenuShortcut className="tracking-normal">
                    {text[resolvedTheme]}
                  </DropdownMenuShortcut>
                ) : null}
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { ThemeSelect };
