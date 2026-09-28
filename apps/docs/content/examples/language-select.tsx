"use client";

import { LanguageSelect } from "@design-eg/ui";

export default function LanguageSelectExample() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <LanguageSelect align="start" />
        <span className="text-xs text-muted-foreground">select</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <LanguageSelect display="code" />
        <span className="text-xs text-muted-foreground">code</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <LanguageSelect variant="ghost" size="sm" />
        <span className="text-xs text-muted-foreground">ghost, sm</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <LanguageSelect
          size="sm"
          label="اللغة"
          locales={[
            { code: "en", nativeName: "English", englishName: "English" },
            { code: "ar", nativeName: "العربية", englishName: "Arabic" },
            { code: "fr", nativeName: "Français", englishName: "French" },
            { code: "he", nativeName: "עברית", englishName: "Hebrew" },
          ]}
        />
        <span className="text-xs text-muted-foreground">custom list</span>
      </div>
    </div>
  );
}
