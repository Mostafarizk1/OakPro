import { blogPosts } from "@/content/data";
import { getPublishedPosts } from "./posts";
import { supabaseConfigured } from "./supabase";

export type CardItem = { slug: string; title: string; excerpt: string; cover_url?: string | null; cover_alt?: string | null; cover_w?: number | null; cover_h?: number | null };

/** Cards for the blog list / home / related. Uses Supabase when configured, otherwise the static placeholders. */
export async function getBlogCards(locale: "ar" | "en", limit = 50, exclude?: string): Promise<{ items: CardItem[]; fromDb: boolean }> {
  if (supabaseConfigured) {
    const posts = await getPublishedPosts(locale, limit + 1);
    if (posts) return { items: posts.filter((p) => p.slug !== exclude).slice(0, limit), fromDb: true };
  }
  return { items: blogPosts[locale].filter((p) => p.slug !== exclude).slice(0, limit), fromDb: false };
}
