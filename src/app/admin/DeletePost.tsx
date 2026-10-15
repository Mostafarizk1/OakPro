"use client";
import { useRouter } from "next/navigation";

export default function DeletePost({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  return (
    <button className="text-[#b3261e] hover:underline" onClick={async () => {
      if (!confirm(`حذف المقال «${title}» نهائياً؟ لا يمكن التراجع.`)) return;
      const r = await fetch(`/api/admin/posts?id=${id}`, { method: "DELETE" });
      if (r.ok) router.refresh(); else alert("تعذّر الحذف.");
    }}>حذف</button>
  );
}
