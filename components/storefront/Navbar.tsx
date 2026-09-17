"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import BrandLogo from "@/components/BrandLogo";
import AccountMenu, { type StoreCustomer } from "@/components/storefront/AccountMenu";
import CollectionsMenu, { CollectionsPanel } from "@/components/storefront/CollectionsMenu";
import PrefToggles from "@/components/storefront/PrefToggles";
import { nestCategories, localizedCategoryName } from "@/lib/categories";
import { usePreferences } from "@/lib/preferences";
import { useCart, useUi, useWishlist } from "@/lib/store";
import { loc, theme } from "@/theme.config";
import type { Category } from "@/types";

export default function Navbar({
  customer = null,
  categories = [],
}: {
  customer?: StoreCustomer | null;
  categories?: Category[];
}) {
  const pathname = usePathname();
  const { count } = useCart();
  const { ids: wishlistIds } = useWishlist();
  const { setSearchOpen, setCartOpen } = useUi();
  const { t, locale } = usePreferences();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catsOpen, setCatsOpen] = useState(false);
  const [openCat, setOpenCat] = useState<string | null>(null);
  const textColor = "var(--black)";
  const categoryTree = nestCategories(categories);

  useEffect(() => {
    setMobileOpen(false);
    setCatsOpen(false);
    setOpenCat(null);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onPointer = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest(".mobile-drawer, .header-menu-btn")) return;
      setMobileOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  return (
    <header className="site-header">
      <Link href="/shop" className="announce-bar">
        {loc(theme.announcement, locale)}
      </Link>

      <div className="shop-nav-shell">
        <div className="shop-nav shop-nav--top">
          <div className="shop-nav-left">
            <NavIcon
              href="/search"
              title={t("search")}
              color={textColor}
              onClick={(event) => {
                event.preventDefault();
                setSearchOpen(true);
              }}
            >
              <SearchIcon />
            </NavIcon>
            <button
              type="button"
              className={`header-menu-btn${mobileOpen ? " is-open" : ""}`}
              aria-label={t("menu")}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              onClick={() => setMobileOpen((open) => !open)}
            >
              <MenuIcon />
            </button>
          </div>

          <div className="shop-nav-logo">
            <Link href="/" aria-label={theme.brand.display}>
              <BrandLogo size="nav" />
            </Link>
          </div>

          <div className="shop-nav-right">
            <PrefToggles />
            <NavIcon href="/wishlist" title={t("wishlist")} badge={wishlistIds.length || undefined} color={textColor}>
              <HeartIcon />
            </NavIcon>
            <NavIcon
              href="/cart"
              title={t("bag")}
              badge={count}
              color={textColor}
              onClick={(event) => {
                event.preventDefault();
                setCartOpen(true);
              }}
            >
              <BagIcon />
            </NavIcon>
            <AccountMenu customer={customer} color={textColor} />
          </div>
        </div>

        <nav className="shop-nav shop-nav--menu" aria-label={t("shop")}>
          <Link href="/" className={`nav-link${pathname === "/" ? " is-active" : ""}`}>
            {t("home")}
          </Link>
          <CollectionsMenu color={textColor} />
          <Link href="/contact" className={`nav-link${pathname.startsWith("/contact") ? " is-active" : ""}`}>
            {t("navContact")}
          </Link>
          <Link href="/faq" className={`nav-link${pathname.startsWith("/faq") ? " is-active" : ""}`}>
            {t("navFaq")}
          </Link>
        </nav>

        <CollectionsPanel categories={categories} />
      </div>

      <div
        className={`mobile-drawer-backdrop${mobileOpen ? " is-open" : ""}`}
        aria-hidden={!mobileOpen}
        onClick={() => setMobileOpen(false)}
      />
      <aside
        id="mobile-nav"
        className={`mobile-drawer${mobileOpen ? " is-open" : ""}`}
        aria-hidden={!mobileOpen}
        aria-label={t("menu")}
      >
        <div className="mobile-drawer__head">
          <p>{t("menu")}</p>
          <button type="button" className="mobile-drawer__close" aria-label={t("close")} onClick={() => setMobileOpen(false)}>
            <CloseIcon />
          </button>
        </div>
        <nav className="mobile-drawer__nav">
          <Link href="/" className={pathname === "/" ? "is-active" : ""}>
            {t("home")}
          </Link>
          <div className={`mobile-drawer__drop${catsOpen ? " is-open" : ""}`}>
            <button
              type="button"
              className="mobile-drawer__drop-btn"
              aria-expanded={catsOpen}
              onClick={() => setCatsOpen((open) => !open)}
            >
              {t("categories")}
              <ChevronIcon />
            </button>
            {catsOpen ? (
              <div className="mobile-drawer__drop-panel">
                <Link href="/shop">{t("viewAllProducts")}</Link>
                {categoryTree.map((category) => {
                  const label = localizedCategoryName(category, locale);
                  if (category.children.length === 0) {
                    return (
                      <Link key={category.id} href={`/shop/${category.slug}`}>
                        {label}
                      </Link>
                    );
                  }
                  const expanded = openCat === category.id;
                  return (
                    <div key={category.id} className={`mobile-drawer__sub${expanded ? " is-open" : ""}`}>
                      <button
                        type="button"
                        className="mobile-drawer__sub-btn"
                        aria-expanded={expanded}
                        onClick={() => setOpenCat(expanded ? null : category.id)}
                      >
                        {label}
                        <ChevronIcon />
                      </button>
                      {expanded ? (
                        <div className="mobile-drawer__sub-panel">
                          <Link href={`/shop/${category.slug}`}>{label}</Link>
                          {category.children.map((child) => (
                            <Link key={child.id} href={`/shop/${child.slug}`}>
                              {localizedCategoryName(child, locale)}
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
          <Link href="/contact" className={pathname.startsWith("/contact") ? "is-active" : ""}>
            {t("navContact")}
          </Link>
          <Link href="/faq" className={pathname.startsWith("/faq") ? "is-active" : ""}>
            {t("navFaq")}
          </Link>
        </nav>
      </aside>
    </header>
  );
}

function NavIcon({
  children,
  title,
  badge,
  color,
  href,
  onClick,
}: {
  children: ReactNode;
  title: string;
  badge?: number;
  color: string;
  href?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
}) {
  const style: CSSProperties = {
    background: "none",
    border: "none",
    cursor: "pointer",
    color,
    padding: "4px",
    position: "relative",
    zIndex: 3,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
  const body = (
    <>
      {children}
      {badge !== undefined && badge > 0 ? (
        <span className="nav-badge">{badge > 9 ? "9+" : badge}</span>
      ) : null}
    </>
  );
  if (href) {
    return (
      <Link href={href} title={title} aria-label={title} className="header-icon-btn" style={style} onClick={onClick}>
        {body}
      </Link>
    );
  }
  return (
    <button type="button" title={title} aria-label={title} className="header-icon-btn" style={style} onClick={onClick}>
      {body}
    </button>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
      <path d="M6 7h12l-1 13H7L6 7Z" />
      <path d="M9 7V6a3 3 0 0 1 6 0v1" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2.4 4.4 6 8l3.6-3.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
