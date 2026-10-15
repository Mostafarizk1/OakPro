import { NextResponse } from "next/server";
import sharp from "sharp";
import { randomUUID } from "node:crypto";
import { supabaseConfigured, supabaseServer } from "@/lib/supabase";

export const runtime = "nodejs";
const MAX_BYTES = 10 * 1024 * 1024;

/**
 * Admin-only image upload. Whatever the admin uploads (JPG/PNG/WebP/HEIC-as-JPEG, up to 10MB) is:
 *  - auto-rotated, EXIF/GPS stripped,
 *  - resized (cover: max 1600px wide, inline: max 1200px),
 *  - converted to WebP (quality 78) → typically 60–180KB,
 *  - for covers, also saved as a 1200×630 JPEG for social sharing (Open Graph).
 */
export async function POST(req: Request) {
  if (!supabaseConfigured) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  const kind = form.get("kind") === "cover" ? "cover" : "inline";
  if (!(file instanceof File)) return NextResponse.json({ error: "no_file" }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "too_large" }, { status: 413 });

  let input: ReturnType<typeof sharp>;
  try {
    input = sharp(Buffer.from(await file.arrayBuffer()), { failOn: "none" }).rotate();
    await input.metadata();
  } catch { return NextResponse.json({ error: "bad_image" }, { status: 415 }); }

  const maxW = kind === "cover" ? 1600 : 1200;
  const main = await input.clone().resize({ width: maxW, withoutEnlargement: true }).webp({ quality: 78, effort: 5 }).toBuffer({ resolveWithObject: true });

  const id = randomUUID();
  const month = new Date().toISOString().slice(0, 7);
  const base = `${month}/${id}`;
  const up = async (path: string, buf: Buffer, type: string) => {
    const { error } = await supabase.storage.from("blog").upload(path, buf, { contentType: type, cacheControl: "31536000", upsert: false });
    if (error) throw new Error(error.message);
    return supabase.storage.from("blog").getPublicUrl(path).data.publicUrl;
  };

  try {
    const url = await up(`${base}.webp`, main.data, "image/webp");
    let ogUrl: string | null = null;
    if (kind === "cover") {
      const og = await input.clone().resize(1200, 630, { fit: "cover", position: "attention" }).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
      ogUrl = await up(`${base}-og.jpg`, og, "image/jpeg");
    }
    return NextResponse.json({ url, ogUrl, width: main.info.width, height: main.info.height, bytes: main.info.size });
  } catch (e) {
    return NextResponse.json({ error: "storage_failed", detail: (e as Error).message }, { status: 502 });
  }
}
