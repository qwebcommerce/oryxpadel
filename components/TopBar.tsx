"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PrefToggles from "@/components/storefront/PrefToggles";
import { logoutAdminAction } from "@/lib/actions";
import { useCommerceSettings } from "@/lib/commerce-settings";
import { promoIsActive } from "@/lib/format";
import { usePreferences } from "@/lib/preferences";
import { theme } from "@/theme.config";

export default function TopBar({
  compact = false,
  adminEmail,
}: {
  compact?: boolean;
  adminEmail?: string | null;
}) {
  const { t } = usePreferences();
  const settings = useCommerceSettings();
  const [scrolled, setScrolled] = useState(false);
  const announcement = [
    t("announceShipping", { currency: theme.commerce.currency, amount: settings.freeShippingFrom }),
    t("announceReturns", { days: settings.returnDays }),
    promoIsActive(settings)
      ? t("announcePromo", { code: settings.promoCode, percent: settings.promoPercent })
      : "",
  ]
    .filter(Boolean)
    .join(" · ");

  useEffect(() => {
    if (!compact) return;
    const sync = () => setScrolled(window.scrollY > 8);
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    return () => window.removeEventListener("scroll", sync);
  }, [compact]);

  if (compact) {
    return (
      <div className={`topbar topbar--admin${scrolled ? " is-scrolled" : ""}`}>
        {adminEmail ? <AdminProductSearch /> : null}
        <div className="topbar-switches" dir="ltr">
          <PrefToggles />
          {adminEmail ? <AdminAvatar email={adminEmail} /> : null}
        </div>
      </div>
    );
  }

  return (
    <div className="topbar">
      <PrefToggles />
      <p style={{ textAlign: "center", margin: 0 }} className="hidden md:block">
        {announcement}
      </p>
    </div>
  );
}

function AdminProductSearch() {
  const { t } = usePreferences();
  const router = useRouter();
  const [query, setQuery] = useState("");

  function go(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = query.trim();
    router.push(next ? `/admin/products?q=${encodeURIComponent(next)}` : "/admin/products");
  }

  return (
    <form className="admin-top-search" onSubmit={go} role="search">
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t("productSearch")}
        aria-label={t("productSearch")}
      />
      <button type="submit" aria-label={t("search")}>
        <SearchIcon />
      </button>
    </form>
  );
}

function AdminAvatar({ email }: { email: string }) {
  const { t } = usePreferences();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const initial = (email.trim()[0] || "A").toUpperCase();

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="admin-avatar" ref={root}>
      <button
        type="button"
        className="admin-avatar__btn"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        title={email}
      >
        {initial}
      </button>
      {open ? (
        <div className="admin-avatar__menu" role="menu">
          <p className="admin-avatar__email">{email}</p>
          <Link href="/admin" role="menuitem" onClick={() => setOpen(false)}>
            {t("dashboard")}
          </Link>
          <form action={logoutAdminAction}>
            <button type="submit" role="menuitem">
              {t("logOut")}
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.25" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 16.5 20 20.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
