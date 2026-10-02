"use client";

import * as React from "react";
import { AdminDashboard, type AdminDashboardRange } from "@design-eg/ui";

export default function AdminDashboardExample() {
  const [range, setRange] = React.useState<AdminDashboardRange>("30d");

  // With no data props the page renders its built-in sample store, which
  // follows the range switch, so the whole page can be explored as is.
  return (
    <AdminDashboard
      range={range}
      onRangeChange={setRange}
      onExport={(period) => console.info("export", period)}
      onOrderAction={(action, order) => console.info(action, order.id)}
      onSignOut={() => console.info("sign out")}
    />
  );
}
