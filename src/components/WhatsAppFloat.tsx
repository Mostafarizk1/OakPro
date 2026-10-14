import { useLocale, useTranslations } from "next-intl";
import { whatsappLink } from "@/config/site";
import WhatsAppIcon from "./WhatsAppIcon";

// inset-inline-end → bottom-left in Arabic (RTL), bottom-right in English (LTR)
export default function WhatsAppFloat() {
  const t = useTranslations("common");
  const locale = useLocale() as "ar" | "en";
  return (
    <a href={whatsappLink(locale)} target="_blank" rel="noopener noreferrer" aria-label={t("whatsappFloat")}
      className="fixed z-40 grid place-items-center w-14 h-14 rounded-md bg-primary text-white shadow-2 hover:bg-primary-hover"
      style={{ insetInlineEnd: 20, bottom: 20 }}>
      <WhatsAppIcon size={30} />
    </a>
  );
}
