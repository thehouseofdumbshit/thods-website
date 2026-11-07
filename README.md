# The House of Dumb S#iT — Website + Internal CRM Starter v2

A preserved public website prototype with invitation-only, passwordless Patron and Artist access, plus a separately deployable internal CRM shell protected by Google Cloud Identity-Aware Proxy (IAP).

## What this version aligns
- No public Artist directory or publicly accessible Artist profile records.
- Artist onboarding is referral/invitation-led; Artist accounts must be provisioned by The House.
- Patron onboarding is invitation-only and Custodian-led.
- Patron commission initiation is directed to the House Desk; there is no direct Patron-to-Artist checkout or public commission submission form.
- Legacy `commission_requests` records are not presented as the approved commission lifecycle.
- Patron and Artist sign in using Supabase passwordless email links, with account creation disabled in the client request.
- Internal CRM is a separate application intended for Cloud Run + IAP.
- CRM denies access if its explicit email allowlist is missing or empty.

## Important
This is an alignment and authentication starter, not a production-ready institutional operating system. The existing Supabase RLS defects identified in the audit remain unresolved. Do not connect confidential live commission, legal or financial data until those policies have been corrected and tested. The commission, financial, document and CRM modules are still placeholders; no migrations are run automatically.

See `SETUP-GUIDE.md` before configuring or deploying.
