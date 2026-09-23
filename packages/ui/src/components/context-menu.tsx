"use client";

/** Menu raised by a right-click or long-press on its trigger area, with the same anatomy as the dropdown menu. */
import * as React from "react";
import { Check, ChevronRight, Circle } from "lucide-react";
import { ContextMenu as ContextMenuPrimitive } from "radix-ui";
import { cn } from "../lib/cn";

/** Surface styles shared by Content and SubContent. */
const menuSurface = [
  "z-(--z-dropdown) min-w-32 overflow-x-hidden overflow-y-auto p-1",
  "max-h-(--radix-context-menu-content-available-height)",
  "origin-(--radix-context-menu-content-transform-origin)",
  "rounded-md border bg-popover text-popover-foreground shadow-2 outline-none",
  "motion-safe:transition-opacity motion-safe:duration-(--duration-fast) motion-safe:ease-standard",
  "data-[state=open]:opacity-100 data-[state=closed]:opacity-0",
  "motion-safe:data-[state=open]:animate-scale-in",
];

/** Row styles shared by Item, CheckboxItem, RadioItem and SubTrigger. */
const menuItem = [
  "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none",
  "transition-[background-color,color] duration-(--duration-fast) ease-standard",
  "focus:bg-accent focus:text-accent-foreground",
  "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-4",
];

function ContextMenu(props: React.ComponentProps<typeof ContextMenuPrimitive.Root>) {
  return <ContextMenuPrimitive.Root {...props} />;
}

function ContextMenuTrigger({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Trigger>) {
  return (
    <ContextMenuPrimitive.Trigger
      data-slot="context-menu-trigger"
      className={cn(className)}
      {...props}
    />
  );
}

function ContextMenuPortal(props: React.ComponentProps<typeof ContextMenuPrimitive.Portal>) {
  return <ContextMenuPrimitive.Portal {...props} />;
}

function ContextMenuGroup({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Group>) {
  return (
    <ContextMenuPrimitive.Group
      data-slot="context-menu-group"
      className={cn(className)}
      {...props}
    />
  );
}

function ContextMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Content>) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        data-slot="context-menu-content"
        className={cn(menuSurface, className)}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  );
}

export interface ContextMenuItemProps extends React.ComponentProps<
  typeof ContextMenuPrimitive.Item
> {
  /** `destructive` tints the row for irreversible actions. */
  variant?: "default" | "destructive";
  /** Pad the inline start so the label lines up with rows that carry an indicator. */
  inset?: boolean;
}

function ContextMenuItem({
  className,
  variant = "default",
  inset = false,
  ...props
}: ContextMenuItemProps) {
  return (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
      data-variant={variant}
      data-inset={inset || undefined}
      className={cn(
        menuItem,
        variant === "destructive" &&
          "text-destructive focus:bg-destructive/10 focus:text-destructive",
        inset && "ps-8",
        className,
      )}
      {...props}
    />
  );
}

function ContextMenuCheckboxItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem>) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      data-slot="context-menu-checkbox-item"
      className={cn(menuItem, "ps-8", className)}
      {...props}
    >
      <span className="pointer-events-none absolute start-2 flex size-4 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <Check className="size-4" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  );
}

function ContextMenuRadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup>) {
  return (
    <ContextMenuPrimitive.RadioGroup
      data-slot="context-menu-radio-group"
      className={cn(className)}
      {...props}
    />
  );
}

function ContextMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem>) {
  return (
    <ContextMenuPrimitive.RadioItem
      data-slot="context-menu-radio-item"
      className={cn(menuItem, "ps-8", className)}
      {...props}
    >
      <span className="pointer-events-none absolute start-2 flex size-4 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <Circle className="size-2" fill="currentColor" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  );
}

export interface ContextMenuLabelProps extends React.ComponentProps<
  typeof ContextMenuPrimitive.Label
> {
  /** Pad the inline start so the label lines up with rows that carry an indicator. */
  inset?: boolean;
}

function ContextMenuLabel({ className, inset = false, ...props }: ContextMenuLabelProps) {
  return (
    <ContextMenuPrimitive.Label
      data-slot="context-menu-label"
      data-inset={inset || undefined}
      className={cn(
        "px-2 py-1.5 text-xs font-semibold text-muted-foreground",
        inset && "ps-8",
        className,
      )}
      {...props}
    />
  );
}

function ContextMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) {
  return (
    <ContextMenuPrimitive.Separator
      data-slot="context-menu-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

function ContextMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="context-menu-shortcut"
      // `ms-auto` parks the hint at the inline end in both directions.
      className={cn("ms-auto text-xs tracking-widest text-muted-foreground", className)}
      {...props}
    />
  );
}

function ContextMenuSub(props: React.ComponentProps<typeof ContextMenuPrimitive.Sub>) {
  return <ContextMenuPrimitive.Sub {...props} />;
}

export interface ContextMenuSubTriggerProps extends React.ComponentProps<
  typeof ContextMenuPrimitive.SubTrigger
> {
  /** Pad the inline start so the label lines up with rows that carry an indicator. */
  inset?: boolean;
}

function ContextMenuSubTrigger({
  className,
  inset = false,
  children,
  ...props
}: ContextMenuSubTriggerProps) {
  return (
    <ContextMenuPrimitive.SubTrigger
      data-slot="context-menu-sub-trigger"
      data-inset={inset || undefined}
      className={cn(
        menuItem,
        "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
        inset && "ps-8",
        className,
      )}
      {...props}
    >
      {children}
      {/* The chevron points into the submenu, which opens towards the left in RTL. */}
      <ChevronRight className="ms-auto size-4 rtl:-scale-x-100" />
    </ContextMenuPrimitive.SubTrigger>
  );
}

function ContextMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubContent>) {
  return (
    <ContextMenuPrimitive.SubContent
      data-slot="context-menu-sub-content"
      className={cn(menuSurface, "shadow-3", className)}
      {...props}
    />
  );
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuPortal,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
};
