"use client";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";

export type EditablePost = {
  id: string; group_id: string; locale: "ar" | "en"; slug: string; title: string; excerpt: string; content: string;
  cover_url: string | null; cover_w: number | null; cover_h: number | null; cover_alt: string | null; og_url: string | null;
  meta_title: string | null; meta_description: string | null; status: "draft" | "published";
};
type Other = { id: string; title: string; locale: "ar" | "en"; group_id: string };

const words = (html: string) => { const t = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(); return t ? t.split(" ").length : 0; };

/** Vercel limits request bodies to ~4.5MB, and phone photos are bigger. Shrink in the browser first (max 2400px, JPEG), then the server converts to WebP. */
async function shrink(file: File): Promise<File> {
  if (file.size < 1.5 * 1024 * 1024) return file;
  try {
    const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, 2400 / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas"); c.width = Math.round(bmp.width * scale); c.height = Math.round(bmp.height * scale);
    c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
    for (const q of [0.88, 0.8, 0.7, 0.6]) {
      const blob: Blob | null = await new Promise((r) => c.toBlob(r, "image/jpeg", q));
      if (blob && blob.size < 3.8 * 1024 * 1024) return new File([blob], "photo.jpg", { type: "image/jpeg" });
    }
  } catch { /* fall through */ }
  return file;
}

export default function PostEditor({ initial, others }: { initial: EditablePost | null; others: Other[] }) {
  const router = useRouter();
  const [locale, setLocale] = useState<"ar" | "en">(initial?.locale ?? "ar");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [metaTitle, setMetaTitle] = useState(initial?.meta_title ?? "");
  const [metaDesc, setMetaDesc] = useState(initial?.meta_description ?? "");
  const [cover, setCover] = useState({ url: initial?.cover_url ?? null, og: initial?.og_url ?? null, w: initial?.cover_w ?? null, h: initial?.cover_h ?? null, alt: initial?.cover_alt ?? "" });
  const [html, setHtml] = useState(initial?.content ?? "");
  const [translationOf, setTranslationOf] = useState<string>(() => (initial ? (others.find((o) => o.group_id === initial.group_id && o.locale !== initial.locale)?.id ?? "") : ""));
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const inlineRef = useRef<HTMLInputElement>(null);
  const dir = locale === "ar" ? "rtl" : "ltr";

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] }, code: false, codeBlock: false, strike: false }),
      Link.configure({ openOnClick: false, autolink: true }),
      Image,
      Placeholder.configure({ placeholder: "ابدأ كتابة المقال هنا…" }),
    ],
    content: initial?.content ?? "",
    editorProps: { attributes: { class: "article-body", dir } },
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
  });

  async function upload(file: File, kind: "cover" | "inline") {
    setUploading(true); setMsg(null);
    const fd = new FormData(); fd.append("file", await shrink(file)); fd.append("kind", kind);
    try {
      const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error === "too_large" ? "الصورة أكبر من 10 ميجابايت." : j.error === "bad_image" ? "الملف ليس صورة صالحة." : "تعذّر رفع الصورة.");
      return j as { url: string; ogUrl: string | null; width: number; height: number; bytes: number };
    } catch (e) { setMsg({ ok: false, text: (e as Error).message }); return null; }
    finally { setUploading(false); }
  }

  async function onCover(f?: File) {
    if (!f) return;
    const r = await upload(f, "cover");
    if (r) { setCover((c) => ({ ...c, url: r.url, og: r.ogUrl, w: r.width, h: r.height })); setMsg({ ok: true, text: `تم رفع الصورة وتحسينها تلقائياً (${Math.round(r.bytes / 1024)} كيلوبايت).` }); }
  }
  async function onInline(f?: File) {
    if (!f || !editor) return;
    const r = await upload(f, "inline");
    if (r) {
      const alt = prompt("اكتب وصفاً قصيراً للصورة (مهم للسيو ولضعاف البصر):") ?? "";
      editor.chain().focus().setImage({ src: r.url, alt }).run();
    }
  }
  function setLink() {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = prompt("اكتب الرابط (يبدأ بـ https:// أو / للصفحات الداخلية). اتركه فارغاً للإزالة:", prev ?? "https://");
    if (url === null) return;
    if (url === "") editor.chain().focus().extendMarkRange("link").unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  // ---------- SEO assistant ----------
  const checks = useMemo(() => {
    const desc = metaDesc || excerpt;
    const shownTitle = metaTitle || title;
    return [
      { ok: shownTitle.length >= 30 && shownTitle.length <= 65, label: `طول العنوان ${shownTitle.length} حرف (المثالي 30–65)` },
      { ok: desc.length >= 70 && desc.length <= 160, label: `طول الوصف ${desc.length} حرف (المثالي 70–160)` },
      { ok: /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug), label: "الرابط (slug) بحروف إنجليزية صغيرة وشرطات فقط" },
      { ok: !!cover.url && cover.alt.trim().length >= 5, label: "صورة غلاف مع وصف نصي للصورة" },
      { ok: words(html) >= 300, label: `طول المقال ${words(html)} كلمة (يفضَّل 300 فأكثر)` },
      { ok: /<h2[ >]/.test(html), label: "يحتوي على عنوان فرعي واحد على الأقل (H2)" },
      { ok: /<a [^>]*href="(\/|https?:\/\/(www\.)?oakpro\.sa)/.test(html), label: "فيه رابط داخلي لصفحة أخرى من الموقع (مثل /services)" },
    ];
  }, [title, metaTitle, metaDesc, excerpt, slug, cover, html]);
  const score = checks.filter((c) => c.ok).length;

  async function save(status: "draft" | "published") {
    setMsg(null);
    if (title.trim().length < 3) return setMsg({ ok: false, text: "اكتب عنوان المقال." });
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) return setMsg({ ok: false, text: "الرابط (slug) يجب أن يكون بحروف إنجليزية صغيرة وأرقام وشرطات، مثل: choosing-container-rental" });
    if (status === "published" && (!cover.url || cover.alt.trim().length < 5)) return setMsg({ ok: false, text: "لنشر المقال أضف صورة غلاف ووصفاً نصياً لها." });
    setBusy(true);
    const r = await fetch("/api/admin/posts", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: initial?.id, locale, slug, title, excerpt, content: html,
        cover_url: cover.url, cover_w: cover.w, cover_h: cover.h, cover_alt: cover.alt || null, og_url: cover.og,
        meta_title: metaTitle || null, meta_description: metaDesc || null, status, translation_of: translationOf || null,
      }),
    });
    const j = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) return setMsg({ ok: false, text: j.error === "slug_taken" ? "هذا الرابط مستخدم لمقال آخر بنفس اللغة. غيّر الـ slug." : "تعذّر الحفظ. حاول مرة أخرى." });
    setMsg({ ok: true, text: status === "published" ? "تم النشر ✓" : "تم حفظ المسودة ✓" });
    if (!initial) router.replace(`/admin/posts/${j.id}`); else router.refresh();
  }

  const tb = (active: boolean) => `px-3 min-h-[40px] rounded-sm text-sm font-bold border ${active ? "bg-primary text-white border-primary" : "bg-white border-line hover:border-primary"}`;
  const otherLocale = others.filter((o) => o.locale !== locale);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px] items-start">
      <div className="grid gap-5">
        <div className="card p-6 grid gap-5">
          <div className="grid gap-5 sm:grid-cols-[1fr_160px]">
            <div><label className="lbl" htmlFor="title">عنوان المقال *</label><input id="title" className="field" dir={dir} value={title} onChange={(e) => setTitle(e.target.value)} /></div>
            <div><label className="lbl" htmlFor="locale">اللغة</label>
              <select id="locale" className="field" value={locale} onChange={(e) => setLocale(e.target.value as "ar" | "en")}><option value="ar">العربية</option><option value="en">English</option></select></div>
          </div>
          <div>
            <label className="lbl" htmlFor="slug">رابط المقال (slug) *</label>
            <input id="slug" className="field text-start" dir="ltr" placeholder="choosing-container-rental-dammam" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/-{2,}/g, "-"))} />
            <p className="text-sm text-muted mt-1" dir="ltr">oakpro.sa/{locale}/blog/{slug || "…"}</p>
          </div>
          <div>
            <label className="lbl" htmlFor="excerpt">ملخص قصير (يظهر في بطاقة المقال وفي جوجل) *</label>
            <textarea id="excerpt" rows={3} className="field" dir={dir} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
            <p className="text-sm text-muted mt-1">{excerpt.length} / 160 حرف</p>
          </div>
        </div>

        <div className="card p-6 grid gap-4">
          <h2 className="text-lg">صورة الغلاف</h2>
          {cover.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover.url} alt={cover.alt} className="rounded-md max-h-[280px] w-auto" />
          ) : <div className="placeholder-img min-h-[140px]">لم تُرفع صورة بعد</div>}
          <div className="flex flex-wrap gap-3 items-center">
            <button type="button" className="btn btn-outline" onClick={() => fileRef.current?.click()} disabled={uploading}>{uploading ? "جارٍ الرفع والتحسين…" : cover.url ? "تغيير الصورة" : "رفع صورة"}</button>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => { onCover(e.target.files?.[0]); e.target.value = ""; }} />
            <span className="text-sm text-muted">ارفع أي صورة (JPG/PNG حتى 10MB) — تتحوّل تلقائياً إلى WebP بحجم صغير. يفضَّل صورة أفقية.</span>
          </div>
          <div><label className="lbl" htmlFor="alt">وصف الصورة (Alt) *</label><input id="alt" className="field" dir={dir} placeholder="مثال: شاحنة نقل حاويات في موقع بناء بالدمام" value={cover.alt} onChange={(e) => setCover((c) => ({ ...c, alt: e.target.value }))} /></div>
        </div>

        <div className="card">
          <div className="flex flex-wrap gap-2 p-3 border-b border-line sticky top-0 bg-white z-10 rounded-t-md">
            <button type="button" className={tb(!!editor?.isActive("heading", { level: 2 }))} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>عنوان فرعي</button>
            <button type="button" className={tb(!!editor?.isActive("heading", { level: 3 }))} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}>عنوان أصغر</button>
            <button type="button" className={tb(!!editor?.isActive("bold"))} onClick={() => editor?.chain().focus().toggleBold().run()}>غامق</button>
            <button type="button" className={tb(!!editor?.isActive("italic"))} onClick={() => editor?.chain().focus().toggleItalic().run()}>مائل</button>
            <button type="button" className={tb(!!editor?.isActive("bulletList"))} onClick={() => editor?.chain().focus().toggleBulletList().run()}>قائمة نقطية</button>
            <button type="button" className={tb(!!editor?.isActive("orderedList"))} onClick={() => editor?.chain().focus().toggleOrderedList().run()}>قائمة مرقّمة</button>
            <button type="button" className={tb(!!editor?.isActive("blockquote"))} onClick={() => editor?.chain().focus().toggleBlockquote().run()}>اقتباس</button>
            <button type="button" className={tb(!!editor?.isActive("link"))} onClick={setLink}>رابط</button>
            <button type="button" className={tb(false)} onClick={() => inlineRef.current?.click()} disabled={uploading}>صورة</button>
            <input ref={inlineRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => { onInline(e.target.files?.[0]); e.target.value = ""; }} />
            <button type="button" className={tb(false)} onClick={() => editor?.chain().focus().undo().run()}>تراجع</button>
          </div>
          <EditorContent editor={editor} />
        </div>

        <details className="card p-6">
          <summary className="cursor-pointer font-bold">إعدادات جوجل المتقدمة (اختياري)</summary>
          <div className="grid gap-5 mt-5">
            <div><label className="lbl" htmlFor="mt">عنوان مخصص لجوجل</label><input id="mt" className="field" dir={dir} placeholder="اتركه فارغاً لاستخدام عنوان المقال" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} /></div>
            <div><label className="lbl" htmlFor="md">وصف مخصص لجوجل</label><textarea id="md" rows={3} className="field" dir={dir} placeholder="اتركه فارغاً لاستخدام الملخص" value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} /></div>
          </div>
        </details>
      </div>

      <aside className="grid gap-5 lg:sticky lg:top-6">
        <div className="card p-6 grid gap-3">
          <div className="flex gap-3">
            <button className="btn btn-primary flex-1" disabled={busy || uploading} onClick={() => save("published")}>{busy ? "…" : initial?.status === "published" ? "تحديث المنشور" : "نشر"}</button>
            <button className="btn btn-outline" disabled={busy || uploading} onClick={() => save("draft")}>{initial?.status === "published" ? "إلغاء النشر" : "حفظ مسودة"}</button>
          </div>
          {msg && <p role="status" className={msg.ok ? "text-primary-hover font-bold" : "err"}>{msg.text}</p>}
        </div>

        <div className="card p-6">
          <h2 className="text-lg mb-1">مساعد السيو</h2>
          <p className="text-sm text-muted mb-3">{score} من {checks.length} ✓ — نصائح فقط، ولا تمنع النشر.</p>
          <ul className="grid gap-2 text-sm">
            {checks.map((c) => <li key={c.label} className="flex gap-2"><span aria-hidden className={c.ok ? "text-primary font-bold" : "text-[#b3261e] font-bold"}>{c.ok ? "✓" : "✗"}</span><span>{c.label}</span></li>)}
          </ul>
        </div>

        <div className="card p-6">
          <h2 className="text-lg mb-2">النسخة بلغة أخرى</h2>
          <p className="text-sm text-muted mb-3">اربط هذا المقال بنسخته {locale === "ar" ? "الإنجليزية" : "العربية"} ليعرف جوجل أنهما نفس المقال.</p>
          <select className="field" value={translationOf} onChange={(e) => setTranslationOf(e.target.value)}>
            <option value="">— بدون ربط —</option>
            {otherLocale.map((o) => <option key={o.id} value={o.id}>{o.title}</option>)}
          </select>
        </div>
      </aside>
    </div>
  );
}
