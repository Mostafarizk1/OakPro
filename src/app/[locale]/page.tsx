import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { about, highlights, seo } from "@/content/data";
import { visibleCertifications } from "@/content/certifications";
import { site } from "@/config/site";
import SectionHead from "@/components/SectionHead";
import HeroMark from "@/components/HeroMark";
import ServiceCards from "@/components/ServiceCards";
import CertList from "@/components/CertList";
import { BlogCards, ContactSection, CtaBand, StepsSection, TrustBar, WhySection } from "@/components/sections";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = locale === "en" ? "en" : "ar";
  return { title: { absolute: seo[l].homeTitle }, description: seo[l].homeDesc, alternates: { canonical: `/${l}`, languages: { ar: "/ar", en: "/en" } } };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as "ar" | "en";
  const t = await getTranslations();

  return (
    <>
      {/* 2. Hero */}
      <section className="on-dark diamond-bg bg-ink text-white">
        <div className="container-x py-16 lg:py-24 grid gap-12 lg:grid-cols-[7fr_5fr] items-center">
          <div>
            <p className="eyebrow"><i className="dia" aria-hidden />{t("hero.eyebrow")}</p>
            <h1 className="mt-5 text-[34px] md:text-[48px] leading-[1.35]">{t("hero.title")}</h1>
            <p className="mt-6 text-lg text-[#d9d9d6] max-w-[60ch]">{t("hero.text")}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/contact" className="btn btn-accent">{t("cta.quote")}</Link>
              <Link href="/services" className="btn btn-ghost-light">{t("cta.services")}</Link>
            </div>
          </div>
          {/* HERO_MEDIA_SLOT — swap for video/Lottie later */}
          <div className="justify-self-center w-[220px] sm:w-[300px] lg:w-[380px] text-white">
            <HeroMark className="w-full h-auto" />
          </div>
        </div>
      </section>

      {/* 3. Trust bar */}
      <TrustBar />

      {/* 4. Highlights */}
      <section className="section !pb-0">
        <div className="container-x grid gap-px bg-line border border-line sm:grid-cols-2 lg:grid-cols-4">
          {highlights[l].map((h) => (
            <div key={h.title} className="bg-white p-6">
              <i className="dia mb-3" aria-hidden />
              <h2 className="text-[17px]">{h.title}</h2>
              <p className="mt-2 text-muted text-[15px]">{h.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. About */}
      <section className="section">
        <div className="container-x grid gap-10 lg:grid-cols-2 items-start">
          <div>
            <SectionHead eyebrow={t("sections.about.eyebrow")} title={t("sections.about.title")} />
            <Link href="/contact" className="btn btn-outline">{t("cta.contact")}</Link>
          </div>
          <div className="space-y-5 text-lg">
            {about[l].map((p, i) => <p key={i} className={i === 0 ? "font-medium text-ink" : "text-muted"}>{p}</p>)}
          </div>
        </div>
      </section>

      {/* 6. Services */}
      <section className="section bg-surface-muted" id="services">
        <div className="container-x">
          <SectionHead eyebrow={t("sections.services.eyebrow")} title={t("sections.services.title")} text={t("sections.services.text")} />
          <ServiceCards />
        </div>
      </section>

      {/* 7. Why */}
      <WhySection />

      {/* 8. Licenses preview */}
      <section className="section">
        <div className="container-x">
          <SectionHead eyebrow={t("sections.certs.eyebrow")} title={t("sections.certs.title")} text={t("sections.certs.text")} />
          <CertList items={visibleCertifications()} limit={4} />
          <div className="mt-8"><Link href="/certifications" className="btn btn-primary">{t("cta.allLicenses")}</Link></div>
        </div>
      </section>

      {/* 9. Steps */}
      <div className="bg-surface-muted"><StepsSection /></div>

      {/* 10. Projects — only when real data exists */}
      {site.features.projects && (
        <section className="section"><div className="container-x"><SectionHead eyebrow={t("sections.projects.eyebrow")} title={t("sections.projects.title")} text={t("sections.projects.text")} /></div></section>
      )}

      {/* 11. Blog */}
      <section className="section">
        <div className="container-x">
          <SectionHead eyebrow={t("sections.blog.eyebrow")} title={t("sections.blog.title")} text={t("sections.blog.text")} />
          <BlogCards />
          <div className="mt-8"><Link href="/blog" className="btn btn-outline">{t("cta.allPosts")}</Link></div>
        </div>
      </section>

      {/* 12. CTA band */}
      <CtaBand />

      {/* 13. Contact */}
      <ContactSection />
    </>
  );
}
