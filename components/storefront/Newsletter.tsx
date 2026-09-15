"use client";

import { useState } from "react";
import { subscribeNewsletterAction } from "@/lib/actions";
import { usePreferences } from "@/lib/preferences";
import { useToast } from "@/lib/toast";

export default function Newsletter() {
  const { t } = usePreferences();
  const toast = useToast();
  const [done, setDone] = useState(false);

  return (
    <section className="newsletter">
      <p className="section-eyebrow">{t("newsletterTitle")}</p>
      {done ? (
        <p className="newsletter__done">{t("newsletterSuccess")}</p>
      ) : (
        <form
          className="newsletter__form"
          action={async (formData) => {
            const result = await subscribeNewsletterAction(formData);
            if (result?.ok) {
              setDone(true);
              toast.success(t("newsletterSuccess"));
            } else if (result?.error) {
              toast.error(t("toastError"), result.error);
            }
          }}
        >
          <input type="email" name="email" required placeholder={t("emailPlaceholder")} aria-label={t("email")} />
          <button type="submit">{t("subscribe")}</button>
        </form>
      )}
    </section>
  );
}
