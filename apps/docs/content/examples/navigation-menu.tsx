"use client";

import * as React from "react";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Building2,
  CreditCard,
  GraduationCap,
  History,
  Plug,
  Rocket,
  Users,
  Workflow,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@design-eg/ui";

interface MenuEntry {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

const products: MenuEntry[] = [
  {
    title: "Dashboards",
    description: "Live charts for every metric your team tracks.",
    href: "#",
    icon: <BarChart3 />,
  },
  {
    title: "Automations",
    description: "Trigger work from events, on a schedule or by hand.",
    href: "#",
    icon: <Workflow />,
  },
  {
    title: "Billing",
    description: "Plans, invoices and usage-based pricing in one place.",
    href: "#",
    icon: <CreditCard />,
  },
  {
    title: "Integrations",
    description: "Connect the tools you already use in a few clicks.",
    href: "#",
    icon: <Plug />,
  },
];

const solutions: MenuEntry[] = [
  {
    title: "Startups",
    description: "Everything a small team needs to ship the first version.",
    href: "#",
    icon: <Rocket />,
  },
  {
    title: "Growing teams",
    description: "Roles, reviews and shared workspaces as headcount rises.",
    href: "#",
    icon: <Users />,
  },
  {
    title: "Enterprise",
    description: "Single sign-on, audit logs and a dedicated region.",
    href: "#",
    icon: <Building2 />,
  },
];

const resources: MenuEntry[] = [
  {
    title: "Documentation",
    description: "Reference for every component, token and hook.",
    href: "#",
    icon: <BookOpen />,
  },
  {
    title: "Guides",
    description: "Step-by-step walkthroughs, from setup to theming.",
    href: "#",
    icon: <GraduationCap />,
  },
  {
    title: "Changelog",
    description: "What shipped this week, and what changed.",
    href: "#",
    icon: <History />,
  },
];

function MenuLink({ title, description, href, icon }: MenuEntry) {
  return (
    <li>
      <NavigationMenuLink href={href} className="flex-row items-start gap-3">
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border bg-background">
          {icon}
        </span>
        <span className="grid gap-0.5">
          <span className="font-medium text-foreground">{title}</span>
          <span className="line-clamp-2 text-xs leading-snug text-muted-foreground">
            {description}
          </span>
        </span>
      </NavigationMenuLink>
    </li>
  );
}

export default function NavigationMenuExample() {
  return (
    <div className="flex min-h-96 w-full justify-center">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid gap-2 md:w-xl md:grid-cols-5">
                <NavigationMenuLink
                  href="#"
                  className="brand-surface justify-end gap-2 rounded-md p-5 hover:text-brand-foreground focus:text-brand-foreground md:col-span-2"
                >
                  <span className="text-lg font-semibold">Platform tour</span>
                  <span className="text-sm opacity-85">
                    See how dashboards, automations and billing fit together in five minutes.
                  </span>
                  <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium">
                    Start the tour
                    <ArrowRight className="size-4 text-current rtl:-scale-x-100" />
                  </span>
                </NavigationMenuLink>
                <ul className="grid gap-1 md:col-span-3">
                  {products.map((entry) => (
                    <MenuLink key={entry.title} {...entry} />
                  ))}
                </ul>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-1 md:w-md">
                {solutions.map((entry) => (
                  <MenuLink key={entry.title} {...entry} />
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-1 md:w-lg md:grid-cols-2">
                {resources.map((entry) => (
                  <MenuLink key={entry.title} {...entry} />
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
              Pricing
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuIndicator />
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
