import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { about, highlights } from "@/content/data";
import PageHero from "@/components/PageHero";
import ContactButtons from "@/components/ContactButtons";
import { CtaBand, WhySection } from "@/components/sections";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sections.about" });
  return { title: t("eyebrow"), description: about[locale as "ar" | "en"][0], alternates: { canonical: `/${locale}/about`, languages: { ar: "/ar/about", en: "/en/about" } } };
}

export default async function About({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as "ar" | "en";
  const t = await getTranslations();
  return (
    <>
      <PageHero eyebrow={t("sections.about.eyebrow")} title={t("sections.about.title")} />
      <section className="section">
        <div className="container-x grid gap-10 lg:grid-cols-[7fr_5fr]">
          <div className="space-y-5 text-lg">{about[l].map((p, i) => <p key={i} className={i === 0 ? "font-medium" : "text-muted"}>{p}</p>)}
            <ContactButtons loc="about_page" className="mt-4" /></div>
          <div className="placeholder-img min-h-[280px]">[{l === "ar" ? "صورة: مقر أوك برو / الفريق في الدمام" : "Image: Oak Pro HQ / team in Dammam"}]</div>
        </div>
        <div className="container-x mt-14 grid gap-px bg-line border border-line sm:grid-cols-2 lg:grid-cols-4">
          {highlights[l].map((h) => <div key={h.title} className="bg-white p-6"><i className="dia mb-3" aria-hidden /><h2 className="text-[17px]">{h.title}</h2><p className="mt-2 text-muted text-[15px]">{h.text}</p></div>)}
        </div>
      </section>
      <WhySection />
      <CtaBand />
    </>
  );
}
