# The House of Dumb S#iT — Main Website v3

This is an interactive front-end prototype for the main House website and its Commission Management Engine.

## Run it

Open `index.html` in a modern browser. No build step is required.

## What is included

- Public-facing institutional landing page.
- Patron's Room preview.
- Artist Studio preview.
- Custodian Desk preview.
- Commission Management Engine: shared commission records, stages, participants, activity history, and role-specific views.
- Commission creation from the Patron's Room.
- Custodian release queue preview using LIFO prioritisation.
- Monthly execution release ceiling of 20, with no carry-forward.
- Artist opportunity responses and the agreed rejection rules.
- Artist remuneration visibility.
- Custodian referral invitation preview.

## Prototype boundary

This is a front-end demonstration with fictional records stored in browser localStorage. It is **not connected** to the live Supabase project, authentication, Cashfree, e-signature services, email delivery or production document storage. Demo controls simulate workflow events only.

Do not use this prototype to process real Patron, Artist, commission, legal or financial data.

## Production integration still required

1. Audit and remediate existing Supabase RLS policies before exposing confidential records.
2. Design and migrate the canonical commission, Artist engagement, queue, invitation, milestone, document, financial and audit data model.
3. Implement server-side workflow transitions and authority checks. UI controls must never be the security boundary.
4. Connect the established Patron, Artist and Custodian authentication models.
5. Integrate a payment provider (Cashfree is provisional), e-signature provider, email delivery and private document storage.
6. Implement and test the 100 Patron / 1,000 Artist admission caps, FIFO admission queues, LIFO commission queue and 20 monthly execution-release cap.

## Key institutional rules represented

- Invitation-led Patron and Artist admission through Custodian referral links.
- Patron cap: 100; Artist cap: 1,000; admission waitlists are FIFO.
- Commission release cap: 20 per calendar month, no carry-forward; commission waitlist is LIFO.
- Artistic events are commission types within the same engine.
- One or multiple Artists may participate in a commission.
- Shared commission conversation includes the Patron, participating Artists and assigned Custodians.
- Artists have seven days to respond to a formal opportunity. Declines and non-responses count as rejections; two qualifying rejections return the Artist to the waitlist. Withdrawal after acceptance counts as two rejections and moves the Artist to the back of the waitlist.
- Two FOC iterations are included in the agreed scope.
- Artist remuneration is committed on formal acceptance; payment follows the agreed milestone arrangement.
- Legal work is handled offline; online legal interaction is e-signing of agreed commission participation.
- Finance is an internal House function; a third-party provider handles payment infrastructure (Cashfree provisional).
