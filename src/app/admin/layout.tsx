import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import "./admin.css";

const lama = localFont({
  src: [
    { path: "../../fonts/LamaSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../fonts/LamaSans-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-lama",
  display: "swap",
});

export const metadata: Metadata = { title: "لوحة التحكم | أوك برو", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={lama.variable}>
      <body className="bg-surface-muted min-h-screen">{children}</body>
    </html>
  );
}
