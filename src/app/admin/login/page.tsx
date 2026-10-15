"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function Login() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setError("");
    const fd = new FormData(e.currentTarget);
    const { error } = await supabaseBrowser().auth.signInWithPassword({ email: String(fd.get("email")), password: String(fd.get("password")) });
    if (error) { setError("البريد الإلكتروني أو كلمة المرور غير صحيحة."); setBusy(false); return; }
    window.location.href = "/admin";
  }

  return (
    <main className="min-h-screen grid place-items-center px-5">
      <form onSubmit={onSubmit} className="card w-full max-w-[420px] p-8 grid gap-5">
        <div>
          <h1 className="text-2xl">لوحة تحكم أوك برو</h1>
          <p className="text-muted mt-1">سجّل الدخول لإدارة المقالات.</p>
        </div>
        <div><label className="lbl" htmlFor="email">البريد الإلكتروني</label><input id="email" name="email" type="email" dir="ltr" required autoComplete="username" className="field text-start" /></div>
        <div><label className="lbl" htmlFor="password">كلمة المرور</label><input id="password" name="password" type="password" dir="ltr" required autoComplete="current-password" className="field text-start" /></div>
        {error && <p role="alert" className="err">{error}</p>}
        <button className="btn btn-primary" disabled={busy}>{busy ? "جارٍ الدخول…" : "دخول"}</button>
      </form>
    </main>
  );
}
