"use client";

import Link from "next/link";
import { localizedCategoryName } from "@/lib/categories";
import { usePreferences } from "@/lib/preferences";
import { loc, theme } from "@/theme.config";
import type { Category } from "@/types";

export default function CategoryGrid({ categories }: { categories: Category[] }) {
  const { t, locale } = usePreferences();
  const fallbacks = theme.collections;
  const parents = categories.filter((cat) => !cat.parentId);
  const cards = (parents.length ? parents : fallbacks.map((item, index) => ({
    id: item.slug,
    slug: item.slug,
    name: item.name.en,
    nameAr: item.name.ar,
    image: item.img,
    parentId: null,
    subtitle: "",
    subtitleAr: "",
    sortOrder: index,
  }))).slice(0, 4).map((cat, index) => {
    const preset = fallbacks.find((item) => item.slug === cat.slug) ?? fallbacks[index];
    return {
      ...cat,
      href: `/shop/${cat.slug}`,
      image: cat.image || preset?.img || fallbacks[0].img,
      label: localizedCategoryName(cat, locale) || (preset ? loc(preset.name, locale) : cat.name),
    };
  });

  return (
    <section className="collection-bento">
      <div className="collection-bento__head">
        <p className="section-eyebrow">{t("shopBy")}</p>
        <h3 className="collection-bento__title">
          <em>{t("collectionHeading")}</em>
        </h3>
      </div>
      <div className="collection-bento__grid">
        {cards.map((cat) => (
          <Link key={cat.id} href={cat.href} className="collection-card">
            <img src={cat.image} alt={cat.label} />
            <span>{cat.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
