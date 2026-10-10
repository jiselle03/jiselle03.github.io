# Set demo — booking and permissions roadmap

This plan borrows the tutoring portal’s useful product patterns: explicit booking states, conflict checks, preserved choices, role-scoped actions, admin overrides with reasons, and an operation history. It deliberately excludes resource management, authentication, server APIs, real payments, and real messaging. The Set demo remains a static, fictional browser experience.

## Current baseline

- The page has Member, Partner, and Admin views with local scenario state.
- Partner roster visibility is scoped to Form House. The role preview distinguishes Partner Admin, Front Desk, and Trainer.
- Pure policy helpers and unit tests now define multi-booking eligibility and partner-assisted 24-hour approval holds.
- Partner enrollment and waitlist offers now create a 24-hour pending hold; the member can accept or decline from the notification panel, and credits are charged only on acceptance. The demo still uses one active waitlist slot and retains `bookingId` as a compatibility pointer to the latest confirmed enrollment; cross-view checks need stronger integration coverage.

## Proposed sequence

### 1. One enrollment record, multiple classes

Represent each member/session relationship as an enrollment record with `sessionId`, `memberId`, `studioId`, `status`, `createdBy`, `creditsCharged`, `creditsReturned`, `createdAt`, `expiresAt`, and `reason`. Start with `confirmed`, `pending-member-approval`, `waitlisted`, `cancelled`, and `expired`.

Members may hold multiple confirmed bookings if they have enough credits and sessions do not overlap in the same local week. A class may appear only once for the same member. Capacity is reserved by confirmed enrollments and unexpired approval holds. The Schedule day count and class cards derive from those records; no separate counters should be edited by hand.

### 2. Member self-booking and assisted enrollment

- Self-booking an available class confirms immediately and deducts credits.
- A partner can request enrollment only for a repeat member associated with that studio, not search the full Set directory.
- The request holds one seat for 24 hours. The member must approve to confirm and charge credits. Decline or expiry releases the seat; silence is not consent. The frontend demo wires this flow for its one represented repeat member (Alex), not a full member directory.
- Do not offer a manual-enroll route that bypasses the member decision. Show pending status and expiry to Partner; show approve/decline controls to the relevant member.
- Waitlist promotion should be a time-limited offer, not silent enrollment. Charge credits only after acceptance; expiry advances the queue.

### 3. Studio permissions and enrollment operations

Keep a small explicit permission matrix:

| Action | Partner Admin | Front Desk | Trainer | Set Admin |
| --- | --- | --- | --- | --- |
| View own studio schedule and roster | Yes | Yes | Assigned classes | All studios |
| Request repeat-member enrollment | Yes | Yes | No | Override with reason |
| Remove an enrollee from own class | Yes | Yes | No | Override with reason |
| Create/edit/cancel studio class | Yes | No | No | Override with reason |
| Change studio staff roles | Yes | No | No | Set access only |
| Cross-studio action | No | No | No | Yes, with reason |

Every handler checks role and studio scope, not only whether a button is disabled. For the demo, the role preview may simulate the acting staff account. Explain in docs that frontend checks are not secure authorization in a real service.

Roster removal must create an enrollment outcome: who removed the member, why, whether credits were returned, and a member-facing notification. Apply the same rule for studio cancellation across every affected enrollment.

### 4. Admin support and controlled overrides

Add a compact request → review → approve/deny flow for exceptional credit adjustments and enrollment corrections. Require a reason, show the affected member/studio, and append an immutable-looking local activity item with actor and decision. Admin can enable/disable member and partner demo access; partner staff can only manage their own studio. Avoid allowing Admin to invisibly rewrite records.

### 5. Cross-view feedback and reset

Derive Member Schedule, Partner roster, Admin search/history, activity, credits, capacity, and relevant notifications from the same local records. Reset must restore every store, including notifications, role preview, filters, selected day, pending holds, and support cases. Keep notification volume scoped: members receive their own decisions and changes; partners receive studio-level events and outcomes, not every routine enrollment; Admin receives escalations and access/support exceptions.

## Test gates

1. Unit: credits, capacity/holds, duplicate prevention, overlap boundaries, cancellation cutoff, waitlist offer acceptance/expiry, and role × action × studio matrix.
2. Transition: self-book/cancel, assisted request/approve/decline/expire, studio removal, class cancellation, admin override request/decision.
3. Cross-view: assert the same local enrollment and balance in Explore, Schedule, Partner roster, notifications, activity, and Admin history after each transition.
4. Resilience: reset while each pending state exists; long names; empty roster; full class; low credits; same-time conflicts; date boundaries.
5. UX release check: keyboard-only flows, focus return and Escape, screen-reader labels/announcements, 320px phone, tablet, desktop, 200% zoom, and reduced motion.

## Deliberate product decisions

- Partners may not search all Set members by member ID. A member must already have a relationship with the studio for assisted enrollment.
- Partner-created enrollment is a request, not an assumed booking. No response means the hold expires.
- Admin exceptions require a reason and visible history.
- No production identity, authorization, billing, messaging, or persistence is simulated as real. If the demo starts implying those guarantees, make the limitation explicit or remove the control.
