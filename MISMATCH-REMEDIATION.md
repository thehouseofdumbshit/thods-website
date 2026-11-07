# THODS mismatch remediation — v2

This document records the website-level corrections made against the agreed House operating model. It does not claim that the backend workflows are complete.

## Addressed in this package

| Earlier mismatch | v2 treatment |
|---|---|
| Public Patron self-registration | Removed. Patron sign-in uses email magic links with `shouldCreateUser: false`; Patron records must be provisioned by an authorised House process. |
| Password-based Patron login | Replaced with passwordless email sign-in. |
| Public Artist self-registration | Removed. Artist sign-in uses email magic links with `shouldCreateUser: false`; Artist records must be provisioned after referral and approval. |
| Password-based Artist login | Replaced with passwordless email sign-in. |
| Public Artist directory | No directory query or listing. Public Artists page explains the private, Custodian-led introduction model. |
| Public Artist profile by URL/id | The old profile route no longer queries Supabase or exposes Artist data; it displays a private-introduction notice. |
| Patron directly chooses an Artist and submits a commission | Removed from the Patron flow. Patron is directed to the House Desk/Custodian conversation. |
| Legacy enquiries presented as commissions | Patron and Artist dashboards no longer read or display `commission_requests` as active commission records. |
| CRM mixed into public website | Internal CRM remains a separate Cloud Run service protected by direct Cloud Run IAP. |
| CRM allowlist empty could admit every IAP-authenticated user | CRM now fails closed with 503 when `CRM_ALLOWED_EMAILS` is empty or missing. |

## Deliberately not implemented yet

- Invitation issuance, expiry, revocation and onboarding records.
- Custodian-created Patron and Artist profiles through a secure administrative workflow.
- Trusted-device management and new-device reauthentication.
- A functional House Desk messaging workflow and proper commission record lifecycle.
- Commission-specific Artist presentations and controlled identity disclosure.
- Milestones, approvals, contracts, document permissions, financial ledgers, payment releases and reconciliation.
- CRM module-level role assignment and record-level permissions.
- Supabase RLS remediation, including the known conversation-membership policy defect and overly permissive public INSERT policies.

## Safety boundary

No SQL migration is executed by this package. Existing database records, schema and RLS policies are left untouched. The public frontend still requires the Supabase project URL and publishable/anon key in `config.js`. Never place a service-role key or any private secret in that file.

Do not connect confidential production data until the RLS remediation and role/record permission tests are complete.
