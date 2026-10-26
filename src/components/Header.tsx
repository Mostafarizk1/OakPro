"use client";
import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { site, callHref, whatsappLink } from "@/config/site";
import { Menu, X, Download, Phone } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";
import ContactButtons from "./ContactButtons";

export default function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const other = locale === "ar" ? "en" : "ar";

  const nav = [
    { href: "/", k: "home" }, { href: "/about", k: "about" }, { href: "/services", k: "services" },
    { href: "/certifications", k: "certifications" },
    ...(site.features.projects ? [{ href: "/projects", k: "projects" }] : []),
    { href: "/blog", k: "blog" }, { href: "/contact", k: "contact" },
  ] as const;

  const isActive = (h: string) => (h === "/" ? pathname === "/" : pathname.startsWith(h));

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-none border-b border-line">
      <div className="container-x flex items-center justify-between gap-4 h-[72px]">
        <Link href="/" aria-label={t("nav.home")} className="flex-none">
          <Image src="/brand/logo-side-color.png" alt={locale === "ar" ? "أوك برو" : "Oak Pro"} width={150} height={72} priority className="h-[52px] w-auto" />
        </Link>

        <nav aria-label="Main" className="hidden xl:flex items-center gap-1">
          {nav.map((n) => (
            <Link key={n.k} href={n.href} aria-current={isActive(n.href) ? "page" : undefined}
              className={`px-3 py-2 text-[15px] font-medium rounded-sm hover:text-primary ${isActive(n.href) ? "text-primary underline underline-offset-[10px] decoration-2" : "text-ink"}`}>
              {t(`nav.${n.k}`)}
            </Link>
          ))}
        </nav>

        <div className="hidden xl:flex items-center gap-3">
          {site.companyProfilePdf && (
            <a href={site.companyProfilePdf} download className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
              <Download size={16} aria-hidden /> {t("cta.profile")}
            </a>
          )}
          <Link href="/" locale={other} hrefLang={other} aria-label={t("common.langSwitchLabel")} className="px-3 py-2 text-sm font-medium border border-line rounded-sm hover:border-primary hover:text-primary" lang={other}>
            {t("common.langSwitch")}
          </Link>
          <a href={whatsappLink(locale as "ar" | "en")} target="_blank" rel="noopener noreferrer" className="btn btn-primary !min-h-[44px]" data-event="whatsapp_click" data-loc="header"><WhatsAppIcon size={18} />{t("cta.whatsapp")}</a>
          <a href={callHref} className="btn btn-outline !min-h-[44px] !px-3" aria-label={t("cta.callDirect")} title={t("cta.callDirect")} data-event="phone_click" data-loc="header"><Phone size={18} aria-hidden /></a>
        </div>

        <button type="button" className="xl:hidden p-2 -me-2 min-w-[44px] min-h-[44px] grid place-items-center" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? t("nav.close") : t("nav.menu")} onClick={() => setOpen((v) => !v)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div id="mobile-nav" className="xl:hidden border-t border-line bg-white">
          <nav aria-label="Mobile" className="container-x py-4 flex flex-col">
            {nav.map((n) => (
              <Link key={n.k} href={n.href} onClick={() => setOpen(false)} aria-current={isActive(n.href) ? "page" : undefined}
                className={`py-3 border-b border-line text-[17px] font-medium ${isActive(n.href) ? "text-primary" : "text-ink"}`}>
                {t(`nav.${n.k}`)}
              </Link>
            ))}
            <div className="pt-4">
              <Link href="/" locale={other} lang={other} className="btn btn-outline w-full">{t("common.langSwitch")}</Link>
              <ContactButtons loc="header" className="mt-3 [&>a]:flex-1" />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
