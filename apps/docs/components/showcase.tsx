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
import { getDictionary } from "@/app/[lang]/dictionaries";

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

export async function Showcase() {
  const { showcase } = await getDictionary();
  const d = showcase.demo;

  return (
    <div className="space-y-12">
      <Section id="button" title={showcase.button.title} description={showcase.button.description}>
        <div className="flex flex-wrap items-center gap-3">
          <Button>
            {d.continue} <ArrowRight />
          </Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="destructive">
            <Trash2 /> {d.delete}
          </Button>
        </div>
        <Separator className="my-5" />
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" aria-label={d.add}>
            <Plus />
          </Button>
          <Button size="icon-sm" variant="outline" aria-label={d.notifications}>
            <Bell />
          </Button>
          <Button loading>{d.saving}</Button>
          <Button disabled>{d.disabled}</Button>
        </div>
      </Section>

      <Section id="input" title={showcase.fields.title} description={showcase.fields.description}>
        {/* A real form element for correct labelling and autofill. It stays a server
            component, so the demo submit button is inert rather than handler-driven. */}
        <form className="grid max-w-md gap-5">
          <div className="grid gap-2">
            <Label htmlFor="email">{d.email}</Label>
            <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pw">{d.password}</Label>
            <Input id="pw" type="password" placeholder="••••••••" autoComplete="current-password" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bad">{d.withError}</Label>
            <Input id="bad" aria-invalid defaultValue="not-an-email" aria-describedby="bad-msg" />
            <p id="bad-msg" className="text-xs text-destructive">
              {d.invalidEmail}
            </p>
          </div>
          <div className="flex items-center justify-between rounded-control border p-3">
            <Label htmlFor="remember" className="cursor-pointer">
              {d.rememberMe}
            </Label>
            <Switch id="remember" defaultChecked />
          </div>
          <Button type="button" className="w-full" size="lg">
            {d.signIn}
          </Button>
        </form>
      </Section>

      <Section id="card" title={showcase.card.title} description={showcase.card.description}>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{d.monthlyPlan}</CardTitle>
              <CardDescription>{d.planBlurb}</CardDescription>
              <CardAction>
                <Badge variant="soft">{d.popular}</Badge>
              </CardAction>
            </CardHeader>
            <CardContent>
              <p className="text-display font-display leading-none">
                $12<span className="text-body text-muted-foreground font-sans"> {d.perMonth}</span>
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {[d.featureProjects, d.featureSupport, d.featureCancel].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="size-4 text-success" /> {f}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">{d.choosePlan}</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{d.loadingState}</CardTitle>
              <CardDescription>{d.skeletonBlurb}</CardDescription>
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

      <Section id="badge" title={showcase.badge.title} description={showcase.badge.description}>
        <div className="flex flex-wrap items-center gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="soft">Soft</Badge>
          <Badge variant="success">
            <Check /> {d.paid}
          </Badge>
          <Badge variant="warning">{d.pending}</Badge>
          <Badge variant="destructive">{d.failed}</Badge>
          <Badge variant="info">{d.beta}</Badge>
        </div>
      </Section>
    </div>
  );
}
