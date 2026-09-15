"use client";

import Link from "next/link";
import { usePreferences } from "@/lib/preferences";
import { loc, theme } from "@/theme.config";
import type { MessageKey } from "@/lib/i18n";

export default function Hero() {
  const { locale, t } = usePreferences();
  const slide = theme.hero;

  return (
    <section className="hero">
      <img src={slide.img} alt="" className="hero__media" />
      <div className="hero__overlay" />
      <div className="hero__content">
        <h2 className="hero__title">
          <em>{loc(slide.headline, locale)}</em>
        </h2>
        <Link href={slide.cta.href} className="btn-gold">
          {t(slide.cta.key as MessageKey)}
        </Link>
      </div>
    </section>
  );
}
