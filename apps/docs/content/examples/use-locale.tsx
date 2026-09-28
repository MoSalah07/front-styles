"use client";

import { Button, useLocale } from "@design-eg/ui";

export default function UseLocaleExample() {
  const { locale, locales, dir, setLocale } = useLocale();

  return (
    <div className="grid max-w-sm gap-3">
      <div className="flex gap-2">
        {locales.map((entry) => (
          <Button
            key={entry.code}
            size="sm"
            variant={locale === entry.code ? "default" : "secondary"}
            onClick={() => setLocale(entry.code)}
            className="flex-1"
            lang={entry.code}
          >
            {entry.nativeName}
          </Button>
        ))}
      </div>
      <p className="rounded-control border p-3 text-sm" lang={locale}>
        {locale === "ar" ? "النص يتدفق من اليمين إلى اليسار." : "Text flows from left to right."}
      </p>
      <p className="text-xs text-muted-foreground">
        &lt;html lang=&quot;{locale}&quot; dir=&quot;{dir}&quot;&gt;
      </p>
    </div>
  );
}
