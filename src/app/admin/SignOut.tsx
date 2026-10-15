"use client";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function SignOut() {
  return (
    <button className="btn btn-outline" onClick={async () => { await supabaseBrowser().auth.signOut(); window.location.href = "/admin/login"; }}>
      تسجيل الخروج
    </button>
  );
}
