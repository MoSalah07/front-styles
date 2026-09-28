"use client";

import { Moon, Sun } from "lucide-react";
import { Button, useTheme } from "@design-eg/ui";

export default function UseThemeExample() {
  const { theme, resolvedTheme, setTheme, toggleTheme, mounted } = useTheme();

  return (
    <div className="grid max-w-sm gap-3">
      <Button variant="outline" onClick={toggleTheme}>
        {resolvedTheme === "dark" ? <Moon /> : <Sun />}
        Switch to {resolvedTheme === "dark" ? "light" : "dark"}
      </Button>
      <div className="flex gap-2">
        {(["light", "dark", "system"] as const).map((value) => (
          <Button
            key={value}
            size="sm"
            variant={theme === value ? "default" : "secondary"}
            onClick={() => setTheme(value)}
            className="flex-1 capitalize"
          >
            {value}
          </Button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        {mounted ? `choice: ${theme} · on screen: ${resolvedTheme}` : "reading the stored choice…"}
      </p>
    </div>
  );
}
