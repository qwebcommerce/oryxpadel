"use client";

import { useEffect, useRef } from "react";
import { usePreferences } from "@/lib/preferences";

export default function PrefToggles() {
  const { locale, setLocale, t } = usePreferences();
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

  return (
    <div className="header-prefs" dir="ltr">
      <details className="pref-dropdown" ref={root}>
        <summary className="pref-dropdown__btn" aria-label={t("language")}>
          {locale.toUpperCase()}
          <ChevronDown />
        </summary>
        <ul className="pref-dropdown__menu" role="listbox">
          {(["en", "ar"] as const).map((code) => (
            <li key={code}>
              <button
                type="button"
                role="option"
                aria-selected={locale === code}
                onClick={(event) => {
                  event.preventDefault();
                  setLocale(code);
                  if (root.current) root.current.open = false;
                }}
              >
                {code.toUpperCase()}
              </button>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}

function ChevronDown() {
  return (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
