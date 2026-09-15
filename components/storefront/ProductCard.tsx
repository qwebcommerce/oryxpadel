"use client";

import Link from "next/link";
import type { MouseEvent, PointerEvent } from "react";
import { formatQar } from "@/lib/format";
import { bilingualCopy, firstAvailableVariant, productPriceRange, productStock, variantImage } from "@/lib/products";
import { usePreferences } from "@/lib/preferences";
import { useCart, useUi, useWishlist } from "@/lib/store";
import { useToast } from "@/lib/toast";
import type { Product } from "@/types";

const BADGE: Record<string, { bg: string; color: string }> = {
  BESTSELLER: { bg: "var(--gold)", color: "var(--accent-ink)" },
  TRENDING: { bg: "var(--gold)", color: "var(--accent-ink)" },
  NEW: { bg: "var(--gold)", color: "var(--accent-ink)" },
  SALE: { bg: "var(--sale)", color: "#fff" },
};

export default function ProductCard({
  product,
  width,
  showRemove,
}: {
  product: Product;
  width?: number;
  showRemove?: boolean;
}) {
  const { add } = useCart();
  const { setCartOpen } = useUi();
  const { toggle, remove, has } = useWishlist();
  const toast = useToast();
  const { t, locale } = usePreferences();
  const style = BADGE[product.badge ?? ""];
  const title = bilingualCopy(product.name, product.nameAr, locale);
  const range = productPriceRange(product);
  const stock = productStock(product);
  const variant = firstAvailableVariant(product);
  const cover = variantImage(product, variant);
  const saved = has(product.id);
  const simple = !product.hasVariants;
  const name = title.primary;

  function addToBag(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (!simple || stock <= 0) return;
    add(product);
    toast.success(t("toastAddedToBag"), name);
    setCartOpen(true);
  }

  function toggleFavorite(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    const next = !saved;
    toggle(product.id);
    toast.success(next ? t("savedToWishlist") : t("removedFromWishlist"), name);
  }

  return (
    <article className="product-card" style={{ width: width ? `${width}px` : undefined }}>
      <div className="product-card__media">
        <div className="prod-img">
          <Link href={`/product/${product.slug}`} tabIndex={-1} aria-hidden="true">
            <img src={cover} alt="" loading="lazy" draggable={false} />
          </Link>
          {style && product.badge && (
            <span
              style={{
                position: "absolute",
                top: "0.75rem",
                left: "0.75rem",
                zIndex: 1,
                backgroundColor: style.bg,
                color: style.color,
                fontSize: "0.52rem",
                fontWeight: 800,
                letterSpacing: "0.15em",
                padding: "0.25rem 0.65rem",
                textTransform: "uppercase",
              }}
            >
              {product.badge}
            </span>
          )}
          {simple ? (
            <button
              type="button"
              className="add-btn"
              onClick={addToBag}
              onPointerDown={(event) => event.stopPropagation()}
              disabled={stock <= 0}
              aria-label={stock <= 0 ? t("outOfStock") : t("addToBag")}
            >
              <span className="add-btn__icon" aria-hidden="true">
                <CartIcon />
              </span>
              <span className="add-btn__label">
                <span>{stock <= 0 ? t("outOfStock") : t("addToBag")}</span>
              </span>
            </button>
          ) : (
            <Link
              href={`/product/${product.slug}`}
              className="add-btn"
              aria-label={t("chooseOptions")}
              onPointerDown={(event) => event.stopPropagation()}
            >
              <span className="add-btn__icon" aria-hidden="true">
                <CartIcon />
              </span>
              <span className="add-btn__label">
                <span>{t("chooseOptions")}</span>
              </span>
            </Link>
          )}
        </div>
        <button
          type="button"
          className={`fav-btn${saved ? " is-on" : ""}`}
          aria-pressed={saved}
          aria-label={saved ? t("savedToWishlist") : t("addToWishlist")}
          title={saved ? t("savedToWishlist") : t("addToWishlist")}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={toggleFavorite}
        >
          <HeartIcon filled={saved} />
        </button>
      </div>
      <Link href={`/product/${product.slug}`} className="product-card__copy">
        <p className="product-card__name">
          <span dir={title.primaryDir} lang={title.primaryDir === "rtl" ? "ar" : undefined}>
            {name}
          </span>
        </p>
        <div className="product-card__price">
          <span>
            {range.min !== range.max ? t("fromPrice", { price: formatQar(range.min) }) : formatQar(range.min)}
          </span>
          {product.compareAtPrice ? (
            <span className="product-card__compare">{formatQar(product.compareAtPrice)}</span>
          ) : null}
        </div>
      </Link>
      {showRemove ? (
        <button
          type="button"
          className="wishlist-remove"
          onClick={() => {
            remove(product.id);
            toast.success(t("removedFromWishlist"), name);
          }}
        >
          {t("removeFavorite")}
        </button>
      ) : null}
    </article>
  );
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.3"
        d="M16.608 9.421V6.906H3.392v8.016c0 .567.224 1.112.624 1.513.4.402.941.627 1.506.627H8.63M8.818 3h2.333c.618 0 1.212.247 1.649.686a2.35 2.35 0 0 1 .683 1.658v1.562H6.486V5.344c0-.622.246-1.218.683-1.658A2.33 2.33 0 0 1 8.82 3"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.3"
        d="M14.608 12.563v5m2.5-2.5h-5"
      />
    </svg>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 20.4s-7.2-4.35-9.3-8.55C1.2 9.15 2.4 5.7 5.7 4.95c1.8-.4 3.45.3 4.5 1.65C11.25 5.25 12.9 4.55 14.7 4.95c3.3.75 4.5 4.2 3 6.9C19.2 16.05 12 20.4 12 20.4Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
