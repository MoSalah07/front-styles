"use client";

import * as React from "react";
import { Calendar, type DateRange } from "@design-eg/ui";

export default function CalendarExample() {
  const [date, setDate] = React.useState<Date | undefined>();
  const [range, setRange] = React.useState<DateRange | undefined>();

  return (
    <div className="flex flex-wrap items-start gap-6">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-card border bg-card"
      />
      <Calendar
        mode="range"
        numberOfMonths={2}
        selected={range}
        onSelect={setRange}
        disabled={(day) => day.getDay() === 0 || day.getDay() === 6}
        className="rounded-card border bg-card"
      />
    </div>
  );
}
