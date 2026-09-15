"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import BrandLogo from "@/components/BrandLogo";
import AccountMenu, { type StoreCustomer } from "@/components/storefront/AccountMenu";
import CollectionsMenu, { CollectionsPanel } from "@/components/storefront/CollectionsMenu";
import PrefToggles from "@/components/storefront/PrefToggles";
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
  const textColor = "var(--black)";

  useEffect(() => {
    if (!mobileOpen) return;
    const onPointer = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest(".shop-nav-shell, .header-menu-btn")) return;
      setMobileOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
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
              className="header-menu-btn"
              aria-label={t("menu")}
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

        <nav className={`shop-nav shop-nav--menu${mobileOpen ? " is-open" : ""}`} aria-label={t("shop")}>
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
