import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Cairo, Geist, JetBrains_Mono, Noto_Sans_Devanagari } from "next/font/google";
import { I18nProvider, Toaster } from "@design-eg/ui";
import { ThemeScript } from "@/components/theme-script";
import { SITE } from "@/lib/site";
import { LOCALES, LOCALE_META, languageAlternates, type Locale } from "@/lib/locales";
import { getDictionary, getLocale } from "./dictionaries";
import "../globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo", display: "swap" });
const devanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  variable: "--font-devanagari",
  display: "swap",
});
const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

/**
 * Only the fonts a language actually needs.
 *
 * `next/font/google` self-hosts every subset it is told about and preloads it,
 * so attaching all five variables on every page would ship Cairo's Arabic and
 * Noto's Devanagari to a French reader who will never render a glyph of
 * either. The Latin, display and mono faces are common to all four; the script
 * face is not.
 */
const FONTS: Record<Locale, string> = {
  en: `${geist.variable} ${bebas.variable} ${jetbrains.variable}`,
  fr: `${geist.variable} ${bebas.variable} ${jetbrains.variable}`,
  ar: `${geist.variable} ${cairo.variable} ${bebas.variable} ${jetbrains.variable}`,
  hi: `${geist.variable} ${devanagari.variable} ${bebas.variable} ${jetbrains.variable}`,
};

/** Every locale is built at build time; there are four of them. */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dictionary = await getDictionary();
  const meta = LOCALE_META[locale];

  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: `${SITE.name}: ${dictionary.site.tagline}`,
      template: `%s · ${SITE.name}`,
    },
    description: dictionary.site.description,
    keywords: dictionary.site.keywords,
    applicationName: SITE.name,
    authors: [{ name: SITE.name, url: SITE.github }],
    creator: SITE.name,
    alternates: {
      canonical: `/${locale}`,
      languages: languageAlternates(""),
    },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      title: `${SITE.name}: ${dictionary.site.tagline}`,
      description: dictionary.site.description,
      url: `${SITE.url}/${locale}`,
      locale: meta.ogLocale,
      alternateLocale: LOCALES.filter((code) => code !== locale).map(
        (code) => LOCALE_META[code].ogLocale,
      ),
    },
    twitter: {
      card: "summary_large_image",
      title: `${SITE.name}: ${dictionary.site.tagline}`,
      description: dictionary.site.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#141414" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const dictionary = await getDictionary();
  const meta = LOCALE_META[locale];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: SITE.name,
    description: dictionary.site.description,
    url: `${SITE.url}/${locale}`,
    codeRepository: SITE.github,
    programmingLanguage: "TypeScript",
    runtimePlatform: "React 19",
    license: "https://opensource.org/licenses/MIT",
    inLanguage: locale,
    keywords: dictionary.site.keywords.join(", "),
  };

  return (
    <html lang={locale} dir={meta.dir} className={`dark ${FONTS[locale]}`} suppressHydrationWarning>
      <head>
        <ThemeScript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-dvh antialiased">
        {/* Gives every component from the library its default strings in this
            language, so a Dialog close button or a DataTable empty state needs
            no label prop at the call site. */}
        <I18nProvider locale={locale}>
          {children}
          {/* One viewport for the whole site: every copy button and demo toasts through it. */}
          <Toaster />
        </I18nProvider>
      </body>
    </html>
  );
}
