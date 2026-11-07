# THODS website + internal CRM starter (v2)

## What this package does
- Keeps the existing public multi-page website and its visual language.
- Replaces Artist and Patron password forms with Supabase passwordless email magic links.
- Disables public self-registration (`shouldCreateUser: false`). Accounts must be provisioned/invited by The House before sign-in.
- Removes public Artist directory discovery and direct Patron-to-Artist commission submission from the Artist/Patron account pages. The Patron is directed to the House Desk. The old individual Artist profile URL is now a private-introduction notice rather than a public data lookup.
- Stops displaying legacy `commission_requests` rows as if they were approved commission records. The current schema does not yet implement the agreed commission lifecycle.
- Adds a separate internal CRM shell intended for Google Cloud Run protected by Identity-Aware Proxy (IAP). The server verifies the signed IAP JWT and checks an email allowlist.

## Important limitations
This is a working frontend/authentication starter, not the completed House operating system. Existing Supabase schema/RLS policies were found to have security defects in the audit. This package intentionally does not run migrations, modify policies, create profiles, publish Artists, create commissions, or perform financial operations. Existing table access may fail until the RLS remediation is applied. The CRM modules are navigation placeholders, not connected workflows. The CRM server now fails closed if either the IAP audience or explicit email allowlist is missing.

## A. Public website setup
1. Set `supabaseUrl` and the **publishable/anon key** in `config.js`. Never use a service-role/secret key in browser code.
2. In Supabase Authentication → URL Configuration, set the deployed website as Site URL and add the Artist and Patron page URLs as allowed redirect URLs.
3. In Supabase Authentication → Sign In / Providers → Email, keep email passwordless sign-in enabled. Configure the email template to send a confirmation link (`{{ .ConfirmationURL }}`) for magic-link sign-in.
4. Provision Patron and Artist Auth users through the House's controlled invitation/onboarding process, and create their matching `patron_profiles` / `artists` records through an authorised administrative process. Public pages cannot create accounts.
5. Deploy the website folder contents to the existing static host. `config.js` is public and contains only the Supabase URL and publishable key.
6. Test with one pre-provisioned Patron and one pre-provisioned Artist. Confirm that unknown email addresses cannot self-register and that the correct profile type is required.

## B. Internal CRM on Google Cloud Run + IAP
Recommended boundary: deploy `crm/` as a separate Cloud Run service and enable IAP directly on that service. Do not put the CRM behind the public static website's authentication.

### Console setup
1. In Google Cloud, select/create the project that will host the CRM. Enable Cloud Run and Identity-Aware Proxy APIs as prompted.
2. Deploy the `crm/` directory as a Cloud Run service (source deployment or container build).
3. In Cloud Run → your service → Security, select **Require authentication → Identity-Aware Proxy (IAP)**. Use direct Cloud Run IAP; do not also enable IAP on a load balancer for the same service.
4. In the IAP access policy, grant `IAP-secured Web App User` (`roles/iap.httpsResourceAccessor`) only to the Head, named Legal Team members and authorised Finance personnel (prefer a Google Group if available). Do not grant broad domain-wide access by default.
5. Configure environment variables: `IAP_EXPECTED_AUDIENCE` (exact audience expected in the IAP signed assertion for this Cloud Run service) and `CRM_ALLOWED_EMAILS` (comma-separated institutional email allowlist). The service returns 503 when either required setting is missing; it fails closed. The allowlist is a second application-level gate, not a replacement for IAP IAM.
6. Verify that unauthenticated requests receive an IAP sign-in/access-denied response, and that an authenticated but non-allowlisted identity receives 403. Verify that an empty allowlist returns 503 rather than allowing all IAP-authenticated users.

### IAP verification
The Node server requires `x-goog-iap-jwt-assertion`, verifies its signature using Google's IAP public keys, checks issuer `https://cloud.google.com/iap` and the configured audience, then applies the email allowlist. It deliberately does not trust the unsigned `x-goog-authenticated-user-email` header. Keep Cloud Run's IAP protection enabled for every ingress path.

### Deploy from Cloud Shell / local gcloud
From the `crm/` directory, one option is:

```bash
gcloud run deploy thods-internal-crm \
  --source . \
  --region asia-south1 \
  --no-allow-unauthenticated \
  --iap \
  --set-env-vars IAP_EXPECTED_AUDIENCE='REPLACE_WITH_EXACT_IAP_AUDIENCE',CRM_ALLOWED_EMAILS='head@example.com,legal@example.com,finance@example.com'
```

Use the exact audience required by the deployed Cloud Run IAP service; do not guess it. If enabling IAP for the first time in a project without a Google organisation, complete the initial IAP OAuth setup in the Cloud Console as required. Grant the IAP service agent Cloud Run Invoker if the console has not done so automatically.

## C. Security / architecture rules
- Head of Patronage & Commissions is the Super Admin; no separate Super Admin identity is introduced.
- Legal and Finance access is limited to assigned/authorised work; IAP access is the outer gate, and application-level role checks plus Supabase RLS must enforce record-level permissions.
- IAP protects the CRM web service. It does not automatically protect a Supabase database or make browser requests to Supabase trusted. All privileged operations must be server-side and auditable.
- Do not put service-role keys, OAuth client secrets, database passwords or IAP secrets in `config.js` or static assets.
- Keep Patron/Artist passwordless email authentication separate from institutional Google/IAP authentication.
- Do not deploy the CRM shell with live data until the Supabase RLS defects identified in the audit are remediated and tested.

## D. Alignment decisions and known gaps
- Patron and Artist access is passwordless email only; no public signup is offered.
- `shouldCreateUser: false` prevents the sign-in form from initiating public account creation. Existing users must be provisioned through an authorised House process.
- The existing database does not yet support invitation records, trusted-device management, Custodian assignment, a proper House Desk conversation workflow, commission milestones, legal records or finance ledgers. The frontend therefore does not pretend those workflows are operational.
- Patron self-deactivation/reactivation, trusted-device management, document access, commission approvals and financial actions are not implemented in this starter.
- The current database role value `concierge` has not been silently migrated to `custodian`; role/schema remediation remains a separate audited change.
- The existing `commission_requests` table remains legacy intake data. Do not use it as the canonical commission table.

## E. Current contents
- Public pages: `index.html`, `artists.html`, `patronage.html`, `commissions.html`, `artist-profile.html`, `artist.html`, `patron.html`
- Shared public styling/scripts: `site.css`, `shared.js`, `config.js`
- Internal CRM starter: `crm/`
- Existing SQL snapshots retained for reference only; they are not automatically executed.
