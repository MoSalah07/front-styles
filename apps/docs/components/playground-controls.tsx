"use client";

import * as React from "react";
import { Languages, Rows3 } from "lucide-react";
import { brands, tokens, type BrandName } from "@design-eg/tokens";
import { Button, ThemeSelect } from "@design-eg/ui";
import { cn } from "@design-eg/ui/cn";
import { LanguageSwitch, useRouteLocale } from "@/components/language-switch";
import type { Dictionary } from "@/app/[lang]/dictionaries/types";

type Density = "compact" | "comfortable" | "spacious";

/**
 * Theme and language own their own state elsewhere — the theme picker reads
 * `<html>` and writes it back, and the language lives in the route. Brand and
 * density have no shipped control yet, so they stay as local segments here.
 */
function useHtmlState() {
  const [brand, setBrandState] = React.useState<BrandName>(tokens.defaultBrand);
  const [density, setDensityState] = React.useState<Density>("comfortable");

  React.useEffect(() => {
    const d = document.documentElement;
    setBrandState((d.dataset.brand as BrandName) || tokens.defaultBrand);
    setDensityState((d.dataset.density as Density) || "comfortable");
  }, []);

  const setBrand = (b: BrandName) => {
    document.documentElement.dataset.brand = b;
    localStorage.setItem("design-eg:brand", b);
    setBrandState(b);
  };
  const setDensity = (v: Density) => {
    document.documentElement.dataset.density = v;
    localStorage.setItem("design-eg:density", v);
    setDensityState(v);
  };

  return { brand, setBrand, density, setDensity };
}

function Segment<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { value: T; label: React.ReactNode; title?: string }[];
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex items-center gap-0.5 rounded-control border bg-surface-1 p-0.5"
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          title={o.title}
          onClick={() => onChange(o.value)}
          className={cn(
            "inline-flex h-7 min-w-7 items-center justify-center gap-1.5 rounded-[calc(var(--radius-control)-2px)] px-2 text-xs font-medium",
            "transition-colors duration-(--duration-fast) ease-standard outline-none focus-visible:ring-2 focus-visible:ring-ring",
            value === o.value
              ? "bg-background text-foreground shadow-1"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/**
 * A Client Component, so its copy arrives as plain strings from the server
 * rather than by importing a dictionary here.
 */
export function PlaygroundControls({
  className,
  copy,
}: {
  className?: string;
  copy: Dictionary["playground"];
}) {
  const s = useHtmlState();
  const { locale } = useRouteLocale();

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {/* Arabic carries dir="rtl" with it, which is the RTL pass for every demo
          on the page — so there is no separate direction toggle to fall out of
          step with the language. */}
      <LanguageSwitch size="sm" align="start" />
      <ThemeSelect size="sm" align="start" defaultTheme="dark" />
      <Segment<BrandName>
        label={copy.brand}
        value={s.brand}
        onChange={s.setBrand}
        options={brands.map((b) => ({
          value: b,
          label: (
            <>
              <span
                className="size-2.5 rounded-full ring-1 ring-border"
                style={{ background: tokens.brands[b].seed }}
              />
              {tokens.brands[b].label}
            </>
          ),
        }))}
      />
      <Segment<Density>
        label={copy.density}
        value={s.density}
        onChange={s.setDensity}
        options={[
          { value: "compact", label: <Rows3 className="size-3.5" />, title: copy.compact },
          { value: "comfortable", label: copy.comfortable },
          { value: "spacious", label: copy.spacious },
        ]}
      />
      <Button variant="ghost" size="sm" className="ms-auto" asChild>
        <a href={`/${locale}#tokens`}>
          <Languages className="size-3.5" />
          {copy.tokens}
        </a>
      </Button>
    </div>
  );
}
