"use client";

/** Row of toggles that share one variant and size and join into a single seamless control. */
import * as React from "react";
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import { type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";
import { toggleVariants } from "./toggle";

type ToggleGroupContextValue = VariantProps<typeof toggleVariants>;

const ToggleGroupContext = React.createContext<ToggleGroupContextValue>({
  variant: "default",
  size: "md",
});

export type ToggleGroupProps = React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  ToggleGroupContextValue;

function ToggleGroup({ className, variant, size, children, ...props }: ToggleGroupProps) {
  const context = React.useMemo(() => ({ variant, size }), [variant, size]);

  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-variant={variant ?? "default"}
      data-size={size ?? "md"}
      className={cn(
        "flex w-fit items-center rounded-control",
        "data-[variant=outline]:shadow-1",
        className,
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={context}>{children}</ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

export type ToggleGroupItemProps = React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  ToggleGroupContextValue;

function ToggleGroupItem({ className, children, variant, size, ...props }: ToggleGroupItemProps) {
  const context = React.useContext(ToggleGroupContext);
  const resolvedVariant = variant ?? context.variant;
  const resolvedSize = size ?? context.size;

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={resolvedVariant ?? "default"}
      data-size={resolvedSize ?? "md"}
      className={cn(
        toggleVariants({ variant: resolvedVariant, size: resolvedSize }),
        // Logical rounding keeps the seam on the correct edge under RTL.
        "min-w-0 shrink-0 rounded-none shadow-none",
        "first:rounded-s-control last:rounded-e-control",
        "focus-visible:z-(--z-raised)",
        "data-[variant=outline]:-ms-px data-[variant=outline]:first:ms-0",
        className,
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
}

export { ToggleGroup, ToggleGroupItem };
