import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import fs from "node:fs";
import path from "node:path";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { blogPosts } from "@/content/data";
import { site, whatsappLink } from "@/config/site";
import { getAllPublishedSlugs, getPublishedPost, getSibling } from "@/lib/posts";
import { getBlogCards } from "@/lib/blog-cards";
import { supabaseConfigured } from "@/lib/supabase";
import { BlogCards } from "@/components/sections";
import "../../../admin/admin.css";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const fromDb = await getAllPublishedSlugs();
  const base = supabaseConfigured ? [] : routing.locales.flatMap((locale) => blogPosts.ar.map((p) => ({ locale, slug: p.slug })));
  return [...base, ...fromDb.map((p) => ({ locale: p.locale, slug: p.slug }))];
}

// Placeholder bodies (used only while Supabase is not configured): content/blog/{locale}/{slug}.md
function loadBody(locale: string, slug: string) {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), "src/content/blog", locale, `${slug}.md`), "utf8");
    return raw.replace(/^---[\s\S]*?---\s*/, "").split(/\n{2,}/).map((s) => s.trim()).filter(Boolean);
  } catch { return []; }
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const l = locale as "ar" | "en";
  if (supabaseConfigured) {
    const p = await getPublishedPost(l, slug);
    if (!p) return {};
    const sib = await getSibling(p);
    const languages: Record<string, string> = { [l]: `/${l}/blog/${slug}` };
    if (sib) languages[sib.locale] = `/${sib.locale}/blog/${sib.slug}`;
    const desc = p.meta_description || p.excerpt;
    const img = p.og_url ?? p.cover_url;
    return {
      title: p.meta_title || p.title, description: desc,
      alternates: { canonical: `/${l}/blog/${slug}`, languages },
      openGraph: { type: "article", title: p.meta_title || p.title, description: desc, publishedTime: p.published_at ?? undefined, modifiedTime: p.updated_at, ...(img ? { images: [{ url: img, width: 1200, height: 630, alt: p.cover_alt ?? p.title }] } : {}) },
      twitter: { card: "summary_large_image" },
    };
  }
  const p = blogPosts[l]?.find((x) => x.slug === slug);
  if (!p) return {};
  return { title: p.title, description: p.excerpt, alternates: { canonical: `/${locale}/blog/${slug}`, languages: { ar: `/ar/blog/${slug}`, en: `/en/blog/${slug}` } } };
}

export default async function Post({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const l = locale as "ar" | "en";
  const t = await getTranslations();

  let title: string, cover: { url: string; alt: string; w: number; h: number } | null = null, bodyHtml: string | null = null, bodyParas: string[] = [];
  let date: string | null = null, minutes: number | null = null, jsonLd: object | null = null;

  if (supabaseConfigured) {
    const p = await getPublishedPost(l, slug);
    if (!p) notFound();
    title = p.title; bodyHtml = p.content; minutes = p.reading_minutes;
    if (p.cover_url) cover = { url: p.cover_url, alt: p.cover_alt ?? p.title, w: p.cover_w ?? 1600, h: p.cover_h ?? 900 };
    date = p.published_at ? new Intl.DateTimeFormat(l === "ar" ? "ar-SA-u-nu-latn-ca-gregory" : "en-GB", { dateStyle: "long", timeZone: "Asia/Riyadh" }).format(new Date(p.published_at)) : null;
    jsonLd = {
      "@context": "https://schema.org", "@type": "Article", headline: p.title, description: p.meta_description || p.excerpt,
      image: p.og_url ?? p.cover_url ?? undefined, datePublished: p.published_at, dateModified: p.updated_at, inLanguage: l,
      mainEntityOfPage: `${site.domain}/${l}/blog/${slug}`,
      author: { "@type": "Organization", name: site.name[l] }, publisher: { "@type": "Organization", name: site.name[l], logo: { "@type": "ImageObject", url: `${site.domain}/brand/logo-side-color.png` } },
    };
  } else {
    const p = blogPosts[l].find((x) => x.slug === slug);
    if (!p) notFound();
    title = p.title; bodyParas = loadBody(locale, slug);
  }

  const related = await getBlogCards(l, 3, slug);
  const shareUrl = encodeURIComponent(`${site.domain}/${locale}/blog/${slug}`);

  return (
    <article className="section">
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <div className="container-x max-w-[820px]">
        <nav aria-label="Breadcrumb" className="text-sm text-muted mb-6"><Link href="/blog" className="hover:text-primary">{t("nav.blog")}</Link> <span aria-hidden>←</span> <span>{title}</span></nav>
        <h1 className="text-[30px] md:text-[40px]">{title}</h1>
        {(date || minutes) && <p className="mt-4 text-muted">{[date, minutes ? `${minutes} ${t("blog.minRead")}` : null].filter(Boolean).join(" · ")}</p>}

        {cover ? (
          <Image src={cover.url} alt={cover.alt} width={cover.w} height={cover.h} priority sizes="(min-width: 900px) 820px, 100vw" className="mt-8 w-full h-auto rounded-md" />
        ) : (
          <div className="placeholder-img aspect-[16/9] mt-8">[{l === "ar" ? "الصورة الرئيسية للمقال" : "Article hero image"}]</div>
        )}

        {bodyHtml !== null
          ? <div className="article-body mt-8" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
          : <div className="mt-8 space-y-5 text-lg">{(bodyParas.length ? bodyParas : [t("blog.placeholderBody")]).map((x, i) => <p key={i}>{x}</p>)}</div>}

        <aside className="mt-12 card p-7 border-s-4 border-s-primary">
          <h2 className="text-xl">{t("blog.needService")}</h2>
          <p className="mt-2 text-muted">{t("blog.needText")}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/contact" className="btn btn-primary">{t("cta.quote")}</Link>
            <a href={whatsappLink(l)} target="_blank" rel="noopener noreferrer" className="btn btn-outline">{t("cta.whatsapp")}</a>
          </div>
        </aside>

        <div className="mt-8 flex items-center gap-4 text-sm">
          <span className="font-medium">{t("blog.share")}:</span>
          <a className="text-primary hover:underline" target="_blank" rel="noopener noreferrer" href={`https://wa.me/?text=${shareUrl}`}>WhatsApp</a>
          <a className="text-primary hover:underline" target="_blank" rel="noopener noreferrer" href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}>LinkedIn</a>
        </div>
      </div>

      {related.items.length > 0 && (
        <div className="container-x mt-16">
          <h2 className="text-2xl mb-6">{t("blog.related")}</h2>
          <BlogCards items={related.items} />
          <Link href="/blog" className="btn btn-outline mt-8">{t("cta.backBlog")}</Link>
        </div>
      )}
    </article>
  );
}
