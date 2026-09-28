"use client";

/** Install snippet with npm, pnpm, yarn and bun tabs and a one-click copy, the way a library's own docs present it. Remembers the reader's package manager. */
import * as React from "react";
import { Terminal } from "lucide-react";
import { cn } from "../lib/cn";
import { useT } from "../lib/i18n";
import { CopyButton } from "../components/copy-button";
import { notify } from "../components/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/tabs";

export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

const ADD: Record<PackageManager, string> = {
  npm: "npm install",
  pnpm: "pnpm add",
  yarn: "yarn add",
  bun: "bun add",
};

const DEV_FLAG: Record<PackageManager, string> = {
  npm: "-D",
  pnpm: "-D",
  yarn: "-D",
  bun: "-d",
};

/** One-off execution of a binary that is not installed — the `npx` family. */
const EXEC: Record<PackageManager, string> = {
  npm: "npx",
  pnpm: "pnpm dlx",
  yarn: "yarn dlx",
  bun: "bunx",
};

const ALL_MANAGERS: PackageManager[] = ["npm", "pnpm", "yarn", "bun"];

export interface InstallCommandProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** Package(s) to add, e.g. `@design-eg/ui`. Rendered as `npm install …` and its equivalents. */
  packageName?: string | string[];
  /** A binary to run once instead, e.g. `@design-eg/cli add button` — rendered as `npx …`, `pnpm dlx …`. */
  command?: string;
  /** Full override per manager, when neither shape above fits. */
  commands?: Partial<Record<PackageManager, string>>;
  /** Install as a dev dependency. */
  dev?: boolean;
  /** Which managers to offer, in tab order. */
  managers?: PackageManager[];
  /** Manager selected on first paint. */
  defaultManager?: PackageManager;
  /** localStorage key holding the reader's choice, or `false` to not remember it. */
  storageKey?: string | false;
  /** Small label in the bar, next to the terminal glyph. */
  label?: React.ReactNode;
  /** Toast on a successful copy: `false` stays silent, a string replaces the message. */
  toast?: boolean | string;
  /** Notified whenever the reader switches manager. */
  onManagerChange?: (manager: PackageManager) => void;
}

function InstallCommand({
  className,
  packageName,
  command,
  commands,
  dev = false,
  managers = ALL_MANAGERS,
  defaultManager,
  storageKey = "design-eg:package-manager",
  label,
  toast = true,
  onManagerChange,
  ...props
}: InstallCommandProps) {
  const t = useT();
  const tabs = managers.length ? managers : ALL_MANAGERS;
  const [manager, setManager] = React.useState<PackageManager>(defaultManager ?? tabs[0] ?? "npm");

  // Read the remembered choice after mount: reading it during render would make
  // the server and the client disagree on the first paint.
  React.useEffect(() => {
    if (storageKey === false || defaultManager) return;
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved && (tabs as string[]).includes(saved)) setManager(saved as PackageManager);
    } catch {
      // Storage can be disabled entirely; the default stands.
    }
    // The tab list is a literal at every call site, so comparing by identity is
    // enough and avoids re-reading storage on every render.
  }, [storageKey, defaultManager, tabs]);

  function selectManager(next: string) {
    const value = next as PackageManager;
    setManager(value);
    onManagerChange?.(value);
    if (storageKey === false) return;
    try {
      window.localStorage.setItem(storageKey, value);
    } catch {
      // Nothing to do: the choice simply will not survive a reload.
    }
  }

  function commandFor(target: PackageManager): string {
    const override = commands?.[target];
    if (override) return override;
    if (command) return `${EXEC[target]} ${command}`;
    if (packageName) {
      const names = Array.isArray(packageName) ? packageName.join(" ") : packageName;
      return `${ADD[target]}${dev ? ` ${DEV_FLAG[target]}` : ""} ${names}`;
    }
    return "";
  }

  function handleCopy() {
    if (toast === false) return;
    notify.copied(typeof toast === "string" ? toast : "Command copied", {
      description: commandFor(manager),
    });
  }

  return (
    <div
      data-slot="install-command"
      className={cn("overflow-hidden rounded-card border bg-surface-1", className)}
      {...props}
    >
      <Tabs value={manager} onValueChange={selectManager} className="gap-0">
        <div className="flex items-center gap-2 border-b bg-surface-2 ps-3 pe-2 py-1.5">
          <Terminal aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground" />
          {label ? (
            <span className="truncate font-mono text-xs text-muted-foreground">{label}</span>
          ) : null}
          <TabsList
            aria-label={t("installCommand.packageManager")}
            className="ms-auto h-7 bg-transparent p-0 text-muted-foreground"
          >
            {tabs.map((item) => (
              <TabsTrigger
                key={item}
                value={item}
                className="h-7 px-2 font-mono text-xs data-[state=active]:bg-surface-1"
              >
                {item}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {tabs.map((item) => (
          <TabsContent key={item} value={item} className="m-0">
            <div className="flex items-center gap-3 ps-4 pe-2 py-2.5">
              <span aria-hidden="true" className="shrink-0 font-mono text-sm text-muted-foreground">
                $
              </span>
              <code
                dir="ltr"
                className="min-w-0 flex-1 overflow-x-auto text-start font-mono text-sm whitespace-pre"
              >
                {commandFor(item)}
              </code>
              <CopyButton
                value={commandFor(item)}
                copyLabel="Copy install command"
                onCopy={handleCopy}
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export { InstallCommand };
