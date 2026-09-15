"use client";

import Link from "next/link";
import { usePreferences } from "@/lib/preferences";
import { loc, theme } from "@/theme.config";
import type { MessageKey } from "@/lib/i18n";

export default function Bestseller() {
  const { locale, t } = usePreferences();
  const block = theme.bestseller;
  return (
    <section className="bestseller">
      <div className="bestseller__copy">
        <p className="section-eyebrow">{loc(block.eyebrow, locale)}</p>
        <div>
          <h2>{loc(block.title, locale)}</h2>
          <p>{loc(block.body, locale)}</p>
        </div>
        <Link href={block.cta.href} className="bestseller__link">
          {t(block.cta.key as MessageKey)}
        </Link>
      </div>
      <div className="bestseller__media">
        <img src={block.img} alt={loc(block.title, locale)} />
      </div>
    </section>
  );
}
