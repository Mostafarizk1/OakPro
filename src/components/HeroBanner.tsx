import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/**
 * Hero = the designer's banner (separate AR / EN artwork, desktop 2400×1000 + mobile 1080×1350, WebP).
 * Smaller renditions (720w mobile, 1600w desktop) let the browser download only what the screen needs.
 * The artwork contains no button: the CTA is a real link (placed over the art on desktop, under it on mobile — see globals.css).
 * The real H1 + intro are kept as screen-reader/SEO text because the visible text lives inside the image.
 */
export default function HeroBanner() {
  const t = useTranslations();
  const l = useLocale() as "ar" | "en";
  const alt = l === "ar"
    ? "أوك برو: أربع خدمات وشريك واحد — مقاولات وصيانة طرق، إدارة نفايات، تنظيف وصيانة، وتوريد عمالة"
    : "Oak Pro: four services, one partner — contracting & road maintenance, waste management, cleaning & maintenance, skilled workforce supply";
  const b = `/banners/hero-${l}`;

  return (
    <section className="hero-banner" data-l={l} aria-label={t("hero.eyebrow")}>
      <h1 className="sr-only">{t("hero.title")}</h1>
      <p className="sr-only">{t("hero.text")}</p>
      <picture>
        <source media="(max-width: 767px)" srcSet={`${b}-mobile-720.webp 720w, ${b}-mobile.webp 1080w`} sizes="100vw" width={1080} height={1350} type="image/webp" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${b}-desktop.webp`} srcSet={`${b}-desktop-1600.webp 1600w, ${b}-desktop.webp 2400w`} sizes="100vw" width={2400} height={1000} alt={alt} fetchPriority="high" decoding="async" className="hero-img" />
      </picture>
      <Link href="/contact" className="btn btn-primary hero-cta">{t("cta.quote")}</Link>
    </section>
  );
}
