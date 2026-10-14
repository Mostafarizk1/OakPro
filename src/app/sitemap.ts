import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { blogPosts, services } from "@/content/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/about", "/services", "/certifications", "/blog", "/contact",
    ...services.ar.map((s) => `/services/${s.slug}`), ...blogPosts.ar.map((p) => `/blog/${p.slug}`)];
  return paths.flatMap((p) => (["ar", "en"] as const).map((l) => ({
    url: `${site.domain}/${l}${p}`,
    alternates: { languages: { ar: `${site.domain}/ar${p}`, en: `${site.domain}/en${p}` } },
  })));
}
