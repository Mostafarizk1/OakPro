# OAK PRO — Decisions & Open Items

Last updated: 2026-10-14. This file records what was decided during the build, and what is **deliberately left for later**. Each pending item says exactly where to make the change.

## A. Decisions made (and why)

| # | Decision | Why |
|---|---|---|
| 1 | Brand palette = the 5 official colors only (`#007680`, `#EED484`, `#40C1AC`, `#131E29`, `#D9D9D6`). Derived tints are listed in `design-system.md`. | Brand guide pp.12-13; guide forbids changing brand colors. |
| 2 | Font = **Lama Sans** (Regular + Bold), taken from the client's current site files. No Medium/Light exist. | It's the brand typeface and the old site already serves it. Files in `src/fonts/`. |
| 3 | Site is a **trust-focused corporate website**, not a sales site. | Client voice note: goal is credibility with large contractors/companies. So: certifications get their own page + home section; "quote" CTAs are kept but limited (header, hero, CTA band, service pages). |
| 4 | MWAN license shown **exactly as issued**: non-hazardous waste + construction & demolition waste, 3 vehicles, Saihat. | Wording rule. The docx lists more waste services (cooking oil, sewage, recyclables, container rental) than the license names; the license card does not claim them. |
| 5 | Phones: +966 54 656 0925 / +966 54 751 6224. WhatsApp uses the first. | Confirmed from the existing site. |
| 6 | Arabic default, `/ar` and `/en`, `localePrefix: always`, hreflang via page metadata. | Spec. |
| 7 | No shadcn/ui; own components using design tokens. | Fewer dependencies; the design is small and angular. Can be swapped later. |
| 8 | Blog bodies are `.md` files, not MDX. | Simpler; structured so a CMS can replace `loadBody()` in `blog/[slug]/page.tsx`. |
| 9 | Blog dates / reading time hidden. | No source data; avoids inventing facts. |
| 10 | Hero logo = SVG rhombus mark traced from the official logo, animated with Framer Motion, white on dark. | Spec; white version used so brand color isn't altered on dark. |
| 11 | Pending certificates (`pending: true`) are hidden in production, visible in dev. | Spec. |
| 12 | Projects page hidden by flag. | No real projects yet. |

## A2. Added 2026-10-14 (after client voice note #2)
- **Environmental permit shown from the client PDF, page 1 only, with the site coordinates table and the phone number permanently blacked out** (flattened PNG at `public/certs/environmental-permit.png`, no hidden text layer). Reason: client does not want the storage yard location or contents exposed to competitors. The permit's own wording (activity: تشغيل مواقف الشاحنات — سيهات) is untouched — we show it as issued. Original PDF stays in the client folder only; never publish it.
- Permit number taken from the document: **EPOPP-2026-008858** (the earlier brief said EPDPP-2026-009858 — please confirm which the client wants; the PDF is authoritative).
- Map: real office pin set (embed + button link `maps.app.goo.gl/EQdKdAM1droKrnym6`); schema geo = embed centre (26.566, 50.0677).
- Floating WhatsApp button and CTA button now use the real WhatsApp glyph.

- **Commercial registration added** (certificate no. 7051245335, issued 19/08/2025, Ministry of Commerce, LLC single person, status active). The certificate has no expiry date, so the chip shows "ساري" from the document's stated active status (`active: true`). File: `public/certs/commercial-registration.pdf` (only a public verification page + QR; no sensitive data).

## A3. Admin dashboard (2026-10-15)
- `/admin` (Arabic RTL, noindex): Supabase email+password login, post list, editor (Tiptap: H2/H3, bold, lists, quote, links, inline images), draft/publish, AR/EN linking for hreflang, live SEO checklist.
- Images: browser shrinks >1.5MB to ≤2400px (Vercel body limit 4.5MB) → server converts to WebP q78 (cover 1600px, inline 1200px), strips EXIF, makes a 1200×630 JPEG for Open Graph, uploads to public bucket `blog`. Site serves via next/image (AVIF/WebP, lazy, 1-year cache).
- Public blog reads from Supabase (ISR 60s + on-demand revalidation on save); falls back to the 3 static placeholders while Supabase env vars are missing. Home hides the blog section if DB is connected but empty.
- Article pages: canonical, hreflang between linked translations, Open Graph/Twitter, Article JSON-LD, sitemap includes published posts.
- HTML is sanitized server-side (no scripts/styles/handlers; https-only images).
- **Needs setup** (see `ADMIN-SETUP.md`): create Supabase project, run `supabase/schema.sql`, disable public sign-ups, add admin user, set the 2 env vars in Vercel.

## A4. CTA unification + GA4 (2026-10-26) — supersedes the 2026-10-21 "quote in the menu" rule
- Every contact CTA = **WhatsApp + direct call** (same number, `966546560925`; `callHref`/`whatsappLink` in `src/config/site.ts`). Used in: hero banner (desktop + mobile), header (+ mobile menu), about, service pages, blog article box, CTA band, two floating icons (call above WhatsApp).
- **"اطلب عرض سعر" exists only in the last section of the home page** (CTA band). It jumps to the quote form (`#contact`) and focuses the name field. Removed from the header.
- GA4 `G-TL9HZR2P1V` via next/script in the locale layout (once, site-wide; not in /admin). Hits are only sent from `oakpro.sa` / `www.oakpro.sa` (never localhost or *.vercel.app). `?ga_debug=1` enables DebugView.
- Events (one delegated listener, `TrackClicks`): `whatsapp_click`, `phone_click`, `quote_request_click`; `generate_lead` fires only after the API returns success. Params: `link_location` (main_banner, floating_icons, header, about_section, about_page, service_page, blog_article, cta_band, final_section, contact_page, other), `language`, `page_path`.
- To use `link_location` in GA4 reports: Admin → Custom definitions → create custom dimension (event scope, parameter `link_location`). Mark the four events as Key events.
- Page views rely on GA4 Enhanced Measurement ("Page changes based on browser history events" must be ON, it is by default).
- No cookie-consent banner added (design change); decide with the client whether PDPL requires one.
- The two phone numbers shown as plain contact info (footer / contact section) remain tel: links to 0925 and 6224; every CTA button uses 0925.

## B. Pending — to add later

| Item | Where to change |
|---|---|
| **Email delivery**: set `RESEND_API_KEY` (+ verified domain, `CONTACT_FROM`, optional `CONTACT_TO`) in Vercel env. Until then production returns 503 for the form. | env vars; `src/app/api/contact/route.ts` |
| Remaining certs: أمانة المنطقة الشرقية (ناقل مرخّص)، الزكاة، التأمينات | fill number/dates/file in `certifications.ts`, remove `pending: true`. Confirm issuer names. |
| Issuer logos for trust bar / cards | `issuerLogo` field + `TrustBar` in `src/components/sections.tsx` (currently text) |
| **Company profile PDF** | set `companyProfilePdf` in `src/config/site.ts` → header link appears |
| **Real photos** (about, services, blog heroes, equipment, team) | placeholders marked `[صورة: …]`; replace the `.placeholder-img` blocks |
| **Projects** (photos, names, client logos with permission) | add data + set `features.projects = true` in `src/config/site.ts`, build the page in `src/app/[locale]/projects/page.tsx` |
| **Blog**: final article text, images, dates | `src/content/blog/{ar,en}/*.md`, `src/content/data.ts` (`blogPosts`) |
| Hero video / Lottie instead of SVG animation | `HERO_MEDIA_SLOT` in `src/app/[locale]/page.tsx` |
| Expiry handling: cert status chip is computed from `expiryDate`; renewal reminder for MWAN (renew 30 days before 12-07-2029 per license) | `certifications.ts` |
| Better rate limiting (in-memory today) | e.g. Upstash/Vercel KV in `api/contact/route.ts` |
| **Domain/DNS** for oakprosa.com, Vercel deploy, 301 redirects from old WordPress URLs (e.g. `/ar/بيت/`) | Vercel; add `redirects()` in `next.config.ts` once old URLs are known |
| Search Console: submit `https://oakprosa.com/sitemap.xml` after launch | — |
| Voice note content beyond the transcript (if any) | — |

## C. Quality status (last run)
Lighthouse mobile, local production build: Performance 92-97, Accessibility 98-100, Best Practices 100, SEO 100 (a canonical flag caused by next-intl Link headers was fixed with `alternateLinks: false`). Reports in `reports/`.
No horizontal scroll at 375 / 768 / 1440 on 9 tested pages (AR + EN). Form API: invalid input 422, honeypot silently OK, valid input 503 until RESEND_API_KEY is set.
