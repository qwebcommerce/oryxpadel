"use client";

import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import Newsletter from "@/components/storefront/Newsletter";
import { usePreferences } from "@/lib/preferences";
import { theme } from "@/theme.config";

export default function Footer() {
  const { t } = usePreferences();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <Newsletter />
      <div className="footer-main">
        <Link href="/" aria-label={theme.brand.display} className="footer-logo">
          <BrandLogo size="footer" />
        </Link>
        <div className="footer-menus">
          <div className="footer-col">
            <p>{t("shop")}</p>
            <ul>
              <li>
                <Link href="/shop" className="footer-link">{t("search")}</Link>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <p>{t("customerCare")}</p>
          </div>
          <div className="footer-col">
            <p>{t("information")}</p>
            <ul>
              <li>
                <Link href="/admin" className="footer-link">{t("admin")}</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-utils">
        <p suppressHydrationWarning>© {year} {theme.brand.display}</p>
        <Link href="/terms" className="footer-legal-link">{t("termsAndPolicies")}</Link>
      </div>
    </footer>
  );
}
