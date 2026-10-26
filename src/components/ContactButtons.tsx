import { useLocale, useTranslations } from "next-intl";
import { callHref, whatsappLink } from "@/config/site";
import { Phone } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";

/** The two standard contact actions used everywhere on the site: WhatsApp + direct call (same number). */
export default function ContactButtons({ loc, tone = "light", className = "", children }: {
  loc: string; tone?: "light" | "dark"; className?: string; children?: React.ReactNode;
}) {
  const t = useTranslations("cta");
  const l = useLocale() as "ar" | "en";
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <a href={whatsappLink(l)} target="_blank" rel="noopener noreferrer" data-event="whatsapp_click" data-loc={loc}
        className={tone === "dark" ? "btn btn-accent" : "btn btn-primary"}><WhatsAppIcon size={20} />{t("whatsapp")}</a>
      <a href={callHref} data-event="phone_click" data-loc={loc}
        className={tone === "dark" ? "btn btn-ghost-light" : "btn btn-outline"}><Phone size={20} aria-hidden />{t("callDirect")}</a>
      {children}
    </div>
  );
}
