import { ArrowRight, Bell, Check, Plus, Trash2 } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
  Skeleton,
  Switch,
} from "@design-eg/ui";

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-4">
      <div className="space-y-1">
        <h2 className="text-h3 font-semibold">{title}</h2>
        <p className="max-w-prose text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="rounded-card border bg-card p-6 shadow-1">{children}</div>
    </section>
  );
}

export function Showcase() {
  return (
    <div className="space-y-12">
      <Section
        id="button"
        title="Button"
        description="Six variants, six sizes, loading state and asChild composition. Hover and active colours come from the primary-hover and primary-active tokens, so every brand gets correct feedback for free."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button>
            Continue <ArrowRight />
          </Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="destructive">
            <Trash2 /> Delete
          </Button>
        </div>
        <Separator className="my-5" />
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" aria-label="Add">
            <Plus />
          </Button>
          <Button size="icon-sm" variant="outline" aria-label="Notifications">
            <Bell />
          </Button>
          <Button loading>Saving</Button>
          <Button disabled>Disabled</Button>
        </div>
      </Section>

      <Section
        id="input"
        title="Input, Label, Switch"
        description="Form controls share one height scale (--control-h-*) that reacts to the density switch above. Focus rings use the ring token and keep a 2px offset for visibility on any surface."
      >
        {/* A real form element for correct labelling and autofill. It stays a server
            component, so the demo submit button is inert rather than handler-driven. */}
        <form className="grid max-w-md gap-5">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pw">Password</Label>
            <Input id="pw" type="password" placeholder="••••••••" autoComplete="current-password" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bad">With an error</Label>
            <Input id="bad" aria-invalid defaultValue="not-an-email" aria-describedby="bad-msg" />
            <p id="bad-msg" className="text-xs text-destructive">
              Enter a valid email address.
            </p>
          </div>
          <div className="flex items-center justify-between rounded-control border p-3">
            <Label htmlFor="remember" className="cursor-pointer">
              Remember me on this device
            </Label>
            <Switch id="remember" defaultChecked />
          </div>
          <Button type="button" className="w-full" size="lg">
            Sign in
          </Button>
        </form>
      </Section>

      <Section
        id="card"
        title="Card"
        description="Header grid with an optional action slot, content and footer. Elevation uses shadow-1 in light mode and a hairline ring in dark mode, the same trick the best dark UIs use."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Monthly plan</CardTitle>
              <CardDescription>Everything you need to ship.</CardDescription>
              <CardAction>
                <Badge variant="soft">Popular</Badge>
              </CardAction>
            </CardHeader>
            <CardContent>
              <p className="text-display font-display leading-none">
                $12<span className="text-body text-muted-foreground font-sans"> / month</span>
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {["Unlimited projects", "Priority support", "Cancel anytime"].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="size-4 text-success" /> {f}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Choose plan</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Loading state</CardTitle>
              <CardDescription>
                Skeletons shimmer with a foreground-tinted gradient.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-24 w-full rounded-media" />
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-avatar" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        id="badge"
        title="Badge"
        description="Status colours are separate ramps (success, warning, danger, info) so they never collide with the brand colour, even when the brand itself is red."
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="soft">Soft</Badge>
          <Badge variant="success">
            <Check /> Paid
          </Badge>
          <Badge variant="warning">Pending</Badge>
          <Badge variant="destructive">Failed</Badge>
          <Badge variant="info">Beta</Badge>
        </div>
      </Section>
    </div>
  );
}
