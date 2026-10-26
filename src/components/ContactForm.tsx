"use client";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { formServices } from "@/content/data";
import { normalizePhone, saudiMobile } from "@/lib/phone";
import { track } from "@/lib/analytics";

type Errors = Partial<Record<"name" | "mobile" | "email" | "service", string>>;

export default function ContactForm({ source = "contact_page" }: { source?: string }) {
  const t = useTranslations("form");
  const locale = useLocale() as "ar" | "en";
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errors, setErrors] = useState<Errors>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;
    const errs: Errors = {};
    if (!data.name?.trim()) errs.name = t("required");
    if (!saudiMobile.test(normalizePhone(data.mobile ?? ""))) errs.mobile = t("mobileInvalid");
    if (!/^\S+@\S+\.\S+$/.test(data.email ?? "")) errs.email = t("emailInvalid");
    if (!data.service) errs.service = t("required");
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setState("sending");
    try {
      const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (r.ok) { setState("ok"); track("generate_lead", { link_location: source, language: locale, page_path: window.location.pathname }); } else setState("error");
    } catch { setState("error"); }
  }

  if (state === "ok") {
    return <div role="status" className="card p-8 border-primary"><p className="text-lg font-medium">{t("success")}</p></div>;
  }

  const err = (k: keyof Errors) => errors[k] && <p id={`${k}-err`} className="err">{errors[k]}</p>;
  const aria = (k: keyof Errors) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${k}-err` : undefined });

  return (
    <form onSubmit={onSubmit} noValidate className="card p-6 md:p-8 grid gap-5">
      <h2 className="text-xl">{t("title")}</h2>
      <div className="grid gap-5 sm:grid-cols-2">
        <div><label className="lbl" htmlFor="f-name">{t("name")} *</label><input id="f-name" name="name" autoComplete="name" className="field" {...aria("name")} />{err("name")}</div>
        <div><label className="lbl" htmlFor="f-company">{t("company")}</label><input id="f-company" name="company" autoComplete="organization" className="field" /></div>
        <div><label className="lbl" htmlFor="f-mobile">{t("mobile")} *</label><input id="f-mobile" name="mobile" type="tel" inputMode="tel" dir="ltr" placeholder="05XXXXXXXX" autoComplete="tel" className="field text-start" {...aria("mobile")} />{err("mobile")}</div>
        <div><label className="lbl" htmlFor="f-email">{t("email")} *</label><input id="f-email" name="email" type="email" dir="ltr" autoComplete="email" className="field text-start" {...aria("email")} />{err("email")}</div>
      </div>
      <div>
        <label className="lbl" htmlFor="f-service">{t("service")} *</label>
        <select id="f-service" name="service" defaultValue="" className="field" {...aria("service")}>
          <option value="" disabled>{t("choose")}</option>
          {formServices[locale].map((s) => <option key={s} value={s}>{s}</option>)}
          <option value={t("other")}>{t("other")}</option>
        </select>{err("service")}
      </div>
      <div><label className="lbl" htmlFor="f-details">{t("details")}</label><textarea id="f-details" name="details" rows={4} className="field" /></div>
      {/* honeypot: hidden from users and assistive tech */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      {state === "error" && <p role="alert" className="err">{t("error")}</p>}
      <div><button type="submit" className="btn btn-primary" disabled={state === "sending"}>{state === "sending" ? t("sending") : t("send")}</button></div>
    </form>
  );
}
