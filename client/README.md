# prodvisor.

**Your AI Product & Growth Advisor.**

Azerbaijani-language AI business advisor built on Next.js. Business discovery, customer conversation intelligence, actionable insights and campaign planning. This archive contains the **owner-supplied existing app upgraded with a new branded UI**, not an unrelated mockup.

## Local setup

```bash
npm ci
cp .env.example .env.local
# Edit .env.local and provide a real GEMINI_API_KEY
npm run dev
```

Open http://localhost:3000. For verification:

```bash
npm run typecheck
npm run build
```

To deploy on Vercel: import this folder as a Next.js application; set `GEMINI_API_KEY` and optional `GEMINI_MODEL` in project environment settings. Redeploy after configuration changes.

**Important:** No `.env.local` is included in this ZIP. Keep credentials secret; `.gitignore` excludes local credentials and build folders.

## Pages

| Path | Purpose |
| --- | --- |
| `/` | Branded landing and entry |
| `/onboarding` | 8 interactive steps with optional AI suggestion support |
| `/dashboard` | Focused personalized overview and next-step recommendation |
| `/business` | Business DNA editor and verification of assumptions |
| `/customers` | Paste/analyze conversations, view history and synthetic examples |
| `/customers/[id]` | Evidence-based AI analysis and action conversion |
| `/advisor` | Personal AI business advisor |
| `/campaigns` | AI-generated marketing briefs; browser-saved plans |
| `/actions` | Task list and observations |
| `/eval` | 15 scenario evaluation using live model calls |

## Technical notes

- Core architecture and server API routes from the supplied app have been preserved. AI uses Gemini server-side only; no fake chatbot response is substituted when credentials are missing.
- Business profiles, chats, campaigns, actions and test results are saved in **browser localStorage**. They are not synced across devices. There is no sign-in system in this hackathon MVP.
- Incoming customer messages are treated as untrusted text. Server masking of selected personal identifiers and quote-verification remain from the original project. Users should still remove sensitive information before analysis.
- Demo business can be loaded via `/onboarding`; sample conversations are clearly labeled synthetic.
- Evaluation results only appear after a real run, never as sample 'accuracy' figures.
- Original brand SVGs are in `public/brand` and are used directly.
- See **DESIGN_SYSTEM.md** for detailed branding, page intentions, responsive rules and developer QA checklist.

## Build verification caveat

The project was statically checked for TypeScript/TSX syntax. Package installation and a full Next.js build require access to the NPM registry; if unavailable, run `npm ci && npm run typecheck && npm run build` in a connected development environment before deployment.
