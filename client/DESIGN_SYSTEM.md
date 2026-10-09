# prodvisor. — Design & Engineering Handoff

## Product intent
Azeri-language AI product-marketing copilot for owners of small companies. The product is **not** a generic AI chat wrapper; it connects a verified Business DNA, evidence-based customer-conversation analysis, an advisor, saved actions, and an AI campaign planner. The entire UI prioritizes "what should I do next?" over analytics clutter.

## Official brand assets
- `public/brand/prodvisor-primary.svg` — navy/ink wordmark with iris-purple period, for light surfaces.
- `public/brand/prodvisor-dark-bg.svg` — for dark backgrounds.
- `public/brand/prodvisor-white.svg` and `prodvisor-black.svg` — monochrome alternates.
- Logos are vector outlines, need no proprietary font files, and retain their original viewBox. Do not stretch or replace with a guessed typographic lockup.
- Favicon is a separate generic "p" mark, NOT a substitute for the official logo.

## Brand tokens
| Token | Value | Application |
| --- | --- | --- |
| Deep Ink | `#241D35` | main text / dark panel |
| Iris Purple | `#7556D8` | primary CTA / navigation / AI states |
| Warm Ivory | `#F8F6F2` | app page background |
| Lilac | `#EDE7FA` | selection / subtle AI surfaces |
| Sage | `#D7E9DC` | supportive positive feedback |
| Border | `#E8E3EE` | soft outlines |
| Muted | `#746D80` | supporting copy |

Fonts: **Manrope** for headings and **Inter** for body/interface. Remote Google Font CSS is used with robust local fallback. Headings have tight tracking. The sidebar is 252px wide on desktop, the workspace has a quiet top bar and content width max 1320px. UI components are in `components/ui.tsx`; CSS variables and shell styling are in `app/globals.css`; Tailwind tokens in `tailwind.config.ts`.

## Pages / critical user flow
1. `/` — public introductory landing with official logo, clear promise, realistic product preview and start CTA.
2. `/onboarding` — 8-step business discovery. One question at a time; AI suggestions are optional, editable, and labeled. Saved answers and profile creation remain connected to the original routes.
3. `/dashboard` — contextual snapshot. A real Business DNA summary, one primary recommendation, counts sourced from actual records, recent conversations, and quick actions. Never fake commercial metrics.
4. `/business` — editable profile, explicit review of AI-added business fields, differentiation and unvalidated assumptions.
5. `/customers` — text paste, privacy notice, active AI analysis, result history, ability to load clearly marked synthetic examples.
6. `/customers/[id]` — separate evidence-based diagnostic summary, issue hypotheses, verified supporting quotes, suggested response, action conversion, original chat retained in a side panel.
7. `/advisor` — contextual chat with suggested questions and side context; existing Gemini API route is preserved.
8. `/campaigns` — **new** campaign brief maker using existing advisor API; objective, platform, budget and notes; result save and copy are functional. Stored in browser, no claim of publishing ads.
9. `/actions` — simplified action list with statuses, source conversation, notes and deletion.
10. `/eval` — original 15-case test harness, visually redesigned; metrics only after real API calls; failures and labeled synthetic limitations are visible.

## Interaction rules
- Purple = primary action; green/orange/red = actual state, not decorative color.
- New users see calls to create Business DNA, not fabricated dashboard charts.
- Empty/loading/error/success states exist in critical paths.
- Business owner may edit and confirm AI assumptions instead of AI automatically treating a suggestion as verified fact.
- Conversation citations include literal quote verification from original implementation.
- Customer data is NOT auto-posted to Instagram or WhatsApp.
- New campaign descriptions are advice, not sales or performance forecasts.
- Mobile sidebar opens as a drawer (breakpoint below 1024px). No horizontal scrolling intended for the main UI; the evaluation comparison table scrolls within its own region.

## Source and integrations
- Existing Next.js App Router project (version/presets retained); React, TypeScript, Tailwind, Zod.
- Server-side Gemini route handling remains in `app/api/ai/*`; API secrets are never exposed to the browser.
- Existing localStorage keys and data shape retained, plus new `prodvisor.campaigns`.
- Some branding and UI now use next/image for public SVG assets.
- There is **no** auth, backend user database, production payment plan, actual conversation channel integration or real sales analytics. Do not promise these to users.
- `public/brand` images supplied by project owner.

## Acceptance tests to run locally (once packages installed)
```
npm ci
cp .env.example .env.local
# Fill GEMINI_API_KEY in .env.local
npm run typecheck
npm run build
npm run dev
```
- Open `/onboarding`, load synthetic demo, then `/dashboard`, `/business`, `/customers`.
- Analyze synthetic chat through Gemini; inspect `/customers/[id]`; copy the AI response and add an action.
- In `/actions`, change status and add a note; ask about it in `/advisor`.
- Create a `/campaigns` brief, save and reopen it.
- Run `/eval`; verify results are calculated, not predefined.
- Verify every route on desktop and 390px mobile.
- Verify `.env.local` is never committed or uploaded.
