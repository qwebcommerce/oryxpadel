"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nestCategories, localizedCategoryName } from "@/lib/categories";
import { usePreferences } from "@/lib/preferences";
import type { Category } from "@/types";

export default function CollectionsMenu({ color }: { color: string }) {
  const { t } = usePreferences();
  const pathname = usePathname();
  const active = pathname === "/shop" || pathname.startsWith("/shop/");
  return (
    <Link
      href="/shop"
      className={`nav-link nav-mega-trigger${active ? " is-active" : ""}`}
      style={{ color }}
      aria-haspopup="true"
      aria-controls="collections-menu"
    >
      {t("categories")}
      <ChevronDown />
    </Link>
  );
}

export function CollectionsPanel({ categories }: { categories: Category[] }) {
  const { t, locale } = usePreferences();
  const tree = nestCategories(categories);

  return (
    <div className="mega-layer" id="collections-menu" role="menu" aria-label={t("categories")}>
      <div className="mega-panel">
        <div className="mega-panel__inner">
          <div className="mega-panel__head">
            <p>{t("shopByCategory")}</p>
            <Link href="/shop" className="mega-panel__all">
              {t("viewAllProducts")}
            </Link>
          </div>
          {tree.length === 0 ? (
            <p className="mega-panel__empty">{t("noCategories")}</p>
          ) : (
            <div className="mega-grid">
              {tree.map((category) => (
                <div key={category.id} className="mega-col">
                  <Link href={`/shop/${category.slug}`} className="mega-col__title">
                    {localizedCategoryName(category, locale)}
                  </Link>
                  {category.children.length > 0 ? (
                    <ul className="mega-col__subs">
                      {category.children.map((child) => (
                        <li key={child.id}>
                          <Link href={`/shop/${child.slug}`}>
                            {localizedCategoryName(child, locale)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ChevronDown() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2.4 4.4 6 8l3.6-3.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
