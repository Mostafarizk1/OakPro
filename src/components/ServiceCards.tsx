"use client";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { services } from "@/content/data";
import { Plus, Minus } from "lucide-react";

export default function ServiceCards() {
  const t = useTranslations("cta");
  const locale = useLocale() as "ar" | "en";
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="grid gap-5 md:grid-cols-2 items-start">
      {services[locale].map((s, i) => {
        const isOpen = open === s.slug;
        return (
          <article key={s.slug} className="card p-6 md:p-8">
            <div className="flex items-start gap-4">
              <span className="relative w-11 h-11 flex-none grid place-items-center text-white font-bold" aria-hidden>
                <span className="absolute inset-[6px] bg-primary rotate-45" /><span className="relative">{i + 1}</span>
              </span>
              <div className="flex-1">
                <h3 className="text-[20px]">{s.title}</h3>
                <p className="mt-2 text-muted">{s.lead}</p>
              </div>
            </div>
            <button type="button" aria-expanded={isOpen} aria-controls={`svc-${s.slug}`} onClick={() => setOpen(isOpen ? null : s.slug)}
              className="mt-5 inline-flex items-center gap-2 min-h-[44px] font-semibold text-primary hover:underline">
              {isOpen ? <Minus size={18} aria-hidden /> : <Plus size={18} aria-hidden />}{t("details")}
            </button>
            {isOpen && (
              <div id={`svc-${s.slug}`} className="mt-3 pt-5 border-t border-line">
                <p>{s.body}</p>
                {s.items.length > 0 && <ul className="dia-list mt-4 space-y-1.5">{s.items.map((it) => <li key={it}>{it}</li>)}</ul>}
                <Link href={`/services/${s.slug}`} className="btn btn-outline mt-6">{t("moreAbout")}</Link>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
