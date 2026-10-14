import type { Metadata } from "next";
import { notFound } from "next/navigation";
import fs from "node:fs";
import path from "node:path";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { blogPosts } from "@/content/data";
import { site, whatsappLink } from "@/config/site";
import { BlogCards } from "@/components/sections";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => blogPosts.ar.map((p) => ({ locale, slug: p.slug })));
}

// Bodies live in content/blog/{locale}/{slug}.md — swap this loader for a CMS later.
function loadBody(locale: string, slug: string) {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), "src/content/blog", locale, `${slug}.md`), "utf8");
    return raw.replace(/^---[\s\S]*?---\s*/, "").split(/\n{2,}/).map((s) => s.trim()).filter(Boolean);
  } catch { return []; }
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const p = blogPosts[locale as "ar" | "en"]?.find((x) => x.slug === slug);
  if (!p) return {};
  return { title: p.title, description: p.excerpt, alternates: { canonical: `/${locale}/blog/${slug}`, languages: { ar: `/ar/blog/${slug}`, en: `/en/blog/${slug}` } } };
}

export default async function Post({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const l = locale as "ar" | "en";
  const p = blogPosts[l].find((x) => x.slug === slug);
  if (!p) notFound();
  const t = await getTranslations();
  const body = loadBody(locale, slug);
  const shareUrl = encodeURIComponent(`${site.domain}/${locale}/blog/${slug}`);

  return (
    <article className="section">
      <div className="container-x max-w-[820px]">
        <nav aria-label="Breadcrumb" className="text-sm text-muted mb-6"><Link href="/blog" className="hover:text-primary">{t("nav.blog")}</Link> <span aria-hidden>←</span> <span>{p.title}</span></nav>
        <h1 className="text-[30px] md:text-[40px]">{p.title}</h1>
        <div className="placeholder-img aspect-[16/9] mt-8">[{l === "ar" ? "الصورة الرئيسية للمقال" : "Article hero image"}]</div>
        <div className="mt-8 space-y-5 text-lg">{(body.length ? body : [t("blog.placeholderBody")]).map((x, i) => <p key={i}>{x}</p>)}</div>

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

      <div className="container-x mt-16">
        <h2 className="text-2xl mb-6">{t("blog.related")}</h2>
        <BlogCards limit={3} exclude={slug} />
        <Link href="/blog" className="btn btn-outline mt-8">{t("cta.backBlog")}</Link>
      </div>
    </article>
  );
}
