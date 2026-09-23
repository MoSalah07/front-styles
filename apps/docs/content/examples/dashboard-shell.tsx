"use client";

import { BarChart3, Bell, CreditCard, FileText, Home, Settings, Users } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  DashboardShell,
  Input,
  StatCard,
  StatCardGrid,
} from "@design-eg/ui";

export default function DashboardShellExample() {
  return (
    <DashboardShell
      brand={<span className="font-display text-xl tracking-wide">design-eg</span>}
      nav={[
        {
          label: "Workspace",
          items: [
            { label: "Overview", icon: <Home className="size-4" />, href: "#", active: true },
            { label: "Analytics", icon: <BarChart3 className="size-4" />, href: "#" },
            { label: "Invoices", icon: <FileText className="size-4" />, href: "#", badge: "3" },
          ],
        },
        {
          label: "Organisation",
          items: [
            { label: "Members", icon: <Users className="size-4" />, href: "#" },
            { label: "Billing", icon: <CreditCard className="size-4" />, href: "#" },
            { label: "Settings", icon: <Settings className="size-4" />, href: "#" },
          ],
        },
      ]}
      breadcrumbs={
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Acme</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Overview</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
      search={<Input placeholder="Search…" aria-label="Search" className="w-56" />}
      actions={
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell />
        </Button>
      }
      user={{ name: "Nour Hassan", email: "nour@acme.eg", initials: "NH" }}
      onSignOut={() => console.info("sign out")}
    >
      <div className="space-y-6">
        <h1 className="text-h3 font-semibold">Overview</h1>
        <StatCardGrid>
          <StatCard label="Revenue" value="EGP 482,300" delta="+12.5%" trend="up" />
          <StatCard label="Customers" value="1,204" delta="-3.1%" trend="down" />
          <StatCard label="Sessions" value="8,921" delta="0.0%" trend="flat" />
        </StatCardGrid>
        <div className="grid h-64 place-items-center rounded-card border bg-surface-1 text-sm text-muted-foreground">
          Your page content goes here.
        </div>
      </div>
    </DashboardShell>
  );
}
