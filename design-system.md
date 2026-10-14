# OAK PRO Design System (v0.1 — Checkpoint 1)

Source: Brand Guidelines SEP 2025. Goal stated by the brand: "modernity, strength & longevity".

## Colors (official → role)
| Token | HEX | Pantone | Role | Text-safe? |
|---|---|---|---|---|
| brand-primary | #007680 | 7714 C | CTA, links, active states | Yes on white (5.38:1); white on it 5.38:1 |
| brand-accent | #EED484 | 7403 C | Highlights on dark, fills | Dark backgrounds only (11.55:1 on ink); 1.46:1 on white ✗ |
| brand-secondary | #40C1AC | 7465 C | Accents on dark | Dark only (7.58:1 on ink); 2.22:1 on white ✗ |
| ink | #131E29 | 7547 C | Headings, dark sections, footer | 16.86:1 on white |
| brand-gray | #D9D9D6 | Cool Gray 1 C | Borders, dividers | fill only |

Failures: primary on ink 3.13:1 (large text only); accent on primary 3.69:1 (large text only).
Derived (tints/shades of the above only): primary-hover #005A62, primary-50 #E6F2F3, surface-muted #F4F5F4, muted-foreground #5B6672.
Brand rule: do not change brand colors, add effects, stretch, or flip the logo (guideline p.10). No gradients.

## Typography
Brand font: **Lama Sans** (Bold/Medium/Regular/Light, Arabic + Latin). Not self-hostable until license confirmed → proposed fallback **Readex Pro** (Arabic + Latin, geometric, close to the wordmark's rounded-square feel). Scale: 12/14/16/18/22/28/36/48 px; Arabic body line-height 1.75; min text 12px.

## Shape, space, motion
Radii 2/4/6px (angular like the logo). 8px spacing base. Shadows subtle. Motion 150/250ms ease-out; hero logo 1.5s once; all disabled under prefers-reduced-motion.

## Motif
The rhombus: section eyebrow markers, bullets, numbered steps, status chips, ≤6% opacity diamond pattern on `ink` sections.

## Components (inventory)
Header/Nav, LangSwitch, Button (primary/outline/dark), TrustBar, Eyebrow+SectionHeading, HighlightItem, ServiceCard (expandable), CertCard + CertModal (watermarked), StepItem (diamond number), BlogCard, CTABand, ContactForm (honeypot), Footer, WhatsAppFloat, HeroLogoAnimation (slot).

Files: `design/tokens.css`, `design/tailwind-theme.ts`, `design/style-tile.html`.
