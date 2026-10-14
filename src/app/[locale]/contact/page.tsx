import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageHero from "@/components/PageHero";
import { ContactSection } from "@/components/sections";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sections.contact" });
  return { title: t("eyebrow"), description: t("text"), alternates: { canonical: `/${locale}/contact`, languages: { ar: "/ar/contact", en: "/en/contact" } } };
}

export default async function Contact({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("sections.contact");
  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} text={t("text")} />
      <ContactSection heading={false} />
    </>
  );
}
