import { Check } from "lucide-react";
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
} from "@design-eg/ui";

const FEATURES = ["Unlimited projects", "Priority support", "Cancel anytime"];

export default function CardExample() {
  return (
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
          <p className="font-display text-display leading-none">
            $12<span className="font-sans text-body text-muted-foreground"> / month</span>
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <Check className="size-4 text-success" /> {feature}
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
          <CardTitle>Usage</CardTitle>
          <CardDescription>Billing period resets on the 1st.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Requests</span>
            <span className="tabular-nums">128,400</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Bandwidth</span>
            <span className="tabular-nums">42.1 GB</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            View invoices
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
