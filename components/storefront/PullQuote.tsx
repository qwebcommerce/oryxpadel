"use client";

import Link from "next/link";
import { usePreferences } from "@/lib/preferences";
import { loc, theme } from "@/theme.config";
import type { MessageKey } from "@/lib/i18n";

export default function PullQuote() {
  const { locale, t } = usePreferences();
  return (
    <section className="pull-quote">
      <p>{loc(theme.pullQuote.text, locale)}</p>
      <Link href={theme.pullQuote.cta.href} className="btn-secondary">
        {t(theme.pullQuote.cta.key as MessageKey)}
      </Link>
    </section>
  );
}
