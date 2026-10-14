import type { Metadata } from "next";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { site } from "@/config/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { seo } from "@/content/data";
import "../globals.css";

const lama = localFont({
  src: [
    { path: "../../fonts/LamaSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../fonts/LamaSans-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-lama",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = locale === "en" ? "en" : "ar";
  return {
    metadataBase: new URL(site.domain),
    title: { default: seo[l].homeTitle, template: `%s | ${site.name[l]}` },
    description: seo[l].homeDesc,
    alternates: { languages: { ar: "/ar", en: "/en", "x-default": "/ar" } },
    openGraph: { siteName: site.name[l], locale: l === "ar" ? "ar_SA" : "en_US", type: "website", images: ["/opengraph-image"] },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: "nav" });
  const l = locale as "ar" | "en";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": `${site.domain}/#org`, name: site.name[l], alternateName: ["Oak Pro", "أوك برو"], url: site.domain, logo: `${site.domain}/brand/logo-side-color.png`, email: site.email, telephone: site.phones[0] },
      {
        "@type": "LocalBusiness", "@id": `${site.domain}/#local`, name: site.name[l], url: site.domain, email: site.email, telephone: site.phones,
        address: { "@type": "PostalAddress", addressLocality: "Dammam", addressRegion: "Eastern Province", addressCountry: "SA" },
        geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
        openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "08:00", closes: "18:00" }],
      },
    ],
  };

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className={lama.variable}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:z-[100] focus:bg-ink focus:text-white focus:px-4 focus:py-2" style={{ insetInlineStart: 8 }}>{t("skip")}</a>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <WhatsAppFloat />
        </NextIntlClientProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
