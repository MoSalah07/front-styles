import { cn } from "@design-eg/ui/cn";

/**
 * cn() is clsx plus tailwind-merge: conditional classes collapse, and the last
 * conflicting utility wins, which is why every component merges className last.
 */
export default function UtilsExample() {
  const active = true;

  return (
    <div className="space-y-3 font-mono text-sm">
      <p className={cn("rounded-control border p-3", active && "border-primary text-primary")}>
        cn(&quot;border&quot;, active &amp;&amp; &quot;border-primary&quot;)
      </p>
      <p className={cn("rounded-control border p-3 text-muted-foreground", "text-foreground")}>
        cn(&quot;text-muted-foreground&quot;, &quot;text-foreground&quot;) → the later class wins
      </p>
    </div>
  );
}
