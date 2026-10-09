# Prodvisor — Meta Business Messaging integration roadmap

The included `/inbox` is a **fully interactive browser-local demo workspace**, not a live Meta Business Suite connection. It supports multi-thread JSON import, filtering, demo replies, and real AI analysis via the application's existing AI endpoint. Import and local replies do not message real customers.

## What is needed for production

1. **Authentication and tenancy**: user sign-in, secure organization ownership, account roles, server-side database (e.g. Postgres with tenant-scoped RLS), audit logging. The current MVP uses browser localStorage and must not be used for multi-tenant live customer messages.
2. **Create a Meta app** on Meta for Developers, with correct app type/products and Business Verification/App Review as required.
3. **Instagram Professional messaging**: choose supported Instagram API login model and appropriate permissions; current Meta IG Login examples use `instagram_business_basic` and `instagram_business_manage_messages`, whereas Facebook Login/Page-linked flows use Page/Instagram permissions including `instagram_basic`, `instagram_manage_messages`, `pages_manage_metadata` (and Page access token). Permissions and requirements change by Graph version; verify against your selected flow.
4. **Facebook Page Messenger**: configure `pages_messaging` and associated Page permissions and Page task access.
5. **OAuth callback**: state/CSRF protection, secure server-side code exchange, token encryption at rest, refreshing tokens, verified Page/IG asset binding to organization.
6. **Webhook**: HTTPS endpoint with verification challenge, `X-Hub-Signature-256` HMAC validation using App Secret, deduplication/event idempotency, queue retries, privacy-conscious logs.
7. **Backfill**: Conversations API to get available existing conversations/messages with pagination, handling request-folder retention and deletion events.
8. **Inbox data**: normalize `provider`, `provider_account_id`, `provider_thread_id`, `provider_message_id`, `direction`, `sent_at`, `content`, `read_state`, and delivery failures into tenant-scoped records. Never allow a tenant to request another tenant's thread.
9. **Send policy**: user-initiated conversations, documented 24-hour reply rules and applicable exceptions, manual approval for sends, rate limits and permission enforcement. Do not auto-send AI drafts.
10. **Analysis privacy**: explicit opt-in and clear policies before sharing messages with an AI provider; mask PII and sanitize instruction injection in customer text.
11. **Validation**: run Meta test-account end-to-end sync/replies, verify correct auth/permissions for customers outside app roles, negative tests for data isolation and webhook forgery.

### JSON import option available now

Download a sample JSON from Inbox, use this shape:

```json
[{"customer":"Aysel","channel":"instagram","messages":[{"from":"customer","text":"Salam, qiymət nə qədərdir?","at":"10:12"},{"from":"business","text":"45 AZN","at":"10:13"}]}]
```

Allowed channels: `instagram`, `messenger`, `whatsapp`, `web`. JSON import is browser-only and does not constitute API integration. Do not upload sensitive real customer data to a shared demo deployment.

### Relevant official references
- Meta IG API: https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api
- Meta Messenger Platform: https://www.postman.com/meta/messenger-platform-api/documentation/iyp204x/messenger-platform-api
- Meta Conversations API: https://www.postman.com/meta/messenger-platform-api/folder/22794852-255610cd-47f5-4f4d-b3fa-71aec360be9a
