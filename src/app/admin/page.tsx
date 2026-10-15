import Link from "next/link";
import { supabaseServer } from "@/lib/supabase";
import SignOut from "./SignOut";
import DeletePost from "./DeletePost";

export const dynamic = "force-dynamic";

type Row = { id: string; locale: "ar" | "en"; slug: string; title: string; status: "draft" | "published"; updated_at: string; published_at: string | null };

export default async function AdminHome() {
  const supabase = await supabaseServer();
  const { data } = await supabase.from("posts").select("id,locale,slug,title,status,updated_at,published_at").order("updated_at", { ascending: false });
  const posts = (data ?? []) as Row[];
  const fmt = (s: string) => s.slice(0, 10).split("-").reverse().join("/");

  return (
    <main className="container-x py-10">
      <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl">المقالات</h1>
        <div className="flex gap-3">
          <Link href="/admin/posts/new" className="btn btn-primary">+ مقال جديد</Link>
          <SignOut />
        </div>
      </header>

      {posts.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-lg">لا توجد مقالات بعد.</p>
          <Link href="/admin/posts/new" className="btn btn-primary mt-5">اكتب أول مقال</Link>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-start">
            <thead className="text-sm text-muted border-b border-line">
              <tr><th className="p-4 text-start">العنوان</th><th className="p-4 text-start">اللغة</th><th className="p-4 text-start">الحالة</th><th className="p-4 text-start">آخر تعديل</th><th className="p-4" /></tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-b border-line last:border-0">
                  <td className="p-4"><Link href={`/admin/posts/${p.id}`} className="font-bold hover:text-primary">{p.title}</Link></td>
                  <td className="p-4">{p.locale === "ar" ? "عربي" : "English"}</td>
                  <td className="p-4"><span className={`px-2.5 py-0.5 rounded-sm text-xs font-bold ${p.status === "published" ? "bg-primary-50 text-primary-hover" : "bg-line text-ink"}`}>{p.status === "published" ? "منشور" : "مسودة"}</span></td>
                  <td className="p-4 text-sm text-muted">{fmt(p.updated_at)}</td>
                  <td className="p-4">
                    <div className="flex gap-4 justify-end text-sm">
                      {p.status === "published" && <a className="text-primary hover:underline" href={`/${p.locale}/blog/${p.slug}`} target="_blank" rel="noopener noreferrer">عرض</a>}
                      <Link className="text-primary hover:underline" href={`/admin/posts/${p.id}`}>تعديل</Link>
                      <DeletePost id={p.id} title={p.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
