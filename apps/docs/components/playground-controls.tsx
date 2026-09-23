"use client";

import * as React from "react";
import { Languages, Monitor, Moon, Rows3, Sun } from "lucide-react";
import { brands, tokens, type BrandName } from "@design-eg/tokens";
import { Button } from "@design-eg/ui/button";
import { cn } from "@design-eg/ui/cn";

type Theme = "light" | "dark" | "system";
type Dir = "ltr" | "rtl";
type Density = "compact" | "comfortable" | "spacious";

function useHtmlState() {
  const [theme, setThemeState] = React.useState<Theme>("dark");
  const [brand, setBrandState] = React.useState<BrandName>(tokens.defaultBrand);
  const [dir, setDirState] = React.useState<Dir>("ltr");
  const [density, setDensityState] = React.useState<Density>("comfortable");

  React.useEffect(() => {
    const d = document.documentElement;
    setThemeState((d.dataset.themeChoice as Theme) || "dark");
    setBrandState((d.dataset.brand as BrandName) || tokens.defaultBrand);
    setDirState((d.dir as Dir) || "ltr");
    setDensityState((d.dataset.density as Density) || "comfortable");
  }, []);

  const setTheme = (t: Theme) => {
    const d = document.documentElement;
    const dark =
      t === "dark" || (t === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
    d.classList.toggle("dark", dark);
    d.classList.toggle("light", !dark);
    d.style.colorScheme = dark ? "dark" : "light";
    d.dataset.themeChoice = t;
    localStorage.setItem("design-eg:theme", t);
    setThemeState(t);
  };
  const setBrand = (b: BrandName) => {
    document.documentElement.dataset.brand = b;
    localStorage.setItem("design-eg:brand", b);
    setBrandState(b);
  };
  const setDir = (v: Dir) => {
    const d = document.documentElement;
    d.dir = v;
    d.lang = v === "rtl" ? "ar" : "en";
    localStorage.setItem("design-eg:dir", v);
    setDirState(v);
  };
  const setDensity = (v: Density) => {
    document.documentElement.dataset.density = v;
    localStorage.setItem("design-eg:density", v);
    setDensityState(v);
  };

  return { theme, setTheme, brand, setBrand, dir, setDir, density, setDensity };
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

export function PlaygroundControls({ className }: { className?: string }) {
  const s = useHtmlState();
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <Segment<Theme>
        label="Colour mode"
        value={s.theme}
        onChange={s.setTheme}
        options={[
          { value: "light", label: <Sun className="size-3.5" />, title: "Light" },
          { value: "dark", label: <Moon className="size-3.5" />, title: "Dark" },
          { value: "system", label: <Monitor className="size-3.5" />, title: "System" },
        ]}
      />
      <Segment<BrandName>
        label="Brand"
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
      <Segment<Dir>
        label="Direction"
        value={s.dir}
        onChange={s.setDir}
        options={[
          { value: "ltr", label: "LTR" },
          { value: "rtl", label: "RTL" },
        ]}
      />
      <Segment<Density>
        label="Density"
        value={s.density}
        onChange={s.setDensity}
        options={[
          { value: "compact", label: <Rows3 className="size-3.5" />, title: "Compact" },
          { value: "comfortable", label: "Default" },
          { value: "spacious", label: "Airy" },
        ]}
      />
      <Button variant="ghost" size="sm" className="ms-auto" asChild>
        <a href="#tokens">
          <Languages className="size-3.5" />
          Tokens
        </a>
      </Button>
    </div>
  );
}
