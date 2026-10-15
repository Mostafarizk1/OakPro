import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { supabaseConfigured, supabaseServer } from "@/lib/supabase";
import { cleanHtml, readingMinutes } from "@/lib/sanitize";

const schema = z.object({
  id: z.string().uuid().optional(),
  locale: z.enum(["ar", "en"]),
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "slug"),
  title: z.string().trim().min(3).max(160),
  excerpt: z.string().trim().max(320).default(""),
  content: z.string().max(400_000).default(""),
  cover_url: z.string().url().nullable().default(null),
  cover_w: z.number().int().nullable().default(null),
  cover_h: z.number().int().nullable().default(null),
  cover_alt: z.string().trim().max(200).nullable().default(null),
  og_url: z.string().url().nullable().default(null),
  meta_title: z.string().trim().max(120).nullable().default(null),
  meta_description: z.string().trim().max(200).nullable().default(null),
  status: z.enum(["draft", "published"]),
  translation_of: z.string().uuid().nullable().optional(),
});

async function guard() {
  if (!supabaseConfigured) return null;
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  return user ? supabase : null;
}

function refresh(locale: string, slug?: string) {
  for (const l of ["ar", "en"]) { revalidatePath(`/${l}`); revalidatePath(`/${l}/blog`); }
  if (slug) revalidatePath(`/${locale}/blog/${slug}`);
  revalidatePath("/sitemap.xml");
}

export async function POST(req: Request) {
  const supabase = await guard();
  if (!supabase) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid", issues: parsed.error.flatten().fieldErrors }, { status: 422 });
  const d = parsed.data;

  const content = cleanHtml(d.content);
  const row: Record<string, unknown> = {
    locale: d.locale, slug: d.slug, title: d.title, excerpt: d.excerpt, content,
    cover_url: d.cover_url, cover_w: d.cover_w, cover_h: d.cover_h, cover_alt: d.cover_alt, og_url: d.og_url,
    meta_title: d.meta_title || null, meta_description: d.meta_description || null,
    status: d.status, reading_minutes: readingMinutes(content), updated_at: new Date().toISOString(),
  };

  if (d.translation_of) {
    const { data: other } = await supabase.from("posts").select("group_id").eq("id", d.translation_of).maybeSingle();
    if (other) row.group_id = other.group_id;
  }

  // published_at is set the first time a post is published, and kept afterwards
  let prevSlug: string | undefined, prevLocale: string | undefined;
  if (d.id) {
    const { data: prev } = await supabase.from("posts").select("status,published_at,slug,locale").eq("id", d.id).maybeSingle();
    prevSlug = prev?.slug; prevLocale = prev?.locale;
    row.published_at = d.status === "published" ? (prev?.published_at ?? new Date().toISOString()) : (prev?.published_at ?? null);
  } else {
    row.published_at = d.status === "published" ? new Date().toISOString() : null;
  }

  const q = d.id ? supabase.from("posts").update(row).eq("id", d.id).select("id").single()
                 : supabase.from("posts").insert(row).select("id").single();
  const { data, error } = await q;
  if (error) {
    const dup = error.code === "23505";
    return NextResponse.json({ error: dup ? "slug_taken" : "db_error", detail: error.message }, { status: dup ? 409 : 500 });
  }
  refresh(d.locale, d.slug);
  if (prevSlug && (prevSlug !== d.slug || prevLocale !== d.locale)) refresh(prevLocale ?? d.locale, prevSlug);
  return NextResponse.json({ ok: true, id: data.id });
}

export async function DELETE(req: Request) {
  const supabase = await guard();
  if (!supabase) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "no_id" }, { status: 400 });
  const { data: prev } = await supabase.from("posts").select("slug,locale").eq("id", id).maybeSingle();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "db_error" }, { status: 500 });
  if (prev) refresh(prev.locale, prev.slug);
  return NextResponse.json({ ok: true });
}
