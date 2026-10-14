import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { visibleCertifications } from "@/content/certifications";
import PageHero from "@/components/PageHero";
import CertList from "@/components/CertList";
import { CtaBand, TrustBar } from "@/components/sections";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sections.certs" });
  return { title: t("eyebrow"), description: t("text"), alternates: { canonical: `/${locale}/certifications`, languages: { ar: "/ar/certifications", en: "/en/certifications" } } };
}

export default async function Certifications({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  return (
    <>
      <PageHero eyebrow={t("sections.certs.eyebrow")} title={t("sections.certs.title")} text={t("certs.intro")} />
      <TrustBar />
      <section className="section">
        <div className="container-x"><CertList items={visibleCertifications()} headingLevel={2} /></div>
      </section>
      <CtaBand />
    </>
  );
}
