import type { Metadata } from "next";
import { cookies } from "next/headers";
import { IBM_Plex_Sans_Arabic, Newsreader, Red_Hat_Display } from "next/font/google";
import { PreferencesProvider, PREFERENCE_BOOTSTRAP } from "@/lib/preferences";
import { ToastProvider } from "@/lib/toast";
import { defaultLocale, defaultThemeMode, theme, themeCss, type Locale } from "@/theme.config";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-body",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600", "700"],
});

const redHat = Red_Hat_Display({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const arabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
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
