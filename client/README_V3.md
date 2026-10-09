# Prodvisor v3 — immersive landing + business SaaS + unified inbox

Updated existing Next.js 15 project. All original AI API handlers, existing local data flows, Business DNA, Onboarding, Customer Analysis, Advisor, Actions, Campaigns, and Quality Tests remain present.

## New features

- **`/`**: Editorial motion-led marketing homepage, pointer-follow spotlight, animated orbital backdrop, animated dashboard illustration, and CSS sticky three-stage scroll storytelling. Respects `prefers-reduced-motion` and reduces visual load on mobile.
- **`/pricing`**: Three transparent conceptual plans with monthly/annual toggle, FAQ, local preference selection. **No real payments, billing, premium unlocking, or subscriptions yet.** Displayed price/limits are proposals, not live paid offers.
- **`/subscription`**: In-app subscription planning view. Displays the user's selected preference and explicit non-billing status.
- **`/for-business`**: Dedicated interactive marketing page for businesses. Its audience selector changes explanations in place rather than redirecting.
- **`/inbox`**: Three-panel Meta Business Suite-inspired local demo inbox: thread filters/search, conversation view, unsent local response drafts, bulk JSON import, sample JSON download, and existing real AI analysis API (results also appear in Customer Analysis).
- **`/integrations`**: Clearly communicates the current demo state and steps required to implement an official Meta integration. No simulated connected accounts.
- **App sidebar**: Reorganized with Inbox / Integrations / Subscription. Removed the disliked dark 'small advice' promotional panel.
- **Global motion polish**: Subtle card interactions, page transitions, sticky storytelling, reduced-motion support, and accessible focus styles.
- **Brand assets**: Original official `public/brand/prodvisor-*.svg` preserved and reused.

## Startup

```bash
npm ci
cp .env.example .env.local
# configure your own API key
npm run typecheck
npm run build
npm run dev
```

IMPORTANT: This package intentionally does **not** contain `.env.local`, `node_modules`, `.next`, Meta access tokens, or payment secrets.

## Known limitations / deployment blockers

1. Meta/Instagram/Messenger accounts are **not connected**. Real OAuth sync requires Meta Business permissions, approved app, secure organization auth/database and webhook. See `META_INTEGRATION_GUIDE.md`.
2. Inbox content and selected pricing preference use **browser localStorage**, not a shared backend. Only synthetic samples or properly consented/non-sensitive test messages should be used in demo environments.
3. Inbox local reply writes to the current browser; it **does not** contact Meta or the customer. Use actual authenticated API integration before any real sending.
4. Pricing selection is a **frontend preference only**, not a subscription or charge. Production needs a billing provider, server-side entitlements, receipts, cancellation, and webhook verification.
5. AI tools need the existing valid Anthropic API key and network access, supplied by deployer. Without it, AI analysis correctly reports an API error.
6. Production `npm run build` could **not be executed in this environment**: npm registry fails DNS lookup `EAI_AGAIN` and dependencies are unavailable. All 39 TS/TSX non-declaration files were parsed successfully with the globally installed TypeScript transpiler. The developer must run typecheck/build in a connected environment.

## Main visual tokens

- Deep Ink `#241D35`, Iris `#7556D8`, Ivory `#F8F6F2`, Lilac `#EDE7FA`, Sage `#D7E9DC`
- Manrope headings and Inter body, both provided via Google Fonts CSS request with fallbacks.
- Orbital animation & background-follow hero via CSS; scroll stage via IntersectionObserver. No motion dependency required.

## UX demo flow

`/` → `/onboarding` → `/business` → `/inbox` → choose a synthetic thread → click "Bu söhbəti analiz et" → `/customers/inbox-{threadId}` for detailed evidence and action recommendations → `/actions`. App has existing sample profile and demo options.

## Safety

- Don't upload private chat data from real users into shared hackathon demo. Meta requires official consent/permissions; messages must be stored securely server side with tenant isolation and proper deletion handling.
- All AI-generated insights are assistance, not guaranteed customer intent or measured sales increase.
- Keep all official logo SVG paths intact when deploying.
