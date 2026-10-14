// Add new documents here — no UI changes needed.
// Wording rule: describe each license exactly as issued. Never imply it covers services it doesn't.
export type Certification = {
  id: string;
  issuer_ar: string; issuer_en: string;
  issuerLogo?: string;
  title_ar: string; title_en: string;
  licenseNumber?: string;
  issueDate?: string;  // ISO
  expiryDate?: string; // ISO
  scope_ar?: string; scope_en?: string;
  file?: string;       // /certs/xxx.pdf | .png  (placeholder shown if missing)
  verifyUrl?: string;
  numberLabel_ar?: string; numberLabel_en?: string; // when the number is not a "license no."
  active?: boolean;    // document has no expiry date but states an active status
  pending?: boolean;   // hidden in production
};

export const certifications: Certification[] = [
  {
    id: "mwan-waste-license",
    issuer_ar: "المركز الوطني لإدارة النفايات (موان)",
    issuer_en: "National Center for Waste Management (MWAN)",
    title_ar: "رخصة إدارة النفايات", title_en: "Waste Management License",
    licenseNumber: "005510",
    issueDate: "2026-07-12", expiryDate: "2029-07-12",
    scope_ar: "النشاط الرئيسي: جمع ونقل النفايات غير الخطرة. النشاط الفرعي: جمع ونقل نفايات الهدم والبناء. السعة التشغيلية: 3 مركبات. الموقع: سيهات، شارع عبدالله بن الحارث.",
    scope_en: "Main activity: collection and transport of non-hazardous waste. Sub-activity: collection and transport of demolition and construction waste. Operating capacity: 3 vehicles. Location: Saihat, Abdullah Bin Al-Harith St.",
    file: "/certs/mwan-license.pdf",
  },
  {
    id: "environmental-permit",
    issuer_ar: "المركز الوطني للرقابة على الالتزام البيئي",
    issuer_en: "National Center for Environmental Compliance",
    title_ar: "تصريح بيئي", title_en: "Environmental Permit",
    licenseNumber: "EPOPP-2026-008858" /* as printed on the permit (user message had EPDPP-2026-009858) */,
    issueDate: "2026-06-25", expiryDate: "2029-06-25",
    scope_ar: "تشغيل مواقف الشاحنات — سيهات.",
    scope_en: "Operation of truck parking facilities — Saihat.",
    // Page 1 of the permit with site coordinates and phone redacted at the client's request.
    file: "/certs/environmental-permit.png",
  },
  {
    id: "cr",
    issuer_ar: "وزارة التجارة", issuer_en: "Ministry of Commerce",
    title_ar: "شهادة السجل التجاري", title_en: "Commercial Registration Certificate",
    licenseNumber: "7051245335",
    numberLabel_ar: "الرقم الوطني الموحد", numberLabel_en: "Unified National Number",
    issueDate: "2025-08-19", active: true,
    scope_ar: "شركة ذات مسؤولية محدودة (شخص واحد). حالة السجل: نشط.",
    scope_en: "Limited liability company (single person). Registration status: Active.",
    file: "/certs/commercial-registration.pdf",
  },
  { id: "amana", issuer_ar: "أمانة المنطقة الشرقية", issuer_en: "Eastern Province Municipality", title_ar: "شهادة ناقل مرخّص", title_en: "Licensed Carrier Certificate", pending: true },
  { id: "zakat", issuer_ar: "هيئة الزكاة والضريبة والجمارك", issuer_en: "Zakat, Tax and Customs Authority", title_ar: "شهادة الزكاة", title_en: "Zakat Certificate", pending: true },
  { id: "gosi", issuer_ar: "المؤسسة العامة للتأمينات الاجتماعية", issuer_en: "General Organization for Social Insurance", title_ar: "شهادة التأمينات الاجتماعية", title_en: "Social Insurance Certificate", pending: true },
];

export const visibleCertifications = () =>
  process.env.NODE_ENV === "production" ? certifications.filter((c) => !c.pending) : certifications;

export const certStatus = (c: Certification, now = new Date()): "valid" | "expired" | "pending" => {
  if (c.pending) return "pending";
  if (!c.expiryDate) return c.active ? "valid" : "pending";
  return new Date(c.expiryDate) >= now ? "valid" : "expired";
};
