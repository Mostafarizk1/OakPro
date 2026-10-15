import { supabaseConfigured, supabasePublic } from "./supabase";

export type Post = {
  id: string; group_id: string; locale: "ar" | "en"; slug: string; title: string; excerpt: string; content: string;
  cover_url: string | null; cover_w: number | null; cover_h: number | null; cover_alt: string | null; og_url: string | null;
  meta_title: string | null; meta_description: string | null; status: "draft" | "published";
  reading_minutes: number; published_at: string | null; created_at: string; updated_at: string;
};

const LIST_COLS = "id,group_id,locale,slug,title,excerpt,cover_url,cover_w,cover_h,cover_alt,published_at,reading_minutes";

/** Published posts for a locale, newest first. Returns null when Supabase is not configured (site falls back to placeholders). */
export async function getPublishedPosts(locale: string, limit = 50): Promise<Post[] | null> {
  if (!supabaseConfigured) return null;
  const { data, error } = await supabasePublic().from("posts").select(LIST_COLS)
    .eq("locale", locale).eq("status", "published").order("published_at", { ascending: false }).limit(limit);
  if (error) { console.error("[posts] list failed", error.message); return null; }
  return (data ?? []) as Post[];
}

export async function getPublishedPost(locale: string, slug: string): Promise<Post | null> {
  if (!supabaseConfigured) return null;
  const { data } = await supabasePublic().from("posts").select("*")
    .eq("locale", locale).eq("slug", slug).eq("status", "published").maybeSingle();
  return (data as Post) ?? null;
}

/** The same article in the other language (for hreflang), if linked and published. */
export async function getSibling(post: Post): Promise<Post | null> {
  if (!supabaseConfigured) return null;
  const other = post.locale === "ar" ? "en" : "ar";
  const { data } = await supabasePublic().from("posts").select("slug,locale")
    .eq("group_id", post.group_id).eq("locale", other).eq("status", "published").maybeSingle();
  return (data as Post) ?? null;
}

export async function getAllPublishedSlugs(): Promise<{ locale: string; slug: string; updated_at: string }[]> {
  if (!supabaseConfigured) return [];
  const { data } = await supabasePublic().from("posts").select("locale,slug,updated_at").eq("status", "published");
  return data ?? [];
}
