"use client";

import * as React from "react";
import { DatePicker, Label, type DateRange } from "@design-eg/ui";

export default function DatePickerExample() {
  const [due, setDue] = React.useState<Date | undefined>();
  const [trip, setTrip] = React.useState<DateRange | undefined>();

  return (
    <div className="grid w-full max-w-sm gap-6">
      <div className="grid gap-2">
        <Label htmlFor="demo-due">Due date</Label>
        <DatePicker id="demo-due" name="due" value={due} onValueChange={setDue} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="demo-trip">Trip dates</Label>
        <DatePicker
          id="demo-trip"
          mode="range"
          name="trip"
          value={trip}
          onValueChange={setTrip}
          min={new Date()}
        />
      </div>
    </div>
  );
}
