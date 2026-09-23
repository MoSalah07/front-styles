"use client";

/** Application shell: a collapsible sidebar driven by prop data, a sticky top bar with a trigger, breadcrumbs, search and a user menu, and the page in the inset. */
import * as React from "react";
import { LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/dropdown-menu";
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
} from "../blocks/app-sidebar";
import { cn } from "../lib/cn";

export interface DashboardShellNavItem {
  /** Row label, also used as the collapsed-mode tooltip. */
  label: string;
  /** Glyph pinned at the inline start. */
  icon?: React.ReactNode;
  /** Renders the row as a link when set. */
  href?: string;
  /** Marks the row as the current page. */
  active?: boolean;
  disabled?: boolean;
  /** Counter or status pill at the inline end. Only shown while expanded. */
  badge?: React.ReactNode;
  onSelect?: () => void;
}

export interface DashboardShellNavGroup {
  /** Heading above the group. It folds away in collapsed mode. */
  label?: string;
  items: DashboardShellNavItem[];
}

export interface DashboardShellUser {
  name: string;
  email?: string;
  /** Avatar image source. Falls back to `initials`, then to the first letter of the name. */
  avatarSrc?: string;
  initials?: string;
}

export interface DashboardShellMenuItem {
  label: string;
  icon?: React.ReactNode;
  href?: string;
  destructive?: boolean;
  onSelect?: () => void;
}

export interface DashboardShellProps extends React.ComponentProps<"div"> {
  /** Sidebar navigation, grouped. */
  nav?: DashboardShellNavGroup[];
  /** Mark or wordmark in the sidebar header. */
  brand?: React.ReactNode;
  /** Extra content pinned to the bottom of the sidebar. */
  sidebarFooter?: React.ReactNode;
  /** Breadcrumb trail in the top bar, typically the Breadcrumb primitive. */
  breadcrumbs?: React.ReactNode;
  /** Search control in the top bar, typically an Input or the command palette trigger. */
  search?: React.ReactNode;
  /** Buttons between the search and the user menu. */
  actions?: React.ReactNode;
  /** Signed-in account. Omit it to hide the user menu. */
  user?: DashboardShellUser;
  /** Rows above the sign-out entry of the user menu. */
  userMenuItems?: DashboardShellMenuItem[];
  /** Text of the sign-out row. */
  signOutLabel?: string;
  onSignOut?: () => void;
  /** Accessible name of the sidebar landmark. */
  sidebarLabel?: string;
  /** Sidebar starts expanded unless this is false. */
  defaultSidebarOpen?: boolean;
  /** Controlled sidebar state. */
  sidebarOpen?: boolean;
  onSidebarOpenChange?: (open: boolean) => void;
  /** Extra classes for the scrolling content area. */
  contentClassName?: string;
}

const defaultMenuItems: DashboardShellMenuItem[] = [
  { label: "Profile", icon: <User aria-hidden="true" /> },
  { label: "Settings", icon: <Settings aria-hidden="true" /> },
];

function initialsOf(user: DashboardShellUser): string {
  if (user.initials) return user.initials;
  return user.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function DashboardShell({
  className,
  nav = [],
  brand,
  sidebarFooter,
  breadcrumbs,
  search,
  actions,
  user,
  userMenuItems = defaultMenuItems,
  signOutLabel = "Sign out",
  onSignOut,
  sidebarLabel = "Main navigation",
  defaultSidebarOpen = true,
  sidebarOpen,
  onSidebarOpenChange,
  contentClassName,
  children,
  ...props
}: DashboardShellProps) {
  return (
    <SidebarProvider
      data-slot="dashboard-shell"
      defaultOpen={defaultSidebarOpen}
      open={sidebarOpen}
      onOpenChange={onSidebarOpenChange}
      className={cn(className)}
      {...props}
    >
      <Sidebar label={sidebarLabel}>
        <SidebarHeader>
          <div
            data-slot="dashboard-shell-brand"
            className="flex min-w-0 items-center gap-2 px-1 [&_svg]:shrink-0"
          >
            {brand}
          </div>
        </SidebarHeader>

        <SidebarContent>
          {nav.map((group, groupIndex) => (
            <SidebarGroup key={group.label ?? groupIndex}>
              {group.label ? <SidebarGroupLabel>{group.label}</SidebarGroupLabel> : null}
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    {item.href ? (
                      // Slot takes exactly one child, so the link supplies its
                      // own icon and label rather than the `icon` prop.
                      <SidebarMenuButton
                        asChild
                        isActive={item.active}
                        tooltip={item.label}
                        aria-disabled={item.disabled || undefined}
                      >
                        <a href={item.href} onClick={item.onSelect}>
                          {item.icon ? (
                            <span aria-hidden="true" className="flex shrink-0">
                              {item.icon}
                            </span>
                          ) : null}
                          <span className="min-w-0 flex-1 truncate group-data-[state=collapsed]/sidebar:hidden">
                            {item.label}
                          </span>
                        </a>
                      </SidebarMenuButton>
                    ) : (
                      <SidebarMenuButton
                        icon={item.icon}
                        isActive={item.active}
                        tooltip={item.label}
                        disabled={item.disabled}
                        onClick={item.onSelect}
                      >
                        {item.label}
                      </SidebarMenuButton>
                    )}
                    {item.badge ? (
                      <span
                        data-slot="dashboard-shell-nav-badge"
                        className={cn(
                          "pointer-events-none absolute inset-y-0 end-2 my-auto flex h-5 items-center",
                          "rounded-badge bg-sidebar-accent px-1.5 text-caption font-semibold",
                          "text-sidebar-accent-foreground",
                          "group-data-[state=collapsed]/sidebar:hidden",
                        )}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          ))}
        </SidebarContent>

        {sidebarFooter ? <SidebarFooter>{sidebarFooter}</SidebarFooter> : null}
      </Sidebar>

      <SidebarInset>
        <header
          data-slot="dashboard-shell-topbar"
          className={cn(
            "sticky top-0 z-(--z-sticky) flex h-(--header-h) shrink-0 items-center gap-2",
            "border-b bg-background/80 px-(--gutter) backdrop-blur-sm",
          )}
        >
          <SidebarTrigger />

          {breadcrumbs ? (
            <div data-slot="dashboard-shell-breadcrumbs" className="ms-1 hidden min-w-0 md:block">
              {breadcrumbs}
            </div>
          ) : null}

          <div className="ms-auto flex min-w-0 items-center gap-2">
            {search ? (
              <div data-slot="dashboard-shell-search" className="min-w-0">
                {search}
              </div>
            ) : null}
            {actions}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  data-slot="dashboard-shell-user-trigger"
                  aria-label={`Account menu for ${user.name}`}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-control p-1 outline-none",
                    "transition-colors duration-(--duration-fast) ease-standard",
                    "hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring",
                  )}
                >
                  <Avatar className="size-8">
                    {user.avatarSrc ? <AvatarImage src={user.avatarSrc} alt="" /> : null}
                    <AvatarFallback>{initialsOf(user)}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate font-semibold">{user.name}</span>
                    {user.email ? (
                      <span className="truncate text-caption font-normal text-muted-foreground">
                        {user.email}
                      </span>
                    ) : null}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {userMenuItems.map((item) =>
                    item.href ? (
                      <DropdownMenuItem
                        key={item.label}
                        asChild
                        variant={item.destructive ? "destructive" : "default"}
                      >
                        <a href={item.href} onClick={item.onSelect}>
                          {item.icon}
                          {item.label}
                        </a>
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        key={item.label}
                        variant={item.destructive ? "destructive" : "default"}
                        onSelect={item.onSelect}
                      >
                        {item.icon}
                        {item.label}
                      </DropdownMenuItem>
                    ),
                  )}

                  {onSignOut ? (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive" onSelect={onSignOut}>
                        <LogOut aria-hidden="true" />
                        {signOutLabel}
                      </DropdownMenuItem>
                    </>
                  ) : null}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        </header>

        <div
          data-slot="dashboard-shell-content"
          className={cn("flex min-w-0 flex-1 flex-col gap-6 p-(--gutter)", contentClassName)}
        >
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export { DashboardShell };
