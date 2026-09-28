"use client";

import { ThemeSelect } from "@design-eg/ui";

export default function ThemeSelectExample() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <ThemeSelect align="start" />
        <span className="text-xs text-muted-foreground">select</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ThemeSelect variant="icon" />
        <span className="text-xs text-muted-foreground">icon</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ThemeSelect variant="ghost" size="sm" />
        <span className="text-xs text-muted-foreground">ghost, sm</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ThemeSelect
          size="sm"
          labels={{ trigger: "المظهر", light: "فاتح", dark: "داكن", system: "النظام" }}
        />
        <span className="text-xs text-muted-foreground">translated</span>
      </div>
    </div>
  );
}
