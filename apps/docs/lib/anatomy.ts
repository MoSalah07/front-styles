/**
 * Hand-written anatomy and prop notes for the items that have an API worth
 * spelling out. Anything missing here simply renders without those sections.
 */

export interface PropNote {
  name: string;
  type: string;
  defaultValue?: string;
  description: string;
}

export interface ItemNotes {
  /** Exported parts, in composition order. */
  anatomy?: string[];
  props?: PropNote[];
  /** Extra guidance rendered under the props table. */
  notes?: string[];
}

const cls: PropNote = {
  name: "className",
  type: "string",
  description: "Merged last through cn(), so any utility here wins over the defaults.",
};

export const ITEM_NOTES: Record<string, ItemNotes> = {
  button: {
    anatomy: ["Button"],
    props: [
      {
        name: "variant",
        type: '"default" | "secondary" | "outline" | "ghost" | "link" | "destructive"',
        defaultValue: '"default"',
        description: "Visual weight. Hover and active colours come from the primary-* tokens.",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg" | "icon" | "icon-sm" | "icon-lg"',
        defaultValue: '"md"',
        description: "Height comes from --control-h-*, so it reacts to the density setting.",
      },
      {
        name: "loading",
        type: "boolean",
        defaultValue: "false",
        description: "Swaps in a spinner and marks the button busy for assistive technology.",
      },
      {
        name: "asChild",
        type: "boolean",
        defaultValue: "false",
        description: "Renders the single child instead of a <button>, e.g. an anchor.",
      },
      cls,
    ],
    notes: ["An icon-only button needs an aria-label; the glyph alone is not an accessible name."],
  },
  input: {
    anatomy: ["Input"],
    props: [
      {
        name: "aria-invalid",
        type: "boolean",
        description: "Switches the border and ring to the destructive role.",
      },
      cls,
    ],
    notes: ["Pair every field with a <Label htmlFor> so clicking the label focuses the control."],
  },
  textarea: { anatomy: ["Textarea"], props: [cls] },
  label: { anatomy: ["Label"], props: [cls] },
  select: {
    anatomy: [
      "Select",
      "SelectTrigger",
      "SelectValue",
      "SelectContent",
      "SelectGroup",
      "SelectLabel",
      "SelectItem",
      "SelectSeparator",
    ],
    notes: ["Select is a Radix root: use value/onValueChange, or defaultValue for uncontrolled."],
  },
  checkbox: {
    anatomy: ["Checkbox"],
    notes: ['Supports the indeterminate state via checked="indeterminate".'],
  },
  "radio-group": { anatomy: ["RadioGroup", "RadioGroupItem"] },
  switch: { anatomy: ["Switch"] },
  slider: { anatomy: ["Slider"] },
  toggle: { anatomy: ["Toggle"] },
  "toggle-group": { anatomy: ["ToggleGroup", "ToggleGroupItem"] },
  form: {
    anatomy: [
      "Form",
      "FormField",
      "FormItem",
      "FormLabel",
      "FormControl",
      "FormDescription",
      "FormMessage",
    ],
    notes: [
      "Form is react-hook-form's FormProvider. FormField is its Controller.",
      "FormControl clones its single child and wires id, aria-describedby and aria-invalid.",
    ],
  },
  dialog: {
    anatomy: [
      "Dialog",
      "DialogTrigger",
      "DialogContent",
      "DialogHeader",
      "DialogTitle",
      "DialogDescription",
      "DialogFooter",
      "DialogClose",
    ],
    props: [
      {
        name: "showCloseButton",
        type: "boolean",
        defaultValue: "true",
        description: "On DialogContent. Hide it when the content supplies its own close control.",
      },
    ],
    notes: ["Every DialogContent needs a DialogTitle, even if it is visually hidden."],
  },
  sheet: {
    anatomy: [
      "Sheet",
      "SheetTrigger",
      "SheetContent",
      "SheetHeader",
      "SheetTitle",
      "SheetDescription",
      "SheetFooter",
      "SheetClose",
    ],
    props: [
      {
        name: "side",
        type: '"top" | "bottom" | "start" | "end"',
        defaultValue: '"end"',
        description: "Logical edge the panel slides from, so it mirrors correctly in RTL.",
      },
    ],
  },
  "dropdown-menu": {
    anatomy: [
      "DropdownMenu",
      "DropdownMenuTrigger",
      "DropdownMenuContent",
      "DropdownMenuLabel",
      "DropdownMenuItem",
      "DropdownMenuCheckboxItem",
      "DropdownMenuRadioGroup",
      "DropdownMenuSub",
      "DropdownMenuSeparator",
      "DropdownMenuShortcut",
    ],
    props: [
      {
        name: "variant",
        type: '"default" | "destructive"',
        defaultValue: '"default"',
        description: "On DropdownMenuItem. Tints irreversible actions.",
      },
      {
        name: "inset",
        type: "boolean",
        description: "Pads the inline start so a label lines up with rows that carry indicators.",
      },
    ],
  },
  popover: { anatomy: ["Popover", "PopoverTrigger", "PopoverAnchor", "PopoverContent"] },
  tooltip: {
    anatomy: ["TooltipProvider", "Tooltip", "TooltipTrigger", "TooltipContent"],
    notes: ["Wrap a screen in a single TooltipProvider so the open delay is shared."],
  },
  tabs: { anatomy: ["Tabs", "TabsList", "TabsTrigger", "TabsContent"] },
  accordion: {
    anatomy: ["Accordion", "AccordionItem", "AccordionTrigger", "AccordionContent"],
    props: [
      {
        name: "type",
        type: '"single" | "multiple"',
        description: 'Required. With "single", add collapsible to allow closing the open item.',
      },
    ],
  },
  table: {
    anatomy: [
      "Table",
      "TableCaption",
      "TableHeader",
      "TableBody",
      "TableFooter",
      "TableRow",
      "TableHead",
      "TableCell",
    ],
    notes: ["Table renders inside its own scroll container, so wide tables never break the page."],
  },
  card: {
    anatomy: [
      "Card",
      "CardHeader",
      "CardTitle",
      "CardDescription",
      "CardAction",
      "CardContent",
      "CardFooter",
    ],
  },
  badge: {
    anatomy: ["Badge"],
    props: [
      {
        name: "variant",
        type: '"default" | "secondary" | "outline" | "soft" | "success" | "warning" | "destructive" | "info"',
        defaultValue: '"default"',
        description: "Status ramps are separate from the brand ramp, so they never collide.",
      },
    ],
  },
  alert: {
    anatomy: ["Alert", "AlertTitle", "AlertDescription"],
    props: [
      {
        name: "variant",
        type: '"default" | "destructive" | "success" | "warning" | "info"',
        defaultValue: '"default"',
        description: "Picks the status ramp for the border, tint and icon colour.",
      },
    ],
  },
  avatar: { anatomy: ["Avatar", "AvatarImage", "AvatarFallback"] },
  command: {
    anatomy: [
      "Command",
      "CommandDialog",
      "CommandInput",
      "CommandList",
      "CommandEmpty",
      "CommandGroup",
      "CommandItem",
      "CommandSeparator",
      "CommandShortcut",
    ],
    notes: ["Built on cmdk. CommandDialog adds the palette chrome and an accessible name."],
  },
  "data-table": {
    anatomy: ["DataTable"],
    props: [
      {
        name: "data",
        type: "readonly T[]",
        description: "Rows. Search, sort and paging all run on this array.",
      },
      {
        name: "columns",
        type: "DataTableColumn<T>[]",
        description: "id, header and cell are required; add sortable, align or accessor as needed.",
      },
      {
        name: "searchable",
        type: "boolean",
        defaultValue: "false",
        description: "Shows the search field.",
      },
      {
        name: "selectable",
        type: "boolean",
        defaultValue: "false",
        description: "Adds the checkbox column.",
      },
      {
        name: "paginated",
        type: "boolean",
        defaultValue: "true",
        description: "Set false to render every row.",
      },
      {
        name: "loading",
        type: "boolean",
        defaultValue: "false",
        description: "Replaces the body with skeleton rows.",
      },
    ],
  },
  "stat-card": {
    anatomy: ["StatCardGrid", "StatCard"],
    props: [
      { name: "label", type: "React.ReactNode", description: "What the figure measures." },
      {
        name: "value",
        type: "React.ReactNode",
        description: "The figure itself, already formatted.",
      },
      {
        name: "delta",
        type: "React.ReactNode",
        description: "Change against the comparison period.",
      },
      {
        name: "trend",
        type: '"up" | "down" | "flat"',
        description: "Colours the delta: success, destructive or muted.",
      },
      { name: "loading", type: "boolean", description: "Swaps the value and delta for skeletons." },
    ],
  },
  "pricing-table": {
    anatomy: ["PricingTable", "PricingTier"],
    props: [
      {
        name: "period",
        type: '"monthly" | "annual"',
        description: "Which price the tiers show. The parent owns it.",
      },
      {
        name: "onPeriodChange",
        type: "(period) => void",
        description: "Fired by the billing switch.",
      },
      {
        name: "columns",
        type: "2 | 3 | 4",
        defaultValue: "3",
        description: "Widest the row gets before wrapping.",
      },
      {
        name: "featured",
        type: "boolean",
        description: "On PricingTier. Lifts the tier onto the brand surface.",
      },
    ],
  },
  hero: {
    anatomy: ["Hero", "HeroEyebrow", "HeroTitle", "HeroDescription", "HeroActions", "HeroMedia"],
    props: [
      {
        name: "variant",
        type: '"default" | "centered" | "split"',
        defaultValue: '"default"',
        description: "Stacked and start-aligned, centered, or text beside media.",
      },
      {
        name: "decoration",
        type: '"dots" | "gradient" | "none"',
        defaultValue: '"dots"',
        description: "Decorative background layer. It is aria-hidden and never affects layout.",
      },
    ],
  },
};

/** Exported parts for the remaining items, so every page can name its imports. */
const EXTRA_ANATOMY: Record<string, string[]> = {
  utils: ["cn"],
  separator: ["Separator"],
  skeleton: ["Skeleton"],
  progress: ["Progress"],
  breadcrumb: [
    "Breadcrumb",
    "BreadcrumbList",
    "BreadcrumbItem",
    "BreadcrumbLink",
    "BreadcrumbPage",
    "BreadcrumbSeparator",
    "BreadcrumbEllipsis",
  ],
  pagination: [
    "Pagination",
    "PaginationContent",
    "PaginationItem",
    "PaginationLink",
    "PaginationPrevious",
    "PaginationNext",
    "PaginationEllipsis",
  ],
  collapsible: ["Collapsible", "CollapsibleTrigger", "CollapsibleContent"],
  "hover-card": ["HoverCard", "HoverCardTrigger", "HoverCardContent"],
  "alert-dialog": [
    "AlertDialog",
    "AlertDialogTrigger",
    "AlertDialogContent",
    "AlertDialogHeader",
    "AlertDialogTitle",
    "AlertDialogDescription",
    "AlertDialogFooter",
    "AlertDialogCancel",
    "AlertDialogAction",
  ],
  "context-menu": [
    "ContextMenu",
    "ContextMenuTrigger",
    "ContextMenuContent",
    "ContextMenuItem",
    "ContextMenuCheckboxItem",
    "ContextMenuRadioGroup",
    "ContextMenuSub",
    "ContextMenuSeparator",
    "ContextMenuShortcut",
  ],
  "scroll-area": ["ScrollArea", "ScrollBar"],
  "input-otp": ["InputOTP", "InputOTPGroup", "InputOTPSlot", "InputOTPSeparator"],
  sonner: ["Toaster", "toast"],
  "empty-state": ["EmptyState"],
  "error-state": ["ErrorState"],
  "page-header": ["PageHeader", "PageHeaderTitle", "PageHeaderDescription", "PageHeaderActions"],
  "cta-banner": ["CtaBanner"],
  faq: ["Faq"],
  "feature-grid": ["FeatureGrid", "FeatureCard"],
  testimonials: ["Testimonials", "TestimonialCard"],
  "logo-marquee": ["LogoMarquee", "LogoMarqueeItem"],
  "site-navbar": ["SiteNavbar"],
  "site-footer": ["SiteFooter"],
  "filter-bar": [
    "FilterBar",
    "FilterBarSearch",
    "FilterBarSelect",
    "FilterBarActions",
    "FilterBarChips",
    "FilterBarChip",
  ],
  "confirm-dialog": ["ConfirmDialog"],
  "stat-bento": ["StatBento", "StatBentoTile", "AnimatedNumber"],
  chart: [
    "ChartContainer",
    "ChartTooltip",
    "ChartTooltipContent",
    "ChartLegend",
    "ChartLegendContent",
  ],
  "app-sidebar": [
    "SidebarProvider",
    "Sidebar",
    "SidebarHeader",
    "SidebarContent",
    "SidebarGroup",
    "SidebarMenu",
    "SidebarMenuItem",
    "SidebarMenuButton",
    "SidebarFooter",
    "SidebarTrigger",
    "SidebarInset",
  ],
  "dashboard-shell": ["DashboardShell"],
  "error-pages": ["NotFoundPage", "ServerErrorPage", "ErrorPageLayout"],
  "forgot-password": ["ForgotPassword"],
  "login-centered": ["LoginCentered"],
  "login-split": ["LoginSplit"],
  "otp-verify": ["OtpVerify"],
  register: ["Register"],
  "settings-page": ["SettingsPage"],
};

export function getItemNotes(name: string): ItemNotes | undefined {
  const notes = ITEM_NOTES[name];
  if (notes) return notes;
  const anatomy = EXTRA_ANATOMY[name];
  return anatomy ? { anatomy } : undefined;
}
