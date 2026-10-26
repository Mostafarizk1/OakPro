"use client";
import { useEffect } from "react";
import { useLocale } from "next-intl";
import { track } from "@/lib/analytics";

/**
 * One delegated click listener for the whole site (mounted once in the layout) → each click fires exactly one GA4 event.
 *  - whatsapp_click      any link to https://wa.me/…
 *  - phone_click         any tel: link
 *  - quote_request_click the "اطلب عرض سعر" button (data-event)
 * Buttons carry data-event + data-loc (where on the page); links without them are still caught by href (loc = "other").
 * data-focus="#id" moves keyboard focus to that field after the in-page jump (used by the quote button → form).
 */
export default function TrackClicks() {
  const locale = useLocale();
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      let event = a.getAttribute("data-event");
      let loc = a.getAttribute("data-loc");
      if (!event) {
        if (/^https:\/\/wa\.me\//.test(href)) event = "whatsapp_click";
        else if (href.startsWith("tel:")) event = "phone_click";
        loc = loc ?? "other";
      }
      if (!event) return;
      track(event, { link_location: loc ?? "other", language: locale, page_path: window.location.pathname });
      const focusSel = a.getAttribute("data-focus");
      if (focusSel) window.setTimeout(() => (document.querySelector(focusSel) as HTMLElement | null)?.focus({ preventScroll: true }), 700);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [locale]);
  return null;
}
