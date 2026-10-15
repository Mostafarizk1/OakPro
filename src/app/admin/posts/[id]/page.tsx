import { notFound } from "next/navigation";
import Link from "next/link";
import { supabaseServer } from "@/lib/supabase";
import PostEditor, { type EditablePost } from "../../PostEditor";

export const dynamic = "force-dynamic";

export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await supabaseServer();

  let initial: EditablePost | null = null;
  if (id !== "new") {
    const { data } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    initial = data as EditablePost;
  }
  const { data: all } = await supabase.from("posts").select("id,title,locale,group_id");
  const others = (all ?? []).filter((p) => p.id !== id) as { id: string; title: string; locale: "ar" | "en"; group_id: string }[];

  return (
    <main className="container-x py-8">
      <Link href="/admin" className="text-primary hover:underline">← كل المقالات</Link>
      <h1 className="text-2xl mt-3 mb-6">{initial ? "تعديل المقال" : "مقال جديد"}</h1>
      <PostEditor initial={initial} others={others} />
    </main>
  );
}
