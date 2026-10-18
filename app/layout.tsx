import type { Metadata } from "next";
import { cookies } from "next/headers";
import localFont from "next/font/local";
import { PreferencesProvider, PREFERENCE_BOOTSTRAP } from "@/lib/preferences";
import { ToastProvider } from "@/lib/toast";
import { defaultLocale, defaultThemeMode, theme, themeCss, type Locale } from "@/theme.config";
import "./globals.css";

const newsreader = localFont({
  src: [
    { path: "./fonts/newsreader-latin-wght-normal.woff2", weight: "200 800", style: "normal" },
    { path: "./fonts/newsreader-latin-wght-italic.woff2", weight: "200 800", style: "italic" },
  ],
  variable: "--font-body",
  display: "swap",
});

const redHat = localFont({
  src: [
    { path: "./fonts/red-hat-display-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/red-hat-display-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/red-hat-display-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-accent",
  display: "swap",
});

const arabic = localFont({
  src: [
    { path: "./fonts/ibm-plex-sans-arabic-arabic-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ibm-plex-sans-arabic-arabic-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/ibm-plex-sans-arabic-arabic-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/ibm-plex-sans-arabic-arabic-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${theme.brand.display} — ${theme.brand.tagline.en}`,
    template: `%s · ${theme.brand.display}`,
  },
  description: theme.brand.description.en,
  icons: { icon: "/logo.png" },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const store = await cookies();
  const locale = (store.get("qc_locale")?.value === "ar" ? "ar" : defaultLocale) as Locale;
  const colorTheme = defaultThemeMode;

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      data-theme={colorTheme}
      className={`${newsreader.variable} ${redHat.variable} ${arabic.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCss() }} />
        <script dangerouslySetInnerHTML={{ __html: PREFERENCE_BOOTSTRAP }} />
      </head>
      <body className={`${newsreader.className} min-h-full flex flex-col`}>
        <PreferencesProvider initialLocale={locale} initialTheme={colorTheme}>
          <ToastProvider>{children}</ToastProvider>
        </PreferencesProvider>
      </body>
    </html>
  );
}
