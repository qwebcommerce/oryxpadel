import { theme } from "@/theme.config";

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://oryxpadel.com").replace(/\/$/, "");
}

export function emailFrom() {
  return process.env.EMAIL_FROM || `${theme.brand.display} <onboarding@resend.dev>`;
}

export function emailBrand() {
  const palette = theme.colors.light;
  return {
    name: theme.brand.display,
    legalName: theme.brand.name,
    tagline: theme.brand.tagline.en,
    taglineAr: theme.brand.tagline.ar,
    accent: palette.accent === "#000000" ? "#111111" : palette.accent,
    gold: palette.accentDark || "#433625",
    bg: "#f6f3ef",
    surface: "#ffffff",
    ink: "#111111",
    muted: "#6b6560",
    line: "#e6e1db",
    footer: "#111111",
    logo: `${siteUrl()}/logo.png`,
    shopUrl: `${siteUrl()}/shop`,
    accountOrdersUrl: `${siteUrl()}/account/orders`,
  };
}
