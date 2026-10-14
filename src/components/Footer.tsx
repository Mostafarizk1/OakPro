import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { site, telLink } from "@/config/site";
import { services } from "@/content/data";

export default function Footer() {
  const t = useTranslations();
  const locale = useLocale() as "ar" | "en";
  const links = [["/", "home"], ["/about", "about"], ["/services", "services"], ["/certifications", "certifications"], ["/blog", "blog"], ["/contact", "contact"]] as const;

  return (
    <footer className="on-dark diamond-bg bg-ink text-white">
      <div className="container-x py-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image src="/brand/logo-side-white.png" alt={locale === "ar" ? "أوك برو" : "Oak Pro"} width={170} height={82} className="h-[60px] w-auto mb-4" />
          <p className="text-[15px] text-[#d9d9d6] max-w-[32ch]">{t("footer.about")}</p>
          <p className="mt-4 text-accent font-bold flex items-center gap-2"><i className="dia" aria-hidden />{t("footer.tagline")}</p>
        </div>
        <div>
          <h2 className="text-base mb-4 text-accent">{t("footer.links")}</h2>
          <ul className="space-y-2 text-[15px]">
            {links.map(([h, k]) => <li key={k}><Link className="hover:underline" href={h}>{t(`nav.${k}`)}</Link></li>)}
          </ul>
        </div>
        <div>
          <h2 className="text-base mb-4 text-accent">{t("footer.services")}</h2>
          <ul className="space-y-2 text-[15px]">
            {services[locale].map((s) => <li key={s.slug}><Link className="hover:underline" href={`/services/${s.slug}`}>{s.title}</Link></li>)}
          </ul>
        </div>
        <div>
          <h2 className="text-base mb-4 text-accent">{t("footer.contact")}</h2>
          <ul className="space-y-2 text-[15px]">
            {site.phones.map((p) => <li key={p}><a className="hover:underline" dir="ltr" style={{ unicodeBidi: "embed" }} href={telLink(p)}>{p}</a></li>)}
            <li><a className="hover:underline" href={`mailto:${site.email}`}>{site.email}</a></li>
            <li>{site.address[locale]}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="container-x py-5 text-sm text-[#d9d9d6]">{t("footer.rights")}</div>
      </div>
    </footer>
  );
}
