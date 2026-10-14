# TODO-CLIENT

- [ ] **Lama Sans web license** — brand font (free on Behance per the guide). Confirm it may be self-hosted on the web and send the font files (Arabic + Latin, Light/Regular/Medium/Bold). Until then the proposal is Readex Pro.
- [ ] Confirm phone numbers on the site (WhatsApp sender used +966 54 691 2374; docx uses 054 656 0925 / 054 751 6224)
- [ ] **MWAN license: confirm the data entry** — the license lists "headquarters city" as عنك while the operating site is سيهات (street عبدالله بن الحارث, 3509). The license scope is ONLY: جمع ونقل النفايات غير الخطرة / نفايات الهدم والبناء, 3 vehicles.
- [ ] **Wording conflict:** the docx lists services (used cooking oil, sewage removal, recyclables, municipal waste, container rental) that the MWAN license does not mention. Per the wording rule, the certification card will show only the licensed scope. Confirm whether other licenses cover those services.
- [ ] Environmental permit image (EPDPP-2026-009858)
- [ ] Remaining licenses from أ. حسين: السجل التجاري، أمانة المنطقة الشرقية (ناقل مرخّص)، الزكاة، التأمينات (PDF + number + dates)
- [ ] Project photos + names; client logos (with permission)
- [ ] Company profile PDF
- [ ] Real photos of equipment, containers, team
- [ ] Domain DNS access for oakprosa.com
- [ ] Voice note `WhatsApp Ptt 2026-10-13 at 8.55.39 PM.ogg` — I can't transcribe audio here; please send the text if it contains requirements.

## Added during build (Checkpoint 2)
- [x] Phones confirmed from the old site (0925 / 6224); Lama Sans font files taken from the client's old site (Regular + Bold used).
- [ ] **RESEND_API_KEY** (+ verified sender domain) so the contact form emails sales@oakprosa.com. Without it production returns an error. Optional env: CONTACT_FROM, CONTACT_TO.
- [ ] Exact Google Maps pin (embed currently shows "Dammam" generally); LocalBusiness geo uses approximate Dammam city-centre coordinates — replace with the real office location.
- [ ] Blog: real article texts, images, publish dates (dates and reading time are hidden until provided). Bodies live in src/content/blog/{ar,en}/*.md
- [ ] Issuer logos (MWAN, National Center for Environmental Compliance, Eastern Province Municipality) for the trust bar/cards, if permitted.
- [ ] Placeholder image slots: about page, service pages, blog heroes.
- [ ] Commercial registration issuer name shown as "وزارة التجارة" in a hidden placeholder — confirm when the document arrives.
- [ ] Projects page is hidden: set `features.projects = true` in src/config/site.ts when real projects exist.
- [ ] Company profile PDF: set `companyProfilePdf` in src/config/site.ts to show the header download link.
