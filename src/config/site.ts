// Single place for contact data — the client may change these.
export const site = {
  name: { ar: "أوك برو", en: "Oak Pro" },
  domain: "https://oakprosa.com",
  phones: ["+966 54 656 0925", "+966 54 751 6224"],
  email: "sales@oakprosa.com",
  address: { ar: "الدمام، المنطقة الشرقية، المملكة العربية السعودية", en: "Dammam, Eastern Province, Saudi Arabia" },
  hours: { ar: "من 8:00 صباحاً حتى 6:00 مساءً", en: "8:00 AM – 6:00 PM" },
  mapUrl: "https://maps.app.goo.gl/EQdKdAM1droKrnym6",
  // Embed uses a text query for Dammam until the exact pin is confirmed (see TODO-CLIENT.md)
  mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d47246.420863096784!2d50.067676165683466!3d26.565976758198023!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e4a01003c7c3145%3A0x1aca900723d76f11!2z2LTYsdmD2Kkg2KPZiNmDINio2LHZiCDZhNmE2YXZgtin2YjZhNin2Kog2YjYqtij2KzZitixINin2YTYrdin2YjZitin2Ko!5e1!3m2!1sar!2seg!4v1791978832533!5m2!1sar!2seg",
  geo: { lat: 26.566, lng: 50.0677 }, // from the Google Maps embed centre (office listing)
  whatsappNumber: "966546560925",
  whatsappText: { ar: "السلام عليكم، أودّ الاستفسار عن خدمات أوك برو.", en: "Hello, I'd like to ask about Oak Pro's services." },
  companyProfilePdf: null as string | null, // set when the client sends the PDF
  features: { projects: false }, // hidden until real projects exist
} as const;

export const whatsappLink = (locale: "ar" | "en") =>
  `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(site.whatsappText[locale])}`;
export const telLink = (p: string) => `tel:${p.replace(/\s/g, "")}`;
