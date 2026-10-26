import { useLocale, useTranslations } from "next-intl";
import { callHref, whatsappLink } from "@/config/site";
import { Phone } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";

// Two fixed icons (call above WhatsApp). inset-inline-end → bottom-left in Arabic (RTL), bottom-right in English (LTR).
export default function FloatingContact() {
  const t = useTranslations();
  const l = useLocale() as "ar" | "en";
  return (
    <div className="floating-contact" style={{ insetInlineEnd: 20, bottom: 20 }}>
      <a href={callHref} aria-label={t("cta.callDirect")} data-event="phone_click" data-loc="floating_icons" className="fc-btn"><Phone size={24} aria-hidden /></a>
      <a href={whatsappLink(l)} target="_blank" rel="noopener noreferrer" aria-label={t("common.whatsappFloat")} data-event="whatsapp_click" data-loc="floating_icons" className="fc-btn"><WhatsAppIcon size={28} /></a>
    </div>
  );
}
