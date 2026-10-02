/**
 * Hand-written anatomy and prop notes for the items that have an API worth
 * spelling out. Anything missing here simply renders without those sections.
 *
 * Plain ESM with JSDoc types rather than TypeScript, because two consumers need
 * it: the docs app imports it through ./anatomy, and scripts/gen-md.mjs runs
 * under bare node before next build. The types live in ./anatomy.
 *
 * @typedef {import("./anatomy").ItemNotes} ItemNotes
 * @typedef {import("./anatomy").PropNote} PropNote
 */
import { localiseItemNotes } from "./item-notes-i18n.mjs";

/** @type {PropNote} */
const cls = {
  name: "className",
  type: "string",
  description: "Merged last through cn(), so any utility here wins over the defaults.",
};

/** @type {Record<string, ItemNotes>} */
export const ITEM_NOTES = {
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
  "copy-button": {
    anatomy: ["CopyButton", "useClipboard"],
    props: [
      {
        name: "value",
        type: "string | (() => string | Promise<string>)",
        description:
          "What lands on the clipboard. The function form runs at click time, for text that is only known then.",
      },
      {
        name: "copyLabel",
        type: "string",
        defaultValue: '"Copy"',
        description: "Accessible name for the icon-only form, and the title on hover.",
      },
      {
        name: "copiedLabel",
        type: "string",
        defaultValue: '"Copied"',
        description: "Replaces the visible label and is announced in a polite live region.",
      },
      {
        name: "timeout",
        type: "number",
        defaultValue: "2000",
        description: "How long the success state lasts, in milliseconds.",
      },
      {
        name: "onCopy",
        type: "(value: string) => void",
        description: "Runs with the copied text. Call notify.copied() here for a toast.",
      },
      {
        name: "onCopyError",
        type: "(error: Error) => void",
        description: "Runs when the browser refuses the write, e.g. on an insecure origin.",
      },
      cls,
    ],
    notes: [
      "The button carries no toast dependency of its own; wire onCopy to notify() when you want one.",
      "useClipboard is the same logic without the markup, for a copy affordance of your own.",
    ],
  },
  "install-command": {
    anatomy: ["InstallCommand"],
    props: [
      {
        name: "packageName",
        type: "string | string[]",
        description: "Package(s) to add. Rendered as npm install, pnpm add, yarn add and bun add.",
      },
      {
        name: "command",
        type: "string",
        description:
          "A binary to run once instead, prefixed per manager with npx, pnpm dlx, yarn dlx or bunx.",
      },
      {
        name: "commands",
        type: "Partial<Record<PackageManager, string>>",
        description: "Full override per manager, when neither shape above fits.",
      },
      {
        name: "dev",
        type: "boolean",
        defaultValue: "false",
        description: "Adds the dev-dependency flag each manager uses.",
      },
      {
        name: "managers",
        type: "PackageManager[]",
        defaultValue: '["npm", "pnpm", "yarn", "bun"]',
        description: "Which tabs to show, in order.",
      },
      {
        name: "storageKey",
        type: "string | false",
        defaultValue: '"design-eg:package-manager"',
        description:
          "Where the reader's choice is remembered. It is read after mount, so SSR stays stable.",
      },
      {
        name: "toast",
        type: "boolean | string",
        defaultValue: "true",
        description: "Toast on a successful copy; a string replaces the message.",
      },
      cls,
    ],
    notes: [
      'The command renders dir="ltr" so it stays readable inside an RTL page.',
      "Mount <Toaster /> once in your root layout, or pass toast={false}.",
    ],
  },
  "code-block": {
    anatomy: ["CodeBlock"],
    props: [
      {
        name: "code",
        type: "string",
        description: "The text shown, and the exact text the copy button writes.",
      },
      {
        name: "label",
        type: "string",
        defaultValue: '"tsx"',
        description: "Gutter label: a file name, or a language.",
      },
      {
        name: "lineNumbers",
        type: "boolean",
        defaultValue: "false",
        description: "Numbers the lines. They are aria-hidden and never reach the clipboard.",
      },
      {
        name: "maxHeight",
        type: "string",
        defaultValue: '"32rem"',
        description: "Height at which the block starts scrolling.",
      },
      {
        name: "hideHeader",
        type: "boolean",
        defaultValue: "false",
        description: "Drops the bar and floats the copy button over the code on hover or focus.",
      },
      {
        name: "toast",
        type: "boolean | string",
        defaultValue: "true",
        description: "Toast on a successful copy; a string replaces the message.",
      },
      cls,
    ],
    notes: [
      "Unhighlighted on purpose: no tokenizer dependency, and nothing to mismatch on hydration.",
    ],
  },
  "theme-select": {
    anatomy: ["ThemeSelect"],
    props: [
      {
        name: "variant",
        type: '"select" | "icon" | "ghost"',
        defaultValue: '"select"',
        description:
          "`select` shows the mode's name and a chevron; the other two collapse to a square button for a header.",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        defaultValue: '"md"',
        description: "Height comes from --control-h-*, so it follows the density setting.",
      },
      {
        name: "align",
        type: '"start" | "center" | "end"',
        defaultValue: '"end"',
        description: "Logical edge the list lines up with, so it mirrors in RTL.",
      },
      {
        name: "labels",
        type: "Partial<ThemeSelectLabels>",
        description:
          "Overrides Theme, Light, Dark and System, for an app that runs in another language.",
      },
      {
        name: "defaultTheme",
        type: '"light" | "dark" | "system"',
        defaultValue: '"system"',
        description: "Mode used for the server render and until the reader has chosen.",
      },
      {
        name: "storageKey",
        type: "string",
        defaultValue: '"design-eg:theme"',
        description: "Where the choice is remembered. Must match your pre-paint script.",
      },
      {
        name: "onThemeChange",
        type: "(theme: Theme) => void",
        description: "Fires after the document root has been updated.",
      },
      cls,
    ],
    notes: [
      "State lives on `<html>`, not in a React context, so this works with or without a provider and agrees with a pre-paint script that ran before React booted.",
      "Add an inline script in `<head>` that reads the same key and sets the class before first paint, or the page flashes the wrong theme on every load.",
      "The System row shows what system currently resolves to, so the choice is never a guess.",
    ],
  },
  "language-select": {
    anatomy: ["LanguageSelect"],
    props: [
      {
        name: "locales",
        type: "readonly LocaleOption[]",
        defaultValue: "English, Arabic",
        description:
          "Languages to offer, in list order. Each is { code, nativeName, englishName?, dir? }.",
      },
      {
        name: "display",
        type: '"native" | "code"',
        defaultValue: '"native"',
        description: "Whether the trigger shows the language's own name or its tag, e.g. AR.",
      },
      {
        name: "variant",
        type: '"select" | "icon" | "ghost"',
        defaultValue: '"select"',
        description: "Same three trigger shapes as ThemeSelect.",
      },
      {
        name: "label",
        type: "string",
        defaultValue: '"Language"',
        description: "Names the control and heads the list. Translate it with the rest of your UI.",
      },
      {
        name: "storageKey",
        type: "string",
        defaultValue: '"design-eg:locale"',
        description: "Where the choice is remembered. Must match your pre-paint script.",
      },
      {
        name: "onLocaleChange",
        type: "(locale: LocaleOption) => void",
        description:
          "Fires after lang and dir are set. Wire your i18n framework or router here; the component does not navigate.",
      },
      cls,
    ],
    notes: [
      'Choosing Arabic sets dir="rtl" as well as lang, which is the whole RTL pass for every component on the page — the library is written in logical properties.',
      "Direction comes from the tag when a locale does not declare one, so Hebrew and Persian mirror without extra configuration.",
      "No flags. A flag is a country, not a language, and Arabic has twenty of them.",
    ],
  },
  "use-theme": {
    anatomy: ["useTheme"],
    props: [
      {
        name: "returns",
        type: "{ theme, resolvedTheme, setTheme, toggleTheme, themes, mounted }",
        description:
          "`theme` may be system; `resolvedTheme` is always light or dark. `mounted` is false during hydration.",
      },
      {
        name: "defaultTheme",
        type: '"light" | "dark" | "system"',
        defaultValue: '"system"',
        description: "Used for the server render and until the reader has chosen.",
      },
      {
        name: "storageKey",
        type: "string",
        defaultValue: '"design-eg:theme"',
        description: "localStorage key holding the choice.",
      },
    ],
    notes: [
      "Built on useSyncExternalStore over the document, so several pickers on one page stay in step, and so do two tabs.",
      "`system` keeps tracking the OS: flipping appearance in system settings repaints the page with no reload.",
      "Also exports applyTheme and resolveTheme, for a pre-paint script or an imperative call outside React.",
    ],
  },
  "use-locale": {
    anatomy: ["useLocale"],
    props: [
      {
        name: "returns",
        type: "{ locale, option, locales, dir, setLocale, mounted }",
        description: "`option` is the full entry for the active code; `dir` is already applied.",
      },
      {
        name: "locales",
        type: "readonly LocaleOption[]",
        defaultValue: "English, Arabic",
        description: "The languages to offer. A code outside the list is ignored.",
      },
      {
        name: "storageKey",
        type: "string",
        defaultValue: '"design-eg:locale"',
        description: "localStorage key holding the choice.",
      },
    ],
    notes: [
      "Writes lang and dir on `<html>` and nothing else: it does not route, and it does not load message catalogues. Wire those to onLocaleChange.",
      "Also exports directionOf and applyLocale, so a pre-paint script can set the direction before first paint.",
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

/**
 * Exported parts for the remaining items, so every page can name its imports.
 * @type {Record<string, string[]>}
 */
const EXTRA_ANATOMY = {
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
  carousel: [
    "Carousel",
    "CarouselContent",
    "CarouselItem",
    "CarouselPrevious",
    "CarouselNext",
    "CarouselDots",
    "useCarousel",
  ],
  "input-otp": ["InputOTP", "InputOTPGroup", "InputOTPSlot", "InputOTPSeparator"],
  combobox: ["Combobox"],
  "navigation-menu": [
    "NavigationMenu",
    "NavigationMenuList",
    "NavigationMenuItem",
    "NavigationMenuTrigger",
    "NavigationMenuContent",
    "NavigationMenuLink",
    "NavigationMenuIndicator",
    "NavigationMenuViewport",
    "navigationMenuTriggerStyle",
  ],
  calendar: ["Calendar"],
  "date-picker": ["DatePicker"],
  sonner: ["Toaster", "notify", "toast"],
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
  "product-card": ["ProductCard"],
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
  "admin-dashboard": ["AdminDashboard"],
  "dashboard-shell": ["DashboardShell"],
  "error-pages": ["NotFoundPage", "ServerErrorPage", "ErrorPageLayout"],
  "forgot-password": ["ForgotPassword"],
  "landing-saas": ["LandingSaas"],
  "landing-store": ["LandingStore"],
  "landing-streaming": ["LandingStreaming"],
  "login-centered": ["LoginCentered"],
  "login-phone": ["LoginPhone"],
  "login-split": ["LoginSplit"],
  "otp-verify": ["OtpVerify"],
  register: ["Register"],
  "register-wizard": ["RegisterWizard"],
  "settings-page": ["SettingsPage"],
};

/**
 * @param {string} name
 * @param {string} [locale] BCP 47 tag; anything but "en" gets the translated notes.
 * @returns {ItemNotes | undefined}
 */
export function getItemNotes(name, locale = "en") {
  const notes =
    ITEM_NOTES[name] ?? (EXTRA_ANATOMY[name] ? { anatomy: EXTRA_ANATOMY[name] } : undefined);
  // English is the source, so it short-circuits; every other language gets the
  // same object with its translated descriptions laid over the top.
  return locale === "en" ? notes : localiseItemNotes(notes, name, locale);
}

/**
 * The barrel export to import for an item. The documented anatomy is
 * authoritative; the title is only a fallback for items without notes.
 *
 * @param {string} name
 * @param {string} title
 * @returns {string}
 */
export function exportName(name, title) {
  const documented = getItemNotes(name)?.anatomy?.[0];
  if (documented) return documented;
  // A hook keeps its camelCase name: use-clipboard exports useClipboard, not
  // UseClipboard, which is what title-casing would give.
  if (name.startsWith("use-")) return name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  return title.replace(/\s+/g, "");
}
