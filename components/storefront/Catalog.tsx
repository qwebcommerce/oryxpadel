"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import ProductCard from "@/components/storefront/ProductCard";
import { nestCategories, localizedCategoryName } from "@/lib/categories";
import { formatQar } from "@/lib/format";
import { productPriceRange, productStock } from "@/lib/products";
import { usePreferences } from "@/lib/preferences";
import { theme } from "@/theme.config";
import type { Category, Product } from "@/types";

const SORTS = [
  { value: "newest", key: "sortFeatured" as const },
  { value: "name", key: "sortNameAZ" as const },
  { value: "name-desc", key: "sortNameZA" as const },
  { value: "price-asc", key: "sortPriceLow" as const },
  { value: "price-desc", key: "sortPriceHigh" as const },
  { value: "oldest", key: "sortDateOld" as const },
  { value: "date-new", key: "sortDateNew" as const },
];

export default function Catalog({
  title: _title,
  products,
  categories,
  activeSlug,
  sort,
}: {
  title: string;
  products: Product[];
  categories: Category[];
  activeSlug?: string;
  sort?: string;
}) {
  const { t, locale } = usePreferences();
  const router = useRouter();
  const pathname = usePathname();
  const tree = nestCategories(categories);
  const active = categories.find((category) => category.slug === activeSlug);
  const [inStock, setInStock] = useState(false);
  const [outOfStock, setOutOfStock] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [compact, setCompact] = useState(false);

  const highest = useMemo(
    () => products.reduce((max, product) => Math.max(max, productPriceRange(product).max), 0),
    [products],
  );

  const visible = useMemo(() => {
    const min = minPrice === "" ? 0 : Number(minPrice);
    const max = maxPrice === "" ? Number.POSITIVE_INFINITY : Number(maxPrice);
    return products.filter((product) => {
      const stock = productStock(product);
      const available = stock > 0;
      if (inStock && !outOfStock && !available) return false;
      if (outOfStock && !inStock && available) return false;
      const range = productPriceRange(product);
      if (range.max < min || range.min > max) return false;
      return true;
    });
  }, [products, inStock, outOfStock, minPrice, maxPrice]);

  function setSort(value: string) {
    const params = new URLSearchParams();
    const sortValue = value === "date-new" ? "newest" : value;
    if (sortValue && sortValue !== "newest") params.set("sort", sortValue);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  const countLabel = `${visible.length} ${visible.length === 1 ? t("item") : t("items")}`;
  const currentSort = sort ?? "newest";

  return (
    <section className="page-section catalog">
      <div className="catalog__head">
        <h1 className="catalog__title">{active ? localizedCategoryName(active, locale) : t("allProducts")}</h1>
      </div>

      {tree.length > 0 ? (
        <div className="collection-top-nav">
          <div className="collection-chips-scroll">
            {tree.map((cat) => {
              const image = cat.image || products.find((product) => product.categorySlug === cat.slug)?.images[0] || "";
              return (
                <Link
                  key={cat.id}
                  href={`/shop/${cat.slug}`}
                  className={`collection-chip${activeSlug === cat.slug ? " is-active" : ""}`}
                >
                  {image ? <img src={image} alt="" /> : <span className="collection-chip__fallback" />}
                  <span>{localizedCategoryName(cat, locale)}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="catalog__toolbar">
        <h4 className="catalog__filters-title">{t("filters")}</h4>
        <p className="catalog__count">{countLabel}</p>
        <label className="catalog__sort-label">
          <span>{t("sort")}</span>
          <select
            className="catalog__sort-select"
            value={currentSort}
            onChange={(event) => setSort(event.target.value)}
          >
            {SORTS.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.key)}
              </option>
            ))}
          </select>
        </label>
        <div className="catalog__density" role="radiogroup" aria-label={t("gridView")}>
          <button
            type="button"
            className={!compact ? "is-active" : ""}
            aria-pressed={!compact}
            aria-label={t("gridDefault")}
            onClick={() => setCompact(false)}
          >
            <GridDefaultIcon />
          </button>
          <button
            type="button"
            className={compact ? "is-active" : ""}
            aria-pressed={compact}
            aria-label={t("gridCompact")}
            onClick={() => setCompact(true)}
          >
            <GridCompactIcon />
          </button>
        </div>
      </div>

      <div className="catalog__body">
        <aside className="catalog__nav">
          <details className="facet" open>
            <summary>
              {t("availability")}
              <CaretIcon />
            </summary>
            <div className="facet__body">
              <label className="facet__check">
                <input type="checkbox" checked={inStock} onChange={(event) => setInStock(event.target.checked)} />
                {t("inStock")}
              </label>
              <label className="facet__check">
                <input type="checkbox" checked={outOfStock} onChange={(event) => setOutOfStock(event.target.checked)} />
                {t("outOfStock")}
              </label>
            </div>
          </details>
          <details className="facet" open>
            <summary>
              {t("price")}
              <CaretIcon />
            </summary>
            <div className="facet__body">
              <div className="price-range">
                <label className="price-range__field">
                  <span>{theme.commerce.currency}</span>
                  <input
                    type="number"
                    min={0}
                    inputMode="decimal"
                    placeholder="0"
                    aria-label={t("lowPrice")}
                    value={minPrice}
                    onChange={(event) => setMinPrice(event.target.value)}
                  />
                </label>
                <span className="price-range__to">{t("to")}</span>
                <label className="price-range__field">
                  <span>{theme.commerce.currency}</span>
                  <input
                    type="number"
                    min={0}
                    inputMode="decimal"
                    placeholder={highest ? highest.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0"}
                    aria-label={t("highPrice")}
                    value={maxPrice}
                    onChange={(event) => setMaxPrice(event.target.value)}
                  />
                </label>
              </div>
              {highest > 0 ? <p className="facet__hint">{t("highestPrice", { price: formatQar(highest) })}</p> : null}
            </div>
          </details>
        </aside>
        <div className="catalog__main">
          {visible.length === 0 ? (
            <p className="catalog__empty">{t("noProducts")}</p>
          ) : (
            <div className={`catalog__grid${compact ? " is-compact" : ""}`}>
              {visible.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function CaretIcon() {
  return (
    <svg width="10" height="6" viewBox="0 0 10 6" aria-hidden="true">
      <path d="M1 1.2 5 5l4-3.8" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function GridDefaultIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <rect x="1" y="1" width="6" height="6" fill="currentColor" />
      <rect x="9" y="1" width="6" height="6" fill="currentColor" />
      <rect x="1" y="9" width="6" height="6" fill="currentColor" />
      <rect x="9" y="9" width="6" height="6" fill="currentColor" />
    </svg>
  );
}

function GridCompactIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      {Array.from({ length: 9 }, (_, index) => (
        <rect
          key={index}
          x={1 + (index % 3) * 5}
          y={1 + Math.floor(index / 3) * 5}
          width="4"
          height="4"
          fill="currentColor"
        />
      ))}
    </svg>
  );
}
