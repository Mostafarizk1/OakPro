import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { services } from "@/content/data";
import { whatsappLink } from "@/config/site";
import PageHero from "@/components/PageHero";
import { CtaBand } from "@/components/sections";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => services.ar.map((s) => ({ locale, slug: s.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const s = services[locale as "ar" | "en"]?.find((x) => x.slug === slug);
  if (!s) return {};
  return { title: s.title, description: s.lead, alternates: { canonical: `/${locale}/services/${slug}`, languages: { ar: `/ar/services/${slug}`, en: `/en/services/${slug}` } } };
}

export default async function ServicePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const l = locale as "ar" | "en";
  const s = services[l].find((x) => x.slug === slug);
  if (!s) notFound();
  const t = await getTranslations();
  return (
    <>
      <PageHero eyebrow={t("sections.services.eyebrow")} title={s.title} text={s.lead} />
      <section className="section">
        <div className="container-x grid gap-10 lg:grid-cols-[7fr_5fr]">
          <div>
            <p className="text-lg">{s.body}</p>
            {s.items.length > 0 && <ul className="dia-list mt-6 space-y-2 text-lg">{s.items.map((i) => <li key={i}>{i}</li>)}</ul>}
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={whatsappLink(l)} target="_blank" rel="noopener noreferrer" className="btn btn-primary">{t("cta.whatsapp")}</a>
              <Link href="/certifications" className="btn btn-outline">{t("nav.certifications")}</Link>
            </div>
          </div>
          <div className="placeholder-img min-h-[300px]">[{l === "ar" ? `صورة: ${s.title}` : `Image: ${s.title}`}]</div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
