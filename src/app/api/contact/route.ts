import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/validation";
import { site } from "@/config/site";

// Simple in-memory rate limit (per server instance). Swap for Upstash/Vercel KV if traffic grows.
const hits = new Map<string, number[]>();
const WINDOW = 10 * 60_000, MAX = 5;
function limited(ip: string) {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > MAX;
}
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (limited(ip)) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    // honeypot filled → pretend success so bots learn nothing
    if ((body as { website?: string })?.website) return NextResponse.json({ ok: true });
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 422 });
  }
  const d = parsed.data;

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    if (process.env.NODE_ENV === "production") return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
    console.log("[contact:dev] RESEND_API_KEY not set — message not sent:", d);
    return NextResponse.json({ ok: true, dev: true });
  }

  const resend = new Resend(key);
  const { error } = await resend.emails.send({
    from: process.env.CONTACT_FROM ?? "Oak Pro Website <onboarding@resend.dev>",
    to: [process.env.CONTACT_TO ?? site.email],
    replyTo: d.email,
    subject: `طلب جديد من الموقع — ${d.name}`,
    html: `<div dir="rtl" style="font-family:Arial,sans-serif"><h2>طلب جديد من موقع أوك برو</h2>
      <p><b>الاسم:</b> ${esc(d.name)}</p><p><b>الجهة:</b> ${esc(d.company)}</p>
      <p><b>الجوال:</b> ${esc(d.mobile)}</p><p><b>البريد:</b> ${esc(d.email)}</p>
      <p><b>الخدمة:</b> ${esc(d.service)}</p><p><b>التفاصيل:</b><br>${esc(d.details).replace(/\n/g, "<br>")}</p></div>`,
  });
  if (error) return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  return NextResponse.json({ ok: true });
}
