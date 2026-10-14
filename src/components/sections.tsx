import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { site, telLink, whatsappLink } from "@/config/site";
import { blogPosts, steps, why } from "@/content/data";
import SectionHead from "./SectionHead";
import ContactForm from "./ContactForm";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";

export function TrustBar() {
  const t = useTranslations("trust");
  const items = [t("mwan"), t("env"), t("amana"), t("cr")];
  return (
    <section aria-label={t("title")} className="bg-surface-muted border-y border-line">
      <div className="container-x py-5">
        <Link href="/certifications" className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 group">
          <span className="text-sm font-bold text-muted">{t("title")}</span>
          {items.map((i) => (
            <span key={i} className="flex items-center gap-2 text-[15px] font-medium text-ink group-hover:text-primary"><i className="dia" aria-hidden />{i}</span>
          ))}
        </Link>
      </div>
    </section>
  );
}

export function WhySection() {
  const t = useTranslations("sections.why");
  const locale = useLocale() as "ar" | "en";
  return (
    <section className="section on-dark diamond-bg bg-ink text-white">
      <div className="container-x">
        <SectionHead eyebrow={t("eyebrow")} title={t("title")} />
        <div className="grid gap-px bg-white/15 sm:grid-cols-2 lg:grid-cols-3 border border-white/15">
          {why[locale].map((w) => (
            <div key={w.title} className="bg-ink p-7">
              <i className="dia mb-4" aria-hidden />
              <h3 className="text-lg text-accent">{w.title}</h3>
              <p className="mt-2 text-[#d9d9d6]">{w.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StepsSection() {
  const t = useTranslations("sections.steps");
  const locale = useLocale() as "ar" | "en";
  return (
    <section className="section">
      <div className="container-x">
        <SectionHead eyebrow={t("eyebrow")} title={t("title")} />
        <ol className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps[locale].map((s, i) => (
            <li key={s.title}>
              <span className="relative w-14 h-14 grid place-items-center text-white text-xl font-bold mb-4" aria-hidden>
                <span className="absolute inset-[8px] bg-primary rotate-45" /><span className="relative">{i + 1}</span>
              </span>
              <h3 className="text-lg">{s.title}</h3>
              <p className="mt-2 text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function BlogCards({ limit = 3, exclude, headingLevel = 3 }: { limit?: number; exclude?: string; headingLevel?: 2 | 3 }) {
  const H = `h${headingLevel}` as "h2" | "h3";
  const t = useTranslations("cta");
  const locale = useLocale() as "ar" | "en";
  const posts = blogPosts[locale].filter((p) => p.slug !== exclude).slice(0, limit);
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {posts.map((p) => (
        <article key={p.slug} className="card flex flex-col overflow-hidden">
          <div className="placeholder-img rounded-none border-0 border-b aspect-[16/9]">[{locale === "ar" ? "صورة المقال" : "Article image"}]</div>
          <div className="p-6 flex flex-col gap-3 flex-1">
            <H className="text-lg"><Link href={`/blog/${p.slug}`} className="hover:text-primary">{p.title}</Link></H>
            <p className="text-muted text-[15px]">{p.excerpt}</p>
            <Link href={`/blog/${p.slug}`} className="mt-auto font-semibold text-primary hover:underline min-h-[44px] inline-flex items-center" aria-label={`${t("read")}: ${p.title}`}>{t("read")}</Link>
          </div>
        </article>
      ))}
    </div>
  );
}

export function CtaBand() {
  const t = useTranslations();
  const locale = useLocale() as "ar" | "en";
  return (
    <section className="on-dark bg-primary text-white">
      <div className="container-x py-14 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        <div className="max-w-[640px]">
          <h2 className="text-[26px] md:text-[32px]">{t("cta_band.title")}</h2>
          <p className="mt-3 text-lg">{t("cta_band.text")}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href={whatsappLink(locale)} target="_blank" rel="noopener noreferrer" className="btn btn-accent"><WhatsAppIcon size={20} />{t("cta.whatsapp")}</a>
          <a href={telLink(site.phones[0])} className="btn btn-ghost-light"><Phone size={20} aria-hidden />{t("cta.call")}</a>
        </div>
      </div>
    </section>
  );
}

export function ContactSection({ heading = true }: { heading?: boolean }) {
  const t = useTranslations();
  const locale = useLocale() as "ar" | "en";
  const rows = [
    { Icon: Phone, label: t("contact.phone"), body: site.phones.map((p) => <a key={p} dir="ltr" style={{ unicodeBidi: "embed" }} className="block hover:text-primary" href={telLink(p)}>{p}</a>) },
    { Icon: Mail, label: t("contact.email"), body: <a className="hover:text-primary" href={`mailto:${site.email}`}>{site.email}</a> },
    { Icon: MapPin, label: t("contact.address"), body: site.address[locale] },
    { Icon: Clock, label: t("contact.hours"), body: site.hours[locale] },
  ];
  return (
    <section className="section" id="contact">
      <div className="container-x">
        {heading && <SectionHead eyebrow={t("sections.contact.eyebrow")} title={t("sections.contact.title")} text={t("sections.contact.text")} />}
        <div className="grid gap-8 lg:grid-cols-[5fr_7fr]">
          <div className="grid gap-6 content-start">
            <ul className="grid gap-5">
              {rows.map(({ Icon, label, body }) => (
                <li key={label} className="flex gap-4">
                  <span className="relative w-11 h-11 flex-none grid place-items-center text-white" aria-hidden><span className="absolute inset-[5px] bg-primary rotate-45" /><Icon size={16} className="relative" /></span>
                  <div><div className="text-sm text-muted">{label}</div><div className="font-medium">{body}</div></div>
                </li>
              ))}
            </ul>
            <div className="card overflow-hidden">
              <iframe title={t("contact.address")} src={site.mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="w-full h-[260px] border-0" />
            </div>
            <a href={site.mapUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline justify-self-start">{t("cta.openMap")}</a>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
