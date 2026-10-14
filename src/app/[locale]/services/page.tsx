import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { services } from "@/content/data";
import PageHero from "@/components/PageHero";
import { CtaBand } from "@/components/sections";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sections.services" });
  return { title: t("eyebrow"), description: t("text"), alternates: { canonical: `/${locale}/services`, languages: { ar: "/ar/services", en: "/en/services" } } };
}

export default async function Services({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as "ar" | "en";
  const t = await getTranslations();
  return (
    <>
      <PageHero eyebrow={t("sections.services.eyebrow")} title={t("sections.services.title")} text={t("sections.services.text")} />
      <section className="section">
        <div className="container-x grid gap-6 md:grid-cols-2">
          {services[l].map((s, i) => (
            <article key={s.slug} className="card p-7 flex flex-col gap-3">
              <span className="relative w-11 h-11 grid place-items-center text-white font-bold" aria-hidden><span className="absolute inset-[6px] bg-primary rotate-45" /><span className="relative">{i + 1}</span></span>
              <h2 className="text-[22px]">{s.title}</h2>
              <p className="text-muted">{s.lead}</p>
              <Link href={`/services/${s.slug}`} className="btn btn-outline mt-auto self-start">{t("cta.moreAbout")}</Link>
            </article>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
