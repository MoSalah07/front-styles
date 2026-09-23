import { tokens, brands } from "@design-eg/tokens";

const RAMPS = ["brand", "neutral", "success", "warning", "danger", "info"] as const;

/**
 * Renders every ramp step as a live swatch bound to the CSS variable, so the grid
 * re-colours instantly when the brand switches. Hex labels come from tokens.json.
 */
export function Swatches() {
  return (
    <section id="tokens" className="scroll-mt-24 space-y-6">
      <div className="space-y-1">
        <h2 className="text-h3 font-semibold">Tokens</h2>
        <p className="max-w-prose text-sm text-muted-foreground">
          Each brand is one JSON seed. The compiler derives OKLCH ramps, maps them onto semantic
          roles for light and dark, and fails the build if any text pair falls under WCAG AA.
        </p>
      </div>

      <div className="space-y-4">
        {RAMPS.map((ramp) => {
          const steps = Object.keys(tokens.brands[tokens.defaultBrand].ramps[ramp]).filter(
            (k) => k !== "seedStep",
          );
          return (
            <div key={ramp} className="space-y-1.5">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-xs text-muted-foreground">--{ramp}-*</span>
                <span className="text-xs text-muted-foreground">{steps.length} steps</span>
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(2.5rem,1fr))] gap-1">
                {steps.map((step) => (
                  <div key={step} className="space-y-1">
                    <div
                      className="h-10 rounded-sm ring-1 ring-inset ring-foreground/10"
                      style={{ background: `var(--${ramp}-${step})` }}
                      title={`--${ramp}-${step}`}
                    />
                    <div className="text-center font-mono text-[10px] text-muted-foreground">
                      {step}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {(
          [
            "background",
            "foreground",
            "card",
            "primary",
            "primary-foreground",
            "secondary",
            "muted",
            "muted-foreground",
            "accent",
            "border",
            "ring",
            "destructive",
          ] as const
        ).map((k) => (
          <div key={k} className="flex items-center gap-3 rounded-control border bg-card p-2">
            <span
              className="size-9 shrink-0 rounded-sm ring-1 ring-inset ring-foreground/10"
              style={{ background: `var(--${k})` }}
            />
            <span className="truncate font-mono text-xs">--{k}</span>
          </div>
        ))}
      </div>

      <details className="rounded-card border bg-card p-4 text-sm">
        <summary className="cursor-pointer font-medium">Compiled brands</summary>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {brands.map((b) => {
            const brand = tokens.brands[b];
            return (
              <li key={b} className="flex items-start gap-3 rounded-control border p-3">
                <span
                  className="mt-0.5 size-6 shrink-0 rounded-sm ring-1 ring-border"
                  style={{ background: brand.seed }}
                />
                <div className="min-w-0">
                  <div className="font-medium">
                    {brand.label}{" "}
                    <span className="font-mono text-xs text-muted-foreground">{brand.seed}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{brand.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </details>
    </section>
  );
}
