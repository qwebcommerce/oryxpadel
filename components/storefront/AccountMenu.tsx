"use client";

import Link from "next/link";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { logoutCustomerAction } from "@/lib/actions";
import { usePreferences } from "@/lib/preferences";

export type StoreCustomer = {
  fullName: string;
  email: string;
};

function initials(name: string, email: string) {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
  }
  const letter = parts[0]?.[0] || (email ?? "").trim()[0] || "U";
  return letter.toUpperCase();
}

export default function AccountMenu({
  customer,
  color,
}: {
  customer: StoreCustomer | null;
  color: string;
}) {
  const { t } = usePreferences();
  const root = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const onPointer = (event: PointerEvent) => {
      const el = root.current;
      if (!el?.open) return;
      if (!el.contains(event.target as Node)) el.open = false;
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, []);

  if (!customer) {
    return (
      <NavIcon href="/account/login" title={t("account")} color={color}>
        <UserIcon />
      </NavIcon>
    );
  }

  return (
    <details className="admin-avatar nav-avatar" ref={root}>
      <summary
        className="admin-avatar__btn"
        title={customer.fullName || customer.email}
        aria-label={customer.fullName || customer.email}
      >
        {initials(customer.fullName, customer.email)}
      </summary>
      <div className="admin-avatar__menu" role="menu">
        <p className="admin-avatar__email">{customer.email}</p>
        <Link href="/account" role="menuitem">
          {t("dashboard")}
        </Link>
        <Link href="/account/orders" role="menuitem">
          {t("ordersNav")}
        </Link>
        <Link href="/account/profile" role="menuitem">
          {t("profileNav")}
        </Link>
        <form action={logoutCustomerAction}>
          <button type="submit" role="menuitem">
            {t("logOut")}
          </button>
        </form>
      </div>
    </details>
  );
}

function NavIcon({
  children,
  title,
  color,
  href,
}: {
  children: ReactNode;
  title: string;
  color: string;
  href: string;
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
  return (
    <Link href={href} title={title} aria-label={title} className="header-icon-btn" style={style}>
      {children}
    </Link>
  );
}

function UserIcon() {
  return (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
