import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { seo } from "@/content/data";
import PageHero from "@/components/PageHero";
import { BlogCards, CtaBand } from "@/components/sections";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as "ar" | "en";
  return { title: { absolute: seo[l].blogTitle }, description: seo[l].blogDesc, alternates: { canonical: `/${locale}/blog`, languages: { ar: "/ar/blog", en: "/en/blog" } } };
}

export default async function Blog({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  return (
    <>
      <PageHero eyebrow={t("title")} title={t("title")} text={t("text")} />
      <section className="section"><div className="container-x"><BlogCards limit={50} headingLevel={2} /></div></section>
      <CtaBand />
    </>
  );
}
