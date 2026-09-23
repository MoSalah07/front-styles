"use client";

/** Settings layout: a sticky anchor-link nav on the inline start and profile, preferences, appearance and danger-zone cards on the inline end. */
import * as React from "react";
import {
  Monitor,
  Moon,
  Palette,
  ShieldAlert,
  SlidersHorizontal,
  Sun,
  Upload,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/avatar";
import { Button } from "../components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/card";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { Separator } from "../components/separator";
import { Switch } from "../components/switch";
import { ToggleGroup, ToggleGroupItem } from "../components/toggle-group";
import { ConfirmDialog } from "../blocks/confirm-dialog";
import { cn } from "../lib/cn";

export type SettingsPageTheme = "light" | "dark" | "system";
export type SettingsPageDensity = "compact" | "comfortable" | "spacious";

export interface SettingsPageUser {
  name: string;
  email?: string;
  avatarSrc?: string;
  initials?: string;
}

export interface SettingsPagePreference {
  /** Stable key, used for the control id and as the React key. */
  id: string;
  label: string;
  description?: string;
  /** Initial value when the caller does not control the switch. */
  defaultChecked?: boolean;
  /** Controlled value. Pair it with `onCheckedChange`. */
  checked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export interface SettingsPageBrandOption {
  /** Value written to `data-brand` on the document element. */
  value: string;
  label: string;
}

export interface SettingsPageProps extends Omit<React.ComponentProps<"div">, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Account shown in the profile card. */
  user?: SettingsPageUser;
  nameLabel?: string;
  emailLabel?: string;
  /** Receives the edited profile fields. */
  onProfileSubmit?: (values: { name: string; email: string }) => void;
  /** Receives the file picked in the avatar slot. */
  onAvatarChange?: (file: File | null) => void;
  /** Rows of the preferences card. */
  preferences?: SettingsPagePreference[];
  /** Brands offered by the appearance card. */
  brands?: SettingsPageBrandOption[];
  /** Hide the appearance card when the host app owns theming. */
  showAppearance?: boolean;
  /** Heading of the danger zone. */
  dangerTitle?: React.ReactNode;
  dangerDescription?: React.ReactNode;
  dangerActionLabel?: string;
  /** Confirmation copy of the destructive dialog. */
  dangerConfirmTitle?: React.ReactNode;
  dangerConfirmDescription?: React.ReactNode;
  /** Runs after the user confirms. The dialog waits for the returned promise. */
  onDangerConfirm?: () => void | Promise<void>;
  /** Extra cards appended after the danger zone. */
  children?: React.ReactNode;
}

const defaultPreferences: SettingsPagePreference[] = [
  {
    id: "product-updates",
    label: "Product updates",
    description: "Occasional email about new components and releases.",
    defaultChecked: true,
  },
  {
    id: "security-alerts",
    label: "Security alerts",
    description: "Always sent for sign-ins from a new device.",
    defaultChecked: true,
  },
  {
    id: "weekly-digest",
    label: "Weekly digest",
    description: "A Monday summary of everything your team shipped.",
  },
];

const defaultBrands: SettingsPageBrandOption[] = [
  { value: "crimson", label: "Crimson" },
  { value: "neutral", label: "Neutral" },
];

const densities: { value: SettingsPageDensity; label: string }[] = [
  { value: "compact", label: "Compact" },
  { value: "comfortable", label: "Default" },
  { value: "spacious", label: "Spacious" },
];

function initialsOf(user: SettingsPageUser): string {
  if (user.initials) return user.initials;
  return user.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function SettingsPage({
  className,
  title = "Settings",
  description = "Manage your account, your notifications and how the interface looks.",
  user,
  nameLabel = "Full name",
  emailLabel = "Email",
  onProfileSubmit,
  onAvatarChange,
  preferences = defaultPreferences,
  brands = defaultBrands,
  showAppearance = true,
  dangerTitle = "Danger zone",
  dangerDescription = "Deleting the workspace removes every project, member and API key. This cannot be undone.",
  dangerActionLabel = "Delete workspace",
  dangerConfirmTitle = "Delete this workspace?",
  dangerConfirmDescription = "Every project, member and API key is removed immediately. This action cannot be undone.",
  onDangerConfirm,
  children,
  ...props
}: SettingsPageProps) {
  const id = React.useId();
  const nameId = `${id}-name`;
  const emailId = `${id}-email`;
  const avatarInputId = `${id}-avatar`;

  const [name, setName] = React.useState(user?.name ?? "");
  const [email, setEmail] = React.useState(user?.email ?? "");
  const [avatarPreview, setAvatarPreview] = React.useState<string | undefined>(user?.avatarSrc);

  const [theme, setTheme] = React.useState<SettingsPageTheme>("system");
  const [brand, setBrand] = React.useState<string>(brands[0]?.value ?? "");
  const [density, setDensity] = React.useState<SettingsPageDensity>("comfortable");

  // Read whatever the document already carries, so the controls open on the
  // real state instead of fighting it on first paint.
  React.useEffect(() => {
    const root = document.documentElement;
    const currentTheme = root.getAttribute("data-theme");
    if (currentTheme === "light" || currentTheme === "dark") setTheme(currentTheme);
    const currentBrand = root.getAttribute("data-brand");
    if (currentBrand) setBrand(currentBrand);
    const currentDensity = root.getAttribute("data-density");
    if (
      currentDensity === "compact" ||
      currentDensity === "comfortable" ||
      currentDensity === "spacious"
    ) {
      setDensity(currentDensity);
    }
  }, []);

  const applyTheme = (next: SettingsPageTheme) => {
    setTheme(next);
    const root = document.documentElement;
    if (next === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", next);
  };

  const applyBrand = (next: string) => {
    setBrand(next);
    document.documentElement.setAttribute("data-brand", next);
  };

  const applyDensity = (next: SettingsPageDensity) => {
    setDensity(next);
    document.documentElement.setAttribute("data-density", next);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    onAvatarChange?.(file);
    // Only a local preview; uploading is the host application's job.
    setAvatarPreview(file ? URL.createObjectURL(file) : user?.avatarSrc);
  };

  const sections = [
    { id: `${id}-section-profile`, label: "Profile", icon: <User aria-hidden="true" /> },
    {
      id: `${id}-section-preferences`,
      label: "Preferences",
      icon: <SlidersHorizontal aria-hidden="true" />,
    },
    ...(showAppearance
      ? [
          {
            id: `${id}-section-appearance`,
            label: "Appearance",
            icon: <Palette aria-hidden="true" />,
          },
        ]
      : []),
    { id: `${id}-section-danger`, label: "Danger zone", icon: <ShieldAlert aria-hidden="true" /> },
  ];

  return (
    <div
      data-slot="settings-page"
      className={cn("mx-auto w-full max-w-(--container-content) px-(--gutter) py-10", className)}
      {...props}
    >
      <header className="mb-10 flex flex-col gap-2">
        <h1 data-slot="settings-page-title" className="font-display text-h2 uppercase">
          {title}
        </h1>
        {description ? (
          <p className="max-w-prose text-pretty text-muted-foreground">{description}</p>
        ) : null}
      </header>

      <div className="grid gap-8 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
        <nav
          data-slot="settings-page-nav"
          aria-label="Settings sections"
          className="lg:sticky lg:top-6 lg:self-start"
        >
          <ul className="flex flex-row flex-wrap gap-1 lg:flex-col">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className={cn(
                    "flex items-center gap-2 rounded-control px-3 py-2 text-sm font-medium",
                    "text-muted-foreground transition-colors duration-(--duration-fast) ease-standard",
                    "hover:bg-accent hover:text-accent-foreground",
                    "outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    "[&_svg]:size-4 [&_svg]:shrink-0",
                  )}
                >
                  {section.icon}
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex min-w-0 flex-col gap-8">
          <Card
            id={sections[0]!.id}
            data-slot="settings-page-profile"
            role="region"
            className="scroll-mt-24"
            aria-labelledby={`${sections[0]!.id}-title`}
          >
            <CardHeader>
              <CardTitle id={`${sections[0]!.id}-title`}>Profile</CardTitle>
              <CardDescription>
                This is how your teammates see you across the workspace.
              </CardDescription>
            </CardHeader>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                onProfileSubmit?.({ name, email });
              }}
            >
              <CardContent className="flex flex-col gap-6">
                <div className="flex flex-wrap items-center gap-4">
                  <Avatar className="size-16">
                    {avatarPreview ? <AvatarImage src={avatarPreview} alt="" /> : null}
                    <AvatarFallback className="text-body">
                      {user ? initialsOf(user) : "?"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col gap-2">
                    {/* The file input stays in the accessibility tree and is
                        driven by its own label, so no click forwarding is needed. */}
                    <Label
                      htmlFor={avatarInputId}
                      className={cn(
                        "inline-flex h-(--control-h-sm) cursor-pointer items-center gap-2",
                        "rounded-control border border-input px-3 text-xs font-semibold",
                        "transition-colors duration-(--duration-fast) ease-standard",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus-within:ring-2 focus-within:ring-ring",
                        "[&_svg]:size-4 [&_svg]:shrink-0",
                      )}
                    >
                      <Upload aria-hidden="true" />
                      Upload a photo
                    </Label>
                    <input
                      id={avatarInputId}
                      data-slot="settings-page-avatar-input"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleAvatarChange}
                    />
                    <p className="text-caption text-muted-foreground">PNG or JPG, up to 2 MB.</p>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor={nameId}>{nameLabel}</Label>
                    <Input
                      id={nameId}
                      name="name"
                      autoComplete="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={emailId}>{emailLabel}</Label>
                    <Input
                      id={emailId}
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="mt-6 justify-end border-t pt-6">
                <Button type="submit">Save changes</Button>
              </CardFooter>
            </form>
          </Card>

          <Card
            id={sections[1]!.id}
            data-slot="settings-page-preferences"
            role="region"
            className="scroll-mt-24"
            aria-labelledby={`${sections[1]!.id}-title`}
          >
            <CardHeader>
              <CardTitle id={`${sections[1]!.id}-title`}>Preferences</CardTitle>
              <CardDescription>Choose what we are allowed to send you.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col">
              {preferences.map((preference, index) => (
                <React.Fragment key={preference.id}>
                  {index > 0 ? <Separator className="my-4" /> : null}
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex min-w-0 flex-col gap-1">
                      <Label htmlFor={`${id}-${preference.id}`}>{preference.label}</Label>
                      {preference.description ? (
                        <p
                          id={`${id}-${preference.id}-description`}
                          className="text-sm text-pretty text-muted-foreground"
                        >
                          {preference.description}
                        </p>
                      ) : null}
                    </div>
                    <Switch
                      id={`${id}-${preference.id}`}
                      defaultChecked={preference.defaultChecked}
                      checked={preference.checked}
                      disabled={preference.disabled}
                      aria-describedby={
                        preference.description ? `${id}-${preference.id}-description` : undefined
                      }
                      onCheckedChange={preference.onCheckedChange}
                    />
                  </div>
                </React.Fragment>
              ))}
            </CardContent>
          </Card>

          {showAppearance ? (
            <Card
              id={sections[2]!.id}
              data-slot="settings-page-appearance"
              role="region"
              className="scroll-mt-24"
              aria-labelledby={`${sections[2]!.id}-title`}
            >
              <CardHeader>
                <CardTitle id={`${sections[2]!.id}-title`}>Appearance</CardTitle>
                <CardDescription>
                  These write straight onto the document element, so every token re-resolves at
                  once.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <span id={`${id}-theme-label`} className="text-sm font-medium">
                    Colour mode
                  </span>
                  <ToggleGroup
                    type="single"
                    variant="outline"
                    size="sm"
                    value={theme}
                    aria-labelledby={`${id}-theme-label`}
                    onValueChange={(next) => next && applyTheme(next as SettingsPageTheme)}
                  >
                    <ToggleGroupItem value="light" aria-label="Light">
                      <Sun aria-hidden="true" />
                      Light
                    </ToggleGroupItem>
                    <ToggleGroupItem value="dark" aria-label="Dark">
                      <Moon aria-hidden="true" />
                      Dark
                    </ToggleGroupItem>
                    <ToggleGroupItem value="system" aria-label="System">
                      <Monitor aria-hidden="true" />
                      System
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                <Separator />

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <span id={`${id}-brand-label`} className="text-sm font-medium">
                    Brand
                  </span>
                  <ToggleGroup
                    type="single"
                    variant="outline"
                    size="sm"
                    value={brand}
                    aria-labelledby={`${id}-brand-label`}
                    onValueChange={(next) => next && applyBrand(next)}
                  >
                    {brands.map((option) => (
                      <ToggleGroupItem key={option.value} value={option.value}>
                        {option.label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>

                <Separator />

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <span id={`${id}-density-label`} className="text-sm font-medium">
                    Density
                  </span>
                  <ToggleGroup
                    type="single"
                    variant="outline"
                    size="sm"
                    value={density}
                    aria-labelledby={`${id}-density-label`}
                    onValueChange={(next) => next && applyDensity(next as SettingsPageDensity)}
                  >
                    {densities.map((option) => (
                      <ToggleGroupItem key={option.value} value={option.value}>
                        {option.label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
              </CardContent>
            </Card>
          ) : null}

          <Card
            id={sections[sections.length - 1]!.id}
            data-slot="settings-page-danger"
            role="region"
            className="scroll-mt-24 border-destructive/40"
            aria-labelledby={`${sections[sections.length - 1]!.id}-title`}
          >
            <CardHeader>
              <CardTitle
                id={`${sections[sections.length - 1]!.id}-title`}
                className="text-destructive"
              >
                {dangerTitle}
              </CardTitle>
              <CardDescription>{dangerDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <ConfirmDialog
                destructive
                title={dangerConfirmTitle}
                description={dangerConfirmDescription}
                confirmLabel={dangerActionLabel}
                onConfirm={() => onDangerConfirm?.()}
                trigger={
                  <Button variant="destructive" data-slot="settings-page-danger-trigger">
                    {dangerActionLabel}
                  </Button>
                }
              />
            </CardContent>
          </Card>

          {children}
        </div>
      </div>
    </div>
  );
}

export { SettingsPage };
