"use client";

import { BarChart3, FileText, Home, LifeBuoy, Settings, Users } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@design-eg/ui";

const GROUPS = [
  {
    label: "Workspace",
    items: [
      { label: "Overview", icon: <Home className="size-4" />, active: true },
      { label: "Analytics", icon: <BarChart3 className="size-4" /> },
      { label: "Invoices", icon: <FileText className="size-4" /> },
    ],
  },
  {
    label: "Organisation",
    items: [
      { label: "Members", icon: <Users className="size-4" /> },
      { label: "Settings", icon: <Settings className="size-4" /> },
    ],
  },
];

export default function AppSidebarExample() {
  return (
    <SidebarProvider className="min-h-80 rounded-card border">
      <Sidebar label="Workspace navigation">
        <SidebarHeader>
          <span className="font-display text-xl tracking-wide">design-eg</span>
        </SidebarHeader>
        <SidebarContent>
          {GROUPS.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton icon={item.icon} isActive={item.active}>
                      {item.label}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton icon={<LifeBuoy className="size-4" />}>Support</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="p-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <span className="text-sm text-muted-foreground">
            Toggle the sidebar, or press Ctrl/Cmd + B.
          </span>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
