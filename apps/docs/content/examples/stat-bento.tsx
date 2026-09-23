"use client";

import { Activity, Globe, Timer, Users } from "lucide-react";
import { AnimatedNumber, StatBento, StatBentoTile } from "@design-eg/ui";

export default function StatBentoExample() {
  return (
    <StatBento>
      <StatBentoTile
        size="lg"
        featured
        icon={<Users className="size-4" />}
        value={<AnimatedNumber value={128400} />}
        label="Monthly active users"
        description="Across every workspace on the platform."
      />
      <StatBentoTile
        size="sm"
        icon={<Activity className="size-4" />}
        value={<AnimatedNumber value={99.98} decimals={2} suffix="%" />}
        label="Uptime"
      />
      <StatBentoTile
        size="sm"
        icon={<Timer className="size-4" />}
        value={<AnimatedNumber value={182} suffix=" ms" />}
        label="p95 latency"
      />
      <StatBentoTile
        size="wide"
        icon={<Globe className="size-4" />}
        value={<AnimatedNumber value={31} />}
        label="Regions served"
        description="Every edge location runs the same build."
      />
    </StatBento>
  );
}
