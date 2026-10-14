"use client";
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Certification, certStatus } from "@/content/certifications";
import { X, FileText } from "lucide-react";

// Deterministic dd/mm/yyyy (Latin digits) — Intl output differs between Node and browsers and caused a hydration mismatch.
const fmt = (iso: string | undefined) => (iso ? iso.split("-").reverse().join("/") : "—");

export default function CertList({ items, limit, headingLevel = 3 }: { items: Certification[]; limit?: number; headingLevel?: 2 | 3 }) {
  const H = `h${headingLevel}` as "h2" | "h3";
  const t = useTranslations("certs");
  const tc = useTranslations("cta");
  const locale = useLocale() as "ar" | "en";
  const [active, setActive] = useState<Certification | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const shown = limit ? items.slice(0, limit) : items;

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (active && !d.open) d.showModal();
    if (!active && d.open) d.close();
  }, [active]);

  const status = (c: Certification) => certStatus(c);

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((c) => {
          const st = status(c);
          return (
            <article key={c.id} className="card p-6 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <H className="text-lg">{locale === "ar" ? c.title_ar : c.title_en}</H>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm text-xs font-bold whitespace-nowrap ${st === "valid" ? "bg-primary-50 text-primary-hover" : "bg-line text-ink"}`}>
                  <i className="dia" style={{ width: 7, height: 7, background: st === "valid" ? undefined : "#5B6672" }} aria-hidden />{t(st)}
                </span>
              </div>
              <p className="text-sm text-muted">{locale === "ar" ? c.issuer_ar : c.issuer_en}</p>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                {c.licenseNumber && <><dt className="text-muted">{(locale === "ar" ? c.numberLabel_ar : c.numberLabel_en) ?? t("number")}</dt><dd className="font-medium"><bdi>{c.licenseNumber}</bdi></dd></>}
                {c.issueDate && <><dt className="text-muted">{t("issued")}</dt><dd><bdi>{fmt(c.issueDate)}</bdi></dd></>}
                {c.expiryDate && <><dt className="text-muted">{t("expires")}</dt><dd><bdi>{fmt(c.expiryDate)}</bdi></dd></>}
                {(locale === "ar" ? c.scope_ar : c.scope_en) && <><dt className="text-muted">{t("scope")}</dt><dd>{locale === "ar" ? c.scope_ar : c.scope_en}</dd></>}
              </dl>
              <div className="mt-auto pt-2 flex flex-wrap gap-3">
                <button type="button" className="btn btn-outline !min-h-[44px]" onClick={() => setActive(c)} disabled={c.pending}>{tc("viewDoc")}</button>
                {c.verifyUrl && <a className="btn btn-outline !min-h-[44px]" href={c.verifyUrl} target="_blank" rel="noopener noreferrer">{t("verify")}</a>}
              </div>
            </article>
          );
        })}
      </div>

      <dialog ref={dialogRef} onClose={() => setActive(null)} onClick={(e) => { if (e.target === dialogRef.current) setActive(null); }}
        aria-label={active ? (locale === "ar" ? active.title_ar : active.title_en) : undefined}
        className="m-auto w-[min(960px,94vw)] h-[min(88vh,900px)] p-0 rounded-md border border-line backdrop:bg-ink/70">
        {active && (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-line">
              <strong>{locale === "ar" ? active.title_ar : active.title_en}</strong>
              <button type="button" autoFocus onClick={() => setActive(null)} aria-label="Close" className="min-w-[44px] min-h-[44px] grid place-items-center"><X /></button>
            </div>
            <div className="relative flex-1 bg-surface-muted overflow-hidden select-none" onContextMenu={(e) => e.preventDefault()}>
              {active.file ? (
                /\.pdf$/i.test(active.file)
                  ? <iframe src={`${active.file}#toolbar=0&navpanes=0`} title={locale === "ar" ? active.title_ar : active.title_en} className="w-full h-full border-0" />
                  : // eslint-disable-next-line @next/next/no-img-element
                    <img src={active.file} alt={locale === "ar" ? active.title_ar : active.title_en} className="w-full h-full object-contain" />
              ) : (
                <div className="placeholder-img h-full m-4"><span><FileText className="mx-auto mb-2" aria-hidden />{t("docPlaceholder")}</span></div>
              )}
              {/* diagonal watermark */}
              <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden grid place-items-center">
                <div className="-rotate-[30deg] text-ink/20 font-bold text-[clamp(28px,6vw,64px)] whitespace-nowrap leading-[3] select-none">
                  {Array.from({ length: 5 }).map((_, i) => <div key={i}>{t("watermark")}&nbsp;&nbsp;&nbsp;{t("watermark")}</div>)}
                </div>
              </div>
            </div>
            <p className="px-4 py-2 text-xs text-muted border-t border-line">{t("note")}</p>
          </div>
        )}
      </dialog>
    </>
  );
}
