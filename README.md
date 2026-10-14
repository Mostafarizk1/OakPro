# OAK PRO website

Next.js 15 (App Router), TypeScript, Tailwind v4, next-intl (ar default, en), Framer Motion.

    npm install
    npm run dev      # http://localhost:3000 -> redirects to /ar
    npm run build && npm start

- Contact data and feature flags: src/config/site.ts
- Copy (from the client docx): src/content/data.ts; UI strings: messages/{ar,en}.json
- Licenses: src/content/certifications.ts
- Design tokens: src/app/tokens.css (mirrors design/tokens.css); docs in design-system.md
- Env: RESEND_API_KEY, CONTACT_FROM, CONTACT_TO (optional)
- Open items: DECISIONS.md and TODO-CLIENT.md
