"use client";

/** Admin overview page inside the dashboard shell: a header with a date-range switch and export, four KPI cards, revenue and channel charts, a recent-orders table, top products and an activity feed, all fed by typed props that fall back to neutral sample data. */
import * as React from "react";
import {
  Banknote,
  BarChart3,
  Download,
  Ellipsis,
  Eye,
  LayoutDashboard,
  Package,
  Percent,
  ReceiptText,
  RotateCcw,
  Settings,
  ShoppingCart,
  Store,
  User,
  Users,
} from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import { Avatar, AvatarFallback, AvatarImage } from "../components/avatar";
import { Badge } from "../components/badge";
import { Button } from "../components/button";
import { Card, CardContent, CardDescription, CardHeader } from "../components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/dropdown-menu";
import { Progress } from "../components/progress";
import { ToggleGroup, ToggleGroupItem } from "../components/toggle-group";
import { useSidebar } from "../blocks/app-sidebar";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../blocks/chart";
import { DataTable, type DataTableColumn } from "../blocks/data-table";
import { EmptyState } from "../blocks/empty-state";
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderTitle,
} from "../blocks/page-header";
import { StatCard, type StatCardTrend } from "../blocks/stat-card";
import {
  DashboardShell,
  type DashboardShellMenuItem,
  type DashboardShellNavGroup,
  type DashboardShellProps,
  type DashboardShellUser,
} from "../templates/dashboard-shell";
import { cn } from "../lib/cn";
import { useFormatters, useI18n, type MessageKey, type TranslateFn } from "../lib/i18n";

/* ------------------------------------------------------------------ types */

/** The periods the header switch offers. */
export type AdminDashboardRange = "7d" | "30d" | "90d";

/** A `Date`, a timestamp, or an ISO string. A bare `YYYY-MM-DD` is read as a local date. */
export type AdminDashboardDate = Date | string | number;

export interface AdminDashboardKpi {
  /** The raw figure. Revenue is in `currency`; conversion is a fraction, so 0.032 is 3.2%. */
  value: number;
  /** Change against the previous period as a fraction: 0.125 renders as "+12.5%". */
  delta?: number;
  /** Colour of the delta. Defaults to the sign of `delta`. */
  trend?: StatCardTrend;
}

export interface AdminDashboardStats {
  revenue: AdminDashboardKpi;
  orders: AdminDashboardKpi;
  customers: AdminDashboardKpi;
  conversion: AdminDashboardKpi;
}

export interface AdminDashboardRevenuePoint {
  date: AdminDashboardDate;
  /** Revenue for the day, in `currency`. */
  revenue: number;
  /** The matching day of the previous period. When any point has it, a dashed comparison line is drawn. */
  previous?: number;
}

export interface AdminDashboardChannel {
  /** Stable key. */
  id: string;
  label: string;
  /** Revenue from the channel, in `currency`. */
  value: number;
}

export type AdminDashboardOrderStatus = "paid" | "pending" | "refunded" | "failed";

export interface AdminDashboardCustomer {
  name: string;
  email?: string;
  /** Avatar image source. Falls back to `initials`, then to the first letters of the name. */
  avatarSrc?: string;
  initials?: string;
}

export interface AdminDashboardOrder {
  id: string;
  customer: AdminDashboardCustomer;
  status: AdminDashboardOrderStatus;
  /** Order total, in `currency`. */
  amount: number;
  date: AdminDashboardDate;
}

/** Rows of the per-order actions menu. */
export type AdminDashboardOrderAction = "view" | "invoice" | "refund";

export interface AdminDashboardProduct {
  id: string;
  name: string;
  /** Units sold in the period. */
  units: number;
  /** Revenue in `currency`. The bars are scaled against the best seller. */
  revenue: number;
}

/** Colour of the dot beside an activity entry. */
export type AdminDashboardTone = "neutral" | "info" | "success" | "warning" | "destructive";

export interface AdminDashboardActivity {
  id: string;
  /** What happened, already phrased in the reader's language. */
  message: React.ReactNode;
  date: AdminDashboardDate;
  tone?: AdminDashboardTone;
}

export interface AdminDashboardProps extends Omit<
  DashboardShellProps,
  "title" | "user" | "children"
> {
  /** Page heading. */
  title?: React.ReactNode;
  /** Line under the heading. */
  description?: React.ReactNode;
  /** Controlled period. Pair it with `onRangeChange`. */
  range?: AdminDashboardRange;
  /** Initial period when the component owns it. */
  defaultRange?: AdminDashboardRange;
  /** Called when the reader picks another period, controlled or not. */
  onRangeChange?: (range: AdminDashboardRange) => void;
  /** Called by the export button with the period on screen. */
  onExport?: (range: AdminDashboardRange) => void;
  /** Text of the export button. */
  exportLabel?: string;
  /** ISO 4217 code every amount is formatted in. */
  currency?: string;
  /** The four KPI cards. */
  stats?: AdminDashboardStats;
  /** One point per day, oldest first. */
  revenueSeries?: AdminDashboardRevenuePoint[];
  /** Revenue split by sales channel. */
  channelSeries?: AdminDashboardChannel[];
  /** Rows of the recent-orders table. */
  orders?: AdminDashboardOrder[];
  /** Called from the row-actions menu of an order. */
  onOrderAction?: (action: AdminDashboardOrderAction, order: AdminDashboardOrder) => void;
  /** Best sellers, highest revenue first. */
  topProducts?: AdminDashboardProduct[];
  /** Feed entries, newest first. */
  activity?: AdminDashboardActivity[];
  /** Signed-in account in the top bar. `null` hides the user menu. */
  user?: DashboardShellUser | null;
  /** Extra sections rendered after the grid. */
  children?: React.ReactNode;
}

/* -------------------------------------------------------------- constants */

const RANGES: readonly AdminDashboardRange[] = ["7d", "30d", "90d"];

const RANGE_DAYS: Record<AdminDashboardRange, number> = { "7d": 7, "30d": 30, "90d": 90 };

function isRange(value: string): value is AdminDashboardRange {
  return (RANGES as readonly string[]).includes(value);
}

const STATUS_VARIANT: Record<
  AdminDashboardOrderStatus,
  "success" | "warning" | "info" | "destructive"
> = {
  paid: "success",
  pending: "warning",
  refunded: "info",
  failed: "destructive",
};

const STATUS_LABEL: Record<AdminDashboardOrderStatus, MessageKey> = {
  paid: "adminDashboard.statusPaid",
  pending: "adminDashboard.statusPending",
  refunded: "adminDashboard.statusRefunded",
  failed: "adminDashboard.statusFailed",
};

const TONE_DOT: Record<AdminDashboardTone, string> = {
  neutral: "bg-muted-foreground",
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
};

/* ---------------------------------------------------------------- helpers */

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Reads a bare `YYYY-MM-DD` as local midnight, so a day never slips across a time zone. */
function toDate(value: AdminDashboardDate): Date {
  if (value instanceof Date) return value;
  if (typeof value === "string") {
    const match = DATE_ONLY.exec(value);
    if (match) return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  }
  return new Date(value);
}

function isValidDate(date: Date): boolean {
  return !Number.isNaN(date.getTime());
}

function initialsOf(person: AdminDashboardCustomer): string {
  if (person.initials) return person.initials;
  return person.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function trendOf(kpi: AdminDashboardKpi): StatCardTrend {
  if (kpi.trend) return kpi.trend;
  if (!kpi.delta) return "flat";
  return kpi.delta > 0 ? "up" : "down";
}

function sum(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

interface DashboardFormats {
  money: Intl.NumberFormat;
  moneyWhole: Intl.NumberFormat;
  moneyCompact: Intl.NumberFormat;
  count: Intl.NumberFormat;
  percent: Intl.NumberFormat;
  change: Intl.NumberFormat;
  date: Intl.DateTimeFormat;
  dateTime: Intl.DateTimeFormat;
  day: Intl.DateTimeFormat;
}

/** The library's locale-bound formatters, plus the currency and percent ones this page needs. */
function useDashboardFormats(currency: string): DashboardFormats {
  const { locale } = useI18n();
  const { number, date } = useFormatters();

  return React.useMemo(
    () => ({
      money: new Intl.NumberFormat(locale, { style: "currency", currency }),
      moneyWhole: new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
      moneyCompact: new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        notation: "compact",
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      }),
      count: number,
      percent: new Intl.NumberFormat(locale, {
        style: "percent",
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }),
      change: new Intl.NumberFormat(locale, {
        style: "percent",
        signDisplay: "exceptZero",
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }),
      date,
      dateTime: new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }),
      day: new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }),
    }),
    [currency, date, locale, number],
  );
}

function formatDate(format: Intl.DateTimeFormat, value: AdminDashboardDate) {
  const date = toDate(value);
  return isValidDate(date)
    ? { text: format.format(date), iso: date.toISOString() }
    : { text: String(value), iso: undefined };
}

/* ------------------------------------------------------------ sample data */

/*
 * Every fallback below is fixed rather than generated from the clock or
 * Math.random, so the server and the client render the same page and a
 * screenshot test sees the same pixels every run.
 */

/** Last day of the sample series: 28 September 2026 (months are zero-based). */
const SAMPLE_END = { year: 2026, month: 8, day: 28 } as const;
const SAMPLE_SPAN = 90;

function sampleRevenueSeries(days: number): AdminDashboardRevenuePoint[] {
  return Array.from({ length: days }, (_, index) => {
    // Position in the full 90-day span, so a day keeps its value across ranges.
    const n = SAMPLE_SPAN - days + index;
    const date = new Date(SAMPLE_END.year, SAMPLE_END.month, SAMPLE_END.day - (days - 1 - index));
    const weekend = date.getDay() === 5 || date.getDay() === 6 ? 620 : 0;
    return {
      date,
      revenue: Math.round(4300 + n * 16 + Math.sin(n / 2.4) * 540 + weekend),
      previous: Math.round(4050 + n * 12 + Math.sin((n + 4) / 2.1) * 500 + weekend * 0.8),
    };
  });
}

function sampleStats(series: readonly AdminDashboardRevenuePoint[]): AdminDashboardStats {
  const revenue = sum(series.map((point) => point.revenue));
  const previous = sum(series.map((point) => point.previous ?? 0));
  const orders = Math.round(revenue / 86);
  const previousOrders = Math.round(previous / 83);
  const customers = Math.round(orders * 0.71);
  const previousCustomers = Math.round(previousOrders * 0.69);
  const change = (now: number, before: number) => (before === 0 ? 0 : now / before - 1);

  return {
    revenue: { value: revenue, delta: change(revenue, previous) },
    orders: { value: orders, delta: change(orders, previousOrders) },
    customers: { value: customers, delta: change(customers, previousCustomers) },
    conversion: { value: 0.0318, delta: -0.042 },
  };
}

const SAMPLE_CHANNELS: ReadonlyArray<{ id: string; label: MessageKey; share: number }> = [
  { id: "online", label: "adminDashboard.channelOnline", share: 0.46 },
  { id: "marketplace", label: "adminDashboard.channelMarketplace", share: 0.27 },
  { id: "retail", label: "adminDashboard.channelRetail", share: 0.17 },
  { id: "social", label: "adminDashboard.channelSocial", share: 0.1 },
];

function sampleChannels(t: TranslateFn, total: number): AdminDashboardChannel[] {
  return SAMPLE_CHANNELS.map((channel) => ({
    id: channel.id,
    label: t(channel.label),
    value: Math.round(total * channel.share),
  }));
}

const SAMPLE_PRODUCTS: ReadonlyArray<{
  id: string;
  name: MessageKey;
  price: number;
  unitsPerMonth: number;
}> = [
  { id: "desk", name: "adminDashboard.productDesk", price: 389, unitsPerMonth: 96 },
  { id: "chair", name: "adminDashboard.productChair", price: 249, unitsPerMonth: 118 },
  { id: "headphones", name: "adminDashboard.productHeadphones", price: 129, unitsPerMonth: 164 },
  { id: "lamp", name: "adminDashboard.productLamp", price: 59, unitsPerMonth: 205 },
];

function sampleProducts(t: TranslateFn, days: number): AdminDashboardProduct[] {
  return SAMPLE_PRODUCTS.map((product) => {
    const units = Math.max(1, Math.round((product.unitsPerMonth * days) / 30));
    return { id: product.id, name: t(product.name), units, revenue: units * product.price };
  });
}

const SAMPLE_ORDERS: AdminDashboardOrder[] = [
  {
    id: "ORD-3218",
    customer: { name: "Salma Farid", email: "salma@example.com" },
    status: "paid",
    amount: 249,
    date: "2026-09-28",
  },
  {
    id: "ORD-3217",
    customer: { name: "Karim Adel", email: "karim@example.com" },
    status: "pending",
    amount: 89.5,
    date: "2026-09-28",
  },
  {
    id: "ORD-3216",
    customer: { name: "Lina Haddad", email: "lina@example.com" },
    status: "paid",
    amount: 1299,
    date: "2026-09-27",
  },
  {
    id: "ORD-3215",
    customer: { name: "Omar Nabil", email: "omar@example.com" },
    status: "failed",
    amount: 64.99,
    date: "2026-09-27",
  },
  {
    id: "ORD-3214",
    customer: { name: "Mariam Saleh", email: "mariam@example.com" },
    status: "paid",
    amount: 412.3,
    date: "2026-09-26",
  },
  {
    id: "ORD-3213",
    customer: { name: "Youssef Amin", email: "youssef@example.com" },
    status: "refunded",
    amount: 158,
    date: "2026-09-26",
  },
  {
    id: "ORD-3212",
    customer: { name: "Hana Mourad", email: "hana@example.com" },
    status: "pending",
    amount: 76.25,
    date: "2026-09-25",
  },
  {
    id: "ORD-3211",
    customer: { name: "Tarek Samy", email: "tarek@example.com" },
    status: "paid",
    amount: 539.9,
    date: "2026-09-25",
  },
];

function sampleActivity(t: TranslateFn, money: Intl.NumberFormat): AdminDashboardActivity[] {
  return [
    {
      id: "order",
      tone: "info",
      date: "2026-09-28T10:24",
      message: t("adminDashboard.activityOrder", { name: "Salma Farid", id: "ORD-3218" }),
    },
    {
      id: "payout",
      tone: "success",
      date: "2026-09-28T09:05",
      message: t("adminDashboard.activityPayout", { amount: money.format(12480) }),
    },
    {
      id: "stock",
      tone: "warning",
      date: "2026-09-27T17:42",
      message: t("adminDashboard.activityStock", { product: t("adminDashboard.productLamp") }),
    },
    {
      id: "refund",
      tone: "destructive",
      date: "2026-09-27T14:10",
      message: t("adminDashboard.activityRefund", { id: "ORD-3213" }),
    },
    {
      id: "signup",
      tone: "neutral",
      date: "2026-09-27T11:36",
      message: t("adminDashboard.activitySignup", { name: "Rami Khalil" }),
    },
  ];
}

function sampleNav(t: TranslateFn, count: Intl.NumberFormat): DashboardShellNavGroup[] {
  return [
    {
      label: t("adminDashboard.navStore"),
      items: [
        { label: t("adminDashboard.navOverview"), icon: <LayoutDashboard />, active: true },
        { label: t("adminDashboard.navOrders"), icon: <ShoppingCart />, badge: count.format(12) },
        { label: t("adminDashboard.navProducts"), icon: <Package /> },
        { label: t("adminDashboard.navCustomers"), icon: <Users /> },
      ],
    },
    {
      label: t("adminDashboard.navWorkspace"),
      items: [
        { label: t("adminDashboard.navReports"), icon: <BarChart3 /> },
        { label: t("adminDashboard.navSettings"), icon: <Settings /> },
      ],
    },
  ];
}

function sampleMenuItems(t: TranslateFn): DashboardShellMenuItem[] {
  return [
    { label: t("adminDashboard.menuProfile"), icon: <User aria-hidden="true" /> },
    { label: t("adminDashboard.navSettings"), icon: <Settings aria-hidden="true" /> },
  ];
}

const SAMPLE_USER: DashboardShellUser = { name: "Nadia Kamel", email: "nadia@example.com" };

function SampleBrand({ name }: { name: string }) {
  return (
    <>
      <span
        data-slot="admin-dashboard-brand-mark"
        aria-hidden="true"
        className="flex size-7 items-center justify-center rounded-control bg-primary text-primary-foreground"
      >
        <Store className="size-4" />
      </span>
      <span
        data-slot="admin-dashboard-brand-name"
        className="truncate font-semibold group-data-[state=collapsed]/sidebar:hidden"
      >
        {name}
      </span>
    </>
  );
}

/* ------------------------------------------------------------ page pieces */

function SectionTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="admin-dashboard-section-title"
      className={cn("text-h4 leading-none font-semibold tracking-tight", className)}
      {...props}
    />
  );
}

/*
 * Recharts lays its SVG out for left-to-right reading and places tick labels
 * with `text-anchor`, which the browser flips under an inherited `rtl`. The
 * surface is pinned to `ltr` and the axes are mirrored explicitly instead, so
 * the labels land where recharts measured them in either direction.
 */
const chartSurface = "aspect-auto w-full [&_.recharts-surface]:[direction:ltr]";

interface RevenueChartProps {
  data: readonly AdminDashboardRevenuePoint[];
  label: string;
  currentLabel: string;
  previousLabel: string;
  formats: DashboardFormats;
}

function RevenueChart({ data, label, currentLabel, previousLabel, formats }: RevenueChartProps) {
  const { direction } = useSidebar();
  const rtl = direction === "rtl";
  // useId output can hold characters that are not valid inside url(#…).
  const gradientId = `admin-dashboard-revenue-${React.useId().replace(/[^\w-]/g, "")}`;

  const points = React.useMemo(
    () =>
      data.map((point) => ({
        date: toDate(point.date).getTime(),
        revenue: point.revenue,
        previous: point.previous,
      })),
    [data],
  );
  const hasPrevious = data.some((point) => typeof point.previous === "number");

  const config = React.useMemo<ChartConfig>(
    () => ({
      revenue: { label: currentLabel },
      ...(hasPrevious ? { previous: { label: previousLabel } } : {}),
    }),
    [currentLabel, hasPrevious, previousLabel],
  );

  return (
    <ChartContainer config={config} label={label} className={cn(chartSurface, "h-64 sm:h-72")}>
      <AreaChart data={points} margin={{ top: 8, bottom: 0, left: 4, right: 4 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-revenue)" stopOpacity={0.28} />
            <stop offset="100%" stopColor="var(--color-revenue)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          reversed={rtl}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={(value: number) => formats.day.format(value)}
        />
        <YAxis
          orientation={rtl ? "right" : "left"}
          tickLine={false}
          axisLine={false}
          width={64}
          tickFormatter={(value: number) => formats.moneyCompact.format(value)}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              indicator="line"
              labelFormatter={(value) =>
                typeof value === "number" ? formats.date.format(value) : value
              }
              valueFormatter={(value) =>
                typeof value === "number" ? formats.money.format(value) : value
              }
            />
          }
        />
        <Area
          dataKey="revenue"
          type="monotone"
          stroke="var(--color-revenue)"
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          dot={false}
          activeDot={{ r: 4 }}
        />
        {hasPrevious ? (
          <Area
            dataKey="previous"
            type="monotone"
            stroke="var(--color-previous)"
            strokeWidth={2}
            strokeDasharray="4 4"
            fill="none"
            dot={false}
            activeDot={{ r: 4 }}
          />
        ) : null}
        {hasPrevious ? <ChartLegend content={<ChartLegendContent />} /> : null}
      </AreaChart>
    </ChartContainer>
  );
}

interface ChannelChartProps {
  data: readonly AdminDashboardChannel[];
  label: string;
  seriesLabel: string;
  formats: DashboardFormats;
}

function ChannelChart({ data, label, seriesLabel, formats }: ChannelChartProps) {
  const { direction } = useSidebar();
  const rtl = direction === "rtl";

  // One measure, so one colour for every bar: the channel is named by the axis.
  const config = React.useMemo<ChartConfig>(
    () => ({ sales: { label: seriesLabel } }),
    [seriesLabel],
  );
  const rows = React.useMemo(
    () => data.map((channel) => ({ id: channel.id, label: channel.label, sales: channel.value })),
    [data],
  );

  return (
    <ChartContainer config={config} label={label} className={cn(chartSurface, "h-64")}>
      <BarChart
        data={rows}
        layout="vertical"
        barCategoryGap={12}
        margin={{ top: 0, bottom: 0, left: rtl ? 64 : 0, right: rtl ? 0 : 64 }}
      >
        <XAxis type="number" dataKey="sales" hide reversed={rtl} />
        <YAxis
          type="category"
          dataKey="label"
          orientation={rtl ? "right" : "left"}
          tickLine={false}
          axisLine={false}
          width={112}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              valueFormatter={(value) =>
                typeof value === "number" ? formats.money.format(value) : value
              }
            />
          }
        />
        <Bar
          dataKey="sales"
          fill="var(--color-sales)"
          maxBarSize={32}
          radius={rtl ? [4, 0, 0, 4] : [0, 4, 4, 0]}
        >
          <LabelList
            dataKey="sales"
            position={rtl ? "left" : "right"}
            offset={8}
            className="fill-foreground text-xs tabular-nums"
            formatter={(value: unknown) =>
              typeof value === "number" ? formats.moneyCompact.format(value) : String(value ?? "")
            }
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

interface OrderActionsProps {
  order: AdminDashboardOrder;
  onAction?: (action: AdminDashboardOrderAction, order: AdminDashboardOrder) => void;
  t: TranslateFn;
}

function OrderActions({ order, onAction, t }: OrderActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          data-slot="admin-dashboard-order-actions"
          variant="ghost"
          size="icon-sm"
          aria-label={t("adminDashboard.orderActions", { id: order.id })}
        >
          <Ellipsis aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
        <DropdownMenuItem onSelect={() => onAction?.("view", order)}>
          <Eye aria-hidden="true" />
          {t("adminDashboard.actionView")}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onAction?.("invoice", order)}>
          <ReceiptText aria-hidden="true" />
          {t("adminDashboard.actionInvoice")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {/* Only a settled payment can be refunded. */}
        <DropdownMenuItem
          variant="destructive"
          disabled={order.status !== "paid"}
          onSelect={() => onAction?.("refund", order)}
        >
          <RotateCcw aria-hidden="true" />
          {t("adminDashboard.actionRefund")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ------------------------------------------------------------------- page */

function AdminDashboard({
  className,
  title: titleProp,
  description: descriptionProp,
  range: rangeProp,
  defaultRange = "30d",
  onRangeChange,
  onExport,
  exportLabel: exportLabelProp,
  currency = "USD",
  stats: statsProp,
  revenueSeries: revenueSeriesProp,
  channelSeries: channelSeriesProp,
  orders = SAMPLE_ORDERS,
  onOrderAction,
  topProducts: topProductsProp,
  activity: activityProp,
  nav: navProp,
  user: userProp,
  brand: brandProp,
  userMenuItems: userMenuItemsProp,
  children,
  ...props
}: AdminDashboardProps) {
  const { t } = useI18n();
  const formats = useDashboardFormats(currency);
  const baseId = React.useId();

  const [uncontrolledRange, setUncontrolledRange] = React.useState(defaultRange);
  const range = rangeProp ?? uncontrolledRange;
  const days = RANGE_DAYS[range];

  const setRange = (next: AdminDashboardRange) => {
    if (rangeProp === undefined) setUncontrolledRange(next);
    onRangeChange?.(next);
  };

  // The sample follows the range, so the fallback page responds to the switch.
  const sampleSeries = React.useMemo(() => sampleRevenueSeries(days), [days]);
  const revenueSeries = revenueSeriesProp ?? sampleSeries;
  const stats = React.useMemo(
    () => statsProp ?? sampleStats(sampleSeries),
    [sampleSeries, statsProp],
  );
  const channelSeries = React.useMemo(
    () => channelSeriesProp ?? sampleChannels(t, sum(sampleSeries.map((point) => point.revenue))),
    [channelSeriesProp, sampleSeries, t],
  );
  const topProducts = React.useMemo(
    () => topProductsProp ?? sampleProducts(t, days),
    [days, t, topProductsProp],
  );
  const activity = React.useMemo(
    () => activityProp ?? sampleActivity(t, formats.moneyWhole),
    [activityProp, formats.moneyWhole, t],
  );

  const nav = navProp === undefined ? sampleNav(t, formats.count) : navProp;
  const user = userProp === undefined ? SAMPLE_USER : (userProp ?? undefined);
  const brand =
    brandProp === undefined ? <SampleBrand name={t("adminDashboard.brandName")} /> : brandProp;
  const userMenuItems = userMenuItemsProp ?? sampleMenuItems(t);

  const title = titleProp ?? t("adminDashboard.title");
  const description = descriptionProp ?? t("adminDashboard.description");
  const exportLabel = exportLabelProp ?? t("adminDashboard.export");
  const comparison = t("adminDashboard.comparison", { count: days });

  const kpis = [
    {
      id: "revenue",
      label: t("adminDashboard.kpiRevenue"),
      icon: <Banknote />,
      kpi: stats.revenue,
      value: formats.moneyWhole.format(stats.revenue.value),
    },
    {
      id: "orders",
      label: t("adminDashboard.kpiOrders"),
      icon: <ShoppingCart />,
      kpi: stats.orders,
      value: formats.count.format(stats.orders.value),
    },
    {
      id: "customers",
      label: t("adminDashboard.kpiCustomers"),
      icon: <Users />,
      kpi: stats.customers,
      value: formats.count.format(stats.customers.value),
    },
    {
      id: "conversion",
      label: t("adminDashboard.kpiConversion"),
      icon: <Percent />,
      kpi: stats.conversion,
      value: formats.percent.format(stats.conversion.value),
    },
  ];

  const columns = React.useMemo<DataTableColumn<AdminDashboardOrder>[]>(
    () => [
      {
        id: "id",
        header: t("adminDashboard.columnOrder"),
        alwaysVisible: true,
        cell: (row) => (
          <span data-slot="admin-dashboard-order-id" className="font-medium whitespace-nowrap">
            {row.id}
          </span>
        ),
      },
      {
        id: "customer",
        header: t("adminDashboard.columnCustomer"),
        accessor: (row) => row.customer.name,
        cell: (row) => (
          <div data-slot="admin-dashboard-customer" className="flex min-w-0 items-center gap-3">
            <Avatar aria-hidden="true" className="size-8">
              {row.customer.avatarSrc ? <AvatarImage src={row.customer.avatarSrc} alt="" /> : null}
              <AvatarFallback className="text-xs">{initialsOf(row.customer)}</AvatarFallback>
            </Avatar>
            <div data-slot="admin-dashboard-customer-text" className="grid min-w-0">
              <span data-slot="admin-dashboard-customer-name" className="truncate font-medium">
                {row.customer.name}
              </span>
              {row.customer.email ? (
                <span
                  data-slot="admin-dashboard-customer-email"
                  className="truncate text-xs text-muted-foreground"
                >
                  {row.customer.email}
                </span>
              ) : null}
            </div>
          </div>
        ),
      },
      {
        id: "status",
        header: t("adminDashboard.columnStatus"),
        accessor: (row) => t(STATUS_LABEL[row.status]),
        cell: (row) => (
          <Badge data-status={row.status} variant={STATUS_VARIANT[row.status]}>
            {t(STATUS_LABEL[row.status])}
          </Badge>
        ),
      },
      {
        id: "amount",
        header: t("adminDashboard.columnAmount"),
        align: "end",
        sortable: true,
        accessor: (row) => row.amount,
        cell: (row) => (
          <span data-slot="admin-dashboard-amount" className="whitespace-nowrap tabular-nums">
            {formats.money.format(row.amount)}
          </span>
        ),
      },
      {
        id: "date",
        header: t("adminDashboard.columnDate"),
        sortable: true,
        accessor: (row) => toDate(row.date),
        cell: (row) => {
          const { text, iso } = formatDate(formats.date, row.date);
          return (
            <time
              data-slot="admin-dashboard-order-date"
              dateTime={iso}
              className="whitespace-nowrap text-muted-foreground"
            >
              {text}
            </time>
          );
        },
      },
      {
        id: "actions",
        header: (
          <span data-slot="admin-dashboard-actions-heading" className="sr-only">
            {t("adminDashboard.columnActions")}
          </span>
        ),
        label: t("adminDashboard.columnActions"),
        align: "end",
        alwaysVisible: true,
        accessor: () => null,
        cell: (row) => <OrderActions order={row} onAction={onOrderAction} t={t} />,
      },
    ],
    [formats, onOrderAction, t],
  );

  const bestSeller = Math.max(0, ...topProducts.map((product) => product.revenue));
  const kpiHeadingId = `${baseId}-kpis`;

  return (
    <DashboardShell
      className={cn(className)}
      nav={nav}
      user={user}
      brand={brand}
      userMenuItems={userMenuItems}
      {...props}
    >
      <div data-slot="admin-dashboard" className="flex min-w-0 flex-col gap-6">
        <PageHeader>
          <PageHeaderTitle>{title}</PageHeaderTitle>
          <PageHeaderDescription>{description}</PageHeaderDescription>
          {/* Below lg the controls drop under the description rather than squeezing the title. */}
          <PageHeaderActions className="max-lg:col-start-1 max-lg:row-span-1 max-lg:row-start-3 max-lg:justify-self-start max-lg:pt-2">
            <ToggleGroup
              type="single"
              variant="outline"
              size="sm"
              value={range}
              onValueChange={(value) => {
                if (isRange(value)) setRange(value);
              }}
              aria-label={t("adminDashboard.rangeLabel")}
            >
              {RANGES.map((option) => (
                <ToggleGroupItem key={option} value={option} className="px-3">
                  {t("adminDashboard.rangeOption", { count: RANGE_DAYS[option] })}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <Button
              data-slot="admin-dashboard-export"
              variant="outline"
              size="sm"
              onClick={() => onExport?.(range)}
            >
              <Download aria-hidden="true" />
              {exportLabel}
            </Button>
          </PageHeaderActions>
        </PageHeader>

        <section
          data-slot="admin-dashboard-kpis"
          aria-labelledby={kpiHeadingId}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 xl:gap-6"
        >
          <h2 id={kpiHeadingId} data-slot="admin-dashboard-kpis-title" className="sr-only">
            {t("adminDashboard.metricsLabel")}
          </h2>
          {kpis.map((item) => (
            <StatCard
              key={item.id}
              data-kpi={item.id}
              className="min-w-0 lg:col-span-3"
              label={item.label}
              value={item.value}
              icon={item.icon}
              delta={
                item.kpi.delta === undefined ? undefined : formats.change.format(item.kpi.delta)
              }
              trend={trendOf(item.kpi)}
              comparison={comparison}
            />
          ))}
        </section>

        <div
          data-slot="admin-dashboard-grid"
          className="grid grid-cols-1 gap-4 lg:grid-cols-12 xl:gap-6"
        >
          <Card data-slot="admin-dashboard-revenue" className="min-w-0 gap-4 lg:col-span-8">
            <CardHeader>
              <SectionTitle>{t("adminDashboard.revenueTitle")}</SectionTitle>
              <CardDescription>{t("adminDashboard.revenueDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <RevenueChart
                data={revenueSeries}
                label={t("adminDashboard.revenueTitle")}
                currentLabel={t("adminDashboard.revenueCurrent")}
                previousLabel={t("adminDashboard.revenuePrevious")}
                formats={formats}
              />
            </CardContent>
          </Card>

          <Card data-slot="admin-dashboard-channels" className="min-w-0 gap-4 lg:col-span-4">
            <CardHeader>
              <SectionTitle>{t("adminDashboard.channelsTitle")}</SectionTitle>
              <CardDescription>{t("adminDashboard.channelsDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ChannelChart
                data={channelSeries}
                label={t("adminDashboard.channelsTitle")}
                seriesLabel={t("adminDashboard.channelSales")}
                formats={formats}
              />
            </CardContent>
          </Card>

          <Card data-slot="admin-dashboard-orders" className="min-w-0 gap-4 lg:col-span-8">
            <CardHeader>
              <SectionTitle>{t("adminDashboard.ordersTitle")}</SectionTitle>
              <CardDescription>
                {t("adminDashboard.ordersDescription", { count: orders.length })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                data={orders}
                columns={columns}
                searchable={false}
                columnToggle={false}
                pageSize={5}
              />
            </CardContent>
          </Card>

          <div
            data-slot="admin-dashboard-aside"
            className="flex min-w-0 flex-col gap-4 lg:col-span-4 xl:gap-6"
          >
            <Card data-slot="admin-dashboard-products" className="gap-4">
              <CardHeader>
                <SectionTitle>{t("adminDashboard.productsTitle")}</SectionTitle>
                <CardDescription>{t("adminDashboard.productsDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                {topProducts.length === 0 ? (
                  <EmptyState
                    icon={<Package />}
                    title={t("adminDashboard.productsEmpty")}
                    className="py-6"
                  />
                ) : (
                  <ul data-slot="admin-dashboard-product-list" className="flex flex-col gap-4">
                    {topProducts.map((product, index) => {
                      const nameId = `${baseId}-product-${index}`;
                      const revenue = formats.moneyWhole.format(product.revenue);
                      return (
                        <li
                          key={product.id}
                          data-slot="admin-dashboard-product"
                          className="flex flex-col gap-1.5"
                        >
                          <div
                            data-slot="admin-dashboard-product-row"
                            className="flex items-baseline justify-between gap-3 text-sm"
                          >
                            <span
                              id={nameId}
                              data-slot="admin-dashboard-product-name"
                              className="min-w-0 truncate font-medium"
                            >
                              {product.name}
                            </span>
                            <span
                              data-slot="admin-dashboard-product-revenue"
                              className="shrink-0 tabular-nums"
                            >
                              {revenue}
                            </span>
                          </div>
                          <Progress
                            aria-labelledby={nameId}
                            value={bestSeller > 0 ? (product.revenue / bestSeller) * 100 : 0}
                            getValueLabel={() => revenue}
                            className="h-1.5"
                          />
                          <span
                            data-slot="admin-dashboard-product-units"
                            className="text-caption text-muted-foreground"
                          >
                            {t("adminDashboard.unitsSold", { count: product.units })}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card data-slot="admin-dashboard-activity" className="gap-4">
              <CardHeader>
                <SectionTitle>{t("adminDashboard.activityTitle")}</SectionTitle>
                <CardDescription>{t("adminDashboard.activityDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                {activity.length === 0 ? (
                  <EmptyState title={t("adminDashboard.activityEmpty")} className="py-6" />
                ) : (
                  <ol data-slot="admin-dashboard-activity-list" className="flex flex-col gap-4">
                    {activity.map((item) => {
                      const { text, iso } = formatDate(formats.dateTime, item.date);
                      return (
                        <li
                          key={item.id}
                          data-slot="admin-dashboard-activity-item"
                          className="flex gap-3"
                        >
                          <span
                            aria-hidden="true"
                            data-slot="admin-dashboard-activity-dot"
                            data-tone={item.tone ?? "neutral"}
                            className={cn(
                              "mt-1.5 size-2 shrink-0 rounded-full",
                              TONE_DOT[item.tone ?? "neutral"],
                            )}
                          />
                          <div
                            data-slot="admin-dashboard-activity-body"
                            className="flex min-w-0 flex-col gap-0.5"
                          >
                            <p
                              data-slot="admin-dashboard-activity-message"
                              className="text-sm text-foreground"
                            >
                              {item.message}
                            </p>
                            <time
                              data-slot="admin-dashboard-activity-time"
                              dateTime={iso}
                              className="text-caption text-muted-foreground"
                            >
                              {text}
                            </time>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {children}
      </div>
    </DashboardShell>
  );
}

export { AdminDashboard };
