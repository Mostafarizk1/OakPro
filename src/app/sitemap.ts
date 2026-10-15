import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { blogPosts, services } from "@/content/data";
import { getAllPublishedSlugs } from "@/lib/posts";
import { supabaseConfigured } from "@/lib/supabase";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const fixed = ["", "/about", "/services", "/certifications", "/blog", "/contact", ...services.ar.map((s) => `/services/${s.slug}`)];
  const out: MetadataRoute.Sitemap = fixed.flatMap((p) => (["ar", "en"] as const).map((l) => ({
    url: `${site.domain}/${l}${p}`,
    alternates: { languages: { ar: `${site.domain}/ar${p}`, en: `${site.domain}/en${p}` } },
  })));
  if (supabaseConfigured) {
    const posts = await getAllPublishedSlugs();
    out.push(...posts.map((p) => ({ url: `${site.domain}/${p.locale}/blog/${p.slug}`, lastModified: p.updated_at })));
  } else {
    out.push(...blogPosts.ar.flatMap((p) => (["ar", "en"] as const).map((l) => ({ url: `${site.domain}/${l}/blog/${p.slug}` }))));
  }
  return out;
}
