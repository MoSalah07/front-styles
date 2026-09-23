"use client";

/** Range input for one or more values, with a thumb rendered per value and full keyboard support. */
import * as React from "react";
import { Slider as SliderPrimitive } from "radix-ui";
import { cn } from "../lib/cn";

export type SliderProps = React.ComponentProps<typeof SliderPrimitive.Root>;

function Slider({ className, defaultValue, value, min = 0, max = 100, ...props }: SliderProps) {
  // One thumb per value: the controlled value wins, then the uncontrolled
  // default, then `[min]` — which is what Radix itself falls back to, so the
  // thumb count always matches the primitive's internal state.
  const thumbValues = React.useMemo(
    () => (Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min]),
    [value, defaultValue, min],
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "data-[orientation=vertical]:h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "relative grow overflow-hidden rounded-full bg-muted",
          "data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full",
          "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5",
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "absolute bg-primary",
            "data-[orientation=horizontal]:h-full",
            "data-[orientation=vertical]:w-full",
          )}
        />
      </SliderPrimitive.Track>
      {thumbValues.map((_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className={cn(
            "block size-4 shrink-0 rounded-full border border-primary bg-background shadow-1",
            "transition-[color,box-shadow] duration-(--duration-fast) ease-standard outline-none",
            "hover:ring-2 hover:ring-ring/40",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "disabled:pointer-events-none disabled:opacity-50",
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
