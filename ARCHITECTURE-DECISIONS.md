# Main Website & Commission Engine — Working Architecture

## Core principle
The House is a private, invitation-led, deliberately capacity-constrained and human-led institution. Technology organises work and preserves institutional memory; it does not replace human judgement, relationship stewardship or creative decisions.

## Stakeholder workspaces
- Patron's Room: Patron relationships, House Desk, commission initiation, shared commission conversations, documents and funding visibility.
- Artist Studio: portfolio, availability, formal opportunities, commission execution, shared commission conversations and remuneration visibility.
- Custodian Desk: referral invitations, assigned Patron relationships, commissions, curation, coordination, procurement and execution oversight.
- Institutional Command Centre: separate protected internal environment for the Head, Finance and governance. It is not part of the public-facing website.

## Commission engine
A Patron expression of commission interest immediately creates a Commission record. There is no separate inquiry-to-commission conversion entity. The record progresses through brief development, Artist selection, proposals, formal Artist acceptance, commercial development, funding, readiness, execution, completion and settlement.

Artistic events are commission categories within the same engine. A commission may have one Artist (default) or multiple Artists, each with separately defined engagement, scope, commercials, milestones and contractual obligations. All participants share the commission conversation with the Patron and assigned Custodian(s).

## Capacity and queues
- Maximum 100 approved Patrons; admission waitlist FIFO.
- Maximum 1,000 approved Artists; admission waitlist FIFO.
- Artist admission is approved by the Head. Custodian referral does not confer admission authority.
- Maximum 20 commissions formally released for execution per calendar month. No carry-forward.
- Commission waitlist uses LIFO priority.

## Artist participation
- Participation is free to Artists.
- Formal opportunity response deadline: seven days.
- Declining a formal opportunity counts as one rejection.
- No response within seven days counts as one rejection.
- Clarification requests and creative-scope discussions are not rejections.
- Two qualifying rejections return the Artist to the Artist waitlist; re-entry requires Head approval.
- Withdrawal after formal acceptance counts as two rejections and moves the Artist to the back of the Artist waitlist.
- Artist remuneration is recorded as a locked commitment on formal acceptance; payment follows the agreed milestone arrangement.
- Two FOC iterations are included in the agreed scope.

## Finance and legal
- Finance is an internal House function responsible for verification, reconciliation and financial oversight.
- A third-party payment provider handles payment infrastructure and transactions; Cashfree is provisional pending diligence.
- Separate commission-level accounting records track Patron funds, Artist commitments, vendor liabilities and House fees.
- Legal work is offline/backend. The only legal interaction in the online platform is e-signing of contractually agreed commission participation. Signed documents are associated with the commission.

## Important implementation boundary
This prototype is not production-connected. Existing Supabase tables and RLS policies must be audited and remediated before confidential live data is exposed. The prototype's local demo controls are not production authority or security controls.
