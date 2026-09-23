"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@design-eg/ui";

const DATA = [
  { month: "Jan", web: 1860, mobile: 800 },
  { month: "Feb", web: 3050, mobile: 2000 },
  { month: "Mar", web: 2370, mobile: 1200 },
  { month: "Apr", web: 730, mobile: 1900 },
  { month: "May", web: 2090, mobile: 1300 },
  { month: "Jun", web: 2140, mobile: 1400 },
];

const config = {
  web: { label: "Web" },
  mobile: { label: "Mobile" },
} satisfies ChartConfig;

export default function ChartExample() {
  return (
    <ChartContainer config={config} label="Sessions by platform" className="h-72 w-full">
      <BarChart data={DATA} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} width={40} />
        <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="web" fill="var(--color-web)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
