import { CreditCard, Users, Activity, DollarSign } from "lucide-react";
import { StatCard, StatCardGrid } from "@design-eg/ui";

export default function StatCardExample() {
  return (
    <StatCardGrid>
      <StatCard
        label="Monthly revenue"
        value="EGP 482,300"
        icon={<DollarSign className="size-4" />}
        delta="+12.5%"
        trend="up"
        comparison="vs last month"
      />
      <StatCard
        label="New customers"
        value="1,204"
        icon={<Users className="size-4" />}
        delta="-3.1%"
        trend="down"
        comparison="vs last month"
      />
      <StatCard
        label="Active sessions"
        value="8,921"
        icon={<Activity className="size-4" />}
        delta="0.0%"
        trend="flat"
        comparison="vs last hour"
      />
      <StatCard label="Churn" value="—" icon={<CreditCard className="size-4" />} loading />
    </StatCardGrid>
  );
}
